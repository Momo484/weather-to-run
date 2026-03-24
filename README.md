#  Weather-To-Run

A high-performance, full-stack web application that calculates and visualizes the mathematically optimal times to go for a run based on complex weather data. 

This project utilizes a custom **C++ backend engine** to mathematically score future weather conditions (factoring in temperature, dew point, cloud cover, and wind speed) and serves the processed data to a strictly typed **React/TypeScript frontend**, for no good reason other than fun.

## 🔗 Live Links
* **Frontend Application:** [https://https://weather-to-run.vercel.app/]
* **C++ API Endpoint:** [https://weather-to-run.onrender.com/api/forecast?lat=-33.8688&lon=151.2093]

---

## System Architecture

This project is structured as a monorepo, separating the UI layer from the heavy algorithmic processing. 

### Backend (The Scoring Engine)
A custom-built, Dockerized C++ microservice designed for speed and memory safety.
* **Language:** C++17
* **Framework:** Crow (Fast, lightweight C++ microframework)
* **Networking:** ASIO & OpenSSL (via `cpp-httplib` for secure external API requests)
* **Data Handling:** `nlohmann/json`
* **Deployment:** Containerized via Docker and deployed on Render (Linux environment)

### Frontend (The Visualization Layer)
A sleek, responsive, and strictly typed client application.
* **Core:** React 18, Vite, TypeScript
* **Styling:** Tailwind CSS (with custom semantic design tokens & dark mode support)
* **Location Search:** Custom Debounced Autocomplete powered by the Open-Meteo Geocoding API
* **Data Visualization:** Recharts (for mapping the 168-hour scoring arrays)

---

## Key Features

* **Algorithmic Weather Scoring:** The C++ engine processes raw data through custom mathematical models (including flat-top Gaussian and logistic functions) to generate a proprietary 0-100 "Run Score".
* **Optimized Data Payloads:** The backend chunks 168 hours of raw Open-Meteo data into strictly typed, 24-hour daily arrays before transmitting, minimizing frontend processing and rendering costs.
* **Fuzzy Geocoding:** Implemented a custom 300ms debounce hook in React to query the Open-Meteo Geocoding API, providing a seamless, real-time location autocomplete experience without relying on heavy Google Maps SDKs.
* **Production-Ready Deployment:** Engineered with `CMake` and containerized with a `.dockerignore` and `Dockerfile` to ensure flawless cross-platform compilation from an Apple Silicon development environment to an x86 Linux production server.

---

## 💻 Local Development Setup

### Running the C++ Backend
```bash
cd backend
mkdir build && cd build
cmake ..
make
./weather_engine
```
The server will start on http://localhost:8080
### Running the React Frontend
```bash
cd frontend
npm install
npm run dev
```
The client will start on http://localhost:5173
