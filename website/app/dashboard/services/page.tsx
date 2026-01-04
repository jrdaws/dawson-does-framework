"use client";

import { ConnectedServices } from "@/app/components/configurator/ConnectedServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ConnectedServicesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Connected Services</h1>
        <p className="text-muted-foreground mt-1">
          Connect your accounts to enable seamless project generation and deployment.
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Why connect services?</AlertTitle>
        <AlertDescription>
          Connected services allow the framework to automatically create repositories, 
          set up databases, and deploy your projects. You can disconnect at any time.
        </AlertDescription>
      </Alert>

      {/* Services Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Integrations</CardTitle>
              <CardDescription>
                Manage connections to third-party services
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              OAuth Secured
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ConnectedServices 
            compact={false}
            onServiceChange={(service, connected) => {
              console.log(`${service} ${connected ? 'connected' : 'disconnected'}`);
            }}
          />
        </CardContent>
      </Card>

      {/* Service Benefits */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              GitHub
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• Create private/public repos</li>
              <li>• Push generated code</li>
              <li>• Configure CI/CD workflows</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Supabase
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• Auto-configure database</li>
              <li>• Set up authentication</li>
              <li>• Generate API keys</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Vercel
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• One-click deployment</li>
              <li>• Preview environments</li>
              <li>• Environment variables</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Security Note */}
      <Alert variant="default" className="bg-muted/50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Security & Privacy</AlertTitle>
        <AlertDescription>
          We use OAuth for secure authentication and only request the minimum permissions needed.
          Your tokens are encrypted and you can revoke access at any time from your service provider.
        </AlertDescription>
      </Alert>
    </div>
  );
}

