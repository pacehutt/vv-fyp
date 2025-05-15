"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaArrowsRotate, FaUpload } from "react-icons/fa6";
import { RiGalleryLine } from "react-icons/ri";

function VirtualTryOn({ closeWindow, initialProductImage }) {
  const [userImage, setUserImage] = useState(null);
  const [productImage, setProductImage] = useState(initialProductImage);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allProductImages, setAllProductImages] = useState([]);

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

  async function urlToFile(url, filename = "file.png") {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Could not fetch ${url}: ${res.statusText}`);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

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

  const selectProductImage = (img) => {
    setProductImage(img);
    setResultImage(null);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-blue-100/60 via-white/50 to-blue-50 flex items-center justify-center overflow-y-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-6xl bg-white/60 backdrop-blur-2xl border border-blue-100 rounded-2xl shadow-xl"
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-blue-200 bg-gradient-to-r from-blue-200 via-white to-blue-100 rounded-t-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Virtual Try-On
          </h2>
          <button
            onClick={closeWindow}
            className="text-gray-600 hover:text-red-500"
          >
            <IoCloseCircleOutline className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Upload Panels */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="bg-white/70 p-4 rounded-xl border border-blue-100 shadow-sm">
              <p className="text-sm text-gray-700 mb-2">Product Image</p>
              <div className="relative h-60 bg-white rounded-lg flex items-center justify-center border border-blue-100">
                {productImage ? (
                  <img src={productImage} className="h-full object-contain" />
                ) : (
                  <p className="text-gray-400">No image selected</p>
                )}
                <button
                  onClick={() => setShowProductGallery((p) => !p)}
                  className="absolute bottom-3 right-3 p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white shadow"
                >
                  <RiGalleryLine />
                </button>
              </div>
            </div>

            {/* User Image Upload */}
            <div className="bg-white/70 p-4 rounded-xl border border-blue-100 shadow-sm">
              <p className="text-sm text-gray-700 mb-2">Your Image</p>
              <div className="relative h-60 bg-white rounded-lg flex items-center justify-center border border-blue-100">
                {userImage ? (
                  <img src={userImage} className="h-full object-contain" />
                ) : (
                  <p className="text-gray-400">Upload your image</p>
                )}
                <label className="absolute bottom-3 right-3 p-2 bg-green-500 hover:bg-green-600 rounded-full text-white shadow cursor-pointer">
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
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
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
            <div className="bg-white/70 p-4 rounded-xl border border-blue-100 h-[300px] flex items-center justify-center shadow-sm">
              {resultImage ? (
                <motion.img
                  src={resultImage}
                  alt="Result"
                  className="max-h-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              ) : (
                <p className="text-gray-400">
                  {isProcessing ? "Processing..." : "Result will appear here"}
                </p>
              )}
            </div>

            {resultImage && (
              <div>
                <p className="text-gray-700 mb-2">You may also like</p>
                <div className="grid grid-cols-3 gap-3">
                  {allProductImages.slice(0, 3).map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => selectProductImage(img)}
                      className="rounded-lg overflow-hidden border border-blue-100 cursor-pointer shadow"
                    >
                      <img src={img} className="w-full h-20 object-contain" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default VirtualTryOn;
