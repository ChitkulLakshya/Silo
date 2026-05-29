# Domain Layer Documentation (Business Logic)

The Domain Layer acts as the structural foundation of the core business logic. It is completely independent of Android framework libraries, database systems, or network models to maximize testability and reusability.

## Components

### 1. `Email.kt`
- **Path**: `com.silo.zenmail.domain.model.Email`
- **Purpose**: Pure Kotlin data class representing an email thread inside the business logic and UI layer.
- **Independence**: This class is completely decoupled from Room annotations (`@Entity`, `@ColumnInfo`) or Retrofit/GSON response parsing tags, protecting presentation elements from database or network schema migrations.

### 2. `EmailRepository.kt`
- **Path**: `com.silo.zenmail.domain.repository.EmailRepository`
- **Purpose**: Repository interface abstracting data fetching behavior.
- **Contract Methods**:
  - `observeInbox()`: Returns a reactive stream `Flow<List<Email>>` feeding the UI.
  - `refreshInboxFromServer()`: Triggers background remote synchronization.
  - `deleteEmail(emailId)`: Command to remove an email.
  - `clearInbox()`: Securely purges cached work emails on logout.
