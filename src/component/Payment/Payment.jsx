import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PaymentModal.module.css";

const Payment = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate()

 useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/cloth/getCloth/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      console.log("API RESPONSE 👉", data); // 🔥 IMPORTANT
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  fetchData();
}, [id]);


const handleBack = ()=>{
navigate(-1)
}

  if (!product) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <button className={styles.backBtn} onClick = { handleBack}>← Go back</button>
          <button className={styles.closeBtn} onClick = { handleBack} >✕</button>
        </div>

        <div className={styles.content}>

          {/* LEFT */}
          <div className={styles.left}>
            <h2>Product Details</h2>

            <div className={styles.row1}>
              <label>item</label>
              <span className={styles.name}>{product.name}</span>
            </div>

            <div className={styles.row}>
              <label>Product Type</label>
              <span>{product.type}</span>
            </div>

            <div className={styles.row}>
              <label>Product Color </label>
              <span>{product.color[0]}</span>
            </div>

            <div className={styles.row}>
              <label>Product Brand </label>
              <span>{product.brand}</span>
            </div>

          
          </div>
            
          {/* RIGHT */}
          <div className={styles.right}>
            <h2>Payment</h2>

            <div className={styles.billRow}>
              <span>product price</span>
              <span>₹{product.price}</span>
            </div>

            <div className={styles.billRow}>
              <span>Tax</span>
              <span>₹35</span>
            </div>

            <div className={styles.total}>
              <span>Total</span>
              <span>₹{product.price +35}</span>
            </div>
              
          </div>
            <div className={styles.status}>payment</div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
