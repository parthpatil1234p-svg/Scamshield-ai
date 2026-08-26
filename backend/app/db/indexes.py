import logging
import pymongo
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger("scamshield.db")

async def ensure_indexes(db: AsyncIOMotorDatabase) -> None:
    logger.info("Verifying and creating database indexes...")
    
    await db.users.create_index(
        [("email", pymongo.ASCENDING)],
        unique=True,
        name="idx_users_email_unique"
    )
    await db.users.create_index(
        [("user_id", pymongo.ASCENDING)],
        unique=True,
        name="idx_users_user_id_unique"
    )

    await db.scans.create_index(
        [("scan_id", pymongo.ASCENDING)],
        unique=True,
        name="idx_scans_scan_id_unique"
    )
    await db.scans.create_index(
        [("user_id", pymongo.ASCENDING), ("created_at", pymongo.DESCENDING)],
        name="idx_scans_user_created_at"
    )
    await db.scans.create_index(
        [
            ("user_id", pymongo.ASCENDING),
            ("risk_level", pymongo.ASCENDING),
            ("created_at", pymongo.DESCENDING)
        ],
        name="idx_scans_user_risk_created_at"
    )
    logger.info("Database indexes successfully created and verified.")
