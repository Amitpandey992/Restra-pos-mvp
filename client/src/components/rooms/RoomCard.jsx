import React, { useState } from "react";
import clsx from "clsx";
import {
  Users,
  Wifi,
  Video,
  Volume2,
  Sun,
  Coffee,
  MoreHorizontal,
} from "lucide-react";

const RoomCard = ({ room, onBook }) => {
  const isAvailable = room.status === "available";

  const getIcon = (iconName) => {
    switch (iconName) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "volume":
        return <Volume2 className="w-4 h-4" />;
      case "sun":
        return <Sun className="w-4 h-4" />;
      case "coffee":
        return <Coffee className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-primary/5 shadow-sm hover:shadow-xl transition-shadow group flex flex-col h-full">
      {/* Image & Status */}
      <div
        className="relative h-56 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${room.image})` }}
      >
        <div
          className={clsx(
            "absolute top-4 right-4 px-3 py-1 text-white text-xs font-bold rounded-full flex items-center gap-1",
            isAvailable ? "bg-emerald-500" : "bg-amber-500",
          )}
        >
          <span
            className={clsx(
              "size-2 bg-white rounded-full",
              isAvailable && "animate-pulse",
            )}
          ></span>
          {isAvailable ? "Available" : "Occupied"}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {room.name}
          </h3>
          <p className="text-primary font-bold">₹{room.price}/hr</p>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
          {room.location}
        </p>

        {/* Amenities */}
        <div className="flex items-center gap-4 text-slate-400 mb-6 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span className="text-xs">Seats {room.capacity}</span>
          </div>
          {room.amenities.map((amenity, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {getIcon(amenity.icon)}
              <span className="text-xs">{amenity.label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => isAvailable && onBook(room)}
            disabled={!isAvailable}
            className={clsx(
              "flex-1 h-10 font-bold rounded-full text-sm transition-opacity",
              isAvailable
                ? "bg-primary text-white hover:opacity-90"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed",
            )}
          >
            {isAvailable ? "Book Now" : "Scheduled"}
          </button>
          <button className="w-10 h-10 border border-primary/20 text-primary rounded-full flex items-center justify-center hover:bg-primary/5 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
