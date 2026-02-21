import React, { useState } from "react";
import RoomCard from "../components/rooms/RoomCard";
import { Calendar, Plus, CheckCircle, Search, Filter } from "lucide-react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { getTables } from "../api/tableApi";
import toast from "react-hot-toast";

const Rooms = () => {
  const [activeTab, setActiveTab] = useState("All Rooms");
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { data: tablesResponse, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    onError: () => toast.error("Failed to load rooms"),
  });

  const allTables = tablesResponse?.data?.items || [];

  // Map tables to rooms format, mocking missing UI fields
  const rooms = allTables.map((table) => ({
    id: table.id,
    name: table.name,
    price: Math.floor(table.capacity * 20), // Mock price based on capacity
    location: table.location || "Main Hall",
    capacity: table.capacity,
    status: table.status, // available, occupied
    type: table.location
      ? table.location.includes("VIP")
        ? "VIP Suites"
        : table.location.includes("Outdoor")
          ? "Outdoor Spaces"
          : "Private Halls"
      : "Private Halls",
    amenities: [
      { icon: "wifi", label: "Fast WiFi" },
      { icon: "coffee", label: "Service" },
    ],
    image:
      table.capacity > 10
        ? "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&h=300&fit=crop"
        : "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=500&h=300&fit=crop",
  }));

  const filteredRooms =
    activeTab === "All Rooms"
      ? rooms
      : rooms.filter(
          (r) =>
            r.type === activeTab ||
            (activeTab === "Private Halls" &&
              !["VIP Suites", "Outdoor Spaces"].includes(r.type)),
        );

  const handleBook = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  // Stats
  const total = rooms.length;
  const available = rooms.filter((r) => r.status === "available").length;
  const occupied = rooms.filter((r) => r.status === "occupied").length;

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen relative">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 bg-white dark:bg-slate-900 px-6 md:px-10 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">
              Room Management
            </h2>
          </div>
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center bg-primary/5 rounded-full px-4 py-2 w-64">
            <Search className="w-4 h-4 text-primary/60 mr-2" />
            <input
              type="text"
              placeholder="Search rooms..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-primary/40 focus:ring-0"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Profile/Notification placeholders */}
          <div className="w-10 h-10 rounded-full bg-primary/10"></div>
        </div>
      </header>

      <main className="px-6 md:px-20 py-8 flex-1 max-w-[1440px] mx-auto w-full">
        {/* Filters and Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex overflow-x-auto border-b border-primary/10 px-1 gap-6 pb-px">
            {["All Rooms", "VIP Suites", "Outdoor Spaces", "Private Halls"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 text-sm font-bold transition-colors whitespace-nowrap",
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-primary dark:text-slate-400",
                  )}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center gap-2 px-6 h-11 bg-primary text-white rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
              <span>Booking Calendar</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-6 h-11 bg-white dark:bg-slate-800 border border-primary/20 text-primary dark:text-white rounded-full font-bold text-sm hover:bg-primary/5 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Room</span>
            </button>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-3 flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="col-span-3 text-center text-slate-500 py-20">
              No rooms found. Add tables to see them here.
            </div>
          ) : (
            filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} onBook={handleBook} />
            ))
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-primary/5 dark:bg-slate-800 p-6 rounded-xl border border-primary/10">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
              Total Rooms
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {total}
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              Available Now
            </p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {available}
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-100 dark:border-amber-800">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              Occupied
            </p>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {occupied}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                System Health
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                Optimal
              </p>
            </div>
            <CheckCircle className="text-emerald-500 w-8 h-8" />
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">New Booking</h3>
              <button
                onClick={handleCloseModal}
                className="hover:bg-white/20 rounded-full p-1"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Selected Room
                </label>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg font-medium text-slate-900 dark:text-white">
                  {selectedRoom?.name}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary"
                />
              </div>
              <button
                onClick={() => {
                  toast.success("Booking Confirmed!");
                  handleCloseModal();
                }}
                className="w-full h-12 bg-primary text-white font-bold rounded-full mt-4 hover:opacity-90 transition-opacity"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
