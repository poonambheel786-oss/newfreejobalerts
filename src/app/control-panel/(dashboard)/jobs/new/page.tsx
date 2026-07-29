import React from "react";
import { prisma } from "@/lib/db";
import JobForm from "./job-form";

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{
    type?: string;
  }>;
}

export default async function CreateJobPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialType = params.type || "Latest Notifications";

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
    <div className="max-w-5xl mx-auto space-y-6">
      <JobForm states={fallbackStates} categories={fallbackCategories} initialType={initialType} />
    </div>
  );
}
