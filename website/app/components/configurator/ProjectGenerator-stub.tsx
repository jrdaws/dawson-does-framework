"use client";

// Temporary stub during deployment - full feature will return after package publishing
export function ProjectGenerator(props: any) {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center space-y-4">
        <div className="text-2xl">🚧</div>
        <h3 className="text-lg font-semibold">Project Generator Temporarily Unavailable</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          The project generator is being updated. Use the Export tab to download your project configuration and run the CLI pull command.
        </p>
      </div>
    </div>
  );
}
