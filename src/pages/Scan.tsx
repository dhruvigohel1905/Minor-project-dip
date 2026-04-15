import { useState, useEffect, useCallback } from "react";
import { fetchBooks, scanImage, matchBooks, type Book, type MatchResult } from "@/lib/bookService";
import { ImageCapture } from "@/components/ImageCapture";
import { ScanResults } from "@/components/ScanResults";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ScanLine, BookOpen } from "lucide-react";

export function ScanPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [scanResults, setScanResults] = useState<MatchResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const handleImageCapture = useCallback(
    async (base64: string) => {
      setIsScanning(true);
      setScanResults([]);
      try {
        const extracted = await scanImage(base64);
        if (extracted.length === 0) {
          toast({ title: "No books detected", description: "Try a clearer image with visible book spines or covers.", variant: "destructive" });
          return;
        }
        const results = matchBooks(extracted, books);
        setScanResults(results);
        toast({ title: `${extracted.length} books detected`, description: `${results.filter(r => r.match).length} matched with library.` });
      } catch (err) {
        toast({ title: "Scan failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
      } finally {
        setIsScanning(false);
      }
    },
    [books, toast]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white dark:bg-slate-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
              <ScanLine className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary">Scan Book Spines</h1>
              <p className="text-sm text-muted-foreground mt-1">Take a photo or upload an image to identify books</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Image Capture Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-border shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground mb-2">Upload or Capture Image</h2>
              <p className="text-sm text-muted-foreground">Position your device to capture book spines clearly for best results</p>
            </div>
            <ImageCapture onImageCapture={handleImageCapture} isProcessing={isScanning} />

            {/* Processing State */}
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30 animate-pulse mt-4"
              >
                <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-sm text-primary font-medium">Analyzing image with AI...</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Library Status */}
        {books.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 bg-accent/10 rounded-lg p-6 border border-accent/30 text-center"
          >
            <BookOpen className="h-8 w-8 text-accent mx-auto mb-3" />
            <p className="text-sm text-foreground font-medium">No books in library yet</p>
            <p className="text-xs text-muted-foreground mt-1">Please import an Excel dataset first for better matching accuracy</p>
          </motion.div>
        )}

        {/* Scan Results Section */}
        {scanResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white dark:bg-slate-800 rounded-lg p-8 border border-border shadow-sm"
          >
            <h2 className="text-lg font-bold text-foreground mb-6">Scan Results</h2>
            <ScanResults results={scanResults} />
          </motion.div>
        )}
      </main>
    </div>
  );
}
