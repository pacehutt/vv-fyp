import React from "react";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";

type VirtualRoomProps = {
    closeWindow: () => void;
  };

  
function VirtualRoom({ closeWindow }: VirtualRoomProps) {
  return (
    <div className="w-full h-screen top-0 left-0 bg-gray-900 bg-opacity-90 fixed z-10 flex justify-center items-center">
      <div className="w-[300px] bg-gradient-to-br from-white to-[#54A82F] relative p-6 rounded-md">
        <IoCloseCircleOutline className="top-3 right-3 absolute text-2xl" onClick={closeWindow}/>
        <h2 className="mb-2 text-white font-bold text-2xl">Vittual Room</h2>
        <div className="w-full mb-5">
            <img src="../output1.png" className="rounded-md"/>
        </div>
        <div className="w-full mb-5 flex justify-between items-center gap-x-8">
            <img className="w-1/4 rounded" src="../output1.png"/>
            <button className="w-3/4 h-10 rounded bg-lund text-white hover:bg-green-400">Change Image</button>
        </div>
        <div className="mb-4">
            <h3 className="mb-2 text-white font-bold">Similar Styles:</h3>
            <div className="w-full flex justify-between gap-x-2">
            <img src="../output1.png" className="w-28 rounded-md"/>
            <img src="../output1.png" className="w-28 rounded-md"/>
            </div>
        </div>
        <div className="w-full">
            <button className="hover:bg-green-400 w-full h-11 flex rounded-md bg-lund text-white justify-center items-center font-medium text-xl gap-x-4">Checkout <MdOutlineShoppingCartCheckout/></button>
        </div>
      </div>
    </div>
  );
}

export default VirtualRoom;
