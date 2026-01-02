@echo off
echo ========================================
echo   Server Status
echo ========================================
echo.

echo Checking HTTP server (port 8000)...
netstat -ano | findstr :8000 | findstr LISTENING
if errorlevel 1 (
    echo   [X] HTTP server is NOT running
) else (
    echo   [√] HTTP server is running
)
echo.

echo Checking localtunnel...
tasklist /FI "IMAGENAME eq node.exe" /FO CSV | findstr "node.exe" > nul
if errorlevel 1 (
    echo   [X] Localtunnel is NOT running
) else (
    echo   [√] Localtunnel might be running
)
echo.

echo ========================================
echo Tunnel URL:
type tunnel.log 2>nul | findstr /C:"your url is"
echo.
echo Password:
type password.txt 2>nul
echo ========================================
echo.
pause
