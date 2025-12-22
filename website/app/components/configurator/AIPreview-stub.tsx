"use client";

// Temporary stub during deployment - full feature will return after package publishing
export function AIPreview(props: any) {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center space-y-4">
        <div className="text-2xl">🚧</div>
        <h3 className="text-lg font-semibold">AI Preview Temporarily Unavailable</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          The AI preview feature is being updated. Use the Export tab to download your project configuration.
        </p>
      </div>
    </div>
  );
}
