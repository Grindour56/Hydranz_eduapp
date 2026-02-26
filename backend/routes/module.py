from fastapi import APIRouter
from models import ModuleRequest
import sqlite3

router = APIRouter()

@router.post("/get_module")
def get_module(request: ModuleRequest):
    conn = sqlite3.connect("modules.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT content FROM modules WHERE id=?",
        (request.module_id,)
    )

    row = cursor.fetchone()
    conn.close()

    if row:
        return {"content": row[0]}
    return {"content": "Module not found"}