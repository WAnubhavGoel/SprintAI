'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, X, FileText, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function UploadBox() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleFileSelect(selected: File | null) {
    if (!selected) return;
    if (selected.type !== 'application/pdf') {
      setError('Only PDF files are supported.');
      return;
    }
    setError('');
    setFile(selected);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    handleFileSelect(dropped || null);
  }

  async function handleSubmit() {
    if (!file) { setError('Please select a PDF file.'); return; }
    if (!query.trim()) { setError('Please enter a query or focus area.'); return; }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', query.trim());

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Upload failed. Please try again.');
      setLoading(false);
      return;
    }

    router.push(`/notes/${data.documentId}/notes`);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Upload dropzone */}
      <Card>
        <CardContent className="pt-2">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
              dragging
                ? 'border-[#3b82f6] bg-blue-50/50'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            />

            {!file ? (
              <>
                <UploadCloud className="mx-auto size-10 text-slate-400 mb-3" />
                <p className="font-semibold text-slate-700 text-sm">
                  Upload your document
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Drag & drop your PDF here, or click to browse
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <FileText className="size-8 text-[#071A2F] shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  aria-label="Remove file"
                >
                  <X />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Query textarea */}
      <Textarea
        placeholder="Ask your query or focus area (e.g. 'Summarize key concepts from Chapter 3 and generate a practice quiz')..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={3}
        className="rounded-xl border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 resize-none focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400"
      />

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-12 rounded-xl font-semibold text-white bg-[#071A2F] hover:bg-[#123B6D] transition-colors text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" data-icon="inline-start" />
            Processing...
          </>
        ) : (
          <>
            Generate Notes & Start Learning
            <ArrowRight data-icon="inline-end" />
          </>
        )}
      </Button>
    </div>
  );
}
