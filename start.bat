@echo off
echo ========================================
echo   Starting Web Server and Tunnel
echo ========================================
echo.

REM Start Python HTTP server in background
echo [1/3] Starting HTTP server on port 8000...
start /B python -m http.server 8000 > server.log 2>&1
timeout /t 2 /nobreak > nul

REM Start localtunnel in background
echo [2/3] Starting localtunnel...
start /B cmd /c "npx localtunnel --port 8000 > tunnel.log 2>&1"
timeout /t 5 /nobreak > nul

REM Get and display the tunnel URL and password
echo [3/3] Getting tunnel information...
echo.
timeout /t 3 /nobreak > nul

echo ========================================
echo   Your Website is Now Live!
echo ========================================
echo.

REM Display tunnel URL from log
findstr /C:"your url is" tunnel.log
echo.

REM Get and display password
echo Getting tunnel password...
curl -s https://loca.lt/mytunnelpassword > password.txt
echo Tunnel Password:
type password.txt
echo.
echo.

echo ========================================
echo The password has been saved to password.txt
echo The tunnel URL has been saved to tunnel.log
echo.
echo To stop the server, run: stop.bat
echo ========================================
pause
