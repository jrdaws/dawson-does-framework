/**
 * Advanced Filters Module
 * 
 * Multi-faceted filtering for product/content discovery.
 */

export type FilterType = "select" | "multi-select" | "range" | "boolean" | "text";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterDefinition {
  id: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  min?: number;
  max?: number;
}

export interface ActiveFilter {
  filterId: string;
  value: string | string[] | [number, number] | boolean;
}

/**
 * Apply filters to a dataset
 */
export function applyFilters<T extends Record<string, unknown>>(
  items: T[],
  filters: ActiveFilter[],
  filterDefinitions: FilterDefinition[]
): T[] {
  if (filters.length === 0) return items;

  return items.filter((item) => {
    return filters.every((filter) => {
      const definition = filterDefinitions.find((d) => d.id === filter.filterId);
      if (!definition) return true;

      const itemValue = item[filter.filterId];

      switch (definition.type) {
        case "select":
          return itemValue === filter.value;

        case "multi-select":
          if (!Array.isArray(filter.value)) return true;
          return filter.value.includes(String(itemValue));

        case "range":
          if (!Array.isArray(filter.value) || filter.value.length !== 2) return true;
          const [min, max] = filter.value as [number, number];
          const numValue = Number(itemValue);
          return numValue >= min && numValue <= max;

        case "boolean":
          return Boolean(itemValue) === filter.value;

        case "text":
          return String(itemValue)
            .toLowerCase()
            .includes(String(filter.value).toLowerCase());

        default:
          return true;
      }
    });
  });
}

/**
 * Build URL search params from active filters
 */
export function filtersToSearchParams(filters: ActiveFilter[]): URLSearchParams {
  const params = new URLSearchParams();

  for (const filter of filters) {
    if (Array.isArray(filter.value)) {
      if (filter.value.length === 2 && typeof filter.value[0] === "number") {
        // Range filter
        params.set(`${filter.filterId}_min`, String(filter.value[0]));
        params.set(`${filter.filterId}_max`, String(filter.value[1]));
      } else {
        // Multi-select
        filter.value.forEach((v) => params.append(filter.filterId, String(v)));
      }
    } else if (typeof filter.value === "boolean") {
      params.set(filter.filterId, filter.value ? "true" : "false");
    } else {
      params.set(filter.filterId, String(filter.value));
    }
  }

  return params;
}

/**
 * Parse URL search params to active filters
 */
export function searchParamsToFilters(
  params: URLSearchParams,
  definitions: FilterDefinition[]
): ActiveFilter[] {
  const filters: ActiveFilter[] = [];

  for (const def of definitions) {
    switch (def.type) {
      case "range": {
        const min = params.get(`${def.id}_min`);
        const max = params.get(`${def.id}_max`);
        if (min && max) {
          filters.push({
            filterId: def.id,
            value: [Number(min), Number(max)],
          });
        }
        break;
      }

      case "multi-select": {
        const values = params.getAll(def.id);
        if (values.length > 0) {
          filters.push({
            filterId: def.id,
            value: values,
          });
        }
        break;
      }

      case "boolean": {
        const value = params.get(def.id);
        if (value !== null) {
          filters.push({
            filterId: def.id,
            value: value === "true",
          });
        }
        break;
      }

      default: {
        const value = params.get(def.id);
        if (value) {
          filters.push({
            filterId: def.id,
            value,
          });
        }
      }
    }
  }

  return filters;
}

/**
 * Count items for each filter option
 */
export function getFilterCounts<T extends Record<string, unknown>>(
  items: T[],
  filterId: string
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const item of items) {
    const value = String(item[filterId] || "");
    counts[value] = (counts[value] || 0) + 1;
  }

  return counts;
}

/**
 * Get min/max values for a numeric field
 */
export function getFieldRange<T extends Record<string, unknown>>(
  items: T[],
  field: string
): [number, number] {
  const values = items.map((i) => Number(i[field])).filter((v) => !isNaN(v));

  if (values.length === 0) return [0, 0];

  return [Math.min(...values), Math.max(...values)];
}

