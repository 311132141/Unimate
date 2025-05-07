@echo off
echo Running Unimate Test Scripts...

REM Check if frontend-only parameter is passed
set FRONTEND_ONLY=false
set USE_PROXY=false

if "%1"=="frontend" set FRONTEND_ONLY=true
if "%2"=="proxy" set USE_PROXY=true

if "%FRONTEND_ONLY%"=="true" (
    if "%USE_PROXY%"=="true" (
        powershell -ExecutionPolicy Bypass -Command "& { cd frontend; python proxy.py }"
    ) else (
        powershell -ExecutionPolicy Bypass -Command "& { cd frontend; python server.py }"
    )
) else (
    REM Start backend in a new window
    start powershell -ExecutionPolicy Bypass -Command "& { cd backend; python manage.py runserver 0.0.0.0:8000 }"
    
    REM Wait for backend to start
    timeout /t 3
    
    REM Start frontend with proxy in current window
    powershell -ExecutionPolicy Bypass -Command "& { cd frontend; python proxy.py }"
)

echo Done. 