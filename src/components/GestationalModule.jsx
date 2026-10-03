import React, { useMemo } from 'react';
import { Baby, Calendar, Scale, AlertTriangle, CheckCircle, Heart, Activity, Info } from 'lucide-react';

export default function GestationalModule({ formData, setFormData }) {
  // Calculos automaticos de gestacion
  const gestationalCalc = useMemo(() => {
    const fum = formData.gestational_fum;
    const preWeight = parseFloat(formData.gestational_preWeight) || 0;
    const currentWeight = parseFloat(formData.weight) || 0;
    const height = parseFloat(formData.height) || 0;
    const isTwin = formData.gestational_type === 'GEMELAR';

    let weeks = parseFloat(formData.gestational_weeks) || 0;
    let days = 0;
    let fpp = '';
    let trimester = 1;

    if (fum) {
      const fumDate = new Date(fum);
      const today = new Date();
      if (!isNaN(fumDate.getTime())) {
        const diffTime = today.getTime() - fumDate.getTime();
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (totalDays > 0) {
          weeks = Math.floor(totalDays / 7);
          days = totalDays % 7;
        }

        // Regla de Naegele para FPP (FUM + 7 días - 3 meses + 1 año)
        const fppDate = new Date(fumDate);
        fppDate.setDate(fppDate.getDate() + 7);
        fppDate.setMonth(fppDate.getMonth() + 9); // equivalente a -3 meses + 1 año
        fpp = fppDate.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
      }
    }

    if (weeks <= 13) trimester = 1;
    else if (weeks <= 27) trimester = 2;
    else trimester = 3;

    // IMC pregestacional
    let preImc = 0;
    let imcCategory = 'Normal';
    let targetMinGain = 11.5;
    let targetMaxGain = 16.0;
    let weeklyRate = 0.42; // kg/sem en 2do y 3er trimestre

    if (preWeight > 0 && height > 0) {
      preImc = +(preWeight / Math.pow(height / 100, 2)).toFixed(1);
      
      if (!isTwin) {
        if (preImc < 18.5) {
          imcCategory = 'Bajo Peso';
          targetMinGain = 12.5;
          targetMaxGain = 18.0;
          weeklyRate = 0.51;
        } else if (preImc <= 24.9) {
          imcCategory = 'Normal';
          targetMinGain = 11.5;
          targetMaxGain = 16.0;
          weeklyRate = 0.42;
        } else if (preImc <= 29.9) {
          imcCategory = 'Sobrepeso';
          targetMinGain = 7.0;
          targetMaxGain = 11.5;
          weeklyRate = 0.28;
        } else {
          imcCategory = 'Obesidad';
          targetMinGain = 5.0;
          targetMaxGain = 9.0;
          weeklyRate = 0.22;
        }
      } else {
        // Embarazo Gemelar
        if (preImc < 25) {
          targetMinGain = 17.0;
          targetMaxGain = 25.0;
        } else if (preImc < 30) {
          targetMinGain = 14.0;
          targetMaxGain = 23.0;
        } else {
          targetMinGain = 11.0;
          targetMaxGain = 19.0;
        }
      }
    }

    // Ganancia actual
    const actualGain = (currentWeight > 0 && preWeight > 0) ? +(currentWeight - preWeight).toFixed(1) : 0;

    // Ganancia esperada según la semana actual (IOM)
    let expectedGainMin = 0;
    let expectedGainMax = 0;

    if (weeks <= 13) {
      // 1er trimestre: ganancia total esperada entre 0.5 y 2.0 kg
      const factor = Math.min(weeks / 13, 1);
      expectedGainMin = +(0.5 * factor).toFixed(1);
      expectedGainMax = +(2.0 * factor).toFixed(1);
    } else {
      // Semanas posteriores: 1.25 kg del 1er trimestre + tasa semanal
      const weeksOver13 = weeks - 13;
      expectedGainMin = +(1.0 + (weeklyRate * 0.8 * weeksOver13)).toFixed(1);
      expectedGainMax = +(2.0 + (weeklyRate * 1.2 * weeksOver13)).toFixed(1);
    }

    let status = 'Dentro del rango esperado';
    let statusColor = 'text-emerald-700 bg-emerald-100 border-emerald-300';
    if (actualGain < expectedGainMin && weeks > 8) {
      status = 'Por debajo de la ganancia recomendada';
      statusColor = 'text-amber-700 bg-amber-100 border-amber-300';
    } else if (actualGain > expectedGainMax) {
      status = 'Por encima de la ganancia recomendada';
      statusColor = 'text-rose-700 bg-rose-100 border-rose-300';
    }

    return {
      weeks,
      days,
      fpp,
      trimester,
      preImc,
      imcCategory,
      targetMinGain,
      targetMaxGain,
      actualGain,
      expectedGainMin,
      expectedGainMax,
      status,
      statusColor
    };
  }, [formData.gestational_fum, formData.gestational_weeks, formData.gestational_preWeight, formData.weight, formData.height, formData.gestational_type]);

  const updateField = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta de Resumen Clínico Gestacional */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 border border-pink-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-pink-200/60 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-500 text-white rounded-2xl shadow-sm">
              <Baby className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-800">Control Nutricional Prenatal</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold border border-pink-200">
                  {gestationalCalc.trimester}° Trimestre
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Monitoreo ponderal y metabólico materno-fetal según pautas internacionales IOM / FIGO.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl border border-pink-200 shadow-2xs">
            <Calendar className="w-4 h-4 text-pink-600" />
            <span className="text-xs font-semibold text-slate-600">FPP Estimada:</span>
            <span className="text-xs font-black text-pink-700">{gestationalCalc.fpp || 'Ingresa FUM'}</span>
          </div>
        </div>

        {/* Métrica Dinámica de Ganancia de Peso IOM */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-pink-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Edad Gestacional</span>
            <span className="text-2xl font-black text-slate-800">
              {gestationalCalc.weeks} <span className="text-sm font-semibold text-pink-600">sem</span> {gestationalCalc.days > 0 && <span className="text-xs text-slate-400">+{gestationalCalc.days}d</span>}
            </span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-pink-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">IMC Pregestacional</span>
            <span className="text-2xl font-black text-slate-800">
              {gestationalCalc.preImc || '--'} <span className="text-xs font-semibold text-slate-500">({gestationalCalc.imcCategory})</span>
            </span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-pink-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Ganancia Actual</span>
            <span className={`text-2xl font-black ${gestationalCalc.actualGain >= 0 ? 'text-pink-600' : 'text-slate-700'}`}>
              {gestationalCalc.actualGain > 0 ? `+${gestationalCalc.actualGain}` : gestationalCalc.actualGain} <span className="text-sm font-semibold">kg</span>
            </span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-pink-100 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Meta Total (IOM)</span>
            <span className="text-2xl font-black text-emerald-600">
              {gestationalCalc.targetMinGain} - {gestationalCalc.targetMaxGain} <span className="text-sm font-semibold">kg</span>
            </span>
          </div>
        </div>

        {/* Diagnóstico de Ganancia Ponderal */}
        <div className={`mt-4 p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${gestationalCalc.statusColor}`}>
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 shrink-0" />
            <span>Estado Ponderal a la semana {gestationalCalc.weeks}: <strong>{gestationalCalc.status}</strong></span>
          </div>
          <span className="text-[11px] opacity-90">
            Rango esperado hoy: {gestationalCalc.expectedGainMin} a {gestationalCalc.expectedGainMax} kg
          </span>
        </div>
      </div>

      {/* Formulario de Parámetros Gestacionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna 1: Fechas y Antropometría Pregestacional */}
        <div className="card space-y-4">
          <h4 className="font-bold text-sm text-pink-700 border-b border-pink-100 pb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Datos de Inicio y Embarazo
          </h4>
          
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Fecha de Última Menstruación (FUM)
            </label>
            <input 
              type="date" 
              className="input-field bg-white" 
              value={formData.gestational_fum || ''} 
              onChange={e => updateField('gestational_fum', e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Peso Pregestacional Habitual (kg)
            </label>
            <input 
              type="number" 
              step="0.1" 
              placeholder="Ej. 62.5" 
              className="input-field bg-white" 
              value={formData.gestational_preWeight || ''} 
              onChange={e => updateField('gestational_preWeight', e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Tipo de Embarazo
            </label>
            <select 
              className="input-field bg-white" 
              value={formData.gestational_type || 'UNICO'} 
              onChange={e => updateField('gestational_type', e.target.value)}
            >
              <option value="UNICO">Único</option>
              <option value="GEMELAR">Gemelar / Múltiple</option>
            </select>
          </div>
        </div>

        {/* Columna 2: Monitoreo Clínico y Bioquímico Frecuente */}
        <div className="card space-y-4">
          <h4 className="font-bold text-sm text-pink-700 border-b border-pink-100 pb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Signos y Tamizajes Clave
          </h4>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Presión Arterial (T/A actual)
            </label>
            <input 
              type="text" 
              placeholder="Ej: 110/70 mmHg" 
              className="input-field bg-white" 
              value={formData.gestational_bp || formData.bloodPressure || ''} 
              onChange={e => updateField('gestational_bp', e.target.value)} 
            />
            <p className="text-[10px] text-slate-400 mt-0.5">Control de prevención para preeclampsia.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Tamiz Glucosa / Curva CTGO (mg/dL)
            </label>
            <input 
              type="number" 
              placeholder="Ej: 125 mg/dL (Sem 24-28)" 
              className="input-field bg-white" 
              value={formData.gestational_glucose || ''} 
              onChange={e => updateField('gestational_glucose', e.target.value)} 
            />
            <p className="text-[10px] text-slate-400 mt-0.5">Tamizaje de Diabetes Mellitus Gestacional.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Edema en Miembros Inferiores
            </label>
            <select 
              className="input-field bg-white" 
              value={formData.gestational_edema || 'Ausente'} 
              onChange={e => updateField('gestational_edema', e.target.value)}
            >
              <option value="Ausente">Ausente (Sin edema)</option>
              <option value="Leve (+)">Leve (+) Maleolar vespertino</option>
              <option value="Moderado (++)">Moderado (++) Hasta rodillas</option>
              <option value="Severo (+++)">Severo (+++) Generalizado / Manos y cara</option>
            </select>
          </div>
        </div>

        {/* Columna 3: Suplementación y Notas Obstétricas */}
        <div className="card space-y-4">
          <h4 className="font-bold text-sm text-pink-700 border-b border-pink-100 pb-2 flex items-center gap-2">
            <Heart className="w-4 h-4" /> Suplementación Prenatal
          </h4>

          <div className="space-y-2">
            {[
              { id: 'folic', label: 'Ácido Fólico (400-800 µg/d)' },
              { id: 'iron', label: 'Hierro Elemental (30-60 mg/d)' },
              { id: 'calcium', label: 'Calcio (1000-1200 mg/d)' },
              { id: 'dha', label: 'Omega-3 / DHA (200-300 mg/d)' },
              { id: 'vitd', label: 'Vitamina D3 (600-1000 UI/d)' }
            ].map(supp => {
              const checked = formData.gestational_supplements?.includes(supp.id);
              return (
                <label key={supp.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 rounded-lg hover:bg-pink-50/50">
                  <input 
                    type="checkbox" 
                    checked={checked || false}
                    onChange={e => {
                      const current = formData.gestational_supplements || [];
                      const updated = e.target.checked ? [...current, supp.id] : current.filter(x => x !== supp.id);
                      updateField('gestational_supplements', updated);
                    }}
                    className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
                  />
                  <span>{supp.label}</span>
                </label>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Altura de Fondo Uterino (AFU cm)
            </label>
            <input 
              type="number" 
              step="0.5" 
              placeholder="Ej: 24 cm" 
              className="input-field bg-white" 
              value={formData.gestational_fundalHeight || ''} 
              onChange={e => updateField('gestational_fundalHeight', e.target.value)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
