# v4
Desktop memory archive built with React, Three.js, and Tauri 2. Memories appear as orbiting around planet. Each fragment may preserve a date, time, place, acoustic imprint, environmental context, photograph or video, and personal recollection. Photos are not up-to-date

## What changed in V4

- Tauri desktop application shell
- Frameless native window with real minimize, maximize, and close controls
- Windows installer configuration for `.exe` and `.msi`

## outdated , do not use for now ts :)
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

For now Tauri creates the installer on the Windows computer
