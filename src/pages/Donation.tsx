import React, { useEffect } from "react";
import styles from "./DonationForm.module.css";

const Donation: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://donorbox.org/install-popup-button.js";
    script.id = "donorbox-popup-button-installer";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🌬️ WHISPER TO THE WIND GOD 🌬️</h1>
      <p className={styles.description}>
        A wise pirate once said, "Not all treasure is silver and gold."
        Your donation's proof of that. If you enjoy using our platform, consider making a small donation to support us.
        May the wind favor you, your board stay afloat, and your rum never run dry. Cheers, from windseeker and beyond.
      </p>

      <a
        className="dbox-donation-button"
        id="preview_inline_popup_button"
        href="https://donorbox.org/windseeker-application?"
        style={{
          background: "rgb(18, 138, 237)",
          color: "rgb(255, 255, 255)",
          textDecoration: "none",
          fontFamily: "Verdana, sans-serif",
          display: "flex",
          gap: "8px",
          width: "fit-content",
          fontSize: "16px",
          borderRadius: "8px",
          lineHeight: "24px",
          padding: "12px 24px",
        }}
      >
        <img
          src="https://donorbox.org/images/white_logo.svg"
          alt="Donorbox Logo"
          style={{ height: "24px" }}
        />
        Donate
      </a>
    </div>
  );
};

export default Donation;