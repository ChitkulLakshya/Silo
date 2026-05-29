package com.silo.zenmail.data.repository

import com.silo.zenmail.core.local.EmailDao
import com.silo.zenmail.core.local.EmailEntity
import com.silo.zenmail.core.remote.ZenMailApiService
import com.silo.zenmail.domain.model.Email
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class EmailRepositoryImpl @Inject constructor(
    private val emailDao: EmailDao,
    private val apiService: ZenMailApiService
) : EmailRepository {

    override fun observeInbox(): Flow<List<Email>> {
        return emailDao.getInboxEmails().map { entities ->
            entities.map { entity ->
                Email(
                    id = entity.id,
                    threadId = entity.threadId,
                    snippet = entity.snippet,
                    subject = entity.subject,
                    sender = entity.sender
                )
            }
        }
    }

    override suspend fun refreshInbox() = withContext(Dispatchers.IO) {
        try {
            val remoteEmails = apiService.fetchLatestEmails()
            val entities = remoteEmails.map { email ->
                EmailEntity(
                    id = email.id,
                    threadId = email.threadId,
                    snippet = email.snippet,
                    subject = email.subject,
                    sender = email.sender
                )
            }
            emailDao.clearInbox()
            emailDao.insertEmails(entities)
        } catch (e: Exception) {
            e.printStackTrace()
            throw e
        }
    }

    override suspend fun archiveEmail(id: String) = withContext(Dispatchers.IO) {
        try {
            // Optimistic local deletion first for zero-lag feeling
            emailDao.deleteEmailById(id)
            // Remote request (can fail or succeed silently, in production we would queue this offline)
            apiService.archiveEmail(id)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
