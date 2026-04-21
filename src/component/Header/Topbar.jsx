import React, { useEffect, useState } from "react";
import outfit from "../../assets/Logo.jpeg";
import search from "../../assets/search.png";
import "../Header/Topbar.css";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import Pagination from "../Pagination";
import { BASE_URL } from "../../api/baseUrl";
import CartDrawer from "./CartDrawer";


const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);


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


  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  navigate("/login");
};



useEffect(() => {
  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");
     
    if (!token){
       console.warn("❌ No token found — skipping fetch");
      return;}

    try {
      const response = await fetch(`${BASE_URL}/api/Bag/count`, {
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
    try {
      const response = await fetch(`${BASE_URL}/api/Bag/getbag`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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

    await fetch(`${BASE_URL}/api/Bag/patchBag/${itemId}`, {
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

  <div className={`navlinks ${menuOpen ? "active" : ""}`}>
    <span onClick={() => navigate("/category/Hand Tilla")}>Hand Tilla</span>
    <span onClick={() => navigate("/category/Aari Work")}>Aari work</span>
    <span onClick={() => navigate("/category/Machine")}>Machine</span>
  </div>

  <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
    ☰
  </div>
</div>


      {/* Search Bar */}
     {/* Desktop Search */}
<div className={`search-bar ${showSearch ? "active" : ""}`}>
  <div className="input">
    <img src={search} alt="Search Icon" className="search-icon" />
    <input type="text" placeholder="Search for products..." />
    <span className="close-search" onClick={() => setShowSearch(false)}>✕</span>
  </div>
</div>

{/* Mobile Search Icon */}
<div className="mobile-search-icon" onClick={() => setShowSearch(true)}>
  <img src={search} alt="Search Icon" className="search-icon" />
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
<CartDrawer
  isOpen={showCart}
  onClose={() => setShowCart(false)}
  cartItems={cartItems}
  setCartItems={setCartItems}
  countCart={countCart}
  setCountCart={setCountCart}
/>

   
  </div>

  <FaSignOutAlt className="icon" title="Logout" style={{ cursor: "pointer" }}  onClick={handleLogout} />
</div>



    </div>
  );
};

export default Topbar;
