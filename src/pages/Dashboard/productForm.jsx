import { useState, useEffect } from "react";

const initialFormState = {
  title: "",
  dollarPrice: "",
  cediPrice: "",
  dollarDiscount: "",
  cediDiscount: "",
  length: "",
  width: "",
  height: "",
  weight: "",
  country: "",
  assetImage: null,
};

const ProductForm = ({ onSubmit, selected, loading }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (selected) {
      setForm({
        ...initialFormState,
        ...selected,
      });
      setImagePreview(selected.image || null);
    } else {
      setForm(initialFormState);
      setImagePreview(null);
    }
  }, [selected]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type === "image/png" || file.type === "image/jpeg";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) return alert("Only PNG/JPEG images allowed!");
    if (!isLt2M) return alert("Image must be smaller than 2MB!");

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setForm((prev) => ({ ...prev, assetImage: file }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Product name is required";
    if (!form.dollarPrice) newErrors.dollarPrice = "Dollar price is required";
    if (!form.cediPrice) newErrors.cediPrice = "Cedi price is required";
    if (!form.dollarDiscount)
      newErrors.dollarDiscount = "Dollar discount is required";
    if (!form.cediDiscount)
      newErrors.cediDiscount = "Cedi discount is required";
    if (!form.length) newErrors.length = "Length is required";
    if (!form.width) newErrors.width = "Width is required";
    if (!form.height) newErrors.height = "Height is required";
    if (!form.weight) newErrors.weight = "Weight is required";
    if (!form.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        {
          label: "Product Name",
          name: "title",
          placeholder: "e.g. Air Conditioner",
        },
        {
          label: "Dollar Price",
          name: "dollarPrice",
          placeholder: "$100",
          type: "number",
        },
        {
          label: "Cedi Price",
          name: "cediPrice",
          placeholder: "GHS 1200",
          type: "number",
        },
        { label: "Dollar Discount", name: "dollarDiscount", type: "number" },
        { label: "Cedi Discount", name: "cediDiscount", type: "number" },
        { label: "Length", name: "length", type: "number" },
        { label: "Width", name: "width", type: "number" },
        { label: "Height", name: "height", type: "number" },
        { label: "Weight", name: "weight", type: "number" },
      ].map(({ label, name, type = "text", placeholder }) => (
        <div key={name} className="flex flex-col gap-1">
          <label className="text-sm font-medium">{label}</label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
          />
          {errors[name] && (
            <p className="text-xs text-red-500">{errors[name]}</p>
          )}
        </div>
      ))}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Country</label>
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="">Select...</option>
          <option value="USA">USA</option>
          <option value="Ghana">Ghana</option>
        </select>
        {errors.country && (
          <p className="text-xs text-red-500">{errors.country}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Product Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-48 rounded shadow border"
          />
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Saving..." : selected ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
