package com.silo.zenmail.core.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface EmailDao {
    @Query("SELECT * FROM emails")
    fun getInboxEmails(): Flow<List<EmailEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEmails(emails: List<EmailEntity>)

    @Query("DELETE FROM emails WHERE id = :id")
    suspend fun deleteEmailById(id: String)

    @Query("DELETE FROM emails")
    suspend fun clearInbox()
}
