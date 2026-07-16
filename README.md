# v4
A downloadable desktop memory archive built with React, Three.js, and Tauri 2. Memories appear as fragments within an orbital reconstruction. Each fragment may preserve a date, time, place, acoustic imprint, environmental context, photograph or video, and personal recollection.

## What changed in V4

- Tauri desktop application shell
- Frameless native window with real minimize, maximize, and close controls
- Windows installer configuration for `.exe` and `.msi`
- Restored window position and size between sessions
- Significantly more detailed white orbital architecture
- Luminous archive core, satellites, radial paths, constellation lines, and 20+ trajectories
- Consistent archival language throughout the interface
- `Fragment` replaces the vague term `Trace`
- `Reconstruction Tools` replaces `Control Panel`
- `Acoustic Imprints` replaces `Audio Residue`
- `Detected Echoes` replaces generated relationships
- `Certainty`, `Signal Strength`, `Visual Resolution`, and `Emotional Temperature` replace unclear calibration labels

## Preview it in VS Code

```powershell
npm.cmd install
npm.cmd run dev
```

## Open it as a desktop app during development

Windows development requires Rust, Microsoft C++ Build Tools, and WebView2. After those are installed:

```powershell
npm.cmd install
npm.cmd run desktop
```

You can also right-click `RUN-DESKTOP.ps1` and choose **Run with PowerShell**.

## Build the downloadable Windows installer

```powershell
npm.cmd run desktop:build
```

Or run:

```powershell
powershell -ExecutionPolicy Bypass -File .\BUILD-WINDOWS.ps1
```

The finished installers will appear in:

```text
src-tauri\target\release\bundle\nsis
src-tauri\target\release\bundle\msi
```

Tauri creates the installer on the Windows computer. This source ZIP is installer-ready, but it does not contain a precompiled `.exe` because Windows installers must be built in a Windows development environment.
