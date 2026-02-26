import sqlite3

DB_NAME = "modules.db"

def get_connection():
    return sqlite3.connect(DB_NAME)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS modules (
        id TEXT PRIMARY KEY,
        content TEXT
    )
    """)

    default_modules = [
        ("remedial", "Basic module content"),
        ("intermediate", "Intermediate module content"),
        ("advanced", "Advanced module content"),
        ("practice", "Practice exercises")
    ]

    cursor.executemany(
        "INSERT OR IGNORE INTO modules VALUES (?, ?)",
        default_modules
    )

    conn.commit()
    conn.close()