# ORACLE Desktop Memory Archive

A desktop memory archive that transforms personal memories into fragments orbiting a central core. Rather than presenting a conventional list of files, ORACLE creates an immersive, cyberpunk-inspired environment for exploring dates, places, photographs, videos, music, environmental context, and memory.

- **Frontend:** React, JavaScript, CSS
- **3D Graphics:** Three.js, React Three Fiber, Drei
- **Desktop:** Tauri 2, Rust
- **Build Tooling:** Vite, npm

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

You may also right-click `RUN-DESKTOP.ps1` and select **Run with PowerShell**.

## Build the Windows Installer

```powershell
npm.cmd run desktop:build
```

Or:

```powershell
powershell -ExecutionPolicy Bypass -File .\BUILD-WINDOWS.ps1
```
Minimize and Esc Controls do not work yet... Lol
