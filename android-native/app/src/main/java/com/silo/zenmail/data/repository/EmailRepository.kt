package com.silo.zenmail.data.repository

import com.silo.zenmail.domain.model.Email
import kotlinx.coroutines.flow.Flow

interface EmailRepository {
    fun observeInbox(): Flow<List<Email>>
    suspend fun refreshInbox()
    suspend fun archiveEmail(id: String)
}
