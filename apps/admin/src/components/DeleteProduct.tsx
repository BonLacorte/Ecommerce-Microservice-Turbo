"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteProductProps {
  productId: string | number;
  productName: string;
}

export const DeleteProduct = ({ productId, productName }: DeleteProductProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete product!");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      setIsOpen(false);
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-rose-600 hover:bg-rose-50 w-full transition-colors rounded-sm">
          <Trash2 className="w-4 h-4" />
          Delete Product
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete <strong>{productName}</strong> from the database.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Delete Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
