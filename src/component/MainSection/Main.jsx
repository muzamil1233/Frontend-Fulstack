import React, { useEffect, useState } from "react";
import "../MainSection/Main.css";
import Pagination from "../Pagination"; // import your component
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/cloth/getClothes",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="new-arrivals">
      <h2>New Arrivals for The World</h2>
      <div className="products-grid">
        {currentProducts.map((product) => (
          <div className="product-card"
           key={product.id}
           onClick={() => navigate(`/detailprof/${product._id}`)}
           >
             <img
        src={`http://localhost:8000${product.images?.[0]}`}
        alt={product.name}
        style={{ width: "100%", height: "250px", objectFit: "cover" }}
      />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <div className="color-selection">
              {product.color?.map((color, idx) => (
                <button
                  key={idx}
                  className="chip-button"
                  style={{ backgroundColor: color }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Main;
