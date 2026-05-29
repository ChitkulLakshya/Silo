package com.silo.zenmail.core.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [EmailEntity::class], version = 1, exportSchema = false)
abstract class ZenMailDatabase : RoomDatabase() {
    abstract fun emailDao(): EmailDao
}
