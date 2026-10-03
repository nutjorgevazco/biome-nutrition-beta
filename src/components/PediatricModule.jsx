import React, { useMemo } from 'react';
import { Baby, Activity, Heart, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function PediatricModule({ formData, setFormData }) {
  const ageYears = parseFloat(formData.age) || 0;
  const currentWeight = parseFloat(formData.weight) || 0;
  const currentHeight = parseFloat(formData.height) || 0;
  const headCirc = parseFloat(formData.pediatric_headCircumference) || 0;

  // Calculo de percentiles aproximados de la OMS
  const pediatricEval = useMemo(() => {
    // Estimación de peso/talla ideales según fórmula estándar OMS pediátrica
    // De 1 a 10 años: Peso ideal = (Edad * 2) + 8
    // Talla ideal = (Edad * 6) + 77
    let idealWeight = 0;
    let idealHeight = 0;

    if (ageYears <= 1) {
      idealWeight = 9.5;
      idealHeight = 75;
    } else if (ageYears <= 12) {
      idealWeight = +(ageYears * 2 + 8).toFixed(1);
      idealHeight = +(ageYears * 6 + 77).toFixed(1);
    } else {
      idealWeight = +(ageYears * 2.5 + 10).toFixed(1);
      idealHeight = +(ageYears * 5 + 90).toFixed(1);
    }

    // Ratio de adecuación
    const weightAdequacy = (currentWeight > 0 && idealWeight > 0) ? Math.round((currentWeight / idealWeight) * 100) : 100;
    const heightAdequacy = (currentHeight > 0 && idealHeight > 0) ? Math.round((currentHeight / idealHeight) * 100) : 100;

    // Diagnósticos aproximados según patrones OMS
    let diagnosisPE = 'Eutrófico (Normal)';
    let colorPE = 'text-emerald-700 bg-emerald-100 border-emerald-300';
    if (weightAdequacy < 80) {
      diagnosisPE = 'Desnutrición Moderada/Severa (P/E < p3)';
      colorPE = 'text-rose-700 bg-rose-100 border-rose-300';
    } else if (weightAdequacy < 90) {
      diagnosisPE = 'Riesgo de Desnutrición (P/E p3 - p15)';
      colorPE = 'text-amber-700 bg-amber-100 border-amber-300';
    } else if (weightAdequacy > 120) {
      diagnosisPE = 'Obesidad Pediátrica (P/E > p97)';
      colorPE = 'text-rose-700 bg-rose-100 border-rose-300';
    } else if (weightAdequacy > 110) {
      diagnosisPE = 'Sobrepeso Pediátrico (P/E p85 - p97)';
      colorPE = 'text-amber-700 bg-amber-100 border-amber-300';
    }

    let diagnosisTE = 'Talla Adecuada para la Edad';
    if (heightAdequacy < 90) diagnosisTE = 'Talla Baja para la Edad (Riesgo)';

    return {
      idealWeight,
      idealHeight,
      weightAdequacy,
      heightAdequacy,
      diagnosisPE,
      colorPE,
      diagnosisTE
    };
  }, [ageYears, currentWeight, currentHeight]);

  const updateField = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="space-y-6">
      {/* Resumen Pediátrico OMS */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-500/10 via-teal-500/5 to-indigo-500/10 border border-sky-200 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-sky-200/60 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500 text-white rounded-2xl shadow-sm">
              <Baby className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-800">Evaluación del Crecimiento Infantil (OMS)</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 font-bold border border-sky-200">
                  {ageYears} años
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Percentiles de Peso para la Edad, Talla para la Edad e Hitos del Desarrollo.
              </p>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-2xl border text-xs font-black ${pediatricEval.colorPE}`}>
            {pediatricEval.diagnosisPE}
          </div>
        </div>

        {/* Tarjetas de Percentiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-sky-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Peso Ideal p50</span>
            <span className="text-2xl font-black text-slate-800">
              {pediatricEval.idealWeight} <span className="text-xs font-semibold text-slate-500">kg</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Adecuación: {pediatricEval.weightAdequacy}%</span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-sky-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Talla Ideal p50</span>
            <span className="text-2xl font-black text-slate-800">
              {pediatricEval.idealHeight} <span className="text-xs font-semibold text-slate-500">cm</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Adecuación: {pediatricEval.heightAdequacy}%</span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-sky-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Perímetro Cefálico</span>
            <span className="text-2xl font-black text-sky-600">
              {headCirc || '--'} <span className="text-xs font-semibold text-slate-500">cm</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Desarrollo neurológico</span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-sky-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Diagnóstico Talla</span>
            <span className="text-xs font-black text-slate-800 leading-tight block mt-1">
              {pediatricEval.diagnosisTE}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">Crecimiento longitudinal</span>
          </div>
        </div>
      </div>

      {/* Formulario Pediátrico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Antecedentes al Nacer */}
        <div className="card space-y-4">
          <h4 className="font-bold text-sm text-sky-700 border-b border-sky-100 pb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Somatometría Neonatal
          </h4>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Peso al Nacer (kg)
            </label>
            <input 
              type="number" 
              step="0.01" 
              placeholder="Ej: 3.25" 
              className="input-field bg-white" 
              value={formData.pediatric_birthWeight || ''} 
              onChange={e => updateField('pediatric_birthWeight', e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Talla al Nacer (cm)
            </label>
            <input 
              type="number" 
              step="0.1" 
              placeholder="Ej: 50.0" 
              className="input-field bg-white" 
              value={formData.pediatric_birthHeight || ''} 
              onChange={e => updateField('pediatric_birthHeight', e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Perímetro Cefálico Actual (cm)
            </label>
            <input 
              type="number" 
              step="0.1" 
              placeholder="Ej: 46.5" 
              className="input-field bg-white" 
              value={formData.pediatric_headCircumference || ''} 
              onChange={e => updateField('pediatric_headCircumference', e.target.value)} 
            />
          </div>
        </div>

        {/* Alimentación y Lactancia */}
        <div className="card space-y-4">
          <h4 className="font-bold text-sm text-sky-700 border-b border-sky-100 pb-2 flex items-center gap-2">
            <Heart className="w-4 h-4" /> Patrón de Alimentación
          </h4>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Tipo de Alimentación Láctea
            </label>
            <select 
              className="input-field bg-white" 
              value={formData.pediatric_milkFeeding || 'LME'} 
              onChange={e => updateField('pediatric_milkFeeding', e.target.value)}
            >
              <option value="LME">Lactancia Materna Exclusiva (LME)</option>
              <option value="FORMULA">Fórmula Infantil</option>
              <option value="MIXTA">Mixta (Seno materno + Fórmula)</option>
              <option value="LECHE_ENTERA">Leche entera de vaca (≥ 1 año)</option>
              <option value="DESTETADO">Destetado por completo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Alimentación Complementaria
            </label>
            <select 
              className="input-field bg-white" 
              value={formData.pediatric_complementaryType || 'BLW'} 
              onChange={e => updateField('pediatric_complementaryType', e.target.value)}
            >
              <option value="BLW">Baby-Led Weaning (BLW / Autorregulado)</option>
              <option value="BLISS">Método BLISS (BLW modificado)</option>
              <option value="PAPILLAS">Papillas y Purés tradicionales</option>
              <option value="MIXTO">Mixto (Triturados + Sólidos seguros)</option>
              <option value="DIETA_FAMILIAR">Integrado a dieta familiar (≥ 1 año)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Edad de Inicio de AC (Meses)
            </label>
            <input 
              type="number" 
              placeholder="Ej: 6 meses" 
              className="input-field bg-white" 
              value={formData.pediatric_acStartMonth || ''} 
              onChange={e => updateField('pediatric_acStartMonth', e.target.value)} 
            />
          </div>
        </div>

        {/* Desarrollo y Alergias */}
        <div className="card space-y-4">
          <h4 className="font-bold text-sm text-sky-700 border-b border-sky-100 pb-2 flex items-center gap-2">
            <Info className="w-4 h-4" /> Hitos del Desarrollo
          </h4>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Hitos Psicomotores Alcanzados
            </label>
            <textarea 
              className="input-field bg-white h-20 text-xs" 
              placeholder="Ej: Sedestación estable sin apoyo a los 6 meses, gateo activo a los 8 meses, primeras palabras..." 
              value={formData.pediatric_milestones || ''} 
              onChange={e => updateField('pediatric_milestones', e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Alergias o Rechazos Alimentarios
            </label>
            <input 
              type="text" 
              placeholder="Ej: Reacción a PLV (Proteína de leche), huevo..." 
              className="input-field bg-white" 
              value={formData.pediatric_allergies || formData.allergies || ''} 
              onChange={e => updateField('pediatric_allergies', e.target.value)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
