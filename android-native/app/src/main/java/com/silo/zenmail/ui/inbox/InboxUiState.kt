package com.silo.zenmail.ui.inbox

import com.silo.zenmail.domain.model.Email

sealed interface InboxUiState {
    object Loading : InboxUiState
    data class Success(val emails: List<Email>) : InboxUiState
    data class Error(val message: String) : InboxUiState
}
