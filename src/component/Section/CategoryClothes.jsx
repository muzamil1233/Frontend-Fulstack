import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./categoryClothes.css"; // import CSS

const CategoryClothes = () => {
  const { category } = useParams();
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/cloth/getClothes/catogory/${category}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setErrorMsg(data.msg);
          setClothes([]);
        } else {
          setClothes(data);
          setErrorMsg("");
        }
      } catch (error) {
        console.error("Error fetching clothes:", error);
        setErrorMsg("Server error");
        setClothes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, [category]);

  if (loading) return <p>Loading {category} clothes...</p>;

  return (
    <div className="category-page">
      <h2 className="category-title">{category} Clothes</h2>

      {errorMsg ? (
        <p className="error-msg">{errorMsg}</p>
      ) : (
        <div className="clothes-grid">
          {clothes.map((item) => (
            <div key={item._id} className="clothes-card">
              <img
  src={`http://localhost:8000${item.images?.[0]}`}
  alt={item.name}
  className="clothes-img"
/>

              <h4 className="clothes-name">{item.name}</h4>
              <p className="clothes-price">₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryClothes;
