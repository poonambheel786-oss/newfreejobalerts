import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import JobForm from "./job-form";

export const dynamic = 'force-dynamic';

export default async function CreateJobPage() {
  const dbStates = await prisma.state.findMany({
    orderBy: { name: 'asc' }
  });
  const dbCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  const states = dbStates.map(s => s.name);
  const categories = dbCategories.map(c => c.name);

  const fallbackStates = states.length > 0 ? states : ["All India"];
  const fallbackCategories = categories.length > 0 ? categories : ["All India Govt Jobs"];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="bg-slate-900 text-white py-4 mb-8">
        <div className="mx-auto max-w-5xl px-4 flex items-center justify-between">
          <Link href="/control-panel/dashboard" className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Control Panel
          </Link>
          <span className="text-xs font-bold text-slate-400">NewFreeJobAlert Job Composer</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <JobForm states={fallbackStates} categories={fallbackCategories} />
      </div>
    </div>
  );
}
