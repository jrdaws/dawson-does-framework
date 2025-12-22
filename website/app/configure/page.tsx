export default function ConfigurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold">Configuration Coming Soon</h1>
        <p className="text-xl text-muted-foreground">
          The visual configurator is being updated. In the meantime, use the CLI to create projects:
        </p>
        <div className="bg-muted p-6 rounded-lg text-left">
          <code className="text-sm">
            npx @jrdaws/framework export saas ./my-app --auth supabase --payments stripe
          </code>
        </div>
        <p className="text-sm text-muted-foreground">
          Full documentation:{" "}
          <a href="https://github.com/jrdaws/dawson-does-framework" className="underline">
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
