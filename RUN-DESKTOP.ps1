$ErrorActionPreference = "Stop"
if (-not (Test-Path "package.json")) { throw "Open PowerShell in the ORACLE folder containing package.json." }
npm.cmd install
npm.cmd run desktop
