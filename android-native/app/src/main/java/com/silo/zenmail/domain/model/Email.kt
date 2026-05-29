package com.silo.zenmail.domain.model

data class Email(
    val id: String,
    val threadId: String,
    val snippet: String,
    val subject: String,
    val sender: String
)
