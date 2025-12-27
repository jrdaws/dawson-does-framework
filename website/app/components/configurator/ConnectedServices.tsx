"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConnectedService {
  id: string;
  service_type: "github" | "supabase" | "vercel";
  account_data?: {
    username?: string;
    email?: string;
    org_name?: string;
  };
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface ServiceConfig {
  id: "github" | "supabase" | "vercel";
  name: string;
  description: string;
  icon: React.ReactNode;
  connectUrl: string;
  docsUrl: string;
  required: boolean;
}

const SERVICES: ServiceConfig[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Create repositories and push code",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    connectUrl: "/api/github/auth",
    docsUrl: "https://docs.github.com/en/developers/apps/building-oauth-apps",
    required: true,
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Database and authentication",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 109 113" fill="currentColor">
        <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fillOpacity="0.6"/>
        <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"/>
      </svg>
    ),
    connectUrl: "/configure?step=7",
    docsUrl: "https://supabase.com/docs",
    required: true,
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Deploy and host your application",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 116 100" fill="currentColor">
        <path d="M57.5 0L115 100H0L57.5 0Z"/>
      </svg>
    ),
    connectUrl: "/configure?step=8",
    docsUrl: "https://vercel.com/docs",
    required: false,
  },
];

interface ConnectedServicesProps {
  className?: string;
  /** Compact mode for sidebar display */
  compact?: boolean;
  /** Callback when a service is connected/disconnected */
  onServiceChange?: (serviceType: string, connected: boolean) => void;
}

export function ConnectedServices({
  className,
  compact = false,
  onServiceChange,
}: ConnectedServicesProps) {
  const [services, setServices] = useState<ConnectedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  // Check if user is authenticated (we'll use a simple check)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for auth token in localStorage or session
    const checkAuth = async () => {
      try {
        // For demo purposes, check if we have a Supabase session
        const token = localStorage.getItem("supabase.auth.token");
        setIsAuthenticated(!!token);
        
        if (token) {
          await fetchServices();
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("supabase.auth.token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/connected-services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const disconnectService = async (serviceType: string) => {
    try {
      setRefreshing(serviceType);
      
      const token = localStorage.getItem("supabase.auth.token");
      if (!token) return;

      const response = await fetch(`/api/connected-services/${serviceType}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect");
      }

      // Update local state
      setServices((prev) => prev.filter((s) => s.service_type !== serviceType));
      onServiceChange?.(serviceType, false);
    } catch (err) {
      console.error("Disconnect error:", err);
    } finally {
      setRefreshing(null);
    }
  };

  const isConnected = (serviceId: string) => {
    return services.some((s) => s.service_type === serviceId);
  };

  const getServiceAccount = (serviceId: string) => {
    const service = services.find((s) => s.service_type === serviceId);
    return service?.account_data?.username || service?.account_data?.email || null;
  };

  if (!isAuthenticated) {
    return (
      <div className={cn("p-4 rounded-xl bg-[#0A0A0A] border border-white/5", className)}>
        <p className="text-sm text-zinc-400">
          Sign in to manage connected services
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cn("p-4 rounded-xl bg-[#0A0A0A] border border-white/5", className)}>
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading services...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-4 rounded-xl bg-[#0A0A0A] border border-red-500/20", className)}>
        <p className="text-sm text-red-400">{error}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchServices}
          className="mt-2 text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      </div>
    );
  }

  if (compact) {
    // Compact sidebar view
    return (
      <div className={cn("space-y-2", className)}>
        {SERVICES.map((service) => {
          const connected = isConnected(service.id);
          const account = getServiceAccount(service.id);
          
          return (
            <div
              key={service.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                connected
                  ? "bg-emerald-500/10 border border-emerald-500/20"
                  : "bg-white/5 border border-white/5 hover:border-indigo-500/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    connected ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-zinc-400"
                  )}
                >
                  {service.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{service.name}</span>
                    {service.required && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-orange-500/30 text-orange-400">
                        Required
                      </Badge>
                    )}
                  </div>
                  {connected && account && (
                    <span className="text-xs text-zinc-500">{account}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {connected ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-zinc-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Full view
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Connected Services</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchServices}
          className="text-xs text-zinc-400 hover:text-white"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-3">
        {SERVICES.map((service) => {
          const connected = isConnected(service.id);
          const account = getServiceAccount(service.id);
          const isRefreshing = refreshing === service.id;
          
          return (
            <div
              key={service.id}
              className={cn(
                "p-4 rounded-xl transition-all duration-200",
                connected
                  ? "bg-emerald-500/10 border border-emerald-500/20"
                  : "bg-[#0A0A0A] border border-white/5 hover:border-indigo-500/30"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      connected ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-zinc-400"
                    )}
                  >
                    {service.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{service.name}</span>
                      {service.required && (
                        <Badge variant="outline" className="text-[10px] border-orange-500/30 text-orange-400">
                          Required
                        </Badge>
                      )}
                      {connected && (
                        <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                          Connected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400">{service.description}</p>
                    {connected && account && (
                      <p className="text-xs text-zinc-500 mt-1">
                        Signed in as <span className="text-zinc-300">{account}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={service.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="View docs"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  
                  {connected ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => disconnectService(service.id)}
                      disabled={isRefreshing}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      {isRefreshing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Disconnect"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      asChild
                      className="bg-indigo-600 hover:bg-indigo-500"
                    >
                      <a href={service.connectUrl}>Connect</a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress indicator */}
      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">
            {services.length} of {SERVICES.filter((s) => s.required).length} required services connected
          </span>
          <span className={cn(
            "font-medium",
            services.length >= SERVICES.filter((s) => s.required).length
              ? "text-emerald-400"
              : "text-orange-400"
          )}>
            {services.length >= SERVICES.filter((s) => s.required).length ? "Ready" : "Setup Incomplete"}
          </span>
        </div>
      </div>
    </div>
  );
}

