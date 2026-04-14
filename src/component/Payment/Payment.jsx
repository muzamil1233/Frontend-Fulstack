import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PaymentModal.module.css";
import { BASE_URL } from "../../api/baseUrl";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add this state at the top of your component
const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error("ID is missing");
        }

        console.log("CALLING 👉", `${BASE_URL}/api/cloth/getCloth/${id}`);

        const res = await fetch(
          `${BASE_URL}/api/cloth/getCloth/${id}`
         
        );
        

        // ✅ HANDLE ERROR RESPONSE
        if (!res.ok) {
          const text = await res.text();
          console.error("API ERROR 👉", text);
          throw new Error("Failed to fetch product");
        }

        const data = await res.json();
        console.log("API RESPONSE 👉", data);

        setProduct(data);
      } catch (err) {
        console.error("Error 👉", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  // ✅ LOADING STATE
  if (loading) return <div>Loading...</div>;

  // ✅ ERROR STATE
  if (error) return <div>Error: {error}</div>;

 return (
  <div className={styles.overlay}>
    <div className={styles.modal}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>← Go back</button>
        <button className={styles.closeBtn} onClick={handleBack}>✕</button>
      </div>

      <div className={styles.content}>
        {/* LEFT */}
        <div className={styles.left}>
          <h2>Product Details</h2>

          <div className={styles.row1}>
            <div style={{ fontSize: 32 }}>👕</div>
            <div>
              <div className={styles.name}>{product.name}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{product.type}</div>
            </div>
          </div>

          <div className={styles.row}>
            <label>Product type</label>
            <span>{product.type}</span>
          </div>

          <div className={styles.row}>
            <label>Product color</label>
            <span>{product.color?.[0] || 'N/A'}</span>
          </div>

          <div className={styles.row}>
            <label>Product brand</label>
            <span>{product.brand}</span>
          </div>

          <div className={styles.row}>
            <label>Status</label>
            <span className={styles.statusBadge}>Available</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <h2>Payment</h2>

          <div className={styles.billRow}>
            <span>🏷️ Product price</span>
            <span>₹{product.price}</span>
          </div>

          <div className={styles.billRow}>
            <span>✂️ Procedure fee</span>
            <span>—</span>
          </div>

          <div className={styles.billRow}>
            <span>⭐ Tax</span>
            <span>₹35</span>
          </div>

          <div className={styles.total}>
            <span>Total</span>
            <span>₹{product.price + 35}</span>
          </div>

         <div className={styles.paymentOptions}>
  <div className={styles.paymentLabel}>💳 Payment options</div>

  <label className={styles.radioOption}>
    <input
      type="radio"
      name="payment"
      value="card"
      checked={paymentMethod === "card"}
      onChange={() => setPaymentMethod("card")}
    />
    Debit/Credit card
  </label>
  {paymentMethod === "card" && (
    <input
      type="text"
      className={styles.cardInput}
      placeholder="Last 4 digits of card..."
    />
  )}

  <label className={styles.radioOption}>
    <input
      type="radio"
      name="payment"
      value="upi"
      checked={paymentMethod === "upi"}
      onChange={() => setPaymentMethod("upi")}
    />
    Online wallets/UPI
  </label>
  {paymentMethod === "upi" && (
    <input
      type="text"
      className={styles.cardInput}
      placeholder="Enter UPI ID (e.g. name@upi)"
    />
  )}

  <label className={styles.radioOption}>
    <input
      type="radio"
      name="payment"
      value="cash"
      checked={paymentMethod === "cash"}
      onChange={() => setPaymentMethod("cash")}
    />
    Cash
  </label>
</div>

          <button className={styles.payBtn}>Pay now</button>
        </div>
      </div>
    </div>
  </div>
);
};

export default Payment;
