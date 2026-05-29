package com.silo.zenmail.core.remote

import com.silo.zenmail.domain.model.Email
import kotlinx.coroutines.delay
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ZenMailApiServiceImpl @Inject constructor() : ZenMailApiService {

    override suspend fun fetchLatestEmails(): List<Email> {
        // Simulate network delay
        delay(1000)
        return listOf(
            Email(
                id = "msg-1",
                threadId = "thread-1",
                sender = "Arlene McCoy <arlene@mail.com>",
                subject = "Design feedback & asset handoff",
                snippet = "Hi there, I wanted to share the latest designs for the client dashboard..."
            ),
            Email(
                id = "msg-2",
                threadId = "thread-2",
                sender = "Google Accounts <no-reply@accounts.google.com>",
                subject = "Security alert for your connected device",
                snippet = "We detected a new login on your Linux device. If this was not you..."
            ),
            Email(
                id = "msg-3",
                threadId = "thread-3",
                sender = "LinkedIn <messages-noreply@linkedin.com>",
                subject = "You have 3 new connection requests pending",
                snippet = "John Doe and 2 other people want to connect with you on LinkedIn..."
            ),
            Email(
                id = "msg-4",
                threadId = "thread-4",
                sender = "Dribbble Team <hello@dribbble.com>",
                subject = "Top UI/UX Inspirations for this week!",
                snippet = "Here are the top shots selected by our curation team this week..."
            ),
            Email(
                id = "msg-5",
                threadId = "thread-5",
                sender = "Apple <news_europe@insideapple.apple.com>",
                subject = "What's new in Swift and Kotlin Multiplatform",
                snippet = "Explore our latest resources, guides, and tutorials for modern app architecture..."
            )
        )
    }

    override suspend fun archiveEmail(id: String): Boolean {
        // Simulate network request
        delay(500)
        return true
    }
}
