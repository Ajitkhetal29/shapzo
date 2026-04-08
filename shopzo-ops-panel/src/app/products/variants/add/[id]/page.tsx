"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { Product } from "@/store/types/product";
import { toast } from "react-toastify";


const MAX_IMAGES = 5;

const AddVariantPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  const [variant, setVariant] = useState({
    size: "",
    color: "",
    price: "",
    stock: "",
    sku: "",
  });

  // 🔹 Stable random seed for SKU
  const [skuSeed] = useState(() =>
    Math.floor(1000 + Math.random() * 9000)
  );

  // 🔹 Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_ENDPOINTS.GET_PRODUCT_BY_ID}/${id}`,
          { withCredentials: true }
        );

        if (!res.data.success) throw new Error();
        setProduct(res.data.product);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // 🔁 Smart SKU regeneration
  useEffect(() => {
    if (!product) return;

    const base = product.name.replace(/\s+/g, "-").toUpperCase();
    const color = variant.color || "X";
    const size = variant.size || "X";

    setVariant((prev) => ({
      ...prev,
      sku: `${base}-${color.toUpperCase()}-${size.toUpperCase()}-${skuSeed}`,
    }));
  }, [variant.color, variant.size, product, skuSeed]);

  // 🔹 Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setVariant({ ...variant, [e.target.name]: e.target.value });
  };

  // 🖼️ Smart image handler (max 5)
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const total = [...images, ...files].slice(0, MAX_IMAGES);

    setImages(total);

    const previews = total.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };


  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = preview.filter((_, i) => i !== index);

    setImages(newImages);
    setPreview(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        const formData = new FormData();
        formData.append("productId", id);
        formData.append("size", variant.size);
        formData.append("color", variant.color);
        formData.append("price", variant.price);
        formData.append("sku", variant.sku);
        formData.append("stock", variant.stock);
        images.forEach((file) => formData.append("images", file));

        const res = await axios.post(API_ENDPOINTS.CREATE_VARIANT, formData, {
          withCredentials: true,
        });

        if (!res.data.success) throw new Error(res.data.message || "Failed to create variant");

        if(res.data.success) {
            toast.success("Variant created successfully", { autoClose: 3000 });
            router.push(`/products/${id}`);

        }
       
    } catch (err: any) {
        setError(err.response?.data?.message || "An error occurred");
    }
  };




  // 🔹 UI states
  if (loading) return <p>Loading...</p>;
  if (error && !product) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">
        Add Variant for {product.name}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SKU */}
        <div>
          <label>SKU</label>
          <input
            value={variant.sku}
            disabled
            className="w-full border p-2 bg-gray-100"
          />
        </div>

        {/* Size */}
        <div>
          <label>Size</label>
          <select
            name="size"
            value={variant.size}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="">Select</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>

        {/* Color */}
        <div>
          <label>Color</label>
          <input
            name="color"
            value={variant.color}
            onChange={handleChange}
            className="w-full border p-2"
            placeholder="e.g. Red"
          />
        </div>

        {/* Price */}
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={variant.price}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>


        {/* stock */}
        <div>
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={variant.stock}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block mb-1">Images</label>

          {images.length < MAX_IMAGES && (
            <input
              type="file"
              multiple
              onChange={handleImages}
              className="w-full border p-2"

            />
          )}

          <p className="text-sm text-gray-500 mt-1">
            {images.length === 0
              ? "Upload up to 5 images"
              : `${images.length} / ${MAX_IMAGES} images selected`}
          </p>
        </div>

        {/* Preview */}
        <div className="flex flex-wrap gap-2">
          {preview.map((src, index) => (
            <div key={index} className="w-1/4 relative">
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-black text-white text-xs px-1"
              >
                ✕
              </button>
              <img
                src={src}
                alt="Preview"
                className="w-full h-auto rounded"
              />
            </div>
          ))}
        </div>

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={!variant.size || !variant.color || !variant.price}
        >
          Create Variant
        </button>
      </form>
    </div>
  );
};

export default AddVariantPage;