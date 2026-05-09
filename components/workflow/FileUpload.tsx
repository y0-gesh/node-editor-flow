"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Paperclip } from "lucide-react";

interface FileUploadProps {
  onFileChange: (field: string, value: string) => void;
  acceptedTypes: string[];
  field: string;
}

export function FileUpload({ onFileChange, acceptedTypes, field }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        setError(`Invalid file type. Please upload a ${acceptedTypes.join(" or ")} file.`);
        setUploadedFile(null);
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        onFileChange(field, file.name);
        setError(null);
      }
    },
    [onFileChange, acceptedTypes, field]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/octet-stream": acceptedTypes,
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer
      ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
      ${error ? "border-red-500" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <Paperclip className="w-8 h-8 text-gray-400 mb-2" />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : uploadedFile ? (
          <div>
            <p>File: {uploadedFile.name}</p>
            <p className="text-sm text-gray-500">
              {(uploadedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <p>Drag & drop a file here, or click to select a file</p>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
