"use client";

import { useState, useEffect } from "react";
import {
  saveSearch,
  deleteSavedSearch,
  isSearchSaved,
  getSavedSearches,
  SavedSearch,
} from "@/lib/search/saved-searches";

interface SaveSearchButtonProps {
  query: string;
  filters?: Record<string, unknown>;
  userId: string;
  onSaved?: (search: SavedSearch) => void;
  className?: string;
}

export function SaveSearchButton({
  query,
  filters,
  userId,
  onSaved,
  className = "",
}: SaveSearchButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (query && userId) {
      isSearchSaved(userId, query).then(setIsSaved);
    }
  }, [query, userId]);

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    const saved = await saveSearch(userId, name.trim(), query, filters);
    setIsLoading(false);

    if (saved) {
      setIsSaved(true);
      setShowNameInput(false);
      setName("");
      onSaved?.(saved);
    }
  };

  if (!query) return null;

  if (isSaved) {
    return (
      <span className={`inline-flex items-center gap-1 text-green-600 dark:text-green-400 ${className}`}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        Saved
      </span>
    );
  }

  if (showNameInput) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name this search..."
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <button
          onClick={handleSave}
          disabled={isLoading || !name.trim()}
          className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "..." : "Save"}
        </button>
        <button
          onClick={() => setShowNameInput(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowNameInput(true)}
      className={`inline-flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      Save Search
    </button>
  );
}

/**
 * Saved Searches List component
 */
interface SavedSearchListProps {
  userId: string;
  onSelect: (search: SavedSearch) => void;
  onDelete?: (search: SavedSearch) => void;
  className?: string;
}

export function SavedSearchList({
  userId,
  onSelect,
  onDelete,
  className = "",
}: SavedSearchListProps) {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSavedSearches(userId).then((data) => {
      setSearches(data);
      setIsLoading(false);
    });
  }, [userId]);

  const handleDelete = async (search: SavedSearch) => {
    const confirmed = window.confirm(`Delete "${search.name}"?`);
    if (!confirmed) return;

    const success = await deleteSavedSearch(search.id, userId);
    if (success) {
      setSearches(searches.filter((s) => s.id !== search.id));
      onDelete?.(search);
    }
  };

  if (isLoading) {
    return <div className="text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  if (searches.length === 0) {
    return (
      <div className={`text-center py-4 text-gray-500 dark:text-gray-400 ${className}`}>
        <p>No saved searches yet.</p>
        <p className="text-sm mt-1">Save a search to quickly access it later.</p>
      </div>
    );
  }

  return (
    <ul className={`space-y-2 ${className}`}>
      {searches.map((search) => (
        <li
          key={search.id}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <button
            onClick={() => onSelect(search)}
            className="flex-1 text-left"
          >
            <p className="font-medium dark:text-white">{search.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {search.query}
            </p>
          </button>
          <button
            onClick={() => handleDelete(search)}
            className="p-1 text-gray-400 hover:text-red-500"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}

