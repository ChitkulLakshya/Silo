package com.silo.zenmail.ui.inbox

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.silo.zenmail.data.repository.EmailRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class InboxViewModel @Inject constructor(
    private val repository: EmailRepository
) : ViewModel() {

    val uiState: StateFlow<InboxUiState> = repository.observeInbox()
        .map { emails -> InboxUiState.Success(emails) }
        .catch { e -> emit(InboxUiState.Error(e.message ?: "Unknown Error")) }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = InboxUiState.Loading
        )

    private val _isRefreshing = MutableStateFlow(false)
    val isRefreshing: StateFlow<Boolean> = _isRefreshing.asStateFlow()

    init {
        syncInbox()
    }

    fun syncInbox() {
        viewModelScope.launch(Dispatchers.IO) {
            _isRefreshing.value = true
            try {
                repository.refreshInbox()
            } catch (e: Exception) {
                // Silently handle sync errors
            } finally {
                _isRefreshing.value = false
            }
        }
    }

    fun archiveEmail(id: String) {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                repository.archiveEmail(id)
            } catch (e: Exception) {
                // Handle deletion errors
            }
        }
    }
}
