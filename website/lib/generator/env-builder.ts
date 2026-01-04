/**
 * Environment Template Builder
 * 
 * Generates .env.example with all required variables.
 */

interface EnvVar {
  name: string;
  description: string;
  required: boolean;
  example?: string;
  public?: boolean;
}

const BASE_ENV_VARS: EnvVar[] = [
  {
    name: "NEXT_PUBLIC_APP_URL",
    description: "Your application URL",
    required: true,
    example: "http://localhost:3000",
    public: true,
  },
];

/**
 * Build .env.example content
 */
export function buildEnvTemplate(additionalVars: EnvVar[]): string {
  const allVars = [...BASE_ENV_VARS, ...additionalVars];
  
  // Group by public/private
  const publicVars = allVars.filter((v) => v.public);
  const privateVars = allVars.filter((v) => !v.public);

  let content = `# Environment Variables
# Copy this file to .env.local and fill in your values

`;

  if (publicVars.length > 0) {
    content += `# =================
# Public Variables (exposed to browser)
# =================

`;
    for (const v of publicVars) {
      content += `# ${v.description}${v.required ? " (required)" : " (optional)"}
${v.name}=${v.example || ""}

`;
    }
  }

  if (privateVars.length > 0) {
    content += `# =================
# Private Variables (server-side only)
# =================

`;
    for (const v of privateVars) {
      content += `# ${v.description}${v.required ? " (required)" : " (optional)"}
${v.name}=${v.example || ""}

`;
    }
  }

  return content;
}

