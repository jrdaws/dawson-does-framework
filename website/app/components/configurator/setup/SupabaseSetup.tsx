"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  ExternalLink,
  Loader2,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SupabaseProject {
  id: string;
  name: string;
  region: string;
  status: string;
}

interface SelectedProject {
  id: string;
  name: string;
  url: string;
  anon_key?: string;
  service_role_key?: string;
}

interface SupabaseSetupProps {
  onComplete?: (project: SelectedProject) => void;
  onToolStatusChange?: (complete: boolean) => void;
  userProjectId?: string;
}

export function SupabaseSetup({
  onComplete,
  onToolStatusChange,
  userProjectId,
}: SupabaseSetupProps) {
  const { session } = useAuth();
  
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Token input
  const [accessToken, setAccessToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  
  // Projects
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);
  
  // UI state
  const [showServiceKey, setShowServiceKey] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Check if already connected on mount
  useEffect(() => {
    if (session?.access_token) {
      checkConnection();
    }
  }, [session?.access_token]);

  // Notify parent of completion status
  useEffect(() => {
    onToolStatusChange?.(!!selectedProject);
  }, [selectedProject, onToolStatusChange]);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token}`,
  });

  const checkConnection = async () => {
    try {
      const response = await fetch("/api/supabase/projects", {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
      if (data.connected && data.projects) {
        setIsConnected(true);
        setProjects(data.projects);
      }
    } catch {
      // Not connected, that's fine
    }
  };

  const handleConnect = async () => {
    if (!accessToken.trim()) {
      setError("Please enter your Supabase access token");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/supabase/connect", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ access_token: accessToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to connect");
        return;
      }

      setIsConnected(true);
      setProjects(data.projects || []);
      setAccessToken("");
      setShowTokenInput(false);
    } catch {
      setError("Failed to connect to Supabase");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsLoading(true);
    setError(null);

    try {
      // Fetch project details with API keys
      const detailsResponse = await fetch(`/api/supabase/projects/${projectId}`, {
        headers: getAuthHeaders(),
      });

      const detailsData = await detailsResponse.json();

      if (!detailsResponse.ok) {
        setError(detailsData.message || "Failed to fetch project details");
        return;
      }

      const project = detailsData.project;
      setSelectedProject(project);

      // If we have a user project ID, save the selection
      if (userProjectId) {
        await fetch(`/api/supabase/projects/${projectId}`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ user_project_id: userProjectId }),
        });
      }

      onComplete?.(project);
    } catch {
      setError("Failed to select project");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Not authenticated
  if (!session) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Sign in required</p>
            <p className="text-sm text-muted-foreground">
              Please sign in to connect your Supabase account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-emerald-500" />
          <h3 className="font-medium text-foreground">Supabase</h3>
          {selectedProject && (
            <Badge variant="success" className="ml-auto">
              <Check className="h-3 w-3 mr-1" />
              Ready
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Use Supabase to manage user authentication, database, and file storage for your app.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Connection Flow */}
      {!isConnected && !showTokenInput && (
        <div className="space-y-4">
          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                1
              </span>
              <span className="text-muted-foreground pt-0.5">
                <a
                  href="https://supabase.com/dashboard/account/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Go to Supabase
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                to create an account or login
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                2
              </span>
              <span className="text-muted-foreground pt-0.5">
                Create a new project or ensure you have at least one existing project
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                3
              </span>
              <span className="text-muted-foreground pt-0.5">
                Click "Connect Supabase" below to authorize access to your projects
              </span>
            </li>
          </ol>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://supabase.com/docs", "_blank")}
            >
              Show Me How
            </Button>
            <Button
              size="sm"
              onClick={() => setShowTokenInput(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Database className="h-4 w-4 mr-2" />
              Connect Supabase
            </Button>
          </div>
        </div>
      )}

      {/* Token Input */}
      {!isConnected && showTokenInput && (
        <div className="space-y-4 p-4 rounded-lg border border-border bg-card/50">
          <div className="space-y-2">
            <Label htmlFor="supabase-token">Access Token</Label>
            <Input
              id="supabase-token"
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Create a token at{" "}
              <a
                href="https://supabase.com/dashboard/account/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                supabase.com/dashboard/account/tokens
              </a>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowTokenInput(false);
                setAccessToken("");
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConnect}
              disabled={isLoading || !accessToken.trim()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Connect
            </Button>
          </div>
        </div>
      )}

      {/* Project Selection */}
      {isConnected && !selectedProject && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Project</Label>
            <Select
              value={selectedProjectId || undefined}
              onValueChange={handleSelectProject}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a Supabase project..." />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <span>{project.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({project.region})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading project details...</span>
            </div>
          )}
        </div>
      )}

      {/* Selected Project Details */}
      {selectedProject && (
        <div className="space-y-4 p-4 rounded-lg border border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">{selectedProject.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedProject(null);
                setSelectedProjectId(null);
              }}
              className="text-xs"
            >
              Change
            </Button>
          </div>

          {/* Credentials Display */}
          <div className="space-y-3 text-sm">
            <CredentialRow
              label="Project ID"
              value={selectedProject.id}
              onCopy={() => copyToClipboard(selectedProject.id, "id")}
              copied={copiedField === "id"}
            />
            <CredentialRow
              label="Project URL"
              value={selectedProject.url}
              onCopy={() => copyToClipboard(selectedProject.url, "url")}
              copied={copiedField === "url"}
            />
            {selectedProject.anon_key && (
              <CredentialRow
                label="Anon Key"
                value={selectedProject.anon_key}
                truncate
                onCopy={() => copyToClipboard(selectedProject.anon_key!, "anon")}
                copied={copiedField === "anon"}
              />
            )}
            {selectedProject.service_role_key && (
              <CredentialRow
                label="Service Role Key"
                value={selectedProject.service_role_key}
                secret
                show={showServiceKey}
                onToggleShow={() => setShowServiceKey(!showServiceKey)}
                onCopy={() => copyToClipboard(selectedProject.service_role_key!, "service")}
                copied={copiedField === "service"}
              />
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(
                  `https://supabase.com/dashboard/project/${selectedProject.id}`,
                  "_blank"
                )
              }
            >
              Open Dashboard
              <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
            <Button
              size="sm"
              onClick={() => onComplete?.(selectedProject)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Credential row component
function CredentialRow({
  label,
  value,
  truncate,
  secret,
  show,
  onToggleShow,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  truncate?: boolean;
  secret?: boolean;
  show?: boolean;
  onToggleShow?: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  const displayValue = secret && !show ? "••••••••••••••••••••" : value;
  const truncatedValue = truncate && !secret ? `${value.slice(0, 30)}...` : displayValue;

  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono max-w-[200px] truncate">
          {truncatedValue}
        </code>
        {secret && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onToggleShow}
          >
            {show ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-6 w-6 p-0", copied && "text-emerald-500")}
          onClick={onCopy}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
}

export default SupabaseSetup;

