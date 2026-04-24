import EditProduct from "@/components/EditProduct";
import { ProductType } from "@repo/types";
import { notFound } from "next/navigation";

const getProduct = async (id: string): Promise<ProductType | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/api/products/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const ProductDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="p-4">
      <EditProduct product={product} />
    </div>
  );
};

export default ProductDetailsPage;
