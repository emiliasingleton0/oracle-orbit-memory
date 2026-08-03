# ORACLE Memory Archive

A memory archive that transforms personal memories into fragments orbiting a central core. Rather than presenting a conventional list of files, it creates an immersive environment for exploring dates, places, photographs, videos, and music.

Built with **React**, **Three.js**, and **Tauri 2**

## Run in the Browser

```powershell
npm.cmd install
npm.cmd run dev
```

## Run as a Desktop App

Windows development requires Rust, Microsoft C++ Build Tools, and WebView2.

```powershell
npm.cmd install
npm.cmd run desktop
```

You could also right-click `RUN-DESKTOP.ps1` and select **Run with PowerShell**.

## Build the Windows Installer

```powershell
npm.cmd run desktop:build
```

Or:

```powershell
powershell -ExecutionPolicy Bypass -File .\BUILD-WINDOWS.ps1
```

Generated installers appear in:

```text
src-tauri\target\release\bundle\nsis
src-tauri\target\release\bundle\msi
```

The source package is installer-ready
