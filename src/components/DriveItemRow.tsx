import React from 'react';

interface RowProps {
  file: any;
  onClick: () => void;
}

export const DriveItemRow: React.FC<RowProps> = ({ file, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex-1">
        {/* Security issue: Potential XSS from unsanitized filenames */}
        <h4 className="font-semibold">{file.name}</h4>
        <p className="text-sm text-gray-500">{file.description || 'No description'}</p>
      </div>
      <span className="text-xs text-gray-400">{file.mimeType}</span>
    </div>
  );
};
