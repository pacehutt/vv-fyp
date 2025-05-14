"use client";
import { useState, useRef, ChangeEvent } from "react";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import VirtualRoom from "./VirtualRoom";


function TryOut() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const tryOut = useRef<HTMLButtonElement | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showVirtualRoom, setShowVirtualRoom] = useState<boolean>(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const currentImageUrl = URL.createObjectURL(file);
      setThumbnailImage(file);
      setImageUrl(currentImageUrl);
      if (tryOut.current) {
        tryOut.current.style.backgroundColor = "#ec4899";
      }
    }
  };

  const openWindow = () => {
    if (thumbnailImage != null) {
      setShowVirtualRoom(true)
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
    {showVirtualRoom&&<VirtualRoom closeWindow={()=>setShowVirtualRoom(false)}/>}
      <div className="w-full flex items-center justify-center mt-14 gap-x-8">
        <button
          ref={tryOut}
          className="w-3/4 rounded-3xl text-2xl text-white bg-chut p-4"
          onClick={openWindow}
        >
          Try it Out
        </button>
        {thumbnailImage == null ? (
          <button
            className="rounded-full hover:bg-pink-500 text-white bg-chut p-4 flex items-center justify-center "
            onClick={handleButtonClick}
          >
            <MdOutlinePhotoCamera className="text-4xl" />
          </button>
        ) : (
          <button
            className="rounded-full hover:bg-pink-500 text-white bg-lund p-4 flex items-center justify-center "
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
