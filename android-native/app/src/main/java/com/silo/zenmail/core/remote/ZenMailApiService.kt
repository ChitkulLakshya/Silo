package com.silo.zenmail.core.remote

import com.silo.zenmail.domain.model.Email

interface ZenMailApiService {
    suspend fun fetchLatestEmails(): List<Email>
    suspend fun archiveEmail(id: String): Boolean
}
