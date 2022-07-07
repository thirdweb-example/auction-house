import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import initMagic from "../lib/initMagic";
import truncateAddress from "../lib/truncateAddress";
import styles from "../styles/Theme.module.css";

export default function Header() {
  const [email, setEmail] = useState(""); // State to hold the email address the user entered.
  const [address, setAddress] = useState<string>(); // State to hold the address the user entered.
  const router = useRouter();

  async function login() {
    try {
      const magic = initMagic();
      await magic.auth.loginWithMagicLink({ email });
    } catch (e) {
      // Handle errors if required!
      console.error("Error logging in", e);
    }
  }

  useEffect(() => {
    (async () => {
      const magic = initMagic();

      const isLoggedIn = await magic.user.isLoggedIn();

      const magicAddress = isLoggedIn
        ? (await magic.user.getMetadata()).publicAddress
        : undefined;

      setAddress(magicAddress || undefined);
    })();
  }, []);

  const handleInputOnChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        {address ? (
          <>
            <p>👋 {(address)}</p>
          </>
        ) : (
          <div className={styles.loginContainer}>
            <input
              type="email"
              placeholder="Your Email Address"
              onChange={handleInputOnChange}
              className={`${styles.textInput} ${styles.noGutter}`}
            />

            <button
              onClick={login}
              className={`${styles.mainButton} ${styles.noGutter}`}
            >
              Sign up
            </button>
          </div>
        )}
      </div>
      <div className={styles.right}>
        <button
          className={styles.mainButton}
          onClick={() => router.push(`/create`)}
        >
          Create Listing
        </button>
      </div>
    </div>
  );
}
