# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.module import router as module_router
from db import init_db

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Include routes
app.include_router(module_router)

@app.get("/")
def root():
    return {"message": "Backend running with SQLite 🚀"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}