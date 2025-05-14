@echo off
echo Running WebSocket tests...

REM Change to this directory
cd %~dp0

REM Run the direct WebSocket test server in a separate window
start "Direct WebSocket Server" cmd /c "python direct_test.py"

REM Wait a moment for the server to start
timeout /t 2 > nul

REM Run the WebSocket test client
python websocket_test.py

REM Store the exit code
set EXIT_CODE=%ERRORLEVEL%

REM Show the result
if %EXIT_CODE% == 0 (
    echo All WebSocket tests passed!
) else (
    echo Some WebSocket tests failed.
)

exit /b %EXIT_CODE% 