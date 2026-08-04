@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing ORACLE dependencies...
  call npm install
  if errorlevel 1 pause & exit /b 1
)
call npm run desktop
if errorlevel 1 pause
