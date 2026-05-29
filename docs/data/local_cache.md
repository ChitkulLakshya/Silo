# Data Layer Documentation (Local Cache)

The local caching strategy utilizes Android's **Room Database** to achieve a completely offline-first, zero-lag UI experience. 

## Components

### 1. `EmailEntity.kt`
- **Path**: `com.silo.zenmail.data.source.local.EmailEntity`
- **Purpose**: Represents the database schema for stored work emails.
- **Key Fields**:
  - `id`: The unique message identifier serving as the primary key.
  - `threadId`: Grouping identifier for email conversations.
  - `bodyHtml`: Cached HTML body content, allowing offline parsing and display.
  - `timestamp`: Epoch millisecond value for ordering the inbox timeline.

### 2. `EmailDao.kt`
- **Path**: `com.silo.zenmail.data.source.local.EmailDao`
- **Purpose**: Defines standard SQLite database operations.
- **Reactive Stream**:
  - Returns `Flow<List<EmailEntity>>` for `getInboxEmails()`.
  - Flow automatically emits new lists to observers whenever the underlying database undergoes modifications (Insert, Update, or Delete).

## Security & Encryption
- In production, configure Room to compile with **SQLCipher**.
- The database is encrypted at rest using an AES-256 key generated in the keystore, preventing unauthorized external access to the work email repository.
