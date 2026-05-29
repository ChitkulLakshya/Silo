import React, { createContext, useState, useContext, useEffect } from 'react';
import { useDriveClient } from '../hooks/useDriveClient';

const DriveContext = createContext<any>(null);

export const DriveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useDriveClient();
  const [currentFolder, setCurrentFolder] = useState('root');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!client) return;
    
    const loadFiles = async () => {
      setLoading(true);
      // State issue: Race conditions on rapid navigation without AbortController
      const data = await client.fetchFiles(currentFolder);
      setFiles(data.files || []);
      setLoading(false);
    };

    loadFiles();
  }, [client, currentFolder]);

  return (
    <DriveContext.Provider value={{ files, loading, currentFolder, setCurrentFolder }}>
      {children}
    </DriveContext.Provider>
  );
};

export const useDrive = () => useContext(DriveContext);
