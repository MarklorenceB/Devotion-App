// components/LogoutButton.tsx - Beautiful logout modal
"use client";

import { LogOut, X, AlertCircle } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { handleLogout } from "@/app/actions/auth";

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const handleConfirmLogout = () => {
    startTransition(async () => {
      await handleLogout();
    });
  };

  const handleCancel = () => {
    if (!isPending) {
      setShowModal(false);
    }
  };

  return (
    <>
      {/* Logout Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1 text-sm sm:text-base hover:opacity-80 transition-opacity"
      >
        <LogOut className="size-6 text-red-500" />
        <span className="hidden sm:inline">Logout</span>
      </button>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCancel}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            {/* Close Button */}
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="size-5" />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-4">
                  <AlertCircle className="size-8 text-red-500" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Confirm Logout
              </h3>

              {/* Message */}
              <p className="text-gray-600 text-center mb-8 leading-relaxed">
                Are you sure you want to sign out of your account? You'll need
                to sign in again to access your content.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Cancel Button */}
                <button
                  onClick={handleCancel}
                  disabled={isPending}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleConfirmLogout}
                  disabled={isPending}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="size-4" />
                      <span>Sign out</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="h-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 rounded-b-2xl" />
          </div>
        </div>
      )}
    </>
  );
}
