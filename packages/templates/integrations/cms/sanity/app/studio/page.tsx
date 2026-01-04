"use client";

/**
 * Sanity Studio Page
 * 
 * Embeds the Sanity Studio at /studio
 * Access at: http://localhost:3000/studio
 */

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}

