import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileWarning } from 'lucide-react';

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.oasis.opendocument.text': ['.odt'],
  'text/plain': ['.txt'],
};

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${isDragReject ? 'border-red-500 bg-red-50' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-4">
        {isDragReject ? (
          <>
            <FileWarning className="w-12 h-12 text-red-500" />
            <p className="text-red-500">Archivo no soportado</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400" />
            <div className="space-y-2">
              <p className="text-gray-600">
                {isDragActive
                  ? 'Suelta el archivo aquí'
                  : 'Arrastra y suelta un archivo o haz clic para seleccionar'}
              </p>
              <p className="text-sm text-gray-500">
                Formatos soportados: PDF, DOC, DOCX, ODT, TXT
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};