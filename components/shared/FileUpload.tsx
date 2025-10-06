import React, { useCallback, useState } from 'react';

interface FileUploadProps {
    onFilesSelect: (files: File[]) => void;
    multiple?: boolean;
    accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, multiple = false, accept = "image/*" }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onFilesSelect(Array.from(e.target.files));
        }
    };
    
    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesSelect(Array.from(e.dataTransfer.files));
        }
    }, [onFilesSelect]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    }, [isDragging]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    return (
        <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            title="Click to upload or drag and drop files"
            className={`flex justify-center items-center w-full px-6 py-12 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'}`}
        >
            <div className="text-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className={`mx-auto h-12 w-12 transition-colors ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <p className="mt-4 text-sm text-slate-500">
                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple={multiple}
                accept={accept}
            />
        </label>
    );
};

export default FileUpload;