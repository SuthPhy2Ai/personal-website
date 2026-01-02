@echo off
echo ========================================
echo   Stopping Web Server and Tunnel
echo ========================================
echo.

REM Kill Python HTTP server
echo [1/2] Stopping HTTP server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a > nul 2>&1
)

REM Kill localtunnel processes
echo [2/2] Stopping localtunnel...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq localtunnel*" > nul 2>&1
wmic process where "commandline like '%%localtunnel%%'" delete > nul 2>&1

echo.
echo ========================================
echo   All services stopped!
echo ========================================
echo.
pause
