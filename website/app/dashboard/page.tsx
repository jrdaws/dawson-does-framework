"use client";

import Link from "next/link";
import { ArrowRight, LinkIcon, FolderOpen, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QUICK_ACTIONS = [
  {
    title: "Connected Services",
    description: "Manage your GitHub, Supabase, and Vercel connections",
    icon: LinkIcon,
    href: "/dashboard/services",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Projects",
    description: "View and manage your generated projects",
    icon: FolderOpen,
    href: "/projects",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Create New Project",
    description: "Start building something amazing",
    icon: Zap,
    href: "/configure",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Manage your projects and connected services.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {QUICK_ACTIONS.map((action) => (
          <Card key={action.href} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center mb-2`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={action.href}>
                <Button variant="ghost" className="group-hover:bg-muted">
                  Go to {action.title.split(" ")[0]}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and project updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity yet.</p>
            <p className="text-sm mt-1">Start by creating a project or connecting a service.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

