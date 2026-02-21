import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStaff, createStaff, deleteStaff, getRoles } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, User, Shield, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import TeamManageModel from "../components/Teams/TeamManageModel";

const Team = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: "",
  });

  const {
    data: staffResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: () => getStaff({ limit: 100 }),
    enabled: user?.Role?.name === "OWNER" || user?.Role?.name === "SUPER_ADMIN",
  });

  const { data: rolesResponse } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    enabled: isModalOpen,
  });

  const createMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: (response) => {
      toast.success("Team member added! Verification email sent.");
      setIsModalOpen(false);
      const emailForOtp = formData.email;
      setFormData({ full_name: "", email: "", password: "", role_id: "" });
      queryClient.invalidateQueries(["staff"]);
      navigate("/verify-otp", { state: { email: emailForOtp } });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add team member");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      toast.success("Team member removed");
      queryClient.invalidateQueries(["staff"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove member");
    },
  });

  const staffList = staffResponse?.data?.users || [];
  const roles = rolesResponse?.data || [];

  const filteredStaff = staffList.filter((member) => {
    const fullName = member?.full_name?.toLowerCase() || "";
    const email = member?.email?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to deactivate this team member?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Only Owner and Super Admin can manage team
  if (user?.Role.name !== "OWNER" && user?.Role.name !== "SUPER_ADMIN") {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 md:px-8 py-6 md:py-8 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
            <UsersIcon className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 dark:text-white truncate">
            Team Management
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-none bg-white dark:bg-slate-800 shadow-sm focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform whitespace-nowrap active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <main className="flex-1 px-4 md:px-8 pb-20 max-w-[1600px] mx-auto w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-primary/10 shadow-sm animate-pulse"
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 mb-4"></div>
                  <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                  <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-10 text-center border border-red-200 dark:border-red-800">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-400">
              Error loading team
            </h3>
            <p className="text-red-600 dark:text-red-300">
              Please try again later.
            </p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-10 text-center border border-primary/5">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {searchQuery ? "No matches found" : "No Team Members Found"}
            </h3>
            <p className="text-slate-500 text-sm">
              {searchQuery
                ? `We couldn't find anyone matching "${searchQuery}"`
                : "Add waiters and cashiers to manage your restaurant."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-primary/5 shadow-sm hover:shadow-md transition-shadow relative group relative"
              >
                {!member.is_active && (
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md uppercase">
                      Inactive
                    </span>
                  </div>
                )}

                {member.id !== user?.id && (
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-4">
                    {member.full_name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {member.full_name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">{member.email}</p>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Shield className="w-3.5 h-3.5" />
                    {member.Role?.name || "Unknown"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Member Modal */}
      {isModalOpen && (
        <TeamManageModel
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          formData={formData}
          setFormData={setFormData}
          createMutation={createMutation}
          roles={roles}
        />
      )}
    </div>
  );
};

// Quick helper to fix icon naming collision with lucide-react Users vs my inline UsersIcon
const UsersIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default Team;
