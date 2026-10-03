import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileSpreadsheet, Plus, Trash2, Search, Download, AlertCircle, CheckCircle2, Edit, X, Save } from 'lucide-react';
import * as XLSX from 'xlsx';
import smaeDefault from '../data/smae.json';

export default function FoodDatabase() {
  const [foods, setFoods] = useState(() => {
    const saved = localStorage.getItem('nutriplan_foods');
    return saved ? JSON.parse(saved) : smaeDefault;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('Todos');
  const [importLog, setImportLog] = useState(null); // { success: N, errors: [...] }
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', group: 'Verduras', subgroup: '', qty: '', unit: '', kcal: 0, prot: 0, carb: 0, fat: 0, fiber: 0, image_url: '' });
  
  const getFoodEmoji = (group) => {
    const emojis = {
      'Verduras': '🥦',
      'Frutas': '🍎',
      'Cereales': '🍞',
      'Leguminosas': '🫘',
      'AOA': '🥩',
      'Leche': '🥛',
      'Grasas': '🥑',
      'Azúcares': '🍯',
      'Libre de Energía': '☕',
      'Bebidas': '🥤'
    };
    return emojis[group] || '🍽️';
  };
  
  const fileInputRef = useRef(null);

  const GROUPS = ['Todos', ...new Set(foods.map(f => f.group))];

  useEffect(() => {
    localStorage.setItem('nutriplan_foods', JSON.stringify(foods));
  }, [foods]);

  // ─── IMPORTAR EXCEL ───
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet);

        let successCount = 0;
        const errors = [];
        const newFoods = [];

        rawData.forEach((row, idx) => {
          // Map common column names (Spanish & English)
          const name = row['Nombre'] || row['nombre'] || row['name'] || row['ALIMENTO'] || row['Alimento'] || '';
          const group = row['Grupo'] || row['grupo'] || row['group'] || row['GRUPO'] || '';
          const subgroup = row['Subgrupo'] || row['subgrupo'] || row['subgroup'] || '';
          const qty = row['Porción'] || row['porcion'] || row['Porcion'] || row['qty'] || row['Cantidad'] || row['cantidad'] || '';
          const unit = row['Unidad'] || row['unidad'] || row['unit'] || '';
          const kcal = parseFloat(row['Kcal'] || row['kcal'] || row['Calorías'] || row['calorias'] || row['Energia'] || row['energia'] || 0);
          const prot = parseFloat(row['Proteína'] || row['proteina'] || row['Prot'] || row['prot'] || row['Proteinas'] || 0);
          const carb = parseFloat(row['Carbohidratos'] || row['carbohidratos'] || row['Carb'] || row['carb'] || row['HCO'] || row['Hidratos'] || 0);
          const fat = parseFloat(row['Grasa'] || row['grasa'] || row['Lípidos'] || row['lipidos'] || row['fat'] || row['Grasas'] || 0);
          const fiber = parseFloat(row['Fibra'] || row['fibra'] || row['fiber'] || 0);

          if (!name || name.trim() === '') {
            errors.push(`Fila ${idx + 2}: Sin nombre de alimento`);
            return;
          }
          if (!group || group.trim() === '') {
            errors.push(`Fila ${idx + 2} (${name}): Sin grupo alimenticio`);
            return;
          }
          if (isNaN(kcal) || kcal < 0) {
            errors.push(`Fila ${idx + 2} (${name}): Kcal inválidas`);
            return;
          }

          newFoods.push({
            id: 'imp_' + Date.now() + '_' + idx,
            name: name.trim(),
            group: group.trim(),
            subgroup: subgroup ? subgroup.trim() : '',
            qty: String(qty).trim(),
            unit: unit ? unit.trim() : '',
            kcal: kcal || 0,
            prot: prot || 0,
            carb: carb || 0,
            fat: fat || 0,
            fiber: fiber || 0
          });
          successCount++;
        });

        if (newFoods.length > 0) {
          setFoods(prev => [...prev, ...newFoods]);
        }
        setImportLog({ success: successCount, total: rawData.length, errors });

      } catch (err) {
        setImportLog({ success: 0, total: 0, errors: [`Error al leer archivo: ${err.message}`] });
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // Reset
  };

  // ─── EXPORTAR EXCEL ───
  const handleExport = () => {
    const exportData = foods.map(f => ({
      Nombre: f.name,
      Grupo: f.group,
      Subgrupo: f.subgroup || '',
      Porción: f.qty,
      Unidad: f.unit || '',
      Kcal: f.kcal,
      Proteína: f.prot,
      Carbohidratos: f.carb,
      Grasa: f.fat,
      Fibra: f.fiber || 0
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alimentos SMAE');
    XLSX.writeFile(wb, 'NutriPlanPro_Alimentos.xlsx');
  };

  // ─── DESCARGAR PLANTILLA ───
  const handleDownloadTemplate = () => {
    const template = [
      { Nombre: 'Ejemplo: Tortilla de maíz', Grupo: 'Cereales', Subgrupo: 'Sin grasa', 'Porción': '1 pieza', Unidad: '30g', Kcal: 70, 'Proteína': 2, Carbohidratos: 15, Grasa: 0, Fibra: 2 },
      { Nombre: 'Ejemplo: Pechuga de pollo', Grupo: 'AOA', Subgrupo: 'Muy bajo en grasa', 'Porción': '30g', Unidad: '', Kcal: 40, 'Proteína': 7, Carbohidratos: 0, Grasa: 1, Fibra: 0 },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
    XLSX.writeFile(wb, 'Plantilla_Alimentos_SMAE.xlsx');
  };

  // ─── CRUD ───
  const handleAddFood = () => {
    if (!formData.name.trim()) return;
    const newFood = { ...formData, id: 'custom_' + Date.now(), kcal: Number(formData.kcal), prot: Number(formData.prot), carb: Number(formData.carb), fat: Number(formData.fat), fiber: Number(formData.fiber) };
    setFoods(prev => [...prev, newFood]);
    setFormData({ name: '', group: 'Verduras', subgroup: '', qty: '', unit: '', kcal: 0, prot: 0, carb: 0, fat: 0, fiber: 0, image_url: '' });
    setShowAddForm(false);
  };

  const handleEditSave = () => {
    setFoods(prev => prev.map(f => f.id === editId ? { ...formData, id: editId, kcal: Number(formData.kcal), prot: Number(formData.prot), carb: Number(formData.carb), fat: Number(formData.fat), fiber: Number(formData.fiber) } : f));
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este alimento de la base de datos?')) {
      setFoods(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('¿Restaurar a los alimentos predeterminados? Se perderán los alimentos importados y personalizados.')) {
      setFoods(smaeDefault);
      setImportLog(null);
    }
  };

  // ─── FILTRO ───
  const filtered = foods.filter(f => {
    const matchGroup = filterGroup === 'Todos' || f.group === filterGroup;
    const matchSearch = !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()) || (f.subgroup && f.subgroup.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchGroup && matchSearch;
  });

  return (
    <div className="p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Base de Datos de Alimentos</h2>
          <p className="text-sm text-slate-500 mt-1">{foods.length} alimentos registrados • Basado en el SMAE</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDownloadTemplate} className="btn-secondary text-sm">
            <Download className="w-4 h-4 mr-1"/> Descargar Plantilla Excel
          </button>
          <button onClick={handleExport} className="btn-secondary text-sm">
            <FileSpreadsheet className="w-4 h-4 mr-1"/> Exportar Todo
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-primary text-sm">
            <Upload className="w-4 h-4 mr-1"/> Importar Excel
          </button>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
        </div>
      </div>

      {/* Import Log */}
      {importLog && (
        <div className={`mb-6 p-4 rounded-xl border ${importLog.errors.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            {importLog.errors.length > 0 ? <AlertCircle className="w-5 h-5 text-amber-600" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            <span className="font-bold text-slate-800">Importación: {importLog.success} de {importLog.total} alimentos cargados correctamente</span>
            <button onClick={() => setImportLog(null)} className="ml-auto text-slate-400 hover:text-slate-600"><X className="w-4 h-4"/></button>
          </div>
          {importLog.errors.length > 0 && (
            <div className="text-sm text-amber-700 max-h-32 overflow-y-auto">
              {importLog.errors.map((err, i) => <p key={i}>• {err}</p>)}
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input type="text" placeholder="Buscar alimento..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div className="flex flex-wrap gap-1">
          {GROUPS.map(g => (
            <button key={g} onClick={() => setFilterGroup(g)} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${filterGroup === g ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{g}</button>
          ))}
        </div>
        <button onClick={() => { setShowAddForm(true); setEditId(null); setFormData({ name: '', group: 'Verduras', subgroup: '', qty: '', unit: '', kcal: 0, prot: 0, carb: 0, fat: 0, fiber: 0, image_url: '' }); }} className="btn-primary text-sm shrink-0">
          <Plus className="w-4 h-4 mr-1"/> Nuevo Alimento
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editId) && (
        <div className="card mb-6 border-2 border-primary-200 bg-primary-50/30">
          <h3 className="font-bold text-primary-700 mb-4">{editId ? 'Editar Alimento' : 'Agregar Nuevo Alimento'}</h3>
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-2"><label className="block text-xs text-slate-500 mb-1">Nombre</label><input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Grupo</label><input type="text" className="input-field" value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Subgrupo</label><input type="text" className="input-field" value={formData.subgroup} onChange={e => setFormData({...formData, subgroup: e.target.value})} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Porción</label><input type="text" className="input-field" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Unidad</label><input type="text" className="input-field" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Kcal</label><input type="number" className="input-field" value={formData.kcal} onChange={e => setFormData({...formData, kcal: e.target.value})} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Proteína (g)</label><input type="number" className="input-field" value={formData.prot} onChange={e => setFormData({...formData, prot: e.target.value})} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Carbohidratos (g)</label><input type="number" className="input-field" value={formData.carb} onChange={e => setFormData({...formData, carb: e.target.value})} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Grasa (g)</label><input type="number" className="input-field" value={formData.fat} onChange={e => setFormData({...formData, fat: e.target.value})} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Fibra (g)</label><input type="number" className="input-field" value={formData.fiber} onChange={e => setFormData({...formData, fiber: e.target.value})} /></div>
            <div className="col-span-4"><label className="block text-xs text-slate-500 mb-1">URL de Imagen (Opcional)</label><input type="text" className="input-field" placeholder="https://ejemplo.com/imagen.jpg" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} /></div>
            <div className="flex items-end gap-2 col-span-2">
              <button onClick={editId ? handleEditSave : handleAddFood} className="btn-primary text-sm w-full justify-center"><Save className="w-4 h-4 mr-1"/> {editId ? 'Actualizar' : 'Agregar'}</button>
              <button onClick={() => { setShowAddForm(false); setEditId(null); }} className="btn-secondary text-sm w-full justify-center">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-8 gap-2 mb-6">
        {['Verduras','Frutas','Cereales','Leguminosas','AOA','Leche','Grasas','Azúcares'].map(g => {
          const count = foods.filter(f => f.group === g).length;
          return (
            <div key={g} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-primary-700">{count}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">{g}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-3 font-semibold text-slate-600">Alimento</th>
              <th className="text-left p-3 font-semibold text-slate-600">Grupo</th>
              <th className="text-left p-3 font-semibold text-slate-600">Porción</th>
              <th className="text-center p-3 font-semibold text-slate-600">Kcal</th>
              <th className="text-center p-3 font-semibold text-slate-600">Prot</th>
              <th className="text-center p-3 font-semibold text-slate-600">Carb</th>
              <th className="text-center p-3 font-semibold text-slate-600">Grasa</th>
              <th className="text-center p-3 font-semibold text-slate-600">Fibra</th>
              <th className="text-center p-3 font-semibold text-slate-600 w-20">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map(food => (
              <tr key={food.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {food.image_url ? (
                      <img src={food.image_url} alt={food.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-xl shadow-sm">
                        {getFoodEmoji(food.group)}
                      </div>
                    )}
                    <span className="font-medium text-slate-800">{food.name}</span>
                  </div>
                </td>
                <td className="p-3"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{food.subgroup || food.group}</span></td>
                <td className="p-3 text-slate-600">{food.qty} {food.unit || ''}</td>
                <td className="p-3 text-center font-semibold text-amber-600">{food.kcal}</td>
                <td className="p-3 text-center text-slate-600">{food.prot}g</td>
                <td className="p-3 text-center text-slate-600">{food.carb}g</td>
                <td className="p-3 text-center text-slate-600">{food.fat}g</td>
                <td className="p-3 text-center text-slate-600">{food.fiber || 0}g</td>
                <td className="p-3 text-center">
                  <div className="flex gap-1 justify-center">
                    <button onClick={() => { setEditId(food.id); setFormData(food); setShowAddForm(false); }} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Edit className="w-3.5 h-3.5"/></button>
                    <button onClick={() => handleDelete(food.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 100 && <p className="text-center text-sm text-slate-400 py-3">Mostrando 100 de {filtered.length} resultados. Usa el buscador para refinar.</p>}
        {filtered.length === 0 && <p className="text-center text-sm text-slate-400 py-10">No se encontraron alimentos.</p>}
      </div>

      <div className="mt-6 text-right">
        <button onClick={handleResetToDefault} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Restaurar base de datos predeterminada</button>
      </div>
    </div>
  );
}
