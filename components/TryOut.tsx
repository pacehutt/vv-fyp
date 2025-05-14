"use client";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import VirtualTryOn from "./VirtualRoom";

function TryOut() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const tryOutButtonRef = useRef<HTMLButtonElement | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState<boolean>(false);
  const [productImage, setProductImage] = useState<string | null>(null);

  // Check for product image in session storage (set by ProductImages component)
  useEffect(() => {
    const storedProductImage = sessionStorage.getItem("productTryOnImage");
    if (storedProductImage) {
      setProductImage(storedProductImage);
    } else {
      // Fallback: Look for the first product image on the page
      const productImgElement = document.getElementById(
        "main-product-image"
      ) as HTMLImageElement;
      if (productImgElement && productImgElement.src) {
        setProductImage(productImgElement.src);
        sessionStorage.setItem("productTryOnImage", productImgElement.src);
      }
    }
  }, []);

  // Check if there's a saved user image in session storage
  useEffect(() => {
    const savedUserImage = sessionStorage.getItem("userTryOnImage");
    if (savedUserImage) {
      setImageUrl(savedUserImage);
      setThumbnailImage({} as File); // Just to indicate we have an image

      // Update button color
      if (tryOutButtonRef.current) {
        tryOutButtonRef.current.style.backgroundColor = "#ec4899";
      }
    }
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create object URL for immediate display
      const currentImageUrl = URL.createObjectURL(file);
      setThumbnailImage(file);
      setImageUrl(currentImageUrl);

      // Store in session storage as base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        sessionStorage.setItem("userTryOnImage", base64String);
      };
      reader.readAsDataURL(file);

      // Update button color
      if (tryOutButtonRef.current) {
        tryOutButtonRef.current.style.backgroundColor = "#ec4899";
      }
    }
  };

  const openVirtualTryOn = () => {
    // We'll open the modal even if no user image yet, so they can upload in modal
    setShowVirtualTryOn(true);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {showVirtualTryOn && (
        <VirtualTryOn
          closeWindow={() => setShowVirtualTryOn(false)}
          initialProductImage={productImage}
        />
      )}

      <div className="w-full flex items-center justify-center mt-14 gap-x-8">
        <button
          ref={tryOutButtonRef}
          className="w-3/4 rounded-3xl text-2xl text-white bg-chut p-4 transition-colors"
          onClick={openVirtualTryOn}
        >
          Try it Out
        </button>

        {thumbnailImage === null ? (
          <button
            className="rounded-full hover:bg-pink-500 text-white bg-chut p-4 flex items-center justify-center transition-colors"
            onClick={handleButtonClick}
          >
            <MdOutlinePhotoCamera className="text-4xl" />
          </button>
        ) : (
          <button
            className="rounded-full hover:bg-pink-500 text-white bg-lund p-4 flex items-center justify-center transition-colors"
            onClick={handleButtonClick}
          >
            <FaCheck className="text-4xl" />
          </button>
        )}

        <input
          id="thumbnailImage"
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png"
        />
      </div>
    </>
  );
}

export default TryOut;
