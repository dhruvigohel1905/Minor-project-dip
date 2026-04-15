import { Book, searchBooks } from "@/lib/bookService";
import { Search, Trash2, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BookListProps {
  books: Book[];
  onDelete: (id: string) => void;
}

export function BookList({ books, onDelete }: BookListProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => searchBooks(books, query), [books, query]);

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-600 font-medium">No books in library</p>
        <p className="text-xs text-slate-500 mt-1">Import a dataset to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search by title, author, ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-10 bg-white border-slate-200 rounded-lg"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-2">
        <span>
          Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of{" "}
          <span className="font-semibold text-slate-900">{books.length}</span> books
        </span>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-8">
          <Search className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-600">No books found</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          <AnimatePresence>
            {filtered.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{book.title}</p>
                  <p className="text-xs text-slate-600 truncate">
                    {[book.author, book.genre, book.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
                {book.isbn && (
                  <span className="text-xs text-slate-500 hidden sm:block">{book.isbn}</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => onDelete(book.id)}
                  title="Delete book"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
