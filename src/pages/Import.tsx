import { ExcelUpload } from "@/components/ExcelUpload";
import { motion } from "framer-motion";
import { BarChart3, FileSpreadsheet, Check, Lock } from "lucide-react";
import { useState } from "react";

export function ImportPage() {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadComplete = () => {
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 5000);
  };

  const supportedFormats = [
    { format: "Excel (.xlsx, .xls)", description: "Recommended format" },
    { format: "CSV", description: "Comma-separated values" },
  ];

  const requiredColumns = [
    { column: "Title", required: true, description: "Book title" },
    { column: "Author", required: false, description: "Book author name" },
    { column: "ISBN", required: false, description: "ISBN number" },
    { column: "Genre", required: false, description: "Book genre/category" },
    { column: "Publisher", required: false, description: "Publishing company" },
    { column: "Year", required: false, description: "Publication year" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white dark:bg-slate-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-foreground font-bold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-accent">Import Book Data</h1>
              <p className="text-sm text-muted-foreground mt-1">Upload your book collection from Excel or CSV</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Upload Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-border shadow-sm mb-8">
            <h2 className="text-lg font-bold text-foreground mb-6">Upload File</h2>
            <ExcelUpload onUploadComplete={handleUploadComplete} />
          </div>
        </motion.div>

        {/* Success Message */}
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mb-8 bg-primary/10 border border-primary/30 rounded-lg p-6 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-primary">Upload Successful!</p>
              <p className="text-sm text-muted-foreground">Your books have been added to the library</p>
            </div>
          </motion.div>
        )}

        {/* Information Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Supported Formats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-border shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              <h3 className="font-bold text-foreground text-lg">Supported Formats</h3>
            </div>
            <div className="space-y-4">
              {supportedFormats.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.format}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Column Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-border shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-6 w-6 text-secondary" />
              <h3 className="font-bold text-foreground text-lg">Column Requirements</h3>
            </div>
            <div className="space-y-3">
              {requiredColumns.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted border border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">{item.column}</span>
                      {item.required && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                          Required
                        </span>
                      )}
                      {!item.required && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-accent/10 rounded-lg p-8 border border-accent/30"
        >
          <h3 className="font-bold text-accent text-lg mb-4">💡 Tips for Successful Import</h3>
          <ul className="space-y-3 text-sm text-foreground">
            <li className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <span>Ensure your Excel file has a header row with column names</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <span>The Title column is required; other columns are optional</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <span>You can add additional columns beyond the suggested ones</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <span>Large files (1000+ books) may take a few seconds to process</span>
            </li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
