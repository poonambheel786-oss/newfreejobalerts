// src/app/control-panel/(dashboard)/dashboard/blog/delete-btn.tsx
'use client';

import React, { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteBlogPost } from "../../../actions";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export default function DeleteBlogButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      startTransition(async () => {
        const result = await deleteBlogPost(id);
        if (result.success) {
          alert("Blog post deleted successfully.");
          router.refresh();
        } else {
          alert(result.error || "Failed to delete blog post.");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer disabled:opacity-50"
      title="Delete Post"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
