"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./auth-context";
import { useConfiguratorStore } from "./configurator-state";
import type { UserProject, CreateUserProjectInput, UpdateUserProjectInput } from "./supabase";

interface UseProjectOptions {
  /** Auto-save debounce delay in ms (default: 2000) */
  autoSaveDelay?: number;
  /** Enable auto-save (default: true when authenticated) */
  autoSave?: boolean;
}

interface UseProjectReturn {
  /** Current project from Supabase (null if not saved yet) */
  project: UserProject | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Whether project has unsaved changes */
  isDirty: boolean;
  /** Whether auto-save is pending */
  isSaving: boolean;
  /** Create a new project in Supabase */
  createProject: (name: string) => Promise<UserProject | null>;
  /** Load an existing project by ID */
  loadProject: (id: string) => Promise<UserProject | null>;
  /** Save current configurator state to Supabase */
  saveProject: () => Promise<boolean>;
  /** Sync Supabase project to local configurator state */
  syncToLocal: (project: UserProject) => void;
  /** List all user projects */
  listProjects: () => Promise<UserProject[]>;
  /** Delete a project */
  deleteProject: (id: string) => Promise<boolean>;
}

/**
 * Hook for managing persistent project state with Supabase.
 * 
 * When user is authenticated:
 * - Projects are saved to Supabase
 * - Auto-save triggers on configurator state changes
 * - Projects persist across sessions and devices
 * 
 * When user is not authenticated:
 * - Falls back to localStorage (via Zustand persist)
 * - No cloud sync
 * 
 * @example
 * const { project, saveProject, createProject } = useProject();
 * 
 * // Create new project
 * await createProject("My SaaS App");
 * 
 * // Manual save
 * await saveProject();
 */
export function useProject(options: UseProjectOptions = {}): UseProjectReturn {
  const { autoSaveDelay = 2000, autoSave = true } = options;
  
  const { user, session } = useAuth();
  const [project, setProject] = useState<UserProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track save timeout for debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get configurator state
  const configuratorState = useConfiguratorStore();

  // Helper to get auth headers
  const getAuthHeaders = useCallback(() => {
    if (!session?.access_token) {
      throw new Error("Not authenticated");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    };
  }, [session]);

  // Map configurator state to Supabase project format
  const stateToProjectInput = useCallback((): UpdateUserProjectInput => {
    const state = useConfiguratorStore.getState();
    
    // Flatten selected features to array
    const features = Object.values(state.selectedFeatures).flat();
    
    return {
      name: state.projectName || "Untitled Project",
      description: state.description || undefined,
      template: state.template,
      features,
      integrations: state.integrations,
    };
  }, []);

  // Sync project data to local configurator state
  const syncToLocal = useCallback((proj: UserProject) => {
    const store = useConfiguratorStore.getState();
    
    // Update local state from project
    if (proj.name) store.setProjectName(proj.name);
    if (proj.template) store.setTemplate(proj.template);
    if (proj.description) store.setDescription(proj.description);
    
    // Sync integrations
    if (proj.integrations) {
      Object.entries(proj.integrations).forEach(([type, provider]) => {
        store.setIntegration(type, provider);
      });
    }
    
    // Sync features (convert array back to category map)
    // For now, put all in a "selected" category - can refine later
    if (proj.features && proj.features.length > 0) {
      store.setFeatures("selected", proj.features);
    }
  }, []);

  // Create a new project
  const createProject = useCallback(async (name: string): Promise<UserProject | null> => {
    if (!user || !session) {
      setError("Must be logged in to create a project");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const input: CreateUserProjectInput = {
        name,
        template: configuratorState.template,
        description: configuratorState.description || undefined,
        features: Object.values(configuratorState.selectedFeatures).flat(),
        integrations: configuratorState.integrations,
      };

      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create project");
        return null;
      }

      setProject(data.project);
      setIsDirty(false);
      return data.project;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, session, configuratorState, getAuthHeaders]);

  // Load an existing project
  const loadProject = useCallback(async (id: string): Promise<UserProject | null> => {
    if (!user || !session) {
      setError("Must be logged in to load a project");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load project");
        return null;
      }

      setProject(data.project);
      syncToLocal(data.project);
      setIsDirty(false);
      return data.project;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, session, getAuthHeaders, syncToLocal]);

  // Save current state to existing project
  const saveProject = useCallback(async (): Promise<boolean> => {
    if (!user || !session || !project) {
      // If no project exists, we can't save - need to create first
      if (user && session && !project) {
        const newProject = await createProject(
          configuratorState.projectName || "Untitled Project"
        );
        return !!newProject;
      }
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updateData = stateToProjectInput();

      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save project");
        return false;
      }

      setProject(data.project);
      setIsDirty(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, session, project, configuratorState, getAuthHeaders, stateToProjectInput, createProject]);

  // List all projects
  const listProjects = useCallback(async (): Promise<UserProject[]> => {
    if (!user || !session) {
      return [];
    }

    try {
      const response = await fetch("/api/projects/list", {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to list projects");
        return [];
      }

      return data.projects || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to list projects");
      return [];
    }
  }, [user, session, getAuthHeaders]);

  // Delete a project
  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    if (!user || !session) {
      return false;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to delete project");
        return false;
      }

      // Clear local project if it was the deleted one
      if (project?.id === id) {
        setProject(null);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
      return false;
    }
  }, [user, session, project, getAuthHeaders]);

  // Auto-save on configurator state changes (debounced)
  useEffect(() => {
    if (!autoSave || !user || !project) {
      return;
    }

    // Mark as dirty when state changes
    setIsDirty(true);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new debounced save
    saveTimeoutRef.current = setTimeout(() => {
      saveProject();
    }, autoSaveDelay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    autoSave,
    autoSaveDelay,
    user,
    project,
    saveProject,
    // Track specific state changes that should trigger save
    configuratorState.projectName,
    configuratorState.template,
    configuratorState.description,
    configuratorState.integrations,
    configuratorState.selectedFeatures,
  ]);

  return {
    project,
    loading,
    error,
    isDirty,
    isSaving,
    createProject,
    loadProject,
    saveProject,
    syncToLocal,
    listProjects,
    deleteProject,
  };
}

export default useProject;

