import React, { useState } from "react";
import { 
  User, 
  Bell, 
  ShieldCheck, 
  Globe, 
  Save, 
  Mail, 
  Lock, 
  CreditCard, 
  CheckCircle2 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface SettingsFormData {
  name: string;
  email: string;
  title: string;
  bio: string;
  pushNotifications: boolean;
  emailMarketing: boolean;
  currency: string;
  timezone: string;
  twoFactor: boolean;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("account");
  const [message, setMessage] = useState<string>("");

  const [formData, setFormData] = useState<SettingsFormData>({
    name: "John Doe",
    email: user?.username ? `${user.username.toLowerCase()}@example.com` : "john@example.com",
    title: "Senior Project Manager",
    bio: "Passionate about creating efficient client management systems and growing professional relationships.",
    pushNotifications: true,
    emailMarketing: false,
    currency: "USD",
    timezone: "UTC-5 (EST)",
    twoFactor: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Settings updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const tabs: Tab[] = [
    { id: "account", label: "My Profile", icon: <User className="w-4 h-4" /> },
    { id: "notifications", label: "Preferences", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "billing", label: "System", icon: <Globe className="w-4 h-4" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-200">
                {formData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Personal Account</h3>
                <p className="text-gray-500 text-sm">Update your photo and personal details.</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">Change Photo</button>
                  <button type="button" className="px-4 py-1.5 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors">Remove</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Job Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    value={formData.email}
                    disabled
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed outline-none font-medium"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700">Biography</label>
                <textarea 
                  rows={4}
                  value={formData.bio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none font-medium"
                />
                <p className="text-xs text-gray-400">Brief description for your profile. 250 characters max.</p>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Push Notifications</h3>
              <p className="text-gray-500 text-sm mb-4">Manage how you receive alerts in the browser.</p>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><CheckCircle2 className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Desktop Push Notifications</p>
                    <p className="text-xs text-gray-500">Receive alerts when projects are updated.</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.pushNotifications}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, pushNotifications: e.target.checked})}
                  className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Email Marketing</h3>
              <p className="text-gray-500 text-sm mb-4">Stay updated with our latest news and features.</p>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Mail className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Weekly Product Summary</p>
                    <p className="text-xs text-gray-500">Get a summary of your activity directly in your inbox.</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.emailMarketing}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, emailMarketing: e.target.checked})}
                  className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-800">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <div className="text-xs">
                <p className="font-bold mb-1">Enhance Your Account Security</p>
                <p>We recommend updating your password every 90 days to maintain optimal security for your sensitive client data.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot your password?</button>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-xs text-gray-500">Provide an extra layer of security to your account.</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${formData.twoFactor ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {formData.twoFactor ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <button type="button" className="w-full py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                Configure 2FA
              </button>
            </div>
          </div>
        );
      case "billing":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">System Currency</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    value={formData.currency}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, currency: e.target.value})}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer font-medium"
                  >
                    <option value="USD">USD - United States Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Date Format</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer font-medium"
                  >
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden group">
               <div className="relative z-10">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
                 <h3 className="text-2xl font-black mb-6">Enterprise Edition</h3>
                 <div className="flex gap-4">
                   <div className="bg-white/5 backdrop-blur-md rounded-2xl px-6 py-4 flex-1 flex flex-col justify-center border border-white/5">
                     <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Total Users</p>
                     <p className="text-xl font-black">Unmetered</p>
                   </div>
                   <div className="bg-white/5 backdrop-blur-md rounded-2xl px-6 py-4 flex-1 flex flex-col justify-center border border-white/5">
                     <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Data Retention</p>
                     <p className="text-xl font-black">Infinite</p>
                   </div>
                 </div>
               </div>
               <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 text-white/5 group-hover:text-white/10 transition-colors">
                 <ShieldCheck className="w-48 h-48" />
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 font-inter">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">System Settings</h2>
        <p className="text-gray-500 mt-2 font-medium">Manage your professional identity and workspace preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 min-h-[600px]">
        {/* Settings Nav */}
        <div className="w-full lg:w-72 border-r border-gray-50 pr-4 py-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {React.cloneElement(tab.icon as React.ReactElement<{ className?: string }>, { className: `w-5 h-5` })}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow p-4 lg:p-8 flex flex-col">
          <form className="flex-grow pb-20" onSubmit={handleSave}>
            {renderContent()}
          </form>

          {/* Footer Actions */}
          <div className="sticky bottom-0 left-0 right-0 pt-8 border-t border-gray-50 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row justify-between items-center gap-4">
            {message && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2 transition-all">
                <CheckCircle2 className="w-4 h-4" />
                {message}
              </div>
            )}
            <div className="flex gap-4 w-full sm:w-auto ml-auto">
              <button 
                type="button"
                className="flex-1 sm:flex-none px-6 py-3 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
              >
                Reset
              </button>
              <button 
                onClick={handleSave}
                type="submit"
                className="flex-1 sm:flex-none px-10 py-3.5 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
