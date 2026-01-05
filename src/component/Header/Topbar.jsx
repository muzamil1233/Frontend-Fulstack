import React, { useEffect, useState } from "react";
import outfit from "../../assets/Logo.jpeg";
import search from "../../assets/search.png";
import "../Header/Topbar.css";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import Pagination from "../Pagination";


const Topbar = () => {
   const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
  const navigate = useNavigate()
// console.log("Topbar rendered");
  const [countCart, setCountCart] = useState(0);
  // console.log("countCart :",countCart)
   const [showCart, setShowCart] = useState(false);
   const [cartItems, setCartItems] = useState([]); // store items from backend
  console.log("cartitems:", cartItems)



useEffect(() => {
  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");
     
    if (!token){
       console.warn("❌ No token found — skipping fetch");
      return;}

    try {
      const response = await fetch("http://localhost:8000/api/Bag/count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("data: ", data)
      if (response.ok) {
        setCountCart(data.count || 0);
      }
    } catch (error) {
      console.log("Error fetching count:", error.message);
    }
  };

  fetchCartCount(); // initial load

  // ✅ Listen for updates from handleEdit()
  window.addEventListener("cart-updated", fetchCartCount);

  // Cleanup
  return () => window.removeEventListener("cart-updated", fetchCartCount);
}, []);

const handleCartClick = async () => {
  setShowCart(!showCart);

  if (!showCart) {
    const userId = localStorage.getItem("userId");
    console.log("🆔 UserID from localStorage:", userId);

    if (!userId) {
      console.warn("❌ No userId found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/Bag/getbag/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      console.log("Bag response:", data);

      if (response.ok) setCartItems(data.items || []);
      else setCartItems([]);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setCartItems([]);
    }
  }
};
const handleQuantityChange = async (itemId, delta) => {
  // Find and update UI quantity first
  const updatedCart = cartItems.map(item => {
    if (item._id === itemId) {
      const newQty = item.quantity + delta;
      return { ...item, quantity: newQty > 0 ? newQty : 1 }; // never 0
    }
    return item;
  });

  setCartItems(updatedCart);

  // Find the updated item to send correct quantity to backend
  const updatedItem = updatedCart.find(item => item._id === itemId);

  try {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8000/api/Bag/patchBag/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: updatedItem.quantity }), // IMPORTANT
    });
  } catch (err) {
    console.error("Error updating quantity:", err);
  }

  // Update total count
  const newCount = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
  setCountCart(newCount);
};



 const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);


  return (
    <div className="Topbar">
      {/* Left Section */}
      <div className="leftSection">
        <div className="logo">
          <img src={outfit} alt="Shop Logo" />
        </div>
        <div className="navlinks">
          <span onClick={() => navigate("/category/women")}>Women</span>
          <span onClick={() => navigate("/category/kids")}>Kids</span>
          <span onClick={() => navigate("/category/men")}>Men</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="input">
          <img src={search} alt="Search Icon" className="search-icon" />
          <input type="text" placeholder="Search for products..." />
        </div>
      </div>

      {/* Right Section */}
  <div className="right-section" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
  <FaHeart className="icon" title="Wishlist" style={{ cursor: "pointer" }} />

  {/* Cart wrapper */}
  <div style={{ position: "relative", cursor: "pointer" }}>
    <FaShoppingCart
      className="icon"
      title="Cart"
      onClick={handleCartClick}
      size={24}
    />
    {countCart > 0 && (
      <span
        style={{
          position: "absolute",
          top: "-5px",
          right: "-10px",
          backgroundColor: "red",
          color: "white",
          borderRadius: "50%",
          padding: "3px 6px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {countCart}
      </span>
    )}


    {/* Cart dropdown as a card */}
  {/* Cart dropdown as a card */}
{showCart && (
  <div
    style={{
      position: "absolute",
      top: "35px",
      right: "0",
      width: "300px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      padding: "15px",
      zIndex: 100,
    }}
  >
    {cartItems.length === 0 ? (
      <p style={{ textAlign: "center", color: "#555" }}>Your bag is empty</p>
    ) : (
      <>
        {/** Calculate paginated items **/}
        {cartItems
          .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
          .map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              {item.productId.image && (
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px", borderRadius: "4px" }}
                />
              )}
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{item.productId.name}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Qty: {item.quantity}</p>
              </div>
              <p style={{ margin: 0, fontWeight: "bold" }}>₹{item.productId.price}</p>
            <button
    onClick={() => handleQuantityChange(item._id, -1)}
    style={{ padding: "3px 8px", borderRadius: "4px" }}
  >
    -
  </button>
  <span>{item.quantity}</span>
  <button
    onClick={() => handleQuantityChange(item._id, 1)}
    style={{ padding: "3px 8px", borderRadius: "4px" }}
  >
    +
  </button>
            </div>
          ))}

        {/** Pagination controls **/}
        {cartItems.length > productsPerPage && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", gap: "5px" }}>
            {Array.from({ length: Math.ceil(cartItems.length / productsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  padding: "5px 8px",
                  borderRadius: "4px",
                  border: currentPage === index + 1 ? "1px solid #007bff" : "1px solid #ccc",
                  backgroundColor: currentPage === index + 1 ? "#007bff" : "#fff",
                  color: currentPage === index + 1 ? "#fff" : "#000",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        <button
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          Checkout
        </button>
      </>
    )}
  </div>
)}

   
  </div>

  <FaSignOutAlt className="icon" title="Logout" style={{ cursor: "pointer" }} />
</div>



    </div>
  );
};

export default Topbar;
