import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Image as ImageIcon, Trash2, Plus, Save, Phone, Palette, Camera, Globe, Mail, Moon, Sun } from 'lucide-react';

export default function Settings({ darkMode, setDarkMode }) {
  const [clinicSettings, setClinicSettings] = useState(() => {
    return JSON.parse(localStorage.getItem('nutriplan_clinic') || '{"name":"","phone":"","address":"","color":"#0f172a","logo":null,"instagram":"","facebook":"","email":""}');
  });

  const [supplements, setSupplements] = useState(() => {
    return JSON.parse(localStorage.getItem('nutriplan_supplements') || '[]');
  });

  const [newSupp, setNewSupp] = useState({ name: '', brand: '', dose: '' });

  useEffect(() => {
    localStorage.setItem('nutriplan_clinic', JSON.stringify(clinicSettings));
    
    // Inject dynamic CSS variable for primary color if desired, though we'll mainly use it in the PDF
    document.documentElement.style.setProperty('--pdf-primary', clinicSettings.color || '#0f172a');
  }, [clinicSettings]);

  useEffect(() => {
    localStorage.setItem('nutriplan_supplements', JSON.stringify(supplements));
  }, [supplements]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClinicSettings(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSupp = () => {
    if (!newSupp.name) return;
    setSupplements([...supplements, { ...newSupp, id: Date.now().toString() }]);
    setNewSupp({ name: '', brand: '', dose: '' });
  };

  const removeSupp = (id) => {
    setSupplements(supplements.filter(s => s.id !== id));
  };

  const PRESET_COLORS = [
    '#0f172a', // Slate (Default)
    '#0284c7', // Sky Blue
    '#059669', // Emerald
    '#7c3aed', // Violet
    '#e11d48', // Rose
    '#d97706', // Amber
  ];

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary-600" />
          Ajustes del Consultorio
        </h2>
        <p className="text-slate-500 mt-1">Personaliza el branding de tus reportes PDF y administra tu catálogo de suplementos.</p>
      </div>

      {/* DARK MODE TOGGLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl transition-colors duration-300 ${
              darkMode ? 'bg-slate-700' : 'bg-amber-100'
            }`}>
              {darkMode ? (
                <Moon className="w-6 h-6 text-blue-300" />
              ) : (
                <Sun className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Modo Oscuro</h3>
              <p className="text-sm text-slate-500">
                {darkMode ? 'El tema oscuro está activado. Más cómodo para la vista en entornos con poca luz.' : 'Cambia al tema oscuro para reducir la fatiga visual.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 ${
              darkMode ? 'bg-primary-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                darkMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CLINIC BRANDING */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-slate-800 p-4 text-white">
            <h3 className="font-bold tracking-wide">Personalización del Reporte (PDF)</h3>
          </div>
          <div className="p-6 space-y-6">
            
            {/* Logo */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Logo de la Clínica</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 relative group">
                  {clinicSettings.logo ? (
                    <>
                      <img src={clinicSettings.logo} alt="Logo" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <Trash2 className="w-6 h-6 text-white" onClick={() => setClinicSettings(prev => ({...prev, logo: null}))} />
                      </div>
                    </>
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                {!clinicSettings.logo && (
                  <div>
                    <label className="btn-secondary cursor-pointer inline-flex">
                      <span>Subir Imagen</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    <p className="text-xs text-slate-400 mt-2">Formatos recomendados: PNG, JPG.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre Comercial</label>
                <input type="text" className="input-field" placeholder="Ej. NutriCenter" 
                  value={clinicSettings.name} onChange={e => setClinicSettings({...clinicSettings, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Teléfono / WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input type="text" className="input-field pl-9" placeholder="Para agendar citas" 
                    value={clinicSettings.phone} onChange={e => setClinicSettings({...clinicSettings, phone: e.target.value})} 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Instagram</label>
                <div className="relative">
                  <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input type="text" className="input-field pl-9" placeholder="@tu.cuenta" 
                    value={clinicSettings.instagram} onChange={e => setClinicSettings({...clinicSettings, instagram: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Facebook</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input type="text" className="input-field pl-9" placeholder="/tu.pagina" 
                    value={clinicSettings.facebook} onChange={e => setClinicSettings({...clinicSettings, facebook: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input type="email" className="input-field pl-9" placeholder="contacto@clinica.com" 
                    value={clinicSettings.email} onChange={e => setClinicSettings({...clinicSettings, email: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dirección Física</label>
                <input type="text" className="input-field" placeholder="Ej. Consultorio 101, Centro Médico" 
                  value={clinicSettings.address} onChange={e => setClinicSettings({...clinicSettings, address: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Color del PDF</label>
              <div className="flex gap-2">
                {PRESET_COLORS.map(color => (
                  <button 
                    key={color} 
                    onClick={() => setClinicSettings({...clinicSettings, color})}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${clinicSettings.color === color ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* SUPPLEMENTS CATALOG */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="bg-slate-800 p-4 text-white">
            <h3 className="font-bold tracking-wide">Catálogo de Suplementos</h3>
          </div>
          
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <h4 className="text-sm font-bold text-slate-700 mb-3">Agregar Nuevo Suplemento</h4>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-5">
                <input type="text" placeholder="Suplemento (Ej. Proteína)" className="input-field py-2 text-sm" value={newSupp.name} onChange={e => setNewSupp({...newSupp, name: e.target.value})} />
              </div>
              <div className="col-span-4">
                <input type="text" placeholder="Marca (Opcional)" className="input-field py-2 text-sm" value={newSupp.brand} onChange={e => setNewSupp({...newSupp, brand: e.target.value})} />
              </div>
              <div className="col-span-3">
                <button onClick={handleAddSupp} className="btn-primary w-full py-2 flex justify-center text-sm"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="col-span-12">
                <input type="text" placeholder="Dosis Sugerida / Instrucciones (Ej. 1 scoop post-entreno)" className="input-field py-2 text-sm" value={newSupp.dose} onChange={e => setNewSupp({...newSupp, dose: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {supplements.length === 0 ? (
              <div className="text-center text-slate-400 mt-10">
                <p>No tienes suplementos en tu catálogo.</p>
                <p className="text-sm mt-1">Añade los que más recetas para asignarlos rápido a tus pacientes.</p>
              </div>
            ) : (
              supplements.map(supp => (
                <div key={supp.id} className="flex justify-between items-center p-3 border border-slate-200 rounded-xl bg-white hover:border-primary-300 transition-colors">
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">{supp.name} <span className="text-slate-400 font-normal ml-2">{supp.brand}</span></h5>
                    <p className="text-xs text-slate-500 mt-0.5">{supp.dose || 'Sin dosis específica por defecto'}</p>
                  </div>
                  <button onClick={() => removeSupp(supp.id)} className="text-slate-300 hover:text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
