import { ProductsType } from "@repo/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SyncButton } from "@/components/SyncButton";

const getData = async (): Promise<ProductsType> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/api/products`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const ProductPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between">
        <h1 className="font-semibold text-gray-800">All Products</h1>
        <SyncButton />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ProductPage;
