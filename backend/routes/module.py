from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import sqlite3
from db import get_connection  # Changed from get_db_connection to get_connection

router = APIRouter()

class ModuleRequest(BaseModel):
    module_id: str

class ModuleResponse(BaseModel):
    title: str
    content: str
    difficulty: Optional[str] = None
    estimated_time: Optional[int] = None

@router.post("/get_module", response_model=ModuleResponse)
async def get_module(request: ModuleRequest):
    """
    Get module content by module_id
    """
    try:
        conn = get_connection()  # Using the correct function name
        cursor = conn.cursor()
        
        # Query module from database
        cursor.execute(
            "SELECT title, content, difficulty, estimated_time FROM modules WHERE id = ?",
            (request.module_id,)
        )
        
        module = cursor.fetchone()
        conn.close()
        
        if module:
            return ModuleResponse(
                title=module[0],
                content=module[1],
                difficulty=module[2],
                estimated_time=module[3]
            )
        else:
            # Return a default module if not found
            return ModuleResponse(
                title=f"Module {request.module_id}",
                content="This is a dynamically generated learning module based on your performance.",
                difficulty="intermediate",
                estimated_time=15
            )
            
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")# routes/module.py
