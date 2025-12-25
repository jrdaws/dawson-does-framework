"use client";

import { useState, useCallback } from "react";
import {
  FilterDefinition,
  ActiveFilter,
  FilterOption,
} from "@/lib/search/filters";

interface FilterPanelProps {
  definitions: FilterDefinition[];
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  className?: string;
}

export function FilterPanel({
  definitions,
  activeFilters,
  onFiltersChange,
  className = "",
}: FilterPanelProps) {
  const updateFilter = useCallback(
    (filterId: string, value: ActiveFilter["value"] | null) => {
      if (value === null) {
        onFiltersChange(activeFilters.filter((f) => f.filterId !== filterId));
      } else {
        const existing = activeFilters.find((f) => f.filterId === filterId);
        if (existing) {
          onFiltersChange(
            activeFilters.map((f) =>
              f.filterId === filterId ? { ...f, value } : f
            )
          );
        } else {
          onFiltersChange([...activeFilters, { filterId, value }]);
        }
      }
    },
    [activeFilters, onFiltersChange]
  );

  const getActiveValue = (filterId: string) => {
    return activeFilters.find((f) => f.filterId === filterId)?.value;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {definitions.map((def) => (
        <FilterSection
          key={def.id}
          definition={def}
          value={getActiveValue(def.id)}
          onChange={(value) => updateFilter(def.id, value)}
        />
      ))}

      {activeFilters.length > 0 && (
        <button
          onClick={() => onFiltersChange([])}
          className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

interface FilterSectionProps {
  definition: FilterDefinition;
  value: ActiveFilter["value"] | undefined;
  onChange: (value: ActiveFilter["value"] | null) => void;
}

function FilterSection({ definition, value, onChange }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="font-medium dark:text-white">{definition.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div>
          {definition.type === "select" && (
            <SelectFilter
              options={definition.options || []}
              value={value as string | undefined}
              onChange={onChange}
            />
          )}

          {definition.type === "multi-select" && (
            <MultiSelectFilter
              options={definition.options || []}
              value={(value as string[]) || []}
              onChange={onChange}
            />
          )}

          {definition.type === "range" && (
            <RangeFilter
              min={definition.min || 0}
              max={definition.max || 100}
              value={(value as [number, number]) || [definition.min || 0, definition.max || 100]}
              onChange={onChange}
            />
          )}

          {definition.type === "boolean" && (
            <BooleanFilter
              label={definition.label}
              value={value as boolean | undefined}
              onChange={onChange}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SelectFilter({
  options,
  value,
  onChange,
}: {
  options: FilterOption[];
  value?: string;
  onChange: (value: string | null) => void;
}) {
  return (
    <div className="space-y-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(value === opt.value ? null : opt.value)}
          className={`w-full text-left px-2 py-1.5 rounded text-sm ${
            value === opt.value
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span className="float-right text-gray-400">({opt.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}

function MultiSelectFilter({
  options,
  value,
  onChange,
}: {
  options: FilterOption[];
  value: string[];
  onChange: (value: string[] | null) => void;
}) {
  const toggleOption = (optValue: string) => {
    const newValue = value.includes(optValue)
      ? value.filter((v) => v !== optValue)
      : [...value, optValue];

    onChange(newValue.length > 0 ? newValue : null);
  };

  return (
    <div className="space-y-1">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        >
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={() => toggleOption(opt.value)}
            className="rounded border-gray-300"
          />
          <span className="text-sm dark:text-gray-300">{opt.label}</span>
          {opt.count !== undefined && (
            <span className="ml-auto text-xs text-gray-400">({opt.count})</span>
          )}
        </label>
      ))}
    </div>
  );
}

function RangeFilter({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number] | null) => void;
}) {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);

  const handleApply = () => {
    if (localMin === min && localMax === max) {
      onChange(null);
    } else {
      onChange([localMin, localMax]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input
          type="number"
          min={min}
          max={max}
          value={localMin}
          onChange={(e) => setLocalMin(Number(e.target.value))}
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
        />
        <span className="text-gray-500">to</span>
        <input
          type="number"
          min={min}
          max={max}
          value={localMax}
          onChange={(e) => setLocalMax(Number(e.target.value))}
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
        />
      </div>
      <button
        onClick={handleApply}
        className="w-full py-1 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
      >
        Apply
      </button>
    </div>
  );
}

function BooleanFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: boolean;
  onChange: (value: boolean | null) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={value === true}
        onChange={(e) => onChange(e.target.checked ? true : null)}
        className="rounded border-gray-300"
      />
      <span className="text-sm dark:text-gray-300">{label}</span>
    </label>
  );
}

