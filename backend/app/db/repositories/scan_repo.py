"""
backend/app/db/repositories/scan_repo.py
MongoDB repository for the 'scans' collection.
All queries enforce user_id scoping to prevent IDOR vulnerabilities (TRD §11.2).
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.exceptions import ForbiddenException, NotFoundException


class ScanRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["scans"]

    async def create_scan(
        self,
        scan_id: str,
        user_id: str,
        analysis_type: str,
        submitted_text: Optional[str],
        submitted_url: Optional[str],
        risk_score: int,
        risk_level: str,
        low_confidence: bool,
        text_sub_score: Optional[int],
        url_sub_score: Optional[int],
        detected_indicators: List[Dict[str, Any]],
        summary: str,
        recommendations: List[str],
        model_metadata: Dict[str, Any],
    ) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        doc = {
            "scan_id": scan_id,
            "user_id": user_id,
            "analysis_type": analysis_type,
            "submitted_text": submitted_text,
            "submitted_url": submitted_url,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "low_confidence": low_confidence,
            "text_sub_score": text_sub_score,
            "url_sub_score": url_sub_score,
            "detected_indicators": detected_indicators,
            "summary": summary,
            "recommendations": recommendations,
            "model_metadata": model_metadata,
            "created_at": now,
            "updated_at": now,
        }
        await self.collection.insert_one(doc)
        doc.pop("_id", None)
        return doc

    async def get_scan_by_id(self, scan_id: str, user_id: str) -> Dict[str, Any]:
        """
        CRITICAL: Always query with BOTH scan_id AND user_id to prevent IDOR.
        Never: {"scan_id": scan_id}   ← IDOR vulnerability
        Always: {"scan_id": scan_id, "user_id": user_id}
        """
        doc = await self.collection.find_one(
            {"scan_id": scan_id, "user_id": user_id},
            {"_id": 0}
        )
        if not doc:
            # Do NOT disclose whether the scan exists for another user
            raise NotFoundException(message="Scan not found.")
        return doc

    async def list_scans(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 20,
        risk_level: Optional[str] = None,
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        List scans for a specific user, optionally filtered by risk_level.
        Returns (items, total_count).
        """
        query: Dict[str, Any] = {"user_id": user_id}
        if risk_level:
            query["risk_level"] = risk_level.upper()

        total = await self.collection.count_documents(query)
        cursor = (
            self.collection.find(query, {"_id": 0})
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        scans = await cursor.to_list(length=limit)
        return scans, total

    async def delete_scan(self, scan_id: str, user_id: str) -> None:
        """
        Delete a scan with IDOR-safe ownership check.
        Raises NotFoundException if not found, ForbiddenException if ownership mismatch.
        """
        # First confirm the scan exists at all
        doc = await self.collection.find_one({"scan_id": scan_id}, {"_id": 0, "user_id": 1})
        if not doc:
            raise NotFoundException(message="Scan not found.")
        if doc["user_id"] != user_id:
            raise ForbiddenException(message="You do not have permission to delete this scan.")

        await self.collection.delete_one({"scan_id": scan_id, "user_id": user_id})

    async def get_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Run aggregation pipeline to retrieve dashboard statistics for a user.
        """
        pipeline = [
            {"$match": {"user_id": user_id}},
            {
                "$group": {
                    "_id": "$risk_level",
                    "count": {"$sum": 1},
                }
            }
        ]
        cursor = self.collection.aggregate(pipeline)
        result_docs = await cursor.to_list(length=None)

        stats: Dict[str, Any] = {
            "total_scans": 0,
            "low_risk_scans": 0,
            "medium_risk_scans": 0,
            "high_risk_scans": 0,
            "critical_risk_scans": 0,
        }

        for doc in result_docs:
            level = doc["_id"]
            count = doc["count"]
            stats["total_scans"] += count
            if level == "LOW":
                stats["low_risk_scans"] = count
            elif level == "MEDIUM":
                stats["medium_risk_scans"] = count
            elif level == "HIGH":
                stats["high_risk_scans"] = count
            elif level == "CRITICAL":
                stats["critical_risk_scans"] = count

        return stats
