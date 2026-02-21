import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function TeamManageModel({
  setIsModalOpen,
  formData,
  setFormData,
  createMutation,
  roles,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-primary/10">
        <div className="p-6 border-b border-primary/10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Add Team Member
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email / Username
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="john@tastybytes.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-3 pr-12 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {passwordVisible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Role
            </label>
            <select
              required
              value={formData.role_id}
              onChange={(e) =>
                setFormData({ ...formData, role_id: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="" disabled>
                Select a role...
              </option>
              {roles.map(
                (role) =>
                  // Hide SUPER_ADMIN from the owner's view
                  role.name !== "SUPER_ADMIN" && (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ),
              )}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || !formData.role_id}
              className="px-5 py-2 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                "Add Member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeamManageModel;
