import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../apis/userApi";
import UpdateProfile from "../components/UpdateProfile";
import { User, Mail, Shield, Edit3, Clock, AlertCircle } from "lucide-react";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        setUserData(data?.user || data);
      } catch (err) {
        setError("Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-vault-muted flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 animate-spin text-indigo-500" />
        <span>Loading account details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const initialLetter = userData?.name ? userData.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-gradient text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-heading font-extrabold text-xl text-vault-main">
            Account Profile
          </h1>
          <p className="text-xs text-vault-muted">
            Manage your personal credentials and security identity
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient text-white font-heading font-extrabold text-2xl flex items-center justify-center shadow-md shadow-indigo-500/20">
            {initialLetter}
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-vault-main">
              {userData?.name}
            </h2>
            <p className="text-xs text-vault-muted font-mono">{userData?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Shield className="w-3 h-3" />
              <span>Zero-Trust Verified</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-vault-subtle bg-vault-primary space-y-1">
            <span className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">
              Display Name
            </span>
            <p className="text-sm font-semibold text-vault-main">{userData?.name}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-vault-subtle bg-vault-primary space-y-1">
            <span className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">
              Email Address
            </span>
            <p className="text-sm font-semibold text-vault-main font-mono truncate">
              {userData?.email}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-deep hover:opacity-95 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Update Profile Details</span>
          </button>
        </div>
      </div>

      {showModal && <UpdateProfile onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Profile;
