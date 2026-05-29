# Presentation Layer Documentation (Inbox Architecture)

The UI architecture implements **Unidirectional Data Flow (UDF)** combined with Jetpack Compose's state-driven presentation model.

## Components

### 1. `InboxUiState.kt`
- **Path**: `com.silo.zenmail.ui.inbox.InboxUiState`
- **Model Type**: Sealed Interface (Loading/Content/Error paradigm).
- **Structure**:
  - `Loading`: Emitted while the local room cache is first being populated.
  - `Success`: Passes an immutable `List<Email>` domain object ready for direct display.
  - `Error`: Contains explicit localization keys or system exceptions for crash diagnostics.

### 2. `InboxViewModel.kt`
- **Path**: `com.silo.zenmail.ui.inbox.InboxViewModel`
- **Purpose**: Connects the repository logic to Jetpack Compose elements.
- **Key Lifecycles & Scopes**:
  - Extends Android lifecycle-aware `ViewModel` to persist during layout rotation configuration alterations.
  - Exposes `uiState: StateFlow<InboxUiState>` initialized with a caching policy `SharingStarted.WhileSubscribed(5000)`.
  - Runs synchronization on a separate Thread Dispatcher (`Dispatchers.IO`) in the `viewModelScope`.
