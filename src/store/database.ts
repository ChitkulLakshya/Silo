import * as SQLite from 'expo-sqlite';
import { EmailData } from '../components/EmailListItem';

export const initDB = async () => {
  const db = await SQLite.openDatabaseAsync('silo.db');
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS emails (
      id TEXT PRIMARY KEY NOT NULL,
      sender TEXT NOT NULL,
      subject TEXT,
      snippet TEXT,
      bodyHtml TEXT,
      timestamp TEXT NOT NULL,
      isRead INTEGER DEFAULT 0,
      iconType TEXT
    );
  `);
};

export const saveEmails = async (emails: EmailData[]) => {
  const db = await SQLite.openDatabaseAsync('silo.db');
  
  // Using a transaction for batch insertion
  await db.withTransactionAsync(async () => {
    for (const email of emails) {
      await db.runAsync(
        `INSERT OR REPLACE INTO emails (id, sender, subject, snippet, timestamp, iconType) VALUES (?, ?, ?, ?, ?, ?)`,
        email.id,
        email.sender,
        email.subject,
        email.snippet,
        email.time, // mapping time
        email.iconType
      );
    }
  });
};

export const getStoredEmails = async (): Promise<EmailData[]> => {
  const db = await SQLite.openDatabaseAsync('silo.db');
  const rows = await db.getAllAsync<{
    id: string;
    sender: string;
    subject: string;
    snippet: string;
    timestamp: string;
    iconType: string;
  }>('SELECT * FROM emails ORDER BY timestamp DESC');
  
  return rows.map(row => ({
    id: row.id,
    sender: row.sender,
    subject: row.subject,
    snippet: row.snippet,
    time: row.timestamp,
    iconType: row.iconType,
  }));
};
