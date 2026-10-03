import React, { useMemo } from 'react';
import { Utensils, CheckCircle2, AlertTriangle, Sparkles, HeartPulse, ShieldCheck, ShieldAlert } from 'lucide-react';

export const FCA_GROUPS = [
  {
    id: 'verduras',
    label: 'Verduras y Ensaladas',
    desc: 'Espinacas, brócoli, lechuga, jitomate, calabacita, etc.',
    type: 'positive',
    ideal: 'diario',
    icon: '🥦'
  },
  {
    id: 'frutas',
    label: 'Frutas Frescas Enteras',
    desc: 'Manzana, plátano, frutos rojos, cítricos, papaya, etc.',
    type: 'positive',
    ideal: 'diario',
    icon: '🍎'
  },
  {
    id: 'leguminosas',
    label: 'Leguminosas',
    desc: 'Frijoles, lentejas, garbanzos, habas, alubias.',
    type: 'positive',
    ideal: 'frecuente',
    icon: '🫘'
  },
  {
    id: 'pescados',
    label: 'Pescados y Mariscos (Omega-3)',
    desc: 'Atún fresco, salmón, sardina, tilapia, camarón.',
    type: 'positive',
    ideal: 'moderado',
    icon: '🐟'
  },
  {
    id: 'carnes_magras',
    label: 'Aves y Carnes Magras',
    desc: 'Pechuga de pollo, pavo, bistec magro, lomo de cerdo.',
    type: 'neutral',
    ideal: 'moderado',
    icon: '🍗'
  },
  {
    id: 'lacteos',
    label: 'Lácteos y Derivados',
    desc: 'Leche, yogur natural, kéfir, queso fresco/panela.',
    type: 'neutral',
    ideal: 'moderado',
    icon: '🥛'
  },
  {
    id: 'embutidos',
    label: 'Embutidos y Carnes Procesadas',
    desc: 'Salchichas, jamón comercial, tocino, chorizo, salami.',
    type: 'negative',
    ideal: 'nunca',
    icon: '🥓'
  },
  {
    id: 'refrescos',
    label: 'Refrescos y Bebidas Azucaradas',
    desc: 'Refrescos regulares, jugos embotellados, tés azucarados.',
    type: 'negative',
    ideal: 'nunca',
    icon: '🥤'
  },
  {
    id: 'ultraprocesados',
    label: 'Ultraprocesados, Frituras y Bollería',
    desc: 'Papas fritas, galletas, pastelillos, cereales de caja azucarados.',
    type: 'negative',
    ideal: 'nunca',
    icon: '🍩'
  },
  {
    id: 'alcohol',
    label: 'Bebidas Alcohólicas',
    desc: 'Cerveza, vino, destilados, licores.',
    type: 'negative',
    ideal: 'nunca',
    icon: '🍷'
  }
];

export const FREQUENCIES = [
  { id: 'diario', label: 'Diario (7d)', weightPositive: 10, weightNegative: 0 },
  { id: 'frecuente', label: '4-6 veces/sem', weightPositive: 8, weightNegative: 2 },
  { id: 'moderado', label: '2-3 veces/sem', weightPositive: 6, weightNegative: 5 },
  { id: 'semanal', label: '1 vez/sem', weightPositive: 3, weightNegative: 7 },
  { id: 'quincenal', label: '1-2 veces/mes', weightPositive: 1, weightNegative: 9 },
  { id: 'nunca', label: 'Rara vez / Nunca', weightPositive: 0, weightNegative: 10 }
];

