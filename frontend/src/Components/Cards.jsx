import React from "react";
import { MdDownloading } from "react-icons/md";

const Cards = ({ _id,name, photo, prompt }) => {

  const downloadImage = (id, url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `image-${id}.jpg`;
    link.click();
  };

  return (
    <div>
      <div className="relative group">
        {<img src={photo} className="relative z-30 h-full w-full object-cover rounded-[20px]" />}
        <div className="bg-gray-950 text-white  z-40 absolute bottom-3  left-3 right-3 font-semibold px-5 py-2 rounded-md  space-y-6 opacity-0  group-hover:opacity-80 transition-opacity duration-700 ">
          <p>{prompt}</p>

          <div className="flex  justify-between">
            <p>{name}</p>
            <button onClick={()=>{downloadImage(_id,photo)}} type="button"><MdDownloading className="size-7"/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
