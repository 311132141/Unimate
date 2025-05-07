# Unimate
Wayfinding app for universities

# UNIMATE – Local‑Laptop Server Prototype README

> **Version 1.0 – 7 May 2025**  |  Semester demo deliverable

UNIMATE is a mobile kiosk solution that lets university students tap their ID card and instantly see their personal timetable **and** an animated 3‑D route to class, right on a Galaxy Tab. This README explains how to clone, configure, and run the complete prototype on a single **Windows or macOS laptop acting as the local server**.

---

## ✨ Feature Overview

| ID   | Feature                       | Notes                                                                  |
| ---- | ----------------------------- | ---------------------------------------------------------------------- |
| F‑01 | **RFID card‑tap login**       | MFRC522 → ESP32 → Django `/api/scan` → WebSocket push → JWT session.   |
| F‑02 | **Fallback credential login** | Three demo `username / password` pairs matching three RFID test cards. |
| F‑03 | **News / Events panel**       | Hard‑coded JSON feed; urgent item badge in red.                        |
| F‑04 | **3‑D wire‑frame map**        | Three.js; placeholder Engineering building & A\* routing.              |
| F‑05 | **Timetable viewer**          | Toggle *Class* / *Exam*; modal details on click.                       |
| F‑06 | **Print**                     | `window.print()` – styles for A4 laser & 80 mm thermal.                |
| F‑07 | **Public room search**        | Search bar on Home; draws route without login.                         |

---

## 🗄️ Repo Structure

```
unimate/
├─ backend/             # Django + Channels + fixtures
│  ├─ docker-compose.yml
│  ├─ requirements.txt
│  └─ app/
├─ frontend/            # HTML, CSS (Tailwind), JS, Three.js assets
├─ hardware/            # ESP32 Arduino sketch + wiring diagram
└─ docs/                # Design PDF & slides
```

---

## 🔧 Hardware List

| Qty        | Part                          | Purpose                                          |
| ---------- | ----------------------------- | ------------------------------------------------ |
| 1          | MFRC522 13.56 MHz RFID reader | Reads UID from student ID.                       |
| 1          | ESP32‑WROOM‑32 DevKit         | Handles SPI + Wi‑Fi JSON POST.                   |
| 3          | RFID test cards               | Pre‑flashed demo UIDs (Alice, Bob, Carol).       |
| 1          | Galaxy Tab (Android 11+)      | Runs kiosk PWA in Guided‑Access.                 |
| 1          | **Laptop** (Windows/macOS)    | Hosts Django + WebSocket server & Wi‑Fi hotspot. |
| *Optional* | Brother QL‑800 printer        | Prints timetable; swap any AirPrint printer.     |

---

## 🌐 Local Network Topology

```
                 ┌───────────────┐  Wi‑Fi (SSID UNIMATE‑demo)
   MFRC522 ←SPI→ │ ESP32 DevKit  │────────────▶ Laptop 192.168.4.1:8000
                 └───────────────┘               ▲
                                                 │ WebSocket + HTTP
                 ┌───────────────────────────────┤
                 │  Galaxy Tab (Chrome/Kiosk)    │
                 └───────────────────────────────┘
```

The laptop hosts a **mobile‑hotspot** (WLAN) so no external router or internet is needed.

---

## 🚀 Quick‑Start (Windows PowerShell example)

```powershell
# 1 Enable Hotspot
netsh wlan set hostednetwork mode=allow ssid=UNIMATE-demo key=Unimate2025!
netsh wlan start hostednetwork
# 2 Assign static IP (GUI or):
netsh interface ip set address "Wi-Fi" static 192.168.4.1 255.255.255.0

# 3 Clone & spin up backend
git clone https://github.com/yourteam/unimate.git
cd unimate/backend
copy .env.example .env            # set SECRET_KEY if desired
wsl docker compose up --build -d  # or plain docker Compose v2

# 4 Seed demo users / courses / events
wsl docker compose exec web python manage.py loaddata demo_users demo_courses demo_events
```

> **Tip (macOS):** use *System Preferences → Sharing → Internet Sharing* to create the hotspot. Assign IP `192.168.4.1/24` on the new interface.

### ESP32 Setup

1. Wire MFRC522 to ESP32 (3 V3 logic, SPI pins).
2. Flash `hardware/esp32_unimate.ino` (Arduino IDE).
3. Edit `WIFI_SSID`, `WIFI_PASS`, `SERVER_IP="192.168.4.1"`.

### Galaxy Tab Setup

* Connect to **UNIMATE‑demo** Wi‑Fi.
* Open Chrome `http://192.168.4.1:8000`.
* Add to Home Screen if you want full PWA.

---

## 🔑 Demo Credentials & Card UIDs

| User  | UID (hex)  | Username | Password   |
| ----- | ---------- | -------- | ---------- |
| Alice | 04A1B2C3D4 | `alice`  | `Pass123!` |
| Bob   | 04B5C6D7E8 | `bob`    | `Pass123!` |
| Carol | 0499AA11BB | `carol`  | `Pass123!` |

A tap with Alice’s card should flip the Home screen into her dashboard in <1 s.

---

## 🛠️ Development Scripts

```bash
# Run Django + Channels without Docker (dev only):
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000

# Tailwind CLI watcher (from frontend/):
npx tailwindcss -i ./tailwind.css -o ./static/site.css --watch
```

---

## 🧪 Manual Test Cases

| ID   | Steps                           | Expected                                        |
| ---- | ------------------------------- | ----------------------------------------------- |
| T‑01 | Tap Alice card                  | Dashboard + Alice timetable in <1 s             |
| T‑02 | Credential login `bob/Pass123!` | Bob dashboard                                   |
| T‑03 | Click ENGGEN205 block           | 3‑D route animates; modal shows lecturer & room |
| T‑04 | Press **Print**                 | System print preview with timetable + route     |
| T‑05 | Wait 180 s idle                 | Auto‑logout back to Home                        |

---

## 🔒 Security Notes (Prototype)

* JWT (HS256) expires 4 h; stored in `sessionStorage` only.
* RFID UID transport over HTTP inside private hotspot (acceptable for demo).
* Passwords hashed via Django PBKDF2.

---

## ⚙️ Future Enhancements

* Live event feed via UoA API → `/api/events`.
* Replace placeholder OBJ with full CAD floor‑plan.
* Room‑occupancy heat‑map.
* Fleet mode: kiosks register via mDNS instead of fixed IDs.
* Deploy to cloud VPS for cross‑campus testing.

---

© 2025 Team UNIMATE – ENGGEN 705
