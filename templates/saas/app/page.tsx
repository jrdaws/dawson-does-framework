"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    console.log("✅ Ready at http://localhost:3000");
  }, []);

  return (
    <main className="p-6 min-h-screen">
      <h1 className="m-0 text-3xl font-bold dark:text-white">SaaS Template</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Export succeeded. Next is wiring real features (auth, billing, db).
      </p>
    </main>
  );
}
