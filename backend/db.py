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
    title TEXT,
    content TEXT
)
    """)

    default_modules = [
    ("remedial", "Basic Concepts", "Basic module content"),
    ("intermediate", "Intermediate Learning", "Intermediate module content"),
    ("advanced", "Advanced Mastery", "Advanced module content"),
    ("practice", "Practice Mode", "Practice exercises")
]

    cursor.executemany(
    "INSERT OR IGNORE INTO modules VALUES (?, ?, ?)",
    default_modules
)

    conn.commit()
    conn.close()