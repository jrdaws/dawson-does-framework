"use client";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Compass, TrendingUp, FileText, CheckCircle2 } from "lucide-react";

interface ContextFieldsProps {
  vision: string;
  mission: string;
  successCriteria: string;
  onVisionChange: (vision: string) => void;
  onMissionChange: (mission: string) => void;
  onSuccessCriteriaChange: (criteria: string) => void;
}

export function ContextFields({
  vision,
  mission,
  successCriteria,
  onVisionChange,
  onMissionChange,
  onSuccessCriteriaChange,
}: ContextFieldsProps) {
  const allFilled = vision.trim() && mission.trim() && successCriteria.trim();
  const noneFilled = !vision.trim() && !mission.trim() && !successCriteria.trim();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Project Context
        </h2>
        <p className="text-muted-foreground mb-4">
          Define your vision, mission, and success criteria for better AI assistance
        </p>
        <Badge variant="info">
          Optional: These will be included in .dd/ handoff files for future AI collaboration
        </Badge>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Vision */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              Vision Statement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label className="text-foreground">
              What is the long-term vision for this project?
            </Label>
            <textarea
              value={vision}
              onChange={(e) => onVisionChange(e.target.value)}
              placeholder="Example: Create the most developer-friendly SaaS platform that helps startups ship products 10x faster..."
              className="w-full min-h-[100px] p-4 rounded-lg border border-input bg-background text-foreground font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Your aspirational goal - where do you want this project to be in 3-5 years?
            </p>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Mission Statement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label className="text-foreground">
              What problem are you solving and for whom?
            </Label>
            <textarea
              value={mission}
              onChange={(e) => onMissionChange(e.target.value)}
              placeholder="Example: We help indie developers and small teams launch production-ready SaaS applications without spending months on boilerplate code..."
              className="w-full min-h-[100px] p-4 rounded-lg border border-input bg-background text-foreground font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Your purpose - what value do you provide and who benefits?
            </p>
          </CardContent>
        </Card>

        {/* Success Criteria */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Success Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label className="text-foreground">
              How will you measure success?
            </Label>
            <textarea
              value={successCriteria}
              onChange={(e) => onSuccessCriteriaChange(e.target.value)}
              placeholder="Example:
- 1,000 active users in first 6 months
- 50+ projects exported per week
- 4.5+ star rating from users
- Sub-2 second page load times
- 99.9% uptime"
              className="w-full min-h-[140px] p-4 rounded-lg border border-input bg-background text-foreground font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Specific, measurable goals that define success (KPIs, metrics, milestones)
            </p>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className={allFilled ? "border-primary/30" : noneFilled ? "" : "border-amber-500/50"}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className={`h-4 w-4 ${allFilled ? "text-primary" : noneFilled ? "text-muted-foreground" : "text-amber-500"}`} />
              {allFilled ? "Complete - Will be included in export" : noneFilled ? "Optional Context" : "Partially Complete"}
              {allFilled && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allFilled && (
              <div className="text-sm text-foreground">
                <p className="mb-2 font-bold">These will be saved in your project as:</p>
                <ul className="space-y-1 text-xs font-mono">
                  <li className="text-primary">→ .dd/vision.md</li>
                  <li className="text-primary">→ .dd/mission.md</li>
                  <li className="text-primary">→ .dd/goals.md</li>
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  These files help AI assistants (like Cursor, Claude) understand your project&apos;s context for better suggestions.
                </p>
              </div>
            )}

            {!allFilled && !noneFilled && (
              <div className="text-sm text-amber-500">
                <p>You&apos;ve started filling out context. Consider completing all fields for best results.</p>
              </div>
            )}

            {noneFilled && (
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">This step is completely optional. Benefits of adding context:</p>
                <ul className="space-y-1 text-xs list-disc list-inside">
                  <li>AI assistants provide more relevant suggestions</li>
                  <li>Team members understand project goals</li>
                  <li>Easier onboarding for new contributors</li>
                  <li>Better alignment on product direction</li>
                </ul>
                <p className="mt-3 text-xs">
                  You can skip this and add context later by creating files in the .dd/ directory.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
