import os
import json
import logging
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, OperationFailure, ServerSelectionTimeoutError

logger = logging.getLogger("db")

MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = "travel_planner"


class FileFallbackCollection:
    """Simulates a MongoDB async collection using a local JSON file."""

    def __init__(self, filename: str, collection_name: str):
        self.filepath = filename
        self.collection_name = collection_name
        self._ensure_file()

    def _ensure_file(self):
        if not os.path.exists(self.filepath):
            with open(self.filepath, "w") as f:
                json.dump({}, f)
        with open(self.filepath, "r") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = {}
        if self.collection_name not in data:
            data[self.collection_name] = []
            with open(self.filepath, "w") as f:
                json.dump(data, f, indent=4)

    def _read_data(self) -> list:
        with open(self.filepath, "r") as f:
            data = json.load(f)
        return data.get(self.collection_name, [])

    def _write_data(self, collection_data: list):
        with open(self.filepath, "r") as f:
            data = json.load(f)
        data[self.collection_name] = collection_data
        with open(self.filepath, "w") as f:
            json.dump(data, f, indent=4)

    def _match(self, doc: dict, query: dict) -> bool:
        for k, v in query.items():
            if k in ("_id", "id"):
                doc_id = str(doc.get("_id") or doc.get("id") or "")
                if doc_id != str(v):
                    return False
            elif k == "user_id":
                if str(doc.get("user_id") or "") != str(v):
                    return False
            elif doc.get(k) != v:
                return False
        return True

    def _stamp(self, doc: dict) -> dict:
        doc_id = str(doc.get("_id") or doc.get("id") or "")
        if doc_id:
            doc["_id"] = doc_id
            doc["id"] = doc_id
        return doc

    async def find_one(self, query: dict) -> dict:
        for doc in self._read_data():
            if self._match(doc, query):
                return self._stamp(doc)
        return None

    async def find(self, query: dict = None) -> list:
        """Returns a plain list (no cursor). Use _motor_find_to_list() in routes."""
        collection_data = self._read_data()
        if not query:
            return [self._stamp(doc) for doc in collection_data]
        return [self._stamp(doc) for doc in collection_data if self._match(doc, query)]

    async def insert_one(self, document: dict):
        collection_data = self._read_data()
        doc_id = str(document.get("_id") or document.get("id") or ObjectId())
        document["_id"] = doc_id
        document["id"] = doc_id
        collection_data.append(document)
        self._write_data(collection_data)

        class InsertResult:
            inserted_id = doc_id

        return InsertResult()

    async def update_one(self, query: dict, update: dict, upsert: bool = False):
        collection_data = self._read_data()
        update_fields = update.get("$set", {})
        updated = False

        for doc in collection_data:
            if self._match(doc, query):
                doc.update(update_fields)
                self._stamp(doc)
                updated = True
                break

        if not updated and upsert:
            new_doc = {**query, **update_fields}
            doc_id = str(new_doc.get("_id") or new_doc.get("id") or ObjectId())
            new_doc["_id"] = doc_id
            new_doc["id"] = doc_id
            collection_data.append(new_doc)

        self._write_data(collection_data)

        class UpdateResult:
            matched_count = 1 if updated else 0
            modified_count = 1 if updated else 0

        return UpdateResult()

    async def delete_one(self, query: dict):
        collection_data = self._read_data()
        new_data = []
        deleted = False

        for doc in collection_data:
            if self._match(doc, query) and not deleted:
                deleted = True
                continue
            new_data.append(doc)

        self._write_data(new_data)

        class DeleteResult:
            deleted_count = 1 if deleted else 0

        return DeleteResult()


async def _motor_find_to_list(cursor_or_list, limit: int = 200) -> list:
    """
    Unified helper: if the result is a Motor AsyncIOMotorCursor call .to_list(),
    otherwise (FileFallbackCollection returns a plain list) just return it as-is.
    Call this everywhere you use collection.find() in route handlers.
    """
    if hasattr(cursor_or_list, "to_list"):
        return await cursor_or_list.to_list(limit)
    return list(cursor_or_list)


class DatabaseConnection:
    def __init__(self):
        self.client = None
        self.db = None
        self.use_fallback = True
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.fallback_file = os.path.join(base_dir, "local_db.json")

    def connect(self):
        if MONGODB_URI:
            try:
                # Motor client creation is synchronous; actual network errors
                # surface on the first real query (Motor is lazy).
                # We catch known error types here; auth failures (OperationFailure)
                # that surface during connect-time checks are also caught.
                self.client = AsyncIOMotorClient(
                    MONGODB_URI,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=5000,
                    socketTimeoutMS=10000,
                )
                self.db = self.client[DB_NAME]
                self.use_fallback = False
                logger.info("MongoDB Atlas client initialised. Connection will be verified on first query.")
                print("MongoDB Atlas Connected Successfully.")
            except (ConnectionFailure, OperationFailure, ServerSelectionTimeoutError, Exception) as e:
                logger.error(f"MongoDB connection failed: {e}. Falling back to Local JSON Database.")
                print(f"MongoDB connection failed: {e}. Falling back to Local JSON Database.")
                self.use_fallback = True
        else:
            print("No MONGODB_URI provided. Falling back to Local JSON Database (local_db.json).")
            self.use_fallback = True

    def get_collection(self, name: str):
        if self.use_fallback:
            return FileFallbackCollection(self.fallback_file, name)
        return self.db[name]


db_connection = DatabaseConnection()
db_connection.connect()


# Collection helpers
def get_users_collection():
    return db_connection.get_collection("users")


def get_trips_collection():
    return db_connection.get_collection("trips")
