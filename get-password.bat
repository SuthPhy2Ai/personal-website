@echo off
echo ========================================
echo   Getting Tunnel Password
echo ========================================
echo.

curl -s https://loca.lt/mytunnelpassword > password.txt

echo Your tunnel password is:
echo.
type password.txt
echo.
echo.
echo Password saved to password.txt
echo ========================================
pause
