import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchBooks, deleteBook, searchBooks, type Book } from "@/lib/bookService";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, Trash2, Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteBook(id);
        setBooks((prev) => prev.filter((b) => b.id !== id));
        toast({ title: "Book deleted", description: "The book has been removed from your library." });
      } catch (err) {
        toast({ title: "Delete failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
      }
    },
    [toast]
  );

  const filtered = useMemo(() => searchBooks(books, query), [books, query]);

  // Chart data - Genre distribution
  const genreData = useMemo(() => {
    const genreMap = new Map<string, number>();
    books.forEach((b) => {
      if (b.genre) {
        genreMap.set(b.genre, (genreMap.get(b.genre) || 0) + 1);
      }
    });
    return Array.from(genreMap.entries())
      .map(([genre, count]) => ({ name: genre, value: count }))
      .sort((a, b) => b.value - a.value);
  }, [books]);

  // Chart data - Publication years
  const yearData = useMemo(() => {
    const yearMap = new Map<number, number>();
    books.forEach((b) => {
      if (b.year) {
        yearMap.set(b.year, (yearMap.get(b.year) || 0) + 1);
      }
    });
    return Array.from(yearMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, count]) => ({ year, count }));
  }, [books]);

  const colors = [
    "hsl(120 45% 32%)",    // GSFC Green
    "hsl(217 85% 42%)",    // GSFC Blue  
    "hsl(38 75% 52%)",     // GSFC Gold
    "hsl(210 65% 45%)",    // Slate Blue
    "hsl(160 60% 45%)",    // Teal
    "hsl(270 50% 55%)",    // Soft Purple
    "hsl(20 70% 50%)",     // Burnt Orange
    "hsl(0 65% 50%)",      // Muted Red
  ];

  const stats = {
    total: books.length,
    filtered: filtered.length,
    genres: genreData.length,
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-background dark:bg-slate-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary dark:text-green-400">My Library</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Explore and manage your collection</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="flex items-center gap-6 text-sm flex-wrap">
              <span className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">{stats.total}</span> books
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">{stats.filtered}</span> visible
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">{stats.genres}</span> genres
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Charts Section */}
        {!loading && books.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="grid grid-cols-1 gap-6">
              {/* Genre Bar Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Books by Genre</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genreData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--foreground) / 0.5)"
                      style={{ fontSize: "12px" }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke="hsl(var(--foreground) / 0.5)"
                      style={{ fontSize: "12px" }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))"
                      }}
                      formatter={(value) => `${value} books`}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(120 45% 32%)" 
                      radius={[8, 8, 0, 0]}
                      name="Books"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and View Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by title, author, ISBN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">View Mode:</p>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {!loading && books.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">No books yet</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Import a dataset to get started with your library</p>
          </motion.div>
        )}

        {/* No Results */}
        {!loading && books.length > 0 && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Search className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">No books found</h2>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search terms</p>
          </motion.div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && filtered.length > 0 && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((book, i) => (
                <motion.div
                  key={book.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col hover:border-primary dark:hover:border-primary/50"
                >
                  {/* Book Cover Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 flex items-center justify-center relative overflow-hidden">
                    <BookOpen className="h-12 w-12 text-primary dark:text-green-400" />
                    {book.genre && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-accent text-foreground text-xs font-medium shadow-md">
                        {book.genre}
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 mb-1">{book.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 flex-1">
                      {book.author || "Unknown Author"}
                    </p>

                    {/* Details */}
                    <div className="space-y-1 mb-4 text-xs text-slate-600 dark:text-slate-400">
                      {book.year && <p className="font-medium">📅 {book.year}</p>}
                      {book.isbn && <p className="truncate">📖 {book.isbn}</p>}
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(book.id)}
                      className="w-full h-8"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* List View */}
        {viewMode === "list" && filtered.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <AnimatePresence>
              {filtered.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.02 }}
                  className="group bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary/50 hover:shadow-md transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{book.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-xs text-slate-600 dark:text-slate-400">{book.author || "Unknown"}</p>
                      {book.genre && (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                          {book.genre}
                        </span>
                      )}
                      {book.year && <p className="text-xs text-slate-500 dark:text-slate-500">•  {book.year}</p>}
                      {book.isbn && <p className="text-xs text-slate-500 dark:text-slate-500">•  {book.isbn}</p>}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(book.id)}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
