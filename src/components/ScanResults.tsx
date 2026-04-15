import { type MatchResult } from "@/lib/bookService";
import { Check, AlertTriangle, X, ChevronDown, BookOpen } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScanResultsProps {
  results: MatchResult[];
}

function ConfidenceBadge({ score }: { score: number }) {
  if (score >= 80)
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
        <Check className="h-3.5 w-3.5" />
        {score}%
      </span>
    );
  if (score >= 50)
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent">
        <AlertTriangle className="h-3.5 w-3.5" />
        {score}%
      </span>
    );
  if (score > 0)
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <AlertTriangle className="h-3.5 w-3.5" />
        {score}%
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
      <X className="h-3.5 w-3.5" />
      No match
    </span>
  );
}

export function ScanResults({ results }: ScanResultsProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (results.length === 0) return null;

  const matched = results.filter((r) => r.match);
  const unmatched = results.filter((r) => !r.match);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 rounded-lg p-4 text-center"
        >
          <p className="text-2xl font-bold text-slate-900">{results.length}</p>
          <p className="text-xs text-slate-600 mt-1">Books Detected</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/10 rounded-lg p-4 text-center border border-primary/30"
        >
          <p className="text-2xl font-bold text-primary">{matched.length}</p>
          <p className="text-xs text-primary/80 mt-1">Matched</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-lg p-4 text-center ${
            unmatched.length > 0
              ? "bg-accent/10 border border-accent/30"
              : "bg-slate-50"
          }`}
        >
          <p className={`text-2xl font-bold ${unmatched.length > 0 ? "text-accent" : "text-slate-900"}`}>
            {unmatched.length}
          </p>
          <p className={`text-xs mt-1 ${unmatched.length > 0 ? "text-accent/80" : "text-slate-600"}`}>
            Unmatched
          </p>
        </motion.div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.map((result, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
          >
            <button
              className="w-full p-4 flex items-start justify-between gap-4 text-left hover:bg-slate-50 transition-colors"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <ConfidenceBadge score={result.confidence} />
                  {result.match ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                      ✓ Match Found
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      × No Match
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-500">OCR detected:</p>
                  <p className="text-sm italic text-slate-600 truncate">"{result.extracted.title}"</p>
                </div>

                {result.match ? (
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <p className="font-semibold text-slate-950 truncate">{result.match.title}</p>
                    <p className="text-sm text-slate-600 truncate">{result.match.author || "Unknown Author"}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic pt-2">No matching book found in library</p>
                )}
              </div>

              <ChevronDown
                className={`h-5 w-5 text-slate-400 transition-transform flex-shrink-0 mt-1 ${
                  expanded === i ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {expanded === i && result.match && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-slate-200 pt-4 space-y-3">
                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {result.match.genre && (
                        <div className="p-3 rounded-lg bg-accent/10">
                          <p className="text-xs text-slate-600 font-medium mb-1">Genre</p>
                          <p className="text-sm text-slate-900">{result.match.genre}</p>
                        </div>
                      )}
                      {result.match.publisher && (
                        <div className="p-3 rounded-lg bg-primary/10">
                          <p className="text-xs text-slate-600 font-medium mb-1">Publisher</p>
                          <p className="text-sm text-slate-900 truncate">{result.match.publisher}</p>
                        </div>
                      )}
                      {result.match.year && (
                        <div className="p-3 rounded-lg bg-secondary/10">
                          <p className="text-xs text-slate-600 font-medium mb-1">Year</p>
                          <p className="text-sm text-slate-900">{result.match.year}</p>
                        </div>
                      )}
                      {result.match.isbn && (
                        <div className="p-3 rounded-lg bg-slate-50">
                          <p className="text-xs text-slate-600 font-medium mb-1">ISBN</p>
                          <p className="text-sm text-slate-900 truncate">{result.match.isbn}</p>
                        </div>
                      )}
                    </div>

                    {/* Alternative Matches */}
                    {result.alternativeMatches.length > 0 && (
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-600 font-semibold mb-2">Other possible matches:</p>
                        <div className="space-y-2">
                          {result.alternativeMatches.map((alt, j) => (
                            <div
                              key={j}
                              className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
                            >
                              <p className="text-sm text-slate-700 truncate">{alt.book.title}</p>
                              <span className="text-xs font-semibold text-slate-600 flex-shrink-0">{alt.score}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
