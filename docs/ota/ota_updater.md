# OTA Update Module Documentation

The `ota` module supports dynamic, self-hosted Over-The-Air app updates, completely bypassing standard app stores for secure enterprise distributions.

## Components

### 1. `OtaUpdater.kt`
- **Path**: `com.silo.zenmail.ota.OtaUpdater`
- **Purpose**: Checks version availability, manages the downloading of new APK updates, and securely requests installation.
- **Workflow**:
  1. **Ping**: Connects to the host repository checking remote version parameters against the device's native version code.
  2. **Download**: Enqueues a secure background download through Android's system `DownloadManager`.
  3. **Capture**: Broadcast receiver listens for `ACTION_DOWNLOAD_COMPLETE`.
  4. **Install**: Translates file reference to secure content URIs using `FileProvider`, dispatching an `ACTION_VIEW` intent with package-archive type.

## Safety & Security Requirements
- The app must declare `<provider>` details inside the `AndroidManifest.xml` targeting `FileProvider`.
- Set up permissions:
  - `android.permission.INTERNET`
  - `android.permission.REQUEST_INSTALL_PACKAGES`
