import React, { useState } from 'react';
import { Calculator, Plus, Trash2, X, Check, Sparkles, BookOpen } from 'lucide-react';

export default function CustomFormulaModal({ isOpen, onClose, currentPatient, onSaveFormula }) {
  if (!isOpen) return null;

  const [formulas, setFormulas] = useState(() => {
    const saved = localStorage.getItem('nutriplan_custom_formulas');
    return saved ? JSON.parse(saved) : [
      {
        id: 'cf_1',
        name: 'Fórmula Clínica Hospitalaria (Long)',
        coeffWeight: 11.5,
        coeffHeight: 5.0,
        coeffAge: 4.5,
        constantMale: 200,
        constantFemale: 150,
        description: 'Ecuación ajustada para pacientes ambulatorios con estrés metabólico leve.'
      }
    ];
  });

  const [form, setForm] = useState({
    name: '',
    coeffWeight: '10',
    coeffHeight: '6.25',
    coeffAge: '5',
    constantMale: '5',
    constantFemale: '-161',
    description: ''
  });

  const [error, setError] = useState('');

  const calculatePreview = (f) => {
    const w = parseFloat(currentPatient?.weight) || 70;
    const h = parseFloat(currentPatient?.height) || 170;
    const a = parseFloat(currentPatient?.age) || 30;
    const isMale = currentPatient?.gender === 'Masculino';

    const cw = parseFloat(f.coeffWeight) || 0;
    const ch = parseFloat(f.coeffHeight) || 0;
    const ca = parseFloat(f.coeffAge) || 0;
    const k = isMale ? (parseFloat(f.constantMale) || 0) : (parseFloat(f.constantFemale) || 0);

    return Math.round((cw * w) + (ch * h) - (ca * a) + k);
  };

  const handleAdd = () => {
    if (!form.name.trim()) {
      setError('El nombre de la fórmula es obligatorio.');
      return;
    }
    const newFormula = {
      id: 'cf_' + Date.now(),
      name: form.name.trim(),
      coeffWeight: parseFloat(form.coeffWeight) || 0,
      coeffHeight: parseFloat(form.coeffHeight) || 0,
      coeffAge: parseFloat(form.coeffAge) || 0,
      constantMale: parseFloat(form.constantMale) || 0,
      constantFemale: parseFloat(form.constantFemale) || 0,
      description: form.description.trim()
    };

    const updated = [...formulas, newFormula];
    setFormulas(updated);
    localStorage.setItem('nutriplan_custom_formulas', JSON.stringify(updated));
    if (onSaveFormula) onSaveFormula(newFormula);
    setForm({
      name: '',
      coeffWeight: '10',
      coeffHeight: '6.25',
      coeffAge: '5',
      constantMale: '5',
      constantFemale: '-161',
      description: ''
    });
    setError('');
  };

  const handleDelete = (id) => {
    const updated = formulas.filter(f => f.id !== id);
    setFormulas(updated);
    localStorage.setItem('nutriplan_custom_formulas', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Constructor de Ecuaciones Metabólicas</h3>
              <p className="text-xs text-slate-500">Crea tus propias fórmulas matemáticas personalizadas de GEB.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Ecuación General Explicada */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-900 text-xs space-y-1">
            <span className="font-bold uppercase tracking-wider block text-amber-800">Estructura de la Ecuación Lineal</span>
            <p className="font-mono text-xs bg-white/80 p-2 rounded-lg border border-amber-200 inline-block">
              GEB (kcal) = (A × Peso_kg) + (B × Talla_cm) - (C × Edad) + Constante(H/M)
            </p>
          </div>

          {/* Formulario de Nueva Fórmula */}
          <div className="space-y-4 border border-slate-200 p-4 rounded-2xl bg-slate-50/50">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Nueva Ecuación Personalizada
            </h4>

            {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nombre de la Ecuación</label>
              <input
                type="text"
                className="input-field bg-white"
                placeholder="Ej. Fórmula Deportiva Biome V1"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Coef. Peso (A)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field bg-white"
                  value={form.coeffWeight}
                  onChange={e => setForm({...form, coeffWeight: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Coef. Talla (B)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field bg-white"
                  value={form.coeffHeight}
                  onChange={e => setForm({...form, coeffHeight: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Coef. Edad (C)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field bg-white"
                  value={form.coeffAge}
                  onChange={e => setForm({...form, coeffAge: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">K Masculino</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field bg-white"
                  value={form.constantMale}
                  onChange={e => setForm({...form, constantMale: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">K Femenino</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field bg-white"
                  value={form.constantFemale}
                  onChange={e => setForm({...form, constantFemale: e.target.value})}
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Guardar Fórmula
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Fórmulas Guardadas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tus Fórmulas Guardadas ({formulas.length})
            </h4>

            {formulas.map(f => (
              <div key={f.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition-colors flex justify-between items-center">
                <div>
                  <h5 className="font-bold text-sm text-slate-800">{f.name}</h5>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    ({f.coeffWeight}×P) + ({f.coeffHeight}×T) - ({f.coeffAge}×E) + {f.constantMale}M / {f.constantFemale}F
                  </p>
                  <p className="text-[11px] text-amber-700 font-semibold mt-1">
                    Cálculo para {currentPatient?.name || 'paciente actual'}: <strong>{calculatePreview(f)} kcal/día</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSaveFormula) onSaveFormula(f);
                      onClose();
                    }}
                    className="btn-secondary py-1.5 px-3 text-xs text-amber-700 hover:bg-amber-50"
                  >
                    Usar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(f.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
