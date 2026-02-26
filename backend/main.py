from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.module import router
from db import init_db

app = FastAPI()

# Add CORS middleware FIRST (best practice)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for hackathon (allow frontend)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Include routes
app.include_router(router)

@app.get("/")
def root():
    return {"message": "Backend running with SQLite 🚀"}