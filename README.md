
## 📘 EdgeLearn

Privacy-Preserving Edge-Based Adaptive Learning System

🚀 #Overview

EdgeLearn is a web-based adaptive learning platform designed to preserve student privacy while operating under limited bandwidth constraints.

Unlike traditional systems that send detailed behavioral analytics to centralized servers, EdgeLearn performs personalization entirely on the user's device (edge). Only minimal encrypted module identifiers are transmitted to the backend.

This ensures:

🔐 No raw learning data leaves the device

📉 Minimal bandwidth usage

🧠 Personalized adaptive learning

🛡 Reduced privacy risk even if central server is compromised

🏗# Architecture
1️⃣ Edge Layer (Client – Browser)

Runs entirely in the user's browser.

*Responsibilities:

Collect quiz performance data

Compute learner profile locally

Generate device-specific personalization seed

Map profile → module_id using stochastic transformation

Encrypt module_id

Send encrypted request via custom protocol

No behavioral logs or learning history are transmitted.

2️⃣ Central Server (Backend API)

Responsibilities:

Store learning modules

Receive encrypted module request

Decrypt module_id

Return requested module content

The server:

Does NOT store user learning history

Does NOT receive raw performance data

Only processes encrypted content identifiers

🔄 System Flow

User completes a quiz.

Frontend computes learner profile:

Accuracy

Speed

Consistency

Topic strengths

Profile is transformed using device-specific seed.

Transformed score → module_id.

module_id is encrypted (AES-GCM).

Custom JSON protocol sends:

{
  "device_id": "...",
  "payload": "encrypted_data",
  "timestamp": 17383838
}

Backend decrypts module_id.

Server returns module content.

🔐 # Privacy Model

EdgeLearn protects user privacy by:

Performing all analytics locally

Using device-specific stochastic personalization

Sending only encrypted module identifiers

Avoiding centralized storage of behavioral data

Using HTTPS-secured communication

Even if the central database is compromised, raw learning patterns cannot be reconstructed.

🧠# Personalization Logic

Each device generates:

device_seed → stochastic personalization modifier

device_secret → encryption key

Personalization formula:

base_score = weighted(accuracy, speed, consistency)
transformed_score = (base_score * device_seed) % 1

This ensures:

Non-deterministic mapping across devices

Unique recommendation behavior per user

No centralized profile storage

🛠 # Tech Stack
Frontend

HTML / JavaScript (or React)

Web Crypto API (AES-GCM encryption)

LocalStorage (device seed + secret)

Backend

Python

FastAPI

Uvicorn

SQLite / JSON module storage

cryptography library (AES decryption)

📂 #Project Structure
project/
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── crypto.js
│
├── backend/
│   ├── main.py
│   ├── crypto_utils.py
│   └── modules.json
│
└── README.md
⚙ Installation & Running
Backend
cd backend
pip install fastapi uvicorn cryptography
uvicorn main:app --reload

Server runs at:

http://127.0.0.1:8000
Frontend

Open:

frontend/index.html

Or serve with:

npx serve frontend
🎯 # Hackathon Focus

This project prioritizes:

Working prototype

Demonstrable privacy preservation

Edge-based personalization

Minimal communication protocol

Clean architectural separation

It does NOT attempt:

Full ORAM-based access pattern protection

Heavy cryptographic research-level solutions

The goal is practical privacy-aware adaptive learning.

🔮# Future Improvements

Federated learning integration

Differential privacy noise injection

Secure enclave-based personalization

Dynamic difficulty reinforcement learning

Content caching optimization for ultra-low bandwidth environments

👥 # Team Roles

Frontend & Edge AI

Encryption & Protocol

Backend & API

Integration & Architecture

📜 License

MIT License (or choose appropriate license)
