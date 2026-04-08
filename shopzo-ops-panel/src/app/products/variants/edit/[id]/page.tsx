"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { ProductVariant } from "@/store/types/product";
import { toast } from "react-toastify";

const MAX_IMAGES = 5;

const EditVariantPage = () => {
  const params = useParams();
  const router = useRouter();
  const variantId = params.id as string;

  const [variant, setVariant] = useState<ProductVariant | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Images
  const [existingImages, setExistingImages] = useState<
    { url: string; public_id: string }[]
  >([]);
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  // 🔹 Form
  const [form, setForm] = useState({
    size: "",
    color: "",
    price: "",
    sku: "",
    stock: "",
  });

  // 🔹 Base SKU (product name part)
  const [baseSku, setBaseSku] = useState("");

  // 🔹 Fetch variant
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_ENDPOINTS.GET_VARIANT_BY_ID}/${variantId}`,
          { withCredentials: true }
        );

        if (!res.data.success) throw new Error();

        const v = res.data.variant;

        setVariant(v);
        setExistingImages(v.images || []);

        // ✅ Extract base SKU (remove last 3 parts: color-size-random)
        const parts = v.sku.split("-");
        const base = parts.slice(0, -3).join("-");
        setBaseSku(base);

        setForm({
          size: v.size || "",
          color: v.color || "",
          price: v.price || "",
          sku: v.sku || "",
          stock: v.stock || "",
        });
      } catch {
        setError("Failed to fetch variant");
      } finally {
        setLoading(false);
      }
    };

    if (variantId) fetchData();
  }, [variantId]);

  // 🔥 Auto-generate SKU when size/color changes
  useEffect(() => {
    if (!baseSku || !form.size || !form.color) return;

    const random = Math.floor(1000 + Math.random() * 9000);

    const newSku = `${baseSku}-${form.color.toUpperCase()}-${form.size.toUpperCase()}-${random}`;

    setForm((prev) => ({
      ...prev,
      sku: newSku,
    }));
  }, [form.size, form.color, baseSku]);

  // 🔹 Input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Add images
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const total =
      existingImages.length + images.length + files.length;

    if (total > MAX_IMAGES) {
      toast.error(`Max ${MAX_IMAGES} images allowed`);
      return;
    }

    const updatedImages = [...images, ...files];
    setImages(updatedImages);

    const previews = updatedImages.map((file) =>
      URL.createObjectURL(file)
    );
    setPreview(previews);
  };

  // 🔹 Remove new image
  const handleRemoveNewImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreview = preview.filter((_, i) => i !== index);

    setImages(updatedImages);
    setPreview(updatedPreview);
  };

  // 🔹 Remove existing image
  const handleRemoveExistingImage = (index: number) => {
    const updated = existingImages.filter((_, i) => i !== index);
    setExistingImages(updated);
  };

  // 🔹 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();

      formData.append("size", form.size);
      formData.append("color", form.color);
      formData.append("price", form.price);
      formData.append("sku", form.sku);
      formData.append("stock", form.stock);


      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      images.forEach((file) =>
        formData.append("images", file)
      );

      const res = await axios.put(
        `${API_ENDPOINTS.UPDATE_VARIANT}/${variantId}`,
        formData,
        { withCredentials: true }
      );

      if (!res.data.success)
        throw new Error(res.data.message);

      toast.success("Variant updated successfully");
      router.back();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Failed to update variant"
      );
    }
  };

  // 🔹 UI states
  if (loading) return <p>Loading...</p>;
  if (error && !variant)
    return <p className="text-red-500">{error}</p>;
  if (!variant) return <p>Variant not found</p>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Edit Variant</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SKU */}
        <div>
          <label>SKU</label>
          <input
            value={form.sku}
            disabled
            className="w-full border p-2 bg-gray-100"
          />
        </div>

        {/* Size */}
        <div>
          <label>Size</label>
          <select
            name="size"
            value={form.size}
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
            value={form.color}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>

        {/* Price */}
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>

          {/* Stock */}
        <div>
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>

        {/* Existing Images */}
        <div>
          <label>Existing Images</label>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img, index) => (
              <div key={index} className="relative w-24">
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveExistingImage(index)
                  }
                  className="absolute top-1 right-1 bg-black text-white text-xs px-1"
                >
                  ✕
                </button>
                <img
                  src={img.url}
                  className="w-full rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Add Images */}
        <div>
          <label>Add Images</label>

          {existingImages.length + images.length < MAX_IMAGES && (
            <input
              type="file"
              multiple
              onChange={handleImages}
              className="w-full border p-2"
            />
          )}

          <p className="text-sm text-gray-500">
            {existingImages.length + images.length} / {MAX_IMAGES}
          </p>
        </div>

        {/* Preview */}
        <div className="flex flex-wrap gap-2">
          {preview.map((src, index) => (
            <div key={index} className="relative w-24">
              <button
                type="button"
                onClick={() =>
                  handleRemoveNewImage(index)
                }
                className="absolute top-1 right-1 bg-black text-white text-xs px-1"
              >
                ✕
              </button>
              <img src={src} className="w-full rounded" />
            </div>
          ))}
        </div>

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2"
        >
          Update Variant
        </button>
      </form>
    </div>
  );
};

export default EditVariantPage;