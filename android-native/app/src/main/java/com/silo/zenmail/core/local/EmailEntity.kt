package com.silo.zenmail.core.local

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "emails")
data class EmailEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "thread_id") val threadId: String,
    @ColumnInfo(name = "snippet") val snippet: String,
    @ColumnInfo(name = "subject") val subject: String,
    @ColumnInfo(name = "sender") val sender: String
)
