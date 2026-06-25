"use client";

import { motion } from "framer-motion";

const WA_NUMBER = "447832619302";
const WA_LINK = `https://wa.me/${WA_NUMBER}`;

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="28"
      height="28"
      fill="white"
      aria-hidden="true"
    >
      <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16.003c0 2.347.635 4.64 1.839 6.659L2.667 29.333l6.88-1.799a13.3 13.3 0 0 0 6.456 1.668h.003C23.363 29.202 29.333 23.23 29.333 16c0-3.565-1.388-6.916-3.91-9.435A13.27 13.27 0 0 0 16.003 2.667zm0 2.4c2.927 0 5.678 1.14 7.745 3.21a10.9 10.9 0 0 1 3.185 7.723c0 6.02-4.898 10.918-10.93 10.918a10.88 10.88 0 0 1-5.543-1.512l-.394-.233-4.085 1.07 1.09-3.978-.257-.41A10.86 10.86 0 0 1 5.067 16c0-6.032 4.903-10.933 10.936-10.933zm-3.07 5.38c-.22-.49-.45-.5-.659-.51-.17-.009-.366-.008-.562-.008s-.512.074-.78.37c-.267.294-1.024.999-1.024 2.437s1.048 2.83 1.194 3.026c.147.195 2.04 3.24 5.018 4.41.7.27 1.247.43 1.673.55.703.2 1.343.172 1.849.104.564-.076 1.735-.708 1.98-1.394.243-.686.243-1.274.17-1.394-.073-.122-.268-.195-.562-.342-.293-.148-1.735-.856-2.003-.953-.27-.098-.465-.147-.66.147-.195.293-.757.953-.927 1.148-.17.195-.342.22-.635.074-.293-.148-1.238-.456-2.358-1.455-.872-.778-1.46-1.738-1.631-2.031-.17-.294-.018-.453.128-.6.13-.13.292-.34.44-.51.146-.17.195-.293.293-.488.097-.195.048-.367-.025-.514-.073-.147-.644-1.579-.888-2.047z" />
    </svg>
  );
}

export function WhatsAppButton() {
  return (
    <div
      className="fixed bottom-6 right-5 z-50"
      style={{ isolation: "isolate" }}
    >
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{
          background: "rgba(37,211,102,0.38)",
          animationDuration: "2.2s",
        }}
      />

      <motion.a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        whileHover={{ scale: 1.10 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 340, damping: 22 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
        style={{
          background: "linear-gradient(135deg, #25D366 0%, #1aad50 100%)",
          boxShadow:
            "0 6px 24px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        <WhatsAppIcon />
      </motion.a>

      {/* Tooltip */}
      <span
        className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: "rgba(10,20,40,0.82)", backdropFilter: "blur(8px)" }}
      >
        Chat on WhatsApp
      </span>
    </div>
  );
}
