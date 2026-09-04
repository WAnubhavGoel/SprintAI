'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PastDoc = { id: string; title: string; createdAt: string };

export default function DashboardShell({
  userName,
  pastDocs,
  children,
}: {
  userName: string;
  pastDocs: PastDoc[];
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/60">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        pastDocs={pastDocs}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar — only shows toggle when sidebar is closed */}
        {!sidebarOpen && (
          <div className="p-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <PanelLeft />
            </Button>
          </div>
        )}

        <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-2xl">
            {/* Greeting */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back, {userName} 👋
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Upload a document to generate instant study notes & quizzes.
              </p>
            </div>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