export default function FoodFrequencyQuestionnaire({ answers = {}, onChange }) {
  // Calculo de calidad dietética Nutrimind
  const dietScore = useMemo(() => {
    let totalPoints = 0;
    let maxPoints = 0;
    const strengths = [];
    const risks = [];

    FCA_GROUPS.forEach(group => {
      const selected = answers[group.id] || 'moderado';
      const freqObj = FREQUENCIES.find(f => f.id === selected) || FREQUENCIES[2];

      maxPoints += 10;
      if (group.type === 'positive') {
        totalPoints += freqObj.weightPositive;
        if (selected === 'diario' || selected === 'frecuente') {
          strengths.push(`Buen consumo de ${group.label.toLowerCase()}`);
        } else if (selected === 'quincenal' || selected === 'nunca') {
          risks.push(`Consumo deficiente de ${group.label.toLowerCase()}`);
        }
      } else if (group.type === 'negative') {
        totalPoints += freqObj.weightNegative;
        if (selected === 'diario' || selected === 'frecuente') {
          risks.push(`Consumo excesivo de ${group.label.toLowerCase()}`);
        } else if (selected === 'quincenal' || selected === 'nunca') {
          strengths.push(`Excelente control en ${group.label.toLowerCase()}`);
        }
      } else {
        // Neutral
        totalPoints += 7;
      }
    });

    const scorePct = Math.round((totalPoints / maxPoints) * 100);

    let classification = 'Calidad Dietética Moderada';
    let badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    if (scorePct >= 80) {
      classification = 'Patrón Protector / Excelente';
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (scorePct < 55) {
      classification = 'Patrón Proinflamatorio / Riesgo Aumentado';
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    }

    return {
      scorePct,
      classification,
      badgeColor,
      strengths,
      risks
    };
  }, [answers]);

  const handleSelect = (groupId, freqId) => {
    if (!onChange) return;
    onChange({
      ...answers,
      [groupId]: freqId
    });
  };

  return (
    <div className="space-y-6">
      {/* Resumen del Score Nutrimind */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-xs">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-800 text-base">Frecuencia de Consumo de Alimentos (FCA)</h4>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${dietScore.badgeColor}`}>
                {dietScore.classification}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Anamnesis cualitativa rápida para detectar patrones protectores vs. factores de riesgo cardiometabólico.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-xs px-5 py-2.5 rounded-2xl border border-emerald-200 shadow-2xs shrink-0">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Score de Dieta</span>
            <span className="text-2xl font-black text-emerald-600">{dietScore.scorePct} <span className="text-xs font-semibold text-slate-400">/ 100</span></span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-sm text-emerald-700 bg-emerald-50">
            {dietScore.scorePct}%
          </div>
        </div>
      </div>

      {/* Grid de Preguntas */}
      <div className="space-y-2.5">
        <div className="hidden lg:grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1 border-b border-slate-100">
          <div className="col-span-5">Grupo de Alimento</div>
          {FREQUENCIES.map(f => (
            <div key={f.id} className="col-span-1 text-center truncate">{f.label.split(' ')[0]}</div>
          ))}
          <div className="col-span-1 text-center">Meta</div>
        </div>

        {FCA_GROUPS.map(group => {
          const currentFreq = answers[group.id] || 'moderado';
          return (
            <div 
              key={group.id} 
              className={`p-3 rounded-2xl border transition-colors flex flex-col lg:grid lg:grid-cols-12 gap-3 items-center ${
                group.type === 'positive' 
                  ? 'border-emerald-100 bg-emerald-50/20' 
                  : group.type === 'negative' 
                  ? 'border-rose-100 bg-rose-50/20' 
                  : 'border-slate-100 bg-white'
              }`}
            >
              {/* Info Grupo */}
              <div className="w-full lg:col-span-5 flex items-center gap-2.5">
                <span className="text-2xl p-1.5 bg-white rounded-xl shadow-2xs shrink-0">{group.icon}</span>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">{group.label}</h5>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{group.desc}</p>
                </div>
              </div>

              {/* Opciones de Frecuencia */}
              <div className="w-full lg:col-span-6 grid grid-cols-3 sm:grid-cols-6 gap-1">
                {FREQUENCIES.map(f => {
                  const isSelected = currentFreq === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleSelect(group.id, f.id)}
                      className={`text-[11px] py-1.5 px-1 rounded-xl font-medium border text-center transition-all cursor-pointer ${
                        isSelected 
                          ? (group.type === 'negative' && (f.id === 'diario' || f.id === 'frecuente')
                              ? 'bg-rose-500 text-white border-rose-600 shadow-2xs font-bold'
                              : 'bg-emerald-600 text-white border-emerald-700 shadow-2xs font-bold')
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {f.label.split(' ')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Badge de Meta */}
              <div className="hidden lg:flex col-span-1 justify-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  group.type === 'positive' ? 'bg-emerald-100 text-emerald-700' : group.type === 'negative' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {group.type === 'positive' ? '≥ 4x/sem' : group.type === 'negative' ? '≤ 1x/mes' : 'Mod.'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hallazgos y Diagnóstico Cualitativo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40">
          <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Fortalezas Dietéticas Detectadas ({dietScore.strengths.length})
          </h5>
          {dietScore.strengths.length > 0 ? (
            <ul className="space-y-1">
              {dietScore.strengths.map((str, idx) => (
                <li key={idx} className="text-xs text-emerald-900 flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span> {str}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No se detectaron hábitos protectores destacados.</p>
          )}
        </div>

        <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40">
          <h5 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Focos Rojos a Intervenir ({dietScore.risks.length})
          </h5>
          {dietScore.risks.length > 0 ? (
            <ul className="space-y-1">
              {dietScore.risks.map((risk, idx) => (
                <li key={idx} className="text-xs text-rose-900 flex items-center gap-1.5">
                  <span className="text-rose-500 font-bold">⚠</span> {risk}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">¡Excelente! Sin patrones de riesgo dietético marcados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
