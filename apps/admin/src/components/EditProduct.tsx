"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { CategoryType, colors, ProductFormSchema, ProductType, sizes } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const fetchCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/api/categories`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories!");
  }

  return await res.json();
};

const EditProduct = ({ product }: { product: ProductType }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price,
      categorySlug: product.categorySlug,
      sizes: product.sizes.map(s => s.toLowerCase()) as any,
      colors: product.colors.map(c => c.toLowerCase()) as any,
      images: product.images as any,
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ProductFormSchema>) => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/api/products/${product.id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update product!");
      }
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      router.push("/dashboard/products");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)] px-4">
        <Form {...form}>
          <form
            className="space-y-8 pb-10"
            onSubmit={form.handleSubmit(
              (data) => mutation.mutate(data),
              (errors) => {
                console.log("Validation errors:", errors);
                toast.error("Please fix the errors in the form.");
              }
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {categories && (
                    <FormField
                      control={form.control}
                      name="categorySlug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat: CategoryType) => (
                                  <SelectItem key={cat.id} value={cat.slug}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-4 gap-2 border p-4 rounded-md">
                          {sizes.map((size) => (
                            <div className="flex items-center gap-2" key={size}>
                              <Checkbox
                                id={`size-${size}`}
                                checked={field.value?.includes(size)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, size]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((v) => v !== size)
                                    );
                                  }
                                }}
                              />
                              <label htmlFor={`size-${size}`} className="text-xs uppercase">
                                {size}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colors</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-2 border p-4 rounded-md">
                          {colors.map((color) => (
                            <div
                              className="flex items-center gap-2"
                              key={color}
                            >
                              <Checkbox
                                id={`color-${color}`}
                                checked={field.value?.includes(color)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, color]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((v) => v !== color)
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`color-${color}`}
                                className="text-xs flex items-center gap-2"
                              >
                                <div
                                  className="w-3 h-3 rounded-full border"
                                  style={{ backgroundColor: color }}
                                />
                                {color}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images (One for each selected color)</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {form.watch("colors")?.map((color) => (
                        <div
                          className="border p-4 rounded-md flex flex-col gap-2"
                          key={color}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-semibold uppercase">
                              {color}
                            </span>
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  formData.append(
                                    "upload_preset",
                                    "ecommerce"
                                  );

                                  const res = await fetch(
                                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                                    {
                                      method: "POST",
                                      body: formData,
                                    }
                                  );
                                  const data = await res.json();

                                  if (data.secure_url) {
                                    const currentImages =
                                      form.getValues("images") || {};
                                    form.setValue("images", {
                                      ...currentImages,
                                      [color]: data.secure_url,
                                    });
                                  }
                                } catch (error) {
                                  console.log(error);
                                  toast.error("Upload failed!");
                                }
                              }
                            }}
                          />
                          {field.value?.[color] && (
                            <div className="mt-2 relative w-full h-32">
                                <img src={field.value[color]} alt={color} className="w-full h-full object-cover rounded-md" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={mutation.isPending}
                size="lg"
              >
                {mutation.isPending ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
};

export default EditProduct;
