import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DetailProf.css";

const DetailProf = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const[loading, setLoading ] = useState(false)
   const [cartItems, setCartItems] = useState(0);
   console.log("cartitem : ",cartItems)
    const [countCart, setCountCart] = useState([]);
    console.log("countcart", countCart)
   

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/cloth/getCloth/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);
useEffect(() => {
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // 🔥 FIXED

      if (!userId) {
        console.error("❌ userId missing in localStorage");
        return;
      }

     const res = await fetch(`http://localhost:8000/api/Bag/getbag/${userId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


      if (!res.ok) {
        console.error("❌ API Error:", res.status);
        return;
      }

      const data = await res.json();
      console.log("Cart Data:", data);

      setCartItems(data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  fetchCart();
}, []);



 const handleEdit = async () => {
  if (!selectedColor) {
    return alert("Please select a color");
  }
  setLoading(true);
  try {
    const response = await fetch("http://localhost:8000/api/Bag/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
  userId: localStorage.getItem("userId"),  // ✅ add this
  productId: product._id,
  color: selectedColor,
  quantity: 1,
}),
    });
    console.log("🧾 Sending productId:", product._id);


    const data = await response.json();
    

    if (response.ok) {
      alert("✅ Item added to your bag!");

      // 🔥 Tell Topbar to refresh count
      window.dispatchEvent(new Event("cart-updated"));
    } else {
      alert(`❌ Failed: ${data.message || "Something went wrong"}`);
    }
  } catch (error) {
    console.error("Error adding to bag:", error);
    alert("❌ Error adding to bag. Please try again.");
  } finally {
    setLoading(false);
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


  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-box">
        {/* Left Section - Image */}
        <div className="product-images">
            
          <img
            src={`http://localhost:8000${product.images?.[0]}`}
            alt={product.name}
            className="main-image"
          />
        </div>

        {/* Right Section - Info */}
        <div className="product-info">
             <h2 className="product-name" >{product.name}</h2>
         
          <div className="product-catogory">

  <p className="pro-det">
    <strong>Category</strong>
    <span>{product.category}</span>
  </p>

  <p className="pro-det">
    <strong>Type</strong>
    <span>{product.type}</span>
  </p>

  <p className="pro-det">
    <strong>Brand</strong>
    <span>{product.brand || "N/A"}</span>
  </p>

  <p className="pro-det">
    <strong>Material</strong>
    <span>{product.material || "N/A"}</span>
  </p>

  <p className="pro-det">
    <strong>Sizes</strong>
    <span>{product.size?.join(", ") || "N/A"}</span>
  </p>

</div>


          {/* Color Selection */}
          <div className="color-section">
            <strong>Colors:</strong>
            <div className="color-options">
              {product.color?.length > 0 ? (
                product.color.map((clr, index) => (
                  <div
                    key={index}
                    className={`color-circle ${selectedColor === clr ? "selected" : ""}`}
                    style={{ backgroundColor: clr.toLowerCase() }}
                    title={clr}
                    onClick={() => setSelectedColor(clr)}
                  ></div>
                ))
              ) : (
                <span> N/A</span>
              )}
            </div>
          </div>

          <p className="price"><strong>Price:</strong> ₹{product.price}</p>

          <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
         <div>
  {Array.isArray(cartItems) && (() => {
    const currentItem = cartItems.find((item) => {
      const itemProductId = item.productId?._id || item.productId;
      return String(itemProductId) === String(product._id);
    });

    if (!currentItem) return null;

    return (
      <div>
        <button
          onClick={() => handleQuantityChange(currentItem._id, -1)}
          style={{ padding: "3px 8px", borderRadius: "4px" }}
        >
          -
        </button>

        <span style={{ margin: "0 8px" }}>Quantity {currentItem.quantity}</span>

        <button
          onClick={() => handleQuantityChange(currentItem._id, 1)}
          style={{ padding: "3px 8px", borderRadius: "4px" }}
        >
          +
        </button>
      </div>
    );
  })()}
</div>


         
           
        

          <div className="action-buttons">
            <button className="add-btn" onClick={ handleEdit} disabled={loading}> {loading ? "Adding..." : "Add to Bag"}</button>
         <button
  className="buy-btn"
  onClick={() => {
    console.log("Navigating with ID:", product?._id);
    navigate(`/payment/${product._id}`);
  }}
>
  Buy Now
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProf;
