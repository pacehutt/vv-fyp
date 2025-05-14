"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FaArrowsRotate, FaUpload } from "react-icons/fa6";
import { RiGalleryLine } from "react-icons/ri";

function VirtualTryOn({ closeWindow, initialProductImage }) {
  const [userImage, setUserImage] = useState(null);
  const [productImage, setProductImage] = useState(initialProductImage);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allProductImages, setAllProductImages] = useState([]);
  const [showProductGallery, setShowProductGallery] = useState(false);

  // Load user image and all product images from session storage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("userTryOnImage");
    if (storedUser) setUserImage(storedUser);

    try {
      const storedList = sessionStorage.getItem("allProductImages");
      if (storedList) {
        const arr = JSON.parse(storedList);
        if (Array.isArray(arr)) setAllProductImages(arr);
      }
    } catch (e) {
      console.error("Failed to parse stored product images:", e);
    }
  }, []);

  // Upload handler for user image
  const handleUserImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserImage(reader.result);
      sessionStorage.setItem("userTryOnImage", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Helper: fetch any URL/data‑URL and make it a File
  async function urlToFile(url, filename = "file.png") {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Could not fetch ${url}: ${res.statusText}`);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  // Main “Try It On” function calling FastAPI
  const processTryOn = async () => {
    if (!userImage || !productImage) return;
    setIsProcessing(true);

    try {
      const personFile = await urlToFile(userImage, "person.png");
      const designFile = await urlToFile(productImage, "design.png");

      const form = new FormData();
      form.append("person_image", personFile);
      form.append("design_image", designFile);

      const res = await fetch("http://127.0.0.1:8000/api/apply-design/", {
        method: "POST",
        body: form,
        // if you need cross-origin, you can add: mode: "cors"
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server ${res.status}: ${text}`);
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setResultImage(objectUrl);
    } catch (err) {
      console.error("Try-on failed:", err);
      alert("Could not apply design: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Switch product images from gallery
  const selectProductImage = (img) => {
    setProductImage(img);
    setShowProductGallery(false);
    setResultImage(null);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center overflow-y-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-6xl bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl"
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-800/70 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-slate-100">
            Virtual Try-On
          </h2>
          <button
            onClick={closeWindow}
            className="text-slate-300 hover:text-red-400"
          >
            <IoCloseCircleOutline className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Upload Panels */}
          <div className="space-y-6">
            {/* Product Selector */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Product Image</p>
              <div className="relative h-60 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700">
                {productImage ? (
                  <img src={productImage} className="h-full object-contain" />
                ) : (
                  <p className="text-slate-500">No image selected</p>
                )}
                <button
                  onClick={() => setShowProductGallery((p) => !p)}
                  className="absolute bottom-3 right-3 p-2 bg-indigo-500 hover:bg-indigo-600 rounded-full text-white shadow"
                >
                  <RiGalleryLine />
                </button>
              </div>
            </div>

            {/* User Image Upload */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Your Image</p>
              <div className="relative h-60 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700">
                {userImage ? (
                  <img src={userImage} className="h-full object-contain" />
                ) : (
                  <p className="text-slate-500">Upload your image</p>
                )}
                <label className="absolute bottom-3 right-3 p-2 bg-emerald-500 hover:bg-emerald-600 rounded-full text-white shadow cursor-pointer">
                  <FaUpload />
                  <input
                    type="file"
                    onChange={handleUserImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Try Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={!userImage || !productImage || isProcessing}
              onClick={processTryOn}
              className={`w-full py-3 rounded-xl text-white font-medium transition ${
                userImage && productImage && !isProcessing
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-slate-600 cursor-not-allowed"
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <FaArrowsRotate className="animate-spin" />
                  Processing...
                </span>
              ) : (
                "Try It On"
              )}
            </motion.button>
          </div>

          {/* Result Panel */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 h-[300px] flex items-center justify-center">
              {resultImage ? (
                <motion.img
                  src={resultImage}
                  alt="Result"
                  className="max-h-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              ) : (
                <p className="text-slate-500">
                  {isProcessing ? "Processing..." : "Result will appear here"}
                </p>
              )}
            </div>

            {resultImage && (
              <>
                <div>
                  <p className="text-slate-400 mb-2">You may also like</p>
                  <div className="grid grid-cols-3 gap-3">
                    {allProductImages.slice(0, 3).map((img, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => selectProductImage(img)}
                        className="rounded-lg overflow-hidden border border-slate-700 cursor-pointer"
                      >
                        <img src={img} className="w-full h-20 object-cover" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow"
                >
                  Add to Cart{" "}
                  <MdOutlineShoppingCartCheckout className="inline ml-2" />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default VirtualTryOn;
