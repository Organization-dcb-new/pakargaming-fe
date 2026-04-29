"use client";

import { useRef } from "react";
import { setClientSecretKey } from "../lib/cryptoClient";

export default function CryptoProvider({ secretKey }: { secretKey: string }) {
  const initialized = useRef(false);
  
  if (!initialized.current) {
    setClientSecretKey(secretKey);
    initialized.current = true;
  }
  
  return null;
}
