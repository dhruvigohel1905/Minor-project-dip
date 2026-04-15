import { useEffect, useState } from "react";
import { fetchBooks, type Book } from "@/lib/bookService";
import { BarChart3, BookOpen, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

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

  const stats = [
    { label: "Total Books", value: books.length, icon: BookOpen, color: "from-primary to-primary", bgColor: "bg-primary/10" },
    { label: "Genres", value: new Set(books.map(b => b.genre)).size, icon: BarChart3, color: "from-secondary to-secondary", bgColor: "bg-secondary/10" },
    { label: "Authors", value: new Set(books.map(b => b.author)).size, icon: TrendingUp, color: "from-accent to-orange-500", bgColor: "bg-accent/10" },
    { label: "Average Year", value: books.length > 0 ? Math.round(books.reduce((a, b) => a + (b.year || 0), 0) / books.length) : 0, icon: Zap, color: "from-primary to-secondary", bgColor: "bg-primary/5" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white dark:bg-slate-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome to GSFC University Library System</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    {loading ? (
                      <div className="h-8 w-16 bg-border rounded animate-pulse mt-2" />
                    ) : (
                      <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-border shadow-sm"
        >
          <h2 className="text-lg font-bold text-foreground mb-6">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
              <h3 className="font-semibold text-primary mb-2">1. Import Data</h3>
              <p className="text-sm text-muted-foreground">Upload an Excel or CSV file with your book collection</p>
            </div>
            <div className="p-6 rounded-lg bg-secondary/5 border border-secondary/20">
              <h3 className="font-semibold text-secondary mb-2">2. Scan Shelves</h3>
              <p className="text-sm text-muted-foreground">Use your camera to scan book spines on shelves</p>
            </div>
            <div className="p-6 rounded-lg bg-accent/5 border border-accent/30">
              <h3 className="font-semibold text-accent mb-2">3. Manage Library</h3>
              <p className="text-sm text-muted-foreground">View, search, and manage your entire book collection</p>
            </div>
          </div>
        </motion.div>

        {/* Tips or Empty State */}
        {books.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-accent/10 rounded-lg p-8 border border-accent/30 mt-6"
          >
            <h3 className="font-semibold text-accent text-lg mb-3">👋 Get Started</h3>
            <p className="text-muted-foreground text-sm">Your library is empty. Start by importing your book collection using the <strong>Import Data</strong> section.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
