from fastapi import APIRouter
from models import ModuleRequest
import sqlite3

router = APIRouter()

@router.post("/get_module")
def get_module(request: ModuleRequest):
    conn = sqlite3.connect("modules.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT title, content FROM modules WHERE id=?",
        (request.module_id,)
    )

    row = cursor.fetchone()
    conn.close()

    if row:
        return {
            "title": row[0],
            "content": row[1]
        }

    return {
        "title": "Not Found",
        "content": "Module not found"
    }