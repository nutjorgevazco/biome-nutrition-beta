import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const BRISTOL_TYPES = [
  {
    type: 1,
    title: 'Tipo 1: Bolas duras',
    desc: 'Trozos duros y separados, como nueces (difíciles de expulsar).',
    category: 'Estreñimiento Severo',
    color: 'border-rose-400 bg-rose-50/50 text-rose-800',
    badgeBg: 'bg-rose-100 text-rose-700',
    iconColor: '#e11d48',
    shape: '🌰 🌰 🌰'
  },
  {
    type: 2,
    title: 'Tipo 2: Aterronada',
    desc: 'Forma de salchicha pero compuesta de fragmentos duros.',
    category: 'Estreñimiento Leve',
    color: 'border-amber-400 bg-amber-50/50 text-amber-800',
    badgeBg: 'bg-amber-100 text-amber-700',
    iconColor: '#d97706',
    shape: '🥖'
  },
  {
    type: 3,
    title: 'Tipo 3: Con grietas',
    desc: 'Forma de salchicha pero con grietas en su superficie.',
    category: 'Normal / Aceptable',
    color: 'border-emerald-300 bg-emerald-50/40 text-emerald-800',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    iconColor: '#059669',
    shape: '🌭'
  },
  {
    type: 4,
    title: 'Tipo 4: Suave y lisa',
    desc: 'Como una salchicha o serpiente, lisa, blanda y fácil de expulsar.',
    category: 'Forma Ideal / Óptima',
    color: 'border-teal-500 bg-teal-50 text-teal-900 ring-2 ring-teal-400 shadow-sm',
    badgeBg: 'bg-teal-100 text-teal-800 font-black',
    iconColor: '#0d9488',
    shape: '🍌'
  },
  {
    type: 5,
    title: 'Tipo 5: Trozos blandos',
    desc: 'Trozos pastosos con bordes claros y definidos. Falta de fibra.',
    category: 'Falta de Fibra',
    color: 'border-yellow-400 bg-yellow-50/50 text-yellow-800',
    badgeBg: 'bg-yellow-100 text-yellow-800',
    iconColor: '#ca8a04',
    shape: '🥔 🥔'
  },
  {
    type: 6,
    title: 'Tipo 6: Pastosa / Esponjosa',
    desc: 'Trozos esponjosos con bordes irregulares, consistencia pastosa.',
    category: 'Inflamación / Diarrea Leve',
    color: 'border-orange-400 bg-orange-50/50 text-orange-800',
    badgeBg: 'bg-orange-100 text-orange-800',
    iconColor: '#ea580c',
    shape: '🥣'
  },
  {
    type: 7,
    title: 'Tipo 7: Acuosa / Líquida',
    desc: 'Acuosa, sin trozos sólidos. Totalmente líquida.',
    category: 'Diarrea Severa',
    color: 'border-red-500 bg-red-50/60 text-red-900',
    badgeBg: 'bg-red-200 text-red-800',
    iconColor: '#dc2626',
    shape: '💧 💧'
  }
];

export default function BristolScale({ value = 4, onChange, frequency = '1 vez al día', onFrequencyChange, symptoms = [], onSymptomsChange }) {
  const currentType = BRISTOL_TYPES.find(t => t.type === parseInt(value)) || BRISTOL_TYPES[3];

  const COMMON_SYMPTOMS = [
    'Distensión / Inflamación abdominal',
    'Gases / Flatulencias excesivas',
    'Reflujo / Pirosis (acidez)',
    'Pesadez postprandial',
    'Dolor o cólico abdominal',
    'Evacuación incompleta (tenesmo)',
    'Urgencia defecatoria',
    'Heces con moco visible'
  ];

  const toggleSymptom = (sym) => {
    if (!onSymptomsChange) return;
    const exists = symptoms.includes(sym);
    if (exists) {
      onSymptomsChange(symptoms.filter(s => s !== sym));
    } else {
      onSymptomsChange([...symptoms, sym]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumen del Tipo Seleccionado */}
      <div className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${currentType.color}`}>
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2 bg-white/80 rounded-xl shadow-xs backdrop-blur-xs">
            {currentType.shape}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base">{currentType.title}</h4>
              <span className={`text-[11px] uppercase font-bold px-2 py-0.5 rounded-full ${currentType.badgeBg}`}>
                {currentType.category}
              </span>
            </div>
            <p className="text-xs opacity-90 mt-0.5 max-w-xl">{currentType.desc}</p>
          </div>
        </div>

        <div className="text-right shrink-0 pl-3">
          <span className="text-2xl font-black block">Tipo {currentType.type}</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75">Escala Bristol</span>
        </div>
      </div>

      {/* Grid Interactivo de Selección (1-7) */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Seleccionar Forma Predominante de Heces (Tipos 1 al 7)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
          {BRISTOL_TYPES.map((item) => {
            const isSelected = parseInt(value) === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => onChange(item.type)}
                className={`flex flex-col items-center justify-between p-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `${item.color} shadow-md scale-[1.03] ring-2 ring-primary-400 font-bold`
                    : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-2xl mb-1">{item.shape}</div>
                <div className="text-xs font-black mb-0.5">Tipo {item.type}</div>
                <div className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold leading-tight line-clamp-1 mb-1 ${item.badgeBg}`}>
                  {item.category.split('/')[0]}
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                  {item.desc}
                </p>
                {isSelected && (
                  <div className="mt-2 text-primary-600">
                    <CheckCircle2 className="w-4 h-4 fill-primary-100" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frecuencia de Evacuación y Síntomas Digestivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Frecuencia de Evacuación
          </label>
          <select
            className="input-field bg-white"
            value={frequency}
            onChange={(e) => onFrequencyChange && onFrequencyChange(e.target.value)}
          >
            <option value="1 a 2 veces al día">1 a 2 veces al día (Normal)</option>
            <option value="3 o más veces al día">3 o más veces al día (Frecuente)</option>
            <option value="Cada tercer día">Cada tercer día (Tránsito Lento)</option>
            <option value="1 a 2 veces por semana">1 a 2 veces por semana (Estreñimiento Severo)</option>
            <option value="Irregular / Variable">Irregular / Variable</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Síntomas Digestivos Asociados
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SYMPTOMS.map((sym) => {
              const active = symptoms.includes(sym);
              return (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-primary-500 text-white border-primary-600 shadow-xs font-medium'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {sym}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
