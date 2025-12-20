export interface CommandConfig {
  template: string;
  projectName: string;
  outputDir: string;
  integrations: Record<string, string>;
}

export function buildCommand(config: CommandConfig): string {
  const parts = ['framework export', config.template, config.outputDir];

  // Add integrations
  Object.entries(config.integrations)
    .filter(([_, value]) => value)
    .forEach(([key, value]) => {
      parts.push(`--${key} ${value}`);
    });

  return parts.join(' \\\n  ');
}

export function buildCommandSingleLine(config: CommandConfig): string {
  const parts = ['framework export', config.template, config.outputDir];

  // Add integrations
  Object.entries(config.integrations)
    .filter(([_, value]) => value)
    .forEach(([key, value]) => {
      parts.push(`--${key} ${value}`);
    });

  return parts.join(' ');
}

export function getRequiredEnvVars(integrations: Record<string, string>): string[] {
  const envVars: string[] = [];

  Object.entries(integrations)
    .filter(([_, provider]) => provider)
    .forEach(([type, provider]) => {
      // Map integrations to their required env vars
      const envVarMap: Record<string, string[]> = {
        'auth-supabase': ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
        'auth-clerk': ['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'],
        'payments-stripe': ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET'],
        'payments-paddle': ['PADDLE_SECRET_KEY', 'PADDLE_WEBHOOK_SECRET'],
        'email-resend': ['RESEND_API_KEY'],
        'email-sendgrid': ['SENDGRID_API_KEY'],
        'db-supabase': ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
        'db-planetscale': ['DATABASE_URL'],
        'ai-openai': ['OPENAI_API_KEY'],
        'ai-anthropic': ['ANTHROPIC_API_KEY'],
        'analytics-posthog': ['NEXT_PUBLIC_POSTHOG_KEY', 'NEXT_PUBLIC_POSTHOG_HOST'],
        'analytics-plausible': ['NEXT_PUBLIC_PLAUSIBLE_DOMAIN'],
        'storage-r2': ['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'],
        'storage-s3': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BUCKET_NAME'],
        'storage-supabase': ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
      };

      const key = `${type}-${provider}`;
      const vars = envVarMap[key];
      if (vars) {
        envVars.push(...vars);
      }
    });

  // Remove duplicates
  return Array.from(new Set(envVars));
}
