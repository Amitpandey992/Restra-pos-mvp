import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import CategoryFilter from "../components/pos/menu/CategoryFilter";
import MenuGrid from "../components/pos/menu/MenuGrid";
import OrderCart from "../components/pos/cart/OrderCart";
import { getMenuItems } from "../api/menuApi";
import { createOrder } from "../api/orderApi";
import { getTables } from "../api/tableApi";
import { ShoppingCart, X } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const Orders = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlTableId = searchParams.get("tableId");
  const [selectedTableId, setSelectedTableId] = useState(urlTableId || "");

  useEffect(() => {
    if (urlTableId) setSelectedTableId(urlTableId);
  }, [urlTableId]);

  const {
    data: menuItemsResponse,
    isLoading: isMenuLoading,
    isError: isMenuError,
  } = useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      const response = await getMenuItems({ limit: 200 });
      // Ensure we return the array part
      return response?.data?.items || [];
    },
    onError: (error) => {
      console.error("Failed to fetch menu items", error);
      toast.error("Failed to fetch menu items");
    },
  });

  const menuItemsData = Array.isArray(menuItemsResponse)
    ? menuItemsResponse
    : [];

  const menuItems = menuItemsData.map((item) => ({
    ...item,
    image: item.image_url,
  }));

  const {
    data: tablesResponse,
    isLoading: isTablesLoading,
    isError: isTablesError,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  const tablesData = tablesResponse?.data?.items;
  const tables = Array.isArray(tablesData) ? tablesData : [];

  const createOrderMutation = useMutation({
    mutationFn: (data) => createOrder(data),
    onSuccess: (response) => {
      toast.success("Order created successfully!");
      if (response && response.data && response.data.id) {
        const orderId = response.data.id;
        setCartItems([]);
        navigate(`/payments?orderId=${orderId}`);
      } else {
        toast.error("Order created but ID missing");
      }
    },
    onError: (error) => {
      console.error("Failed to create order", error);
      toast.error(error.response?.data?.message || "Failed to create order");
    },
  });

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleUpdateQty = (itemId, change) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId)
          return { ...item, qty: Math.max(1, item.qty + change) };
        return item;
      }),
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      setCartItems([]);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // Transform cart items to API format
    // Cart items are MenuItems with qty
    // API expects: { menu_item_id, quantity, notes? }
    const items = cartItems.map((item) => ({
      menu_item_id: item.id,
      quantity: item.qty, // Ensure qty is used
      notes: item.notes || "",
    }));

    const orderData = {
      table_id: selectedTableId || null,
      items,
    };

    createOrderMutation.mutate(orderData);
  };

  const [isCartOpen, setIsCartOpen] = useState(false);

  if (isMenuLoading || isTablesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isMenuError || isTablesError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">
          Failed to load {isMenuError ? "menu items" : "tables data"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-hidden relative">
      {/* Left Side: Category & Menu */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
        <CategoryFilter
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <MenuGrid
          category={selectedCategory}
          searchQuery={searchQuery}
          items={menuItems}
          onAddToOrder={handleAddToCart}
        />
      </div>

      {/* Mobile Cart Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Right Side: Cart (Drawer on mobile, Sidebar on desktop) */}
      <div
        className={clsx(
          "fixed inset-y-0 right-0 w-full sm:w-96 border-l border-primary/10 bg-white dark:bg-slate-900 shadow-2xl z-50 h-full flex flex-col transition-transform duration-300 lg:static lg:translate-x-0",
          isCartOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        {/* Mobile Cart Header */}
        <div className="p-4 flex items-center justify-between border-b border-primary/5 lg:hidden bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold">Your Order</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4 border-b border-primary/5 bg-slate-50 dark:bg-slate-800">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Select Table
          </label>
          <select
            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm"
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(e.target.value)}
            disabled={!!urlTableId}
          >
            <option value="">Takeout / No Table</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.status})
              </option>
            ))}
          </select>
        </div>

        <OrderCart
          items={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
          isSubmitting={createOrderMutation.isPending}
        />
      </div>

      {/* Floating Action Button for Mobile Cart */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-30 lg:hidden bg-primary text-white p-4 rounded-full shadow-2xl flex items-center justify-center animate-bounce hover:scale-110 active:scale-95 transition-all"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {cartItems.reduce((acc, curr) => acc + curr.qty, 0)}
            </span>
          </div>
        </button>
      )}
    </div>
  );
};

export default Orders;
