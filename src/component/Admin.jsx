import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
  const { id } = useParams(); // ✅ edit mode if ID exists
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "",
    size: "",
    color: "",
    material: "",
    price: "",
    stock: "",
    brand: "",
    description: "",
    isFeatured: false,
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  // ✅ Fetch existing cloth data when editing
  useEffect(() => {
    if (!id) return; // Only fetch if in edit mode

    const fetchCloth = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/cloth/getCloth/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        console.log(data)

        if (response.ok) {
          setFormData({
            name: data.name || "",
            category: data.category || "",
            type: data.type || "",
            size: Array.isArray(data.size)
              ? data.size.join(", ")
              : data.size || "",
            color: Array.isArray(data.color)
              ? data.color.join(", ")
              : data.color || "",
            material: data.material || "",
            price: data.price || "",
            stock: data.stock || "",
            brand: data.brand || "",
            description: data.description || "",
            isFeatured: data.isFeatured || false,
          });

          if (data.images?.length > 0) {
            // Make sure images have full URLs
            const urls = data.images.map((imgPath) =>
              imgPath.startsWith("http")
                ? imgPath
                : `http://localhost:8000${imgPath}`
            );
            setUploadedImages(urls);
          }
        } else {
          alert("Failed to fetch cloth data");
        }
      } catch (error) {
        console.error("Error fetching cloth:", error);
      }
    };

    fetchCloth();
  }, [id, token]);

  // ✅ Handle input field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // ✅ Handle file input
  const handleFileChange = (e) => {
    setSelectedImages([...e.target.files]);
  };

  // ✅ Handle form submit (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

   for (let key in formData) {
  if (key === "size" || key === "color") {
    const arr = formData[key]
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    arr.forEach((v) => data.append(key, v)); // ✅ send as normal array values
  } else {
    data.append(key, formData[key]);
  }
}


    selectedImages.forEach((img) => data.append("images", img));

    const url = id
      ? `http://localhost:8000/api/cloth/EditClothes/${id}`
      : `http://localhost:8000/api/cloth/AddCloths`;

    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert(id ? "✅ Cloth updated successfully!" : "🧥 Cloth added successfully!");

        if (result.data?.images?.length > 0) {
          const uploadedURLs = result.data.images.map((imgPath) => {
            const cleanPath = imgPath.replace(/^\/+/, "").replace(/\\/g, "/");
            return `http://localhost:8000/${cleanPath}`;
          });
          setUploadedImages(uploadedURLs);
        }

        setSelectedImages([]);

        // ✅ Redirect back to admin dashboard (or list)
       setTimeout(() => navigate("/Admin"), 300);
       
      } else {
        alert(`❌ ${result.error || "Failed to save cloth"}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Error saving cloth!");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="form-title">{id ? "✏️ Edit Cloth" : "🧥 Add New Cloth"}</h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="admin-form"
      >
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Unisex">Unisex</option>
        </select>

        <input
          name="type"
          placeholder="Type"
          value={formData.type}
          onChange={handleChange}
        />
        <input
          name="size"
          placeholder="Sizes (comma separated)"
          value={formData.size}
          onChange={handleChange}
        />
        <input
          name="color"
          placeholder="Colors (comma separated)"
          value={formData.color}
          onChange={handleChange}
        />
        <input
          name="material"
          placeholder="Material"
          value={formData.material}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
        />
        <input
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />{" "}
          Featured
        </label>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="file-input"
        />

        {/* Local Previews */}
        <div className="preview-container">
          {selectedImages.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              alt="preview"
              className="preview-img"
            />
          ))}
        </div>

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div className="uploaded-section">
            <h4>Uploaded Images:</h4>
            <div className="preview-container">
              {uploadedImages.map((img, i) => (
                <img key={i} src={img} alt="uploaded" className="preview-img" />
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="submit-btn">
          {id ? "Update Cloth" : "Add Cloth"}
        </button>
      </form>
    </div>
  );
};

export default Admin;
