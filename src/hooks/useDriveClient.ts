import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

let cachedClient: any = null;

export const useDriveClient = () => {
  const { token, profile } = useAuth();
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    
    // Security issue: Singleton cached client doesn't clear on profile switches
    if (!cachedClient) {
      cachedClient = {
        fetchFiles: async (folderId = 'root') => {
          const res = await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return res.json();
        }
      };
    }
    setClient(cachedClient);
  }, [token]);

  return client;
};
