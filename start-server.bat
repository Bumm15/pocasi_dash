@echo off
cd /d "c:\programování\pocasi_dash"

REM Zabij případný starý proces na portu 3001
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001 "') do taskkill /F /PID %%a 2>nul
timeout /t 1 /nobreak >nul

node server.js
