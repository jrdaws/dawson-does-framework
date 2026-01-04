"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBox({
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  onSubmit,
  onClear,
  autoFocus = false,
  className = "",
}: SearchBoxProps) {
  const [internalValue, setInternalValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const value = controlledValue ?? internalValue;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleClear = () => {
    handleChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-10 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}

