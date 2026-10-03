import React, { useMemo } from 'react';
import { HeartPulse, Scale, AlertTriangle, ShieldCheck, Check, Sparkles, TrendingDown } from 'lucide-react';
import { calculateCardiometabolicRisks, calculateIdealWeights } from '../utils/clinicalMath';

export default function CardioMetabolicCard({ waist, hip, height, gender, weight, onSelectIdealWeight }) {
  const risks = useMemo(() => {
    return calculateCardiometabolicRisks(waist, hip, height, gender);
  }, [waist, hip, height, gender]);

  const idealWeights = useMemo(() => {
    return calculateIdealWeights(height, gender);
  }, [height, gender]);

  const currentW = parseFloat(weight) || 0;

  return (
    <div className="space-y-6">
      {/* SECCIÓN 1: ÍNDICES DE RIESGO CARDIOMETABÓLICO */}
      <div className="card space-y-4 border-teal-200 bg-gradient-to-br from-white via-teal-50/20 to-white shadow-xs">
        <div className="flex justify-between items-center border-b border-teal-100 pb-3">
          <h4 className="font-bold text-base text-slate-800 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-teal-600" />
            Índices de Riesgo Cardiometabólico y Grasa Visceral
          </h4>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
            Estilo Nutrimind
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Índice Cintura / Cadera (ICC) */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white/80 shadow-2xs space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Índice Cintura / Cadera (ICC)
                </span>
                <span className="text-2xl font-black text-slate-800">
                  {risks.icc > 0 ? risks.icc : '--'}
                </span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                risks.iccRisk === 'low' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : risks.iccRisk === 'moderate' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {risks.iccCategory}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
              <p><strong>Distribución de Grasa:</strong> {risks.iccDistribution}</p>
              <p className="text-[11px] text-slate-400">
                Punto de corte: {gender === 'Masculino' ? '< 0.90 (Hombres)' : '< 0.80 (Mujeres)'}.
              </p>
            </div>
          </div>

          {/* Índice Cintura / Talla (ICT) */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white/80 shadow-2xs space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Índice Cintura / Talla (ICT)
                </span>
                <span className="text-2xl font-black text-slate-800">
                  {risks.ict > 0 ? risks.ict : '--'}{' '}
                  {risks.ict > 0 && <span className="text-xs font-semibold text-slate-400">({Math.round(risks.ict * 100)}% de talla)</span>}
                </span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                risks.ictRisk === 'low' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : risks.ictRisk === 'moderate' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {risks.ictRisk === 'low' ? 'Riesgo Bajo' : risks.ictRisk === 'moderate' ? 'Alerta Visceral' : 'Riesgo Alto'}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
              <p><strong>Diagnóstico:</strong> {risks.ictCategory}</p>
              <p className="text-[11px] text-slate-400">
                Regla de oro médica: La cintura debe medir menos de la mitad de la estatura (ratio &lt; 0.50).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: CALCULADORA MULTIMÉTODO DE PESO TEÓRICO / IDEAL */}
      <div className="card space-y-4 border-amber-200 bg-gradient-to-br from-white via-amber-50/20 to-white shadow-xs">
        <div className="flex justify-between items-center border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="font-bold text-base text-slate-800">Calculadora Multimétodo de Peso Ideal</h4>
              <p className="text-xs text-slate-500">Comparativa de fórmulas clínicas clásicas (Nutrimind / ADA).</p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-xl">
            Promedio: {idealWeights.average} kg
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'hamwi', name: 'Hamwi (Clínica)', val: idealWeights.hamwi, desc: 'Clásica hospitalaria' },
            { id: 'devine', name: 'Devine (Médica)', val: idealWeights.devine, desc: 'Farmacocinética' },
            { id: 'miller', name: 'Miller (Deporte)', val: idealWeights.miller, desc: 'Población activa' },
            { id: 'imc22', name: 'IMC 22.0 (OMS)', val: idealWeights.imc22, desc: 'Mediana normal' }
          ].map(f => {
            const diff = currentW > 0 ? +(currentW - f.val).toFixed(1) : 0;
            return (
              <div 
                key={f.id} 
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-700">{f.name}</span>
                  </div>
                  <span className="text-xl font-black text-slate-800 block">
                    {f.val} <span className="text-xs font-normal text-slate-500">kg</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{f.desc}</span>
                  {currentW > 0 && (
                    <span className={`text-[10px] font-bold block mt-1 ${diff > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {diff > 0 ? `-${diff} kg a perder` : `+${Math.abs(diff)} kg a ganar`}
                    </span>
                  )}
                </div>

                {onSelectIdealWeight && (
                  <button
                    type="button"
                    onClick={() => onSelectIdealWeight(f.val)}
                    className="mt-3 text-[11px] font-bold py-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors w-full cursor-pointer text-center"
                  >
                    Fijar como Meta
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
