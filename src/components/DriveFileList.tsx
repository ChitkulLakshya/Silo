import React, { useState } from 'react';
import { DriveItemRow } from './DriveItemRow';

interface FileListProps {
  files: any[];
  onSelect: (file: any) => void;
}

export const DriveFileList: React.FC<FileListProps> = ({ files, onSelect }) => {
  const [filter, setFilter] = useState('');

  // Performance issue: Expensive filter recalculation on every render
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full">
      <input 
        type="text" 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        placeholder="Filter files..."
        className="p-2 border rounded mb-4"
      />
      <div className="space-y-2">
        {/* Performance issue: Lacks list virtualization for larger directories */}
        {filteredFiles.map(file => (
          <DriveItemRow key={file.id} file={file} onClick={() => onSelect(file)} />
        ))}
      </div>
    </div>
  );
};
