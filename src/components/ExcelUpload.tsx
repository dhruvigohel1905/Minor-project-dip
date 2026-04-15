import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseExcelFile } from "@/lib/excelParser";
import { insertBooks } from "@/lib/bookService";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ExcelUploadProps {
  onUploadComplete: () => void;
}

export function ExcelUpload({ onUploadComplete }: ExcelUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ count: number } | null>(null);
  const { toast } = useToast();

  const processFile = useCallback(async (file: File) => {
    setUploading(true);
    setResult(null);
    try {
      const books = await parseExcelFile(file);
      if (books.length === 0) {
        toast({ title: "No books found", description: "The file appears empty or has no valid data.", variant: "destructive" });
        return;
      }
      // Insert in batches of 100
      for (let i = 0; i < books.length; i += 100) {
        await insertBooks(books.slice(i, i + 100));
      }
      setResult({ count: books.length });
      toast({ title: "Upload complete", description: `${books.length} books imported successfully.` });
      onUploadComplete();
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }, [toast, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
          isDragging
            ? "border-accent bg-accent/10"
            : "border-slate-300 hover:border-accent hover:bg-accent/5"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Processing file...</p>
              <p className="text-xs text-slate-600 mt-1">This may take a moment</p>
            </div>
          </motion.div>
        ) : result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {result.count === 1 ? "1 book imported" : `${result.count} books imported`}
              </p>
              <p className="text-xs text-slate-600 mt-1">Successfully added to your library</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResult(null)}
              className="mt-2"
            >
              Upload another file
            </Button>
          </motion.div>
        ) : (
          <label className="flex flex-col items-center gap-4 cursor-pointer">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
              <Upload className="h-8 w-8 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Drop file here to upload</p>
              <p className="text-xs text-slate-600 mt-1">or click to browse</p>
            </div>
            <Button variant="default" size="sm" disabled={uploading} className="bg-secondary hover:bg-secondary/90">
              Browse Files
            </Button>
            <p className="text-xs text-slate-500 mt-2">Supports .xlsx, .xls, and .csv files</p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />
          </label>
        )}
      </div>
    </div>
  );
}
