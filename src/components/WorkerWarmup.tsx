"use client";

import { useEffect } from "react";

// Automatically pings the Render worker in the background when a user opens SprintAI.
// This wakes up the worker so it is warm and ready before the user even uploads a document.
export function WorkerWarmup() {
  useEffect(() => {
    const workerUrl =
      process.env.NEXT_PUBLIC_WORKER_URL ||
      "https://sprintai-worker.onrender.com";

    fetch(workerUrl, { mode: "no-cors" }).catch(() => null);
  }, []);

  return null;
}
