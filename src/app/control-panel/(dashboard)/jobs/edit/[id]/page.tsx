import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import JobForm from "../../new/job-form";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: Props) {
  const { id } = await params;

  // Fetch job details
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      state: true,
      category: true,
      department: true,
      qualification: true
    }
  });

  if (!job) {
    notFound();
  }

  // Fetch states and categories lists
  const dbStates = await prisma.state.findMany({ orderBy: { name: "asc" } });
  const dbCategories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const states = dbStates.map((s) => s.name);
  const categories = dbCategories.map((c) => c.name);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <JobForm 
        states={states} 
        categories={categories} 
        initialJob={job} 
      />
    </div>
  );
}
