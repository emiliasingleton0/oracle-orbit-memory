# ORACLE Desktop Memory Archive

> **A machine attempting to reconstruct a human life from what remains.**

ORACLE is a native desktop memory archive that transforms personal memories into luminous fragments orbiting a central reconstruction core. Rather than presenting a conventional list of files, ORACLE creates an immersive, cyberpunk-inspired environment for exploring dates, places, photographs, videos, audio traces, environmental context, and written recollections.

Built with **React**, **Three.js**, and **Tauri 2**, the project combines desktop software engineering, real-time 3D rendering, local persistence, and experimental liquid-glass interface design.

## Highlights

- Interactive Three.js orbital memory visualization
- Native desktop shell powered by Tauri 2
- Frameless window with native minimize, maximize, and close controls
- Liquid-glass cyberpunk interface with subtle violet, cyan, and rose ambience
- Create memory fragments with date, time, location, recollection, audio, photos, or short video
- Optional environmental reconstruction for weather, coordinates, moon phase, and time zone
- Spotify audio-trace embedding
- Detected relationship echoes between related memories
- Adjustable certainty, signal strength, visual resolution, and emotional temperature
- Persistent local archive storage
- JSON archive export, import, and reset tools
- Live system clock and reduced-motion accessibility support
- Windows `.exe` / `.msi` installer configuration

## Tech Stack

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

Generated installers appear in:

```text
src-tauri\target\release\bundle\nsis
src-tauri\target\release\bundle\msi
```

The source package is installer-ready. A Windows installer must be compiled on a Windows development environment.

## Archive Backups

Open **Reconstruction Tools** inside ORACLE to:

- Export the current archive as a portable JSON file
- Import a previously exported archive
- Reset the application to the original recovered fragments

Large embedded media files may exceed browser local-storage limits, so regular JSON backups are recommended.

## Version 4.2

- Added portable archive export and import
- Added safe archive reset controls
- Added a live system clock
- Improved corrupted-storage recovery
- Refined the liquid-glass cyberpunk visual system
- Added keyboard focus styling and reduced-motion support
- Updated repository documentation for publication

---

*What happened, and what remained.*


## v4.4 Interaction Update

- Cinematic fragment reconstruction sequence
- Reactive fragment lock cursor with motion echoes
- Live session log recording archive events
- Mode-state overlays for Index, Reconstruction, Echo Scan, and anomalies
- Softer motion blur and depth feedback during orbit navigation
- Reactive orbital architecture when a fragment is active
