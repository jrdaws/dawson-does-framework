/**
 * Package.json Builder
 * 
 * Generates a complete package.json for the project.
 */

import { ProjectConfig } from "./types";

const BASE_DEPENDENCIES: Record<string, string> = {
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
};

const BASE_DEV_DEPENDENCIES: Record<string, string> = {
  "@types/node": "^20.0.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.0.0",
  "autoprefixer": "^10.0.0",
  "eslint": "^8.0.0",
  "eslint-config-next": "^15.0.0",
};

const BASE_SCRIPTS: Record<string, string> = {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
};

/**
 * Build package.json content
 */
export function buildPackageJson(
  config: ProjectConfig,
  additionalDeps: Record<string, string>,
  additionalDevDeps: Record<string, string>
): {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
} {
  return {
    name: config.projectName,
    version: "0.1.0",
    dependencies: {
      ...BASE_DEPENDENCIES,
      ...additionalDeps,
    },
    devDependencies: {
      ...BASE_DEV_DEPENDENCIES,
      ...additionalDevDeps,
    },
    scripts: BASE_SCRIPTS,
  };
}

/**
 * Generate package.json as string
 */
export function generatePackageJsonContent(
  config: ProjectConfig,
  additionalDeps: Record<string, string>,
  additionalDevDeps: Record<string, string>
): string {
  const pkg = buildPackageJson(config, additionalDeps, additionalDevDeps);

  return JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      private: true,
      scripts: pkg.scripts,
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies,
    },
    null,
    2
  );
}

