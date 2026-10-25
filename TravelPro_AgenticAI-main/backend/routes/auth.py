from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.database.db import get_users_collection
from backend.models.schemas import UserRegister, UserLogin, UserResponse, UserPreferencesSchema
from backend.utils.security import get_password_hash, verify_password, create_access_token, decode_access_token
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to retrieve the currently authenticated user from the JWT token."""
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    users_coll = get_users_collection()
    user = await users_coll.find_one({"email": payload["sub"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists"
        )
    return user

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    users_coll = get_users_collection()
    
    # Check if user already exists
    existing_user = await users_coll.find_one({"email": user_data.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    # Create user doc
    hashed_pwd = get_password_hash(user_data.password)
    default_prefs = UserPreferencesSchema()
    
    user_doc = {
        "email": user_data.email.lower(),
        "password": hashed_pwd,
        "name": user_data.name,
        "preferences": default_prefs.model_dump()
    }
    
    res = await users_coll.insert_one(user_doc)
    
    # Generate token
    token = create_access_token(data={"sub": user_doc["email"]})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(res.inserted_id),
            "email": user_doc["email"],
            "name": user_doc["name"],
            "preferences": user_doc["preferences"]
        }
    }

@router.post("/login")
async def login(credentials: UserLogin):
    users_coll = get_users_collection()
    
    user = await users_coll.find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    token = create_access_token(data={"sub": user["email"]})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "preferences": user.get("preferences", UserPreferencesSchema().model_dump())
        }
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "name": current_user["name"],
        "preferences": current_user.get("preferences", UserPreferencesSchema().model_dump())
    }

@router.put("/preferences")
async def update_preferences(prefs: UserPreferencesSchema, current_user: dict = Depends(get_current_user)):
    users_coll = get_users_collection()
    
    await users_coll.update_one(
        {"email": current_user["email"]},
        {"$set": {"preferences": prefs.model_dump()}}
    )
    
    return {
        "message": "Preferences updated successfully",
        "preferences": prefs.model_dump()
    }
