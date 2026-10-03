import React, { useState, useEffect } from "react";
import { LayoutDashboard, Users, Calendar, Activity, ClipboardList, Database, LogOut, ChefHat, Settings as SettingsIcon } from "lucide-react";
import DietBuilder from "./components/DietBuilder";
import Dashboard from "./components/Dashboard";
import Patients from "./components/Patients";
import Appointments from "./components/Appointments";
import FoodDatabase from "./components/FoodDatabase";
import Recipes from "./components/Recipes";
import Settings from "./components/Settings";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('nutriplan_darkmode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nutriplan_darkmode', darkMode);
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans p-2 md:p-3 gap-2 md:gap-3">
      {/* Sidebar - iOS Glassmorphism Style */}
      <aside className="w-24 md:w-28 bg-white/70 backdrop-blur-2xl rounded-[32px] flex flex-col shadow-sm border border-white/50 z-10 shrink-0 no-print">
        <div className="p-4 pt-6 pb-2">
          <div className="flex flex-col items-center gap-2 text-slate-800">
            <div className="bg-gradient-to-br from-primary-400 to-primary-600 p-2.5 rounded-2xl shadow-sm text-white">
              <Activity className="w-7 h-7" />
            </div>
            <h1 className="text-xs font-bold tracking-tight text-center leading-tight">Biome <span className="font-medium block text-[9px] text-slate-500">Nutrition</span></h1>
          </div>
        </div>
        
        <nav className="flex-1 px-2 space-y-2 mt-6 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => setActiveTab("dashboard")} 
            className={`w-full flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 font-medium ${activeTab === "dashboard" ? "bg-white text-primary-600 shadow-sm" : "text-slate-400 hover:bg-black/5 hover:text-slate-600"}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] text-center font-semibold">Inicio</span>
          </button>
          <button 
            onClick={() => setActiveTab("pacientes")} 
            className={`w-full flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 font-medium ${activeTab === "pacientes" ? "bg-white text-primary-600 shadow-sm" : "text-slate-400 hover:bg-black/5 hover:text-slate-600"}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] text-center font-semibold">Pacientes</span>
          </button>
          <button 
            onClick={() => setActiveTab("agenda")} 
            className={`w-full flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 font-medium ${activeTab === "agenda" ? "bg-white text-primary-600 shadow-sm" : "text-slate-400 hover:bg-black/5 hover:text-slate-600"}`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] text-center font-semibold">Agenda</span>
          </button>
          <button 
            onClick={() => setActiveTab("dietas")} 
            className={`w-full flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 font-medium ${activeTab === "dietas" ? "bg-white text-primary-600 shadow-sm" : "text-slate-400 hover:bg-black/5 hover:text-slate-600"}`}
          >
            <ClipboardList className="w-6 h-6" />
            <span className="text-[10px] text-center font-semibold">Planes</span>
          </button>
          <button 
            onClick={() => setActiveTab("recetas")} 
            className={`w-full flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 font-medium ${activeTab === "recetas" ? "bg-white text-primary-600 shadow-sm" : "text-slate-400 hover:bg-black/5 hover:text-slate-600"}`}
          >
            <ChefHat className="w-6 h-6" />
            <span className="text-[10px] text-center font-semibold">Recetas</span>
          </button>
          <button 
            onClick={() => setActiveTab("alimentos")} 
            className={`w-full flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 font-medium ${activeTab === "alimentos" ? "bg-white text-primary-600 shadow-sm" : "text-slate-400 hover:bg-black/5 hover:text-slate-600"}`}
          >
            <Database className="w-6 h-6" />
            <span className="text-[10px] text-center font-semibold">Alimentos</span>
          </button>
        </nav>

        <div className="p-2 mt-auto mb-2 border-t border-slate-200/50 mx-2 space-y-2">
          <button 
            onClick={() => setActiveTab("ajustes")} 
            className={`w-full flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 font-medium ${activeTab === "ajustes" ? "bg-white text-primary-600 shadow-sm" : "text-slate-400 hover:bg-black/5 hover:text-slate-600"}`}
          >
            <SettingsIcon className="w-6 h-6" />
            <span className="text-[10px] text-center font-semibold">Ajustes</span>
          </button>
          
          <button className="w-full flex flex-col items-center gap-1 p-3 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 font-medium">
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] text-center font-semibold">Salir</span>
          </button>
        </div>
      </aside>

      {/* Main Content - iOS Surface */}
      <main className="flex-1 relative overflow-hidden bg-white rounded-[32px] shadow-sm border border-white/50">
        <div className="absolute inset-0">
          <ErrorBoundary fallbackAction={() => setActiveTab("dashboard")}>
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "pacientes" && <Patients />}
            {activeTab === "agenda" && <Appointments />}
            {activeTab === "dietas" && <DietBuilder />}
            {activeTab === "recetas" && <Recipes />}
            {activeTab === "alimentos" && <FoodDatabase />}
            {activeTab === "ajustes" && <Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

