import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger("scamshield.db")

class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db_instance = Database()

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB database '{settings.MONGODB_DB_NAME}'...")
    db_instance.client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        minPoolSize=settings.MONGODB_MIN_POOL_SIZE,
        maxPoolSize=settings.MONGODB_MAX_POOL_SIZE,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000
    )
    db_instance.db = db_instance.client[settings.MONGODB_DB_NAME]
    logger.info("MongoDB client connected successfully.")

async def close_mongo_connection():
    if db_instance.client:
        logger.info("Closing MongoDB client connection...")
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

def get_database() -> AsyncIOMotorDatabase:
    return db_instance.db
