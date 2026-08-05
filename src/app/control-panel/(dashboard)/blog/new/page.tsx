// src/app/control-panel/(dashboard)/blog/new/page.tsx

import React from "react";
import BlogForm from "./blog-form";

export const dynamic = 'force-dynamic';

export default async function CreateBlogPostPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <BlogForm />
    </div>
  );
}
