from fastapi import APIRouter, HTTPException, Depends, status
from backend.database.db import get_trips_collection, _motor_find_to_list
from backend.routes.auth import get_current_user
from backend.models.schemas import TripCreate
from bson import ObjectId
from datetime import datetime
from typing import Dict, Any

router = APIRouter(prefix="/api/trips", tags=["Saved Trips"])


@router.post("")
async def save_trip(trip_data: Dict[str, Any], current_user: dict = Depends(get_current_user)):
    trips_coll = get_trips_collection()
    user_id = str(current_user["_id"])
    trip_data["user_id"] = user_id

    existing_id = trip_data.get("id") or trip_data.get("_id")

    # 1. Check if this exact trip already exists by ID
    if existing_id:
        existing = await trips_coll.find_one({"_id": str(existing_id)})
        if existing and str(existing.get("user_id")) == user_id:
            trip_data["_id"] = str(existing_id)
            trip_data["id"] = str(existing_id)
            await trips_coll.update_one({"_id": str(existing_id)}, {"$set": trip_data})
            return {
                "message": "Trip updated successfully",
                "trip": trip_data
            }

    # 2. Check for an identical trip (same destination + start_location + start_date)
    #    to prevent duplicate inserts on double-saves.
    dest = trip_data.get("destination")
    start_loc = trip_data.get("start_location")
    start_d = trip_data.get("start_date")

    if dest and start_loc and start_d:
        raw = trips_coll.find({"user_id": user_id})
        user_trips = await _motor_find_to_list(raw)

        for match in user_trips:
            if (match.get("destination") == dest and
                    match.get("start_location") == start_loc and
                    match.get("start_date") == start_d):
                m_id = str(match.get("_id") or match.get("id") or "")
                if m_id:
                    trip_data["_id"] = m_id
                    trip_data["id"] = m_id
                    await trips_coll.update_one({"_id": m_id}, {"$set": trip_data})
                    return {
                        "message": "Trip updated successfully",
                        "trip": trip_data
                    }

    trip_data["created_at"] = datetime.utcnow().isoformat()
    trip_data["status"] = "saved"

    try:
        res = await trips_coll.insert_one(trip_data)
        new_id = str(getattr(res, "inserted_id", trip_data.get("_id", trip_data.get("id", ""))))
        trip_data["_id"] = new_id
        trip_data["id"] = new_id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save trip to database: {str(e)}"
        )

    return {
        "message": "Trip saved successfully",
        "trip": trip_data
    }


@router.get("")
async def list_trips(current_user: dict = Depends(get_current_user)):
    trips_coll = get_trips_collection()

    try:
        raw = trips_coll.find({"user_id": str(current_user["_id"])})
        user_trips = await _motor_find_to_list(raw)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve trips from database: {str(e)}"
        )

    results = []
    seen_ids = set()
    for t in user_trips:
        t_id = str(t.get("_id") or t.get("id") or "")
        if not t_id or t_id in seen_ids:
            continue
        seen_ids.add(t_id)
        t["id"] = t_id
        t["_id"] = t_id
        results.append(t)

    results.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return results


@router.get("/{id}")
async def get_trip(id: str, current_user: dict = Depends(get_current_user)):
    trips_coll = get_trips_collection()

    trip = await trips_coll.find_one({"_id": id})
    if not trip:
        try:
            trip = await trips_coll.find_one({"_id": ObjectId(id)})
        except Exception:
            pass

    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    if str(trip.get("user_id")) != str(current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this trip"
        )

    t_id = str(trip.get("_id") or trip.get("id") or id)
    trip["id"] = t_id
    trip["_id"] = t_id
    return trip


@router.put("/{id}")
async def update_trip(id: str, updated_data: Dict[str, Any], current_user: dict = Depends(get_current_user)):
    trips_coll = get_trips_collection()

    trip = await trips_coll.find_one({"_id": id})
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    if str(trip.get("user_id")) != str(current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this trip"
        )

    updated_data["_id"] = id
    updated_data["id"] = id
    updated_data.pop("user_id", None)

    await trips_coll.update_one({"_id": id}, {"$set": updated_data})

    updated_data["id"] = id
    updated_data["_id"] = id
    return {
        "message": "Trip updated successfully",
        "trip": updated_data
    }


@router.delete("/{id}")
async def delete_trip(id: str, current_user: dict = Depends(get_current_user)):
    trips_coll = get_trips_collection()

    trip = await trips_coll.find_one({"_id": id})
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    if str(trip.get("user_id")) != str(current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this trip"
        )

    await trips_coll.delete_one({"_id": id})
    return {"message": "Trip deleted successfully"}
