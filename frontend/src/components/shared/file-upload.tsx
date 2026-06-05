'use client';

import { useRef, useState, useCallback, type ChangeEvent } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export function FileUpload({
  accept = '.pdf,.doc,.docx',
  maxSize = 5 * 1024 * 1024,
  onFileSelect,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = useCallback(
    (f: File): string | null => {
      const allowedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(ext) && !allowedTypes.includes(f.type)) {
        return `Invalid file type. Accepted: ${accept}`;
      }
      if (f.size > maxSize) {
        return `File too large. Max size: ${formatFileSize(maxSize)}`;
      }
      return null;
    },
    [accept, maxSize],
  );

  const handleFile = useCallback(
    (f: File | null) => {
      setError(null);
      if (!f) {
        setFile(null);
        onFileSelect(null);
        return;
      }
      const validationError = validateFile(f);
      if (validationError) {
        setError(validationError);
        setFile(null);
        onFileSelect(null);
        return;
      }
      setFile(f);
      setUploading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      onFileSelect(f);
    },
    [validateFile, onFileSelect],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setProgress(0);
    setUploading(false);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          error && 'border-destructive/50 bg-destructive/5',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <FileText className="size-8 text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="ml-2 rounded-full p-1 hover:bg-muted"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="mb-2 size-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              Drop your file here or <span className="text-primary">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Accepted: {accept} (Max {formatFileSize(maxSize)})
            </p>
          </>
        )}
      </div>

      {uploading && file && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertCircle className="size-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
