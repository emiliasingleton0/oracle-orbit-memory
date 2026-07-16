$ErrorActionPreference = "Stop"
Write-Host "ORACLE Desktop Builder" -ForegroundColor Cyan
Write-Host "Checking project files..."
if (-not (Test-Path "package.json")) { throw "Open PowerShell in the ORACLE folder containing package.json." }
Write-Host "Installing JavaScript dependencies..."
npm.cmd install
Write-Host "Building Windows installer..."
npm.cmd run desktop:build
Write-Host "Finished. Look in src-tauri\target\release\bundle\nsis and src-tauri\target\release\bundle\msi" -ForegroundColor Green
