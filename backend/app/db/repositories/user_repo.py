from datetime import datetime, timezone
from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.security import generate_user_id, hash_password


class UserRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.users

    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        normalized_email = email.strip().lower()
        return await self.collection.find_one({"email": normalized_email})

    async def get_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        return await self.collection.find_one({"user_id": user_id})

    async def create_user(self, email: str, password: str) -> Dict[str, Any]:
        normalized_email = email.strip().lower()
        user_id = generate_user_id()
        password_hash = hash_password(password)
        now = datetime.now(timezone.utc)

        doc = {
            "user_id": user_id,
            "email": normalized_email,
            "password_hash": password_hash,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }
        await self.collection.insert_one(doc)
        return doc
