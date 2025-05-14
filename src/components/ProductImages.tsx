"use client";

import { useState, useEffect } from "react";

// ProductImages component modified to expose the current product image
// and add necessary classes for image identification
function ProductImages({ items = [] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [mainImageUrl, setMainImageUrl] = useState("");

  // Set the first image as the selected one when items change
  useEffect(() => {
    if (items.length > 0) {
      const initialImageUrl = items[0].image?.url || "";
      setMainImageUrl(initialImageUrl);

      // Store the initial product image in session storage for use in TryOut
      if (initialImageUrl) {
        sessionStorage.setItem("productTryOnImage", initialImageUrl);

        // Also store all product images for the TryOn modal to use
        try {
          const allImages = items
            .map((item) => item.image?.url)
            .filter(Boolean);
          sessionStorage.setItem("allProductImages", JSON.stringify(allImages));
        } catch (error) {
          console.error("Error storing product images:", error);
        }
      }
    }
  }, [items]);

  const handleImageClick = (index) => {
    setSelectedImage(index);
    const newImageUrl = items[index].image?.url || "";
    setMainImageUrl(newImageUrl);

    // Also update session storage for product image
    if (newImageUrl) {
      sessionStorage.setItem("productTryOnImage", newImageUrl);
    }
  };

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="w-full h-[500px] mb-4 product-image">
        {mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt="Product"
            className="w-full h-full object-contain"
            id="main-product-image"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p>No image available</p>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="w-full flex flex-wrap gap-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`w-24 h-24 cursor-pointer ${
              selectedImage === i
                ? "border-2 border-pink-500"
                : "border border-gray-200"
            }`}
            onClick={() => handleImageClick(i)}
          >
            {item.image?.url ? (
              <img
                src={item.image.url}
                alt={`Product thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                data-product-index={i}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-xs">No image</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductImages;
