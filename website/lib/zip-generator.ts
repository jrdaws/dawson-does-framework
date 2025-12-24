import { saveAs } from "file-saver";

interface ZipConfig {
  template: string;
  projectName: string;
  integrations: Record<string, string>;
  vision?: string;
  mission?: string;
  successCriteria?: string;
  inspiration?: {
    description?: string;
    urls?: string[];
  };
  envKeys?: Record<string, string>;
}

/**
 * Generate project files and download as ZIP
 * 
 * This calls the server-side API to bundle actual template files
 * with all selected integrations, matching what users see in preview.
 */
export async function generateProjectZip(config: ZipConfig): Promise<void> {
  const response = await fetch("/api/export/zip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Download failed" }));
    throw new Error(error.message || `Download failed: ${response.status}`);
  }

  // Get the blob from response
  const blob = await response.blob();
  
  // Extract filename from Content-Disposition header or use default
  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = `${config.projectName || "project"}.zip`;
  
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="([^"]+)"/);
    if (match) {
      filename = match[1];
    }
  }

  // Download the file
  saveAs(blob, filename);
}
