import React, { useState } from 'react';
import { Stethoscope, Sparkles, Copy, Check, BookOpen, AlertCircle } from 'lucide-react';

export const COMMON_PES_PROBLEMS = [
  { id: 'p1', label: 'Ingesta energética excesiva (NI-1.3)', text: 'Ingesta energética excesiva' },
  { id: 'p2', label: 'Ingesta inadecuada de energía (NI-1.2)', text: 'Ingesta inadecuada de energía' },
  { id: 'p3', label: 'Ingesta excesiva de carbohidratos simples (NI-5.8.3)', text: 'Ingesta excesiva de carbohidratos simples' },
  { id: 'p4', label: 'Ingesta inadecuada de fibra dietética (NI-5.8.5)', text: 'Ingesta inadecuada de fibra dietética' },
  { id: 'p5', label: 'Ingesta proteica subóptima (NI-5.7.1)', text: 'Ingesta proteica subóptima' },
  { id: 'p6', label: 'Sobrepeso / Obesidad Clase I (NC-3.3)', text: 'Sobrepeso / Obesidad' },
  { id: 'p7', label: 'Valores bioquímicos alterados relacionados con nutrición (NC-2.2)', text: 'Valores bioquímicos alterados relacionados con nutrición (Dislipidemia / Glucemia alterada)' },
  { id: 'p8', label: 'Patrón de comidas desordenado o ayunos prolongados (NB-1.5)', text: 'Patrón de comidas desordenado o ayunos prolongados' },
  { id: 'p9', label: 'Ingesta subóptima de líquidos / deshidratación leve (NI-3.1)', text: 'Ingesta subóptima de líquidos' },
  { id: 'p10', label: 'Conocimientos deficientes relacionados con alimentos y nutrición (NB-1.1)', text: 'Conocimientos deficientes sobre alimentación saludable' }
];

export const COMMON_PES_ETIOLOGIES = [
  'Hábitos arraigados de consumo frecuente de alimentos ultraprocesados y bebidas azucaradas',
  'Falta de planificación de compras y preparación de comidas por horarios laborales extensos',
  'Desconocimiento del tamaño adecuado de raciones y balance de macronutrientes',
  'Comportamiento de ingesta emocional vinculada a estrés y ansiedad crónica',
  'Disminución del gasto calórico por sedentarismo severo y actividad física nula',
  'Acceso limitado o aversión hacia verduras, frutas y fuentes de fibra',
  'Omisión de tiempos de comida principales (desayuno) que detona hiperfagia nocturna',
  'Alteración endocrina metabólica previa no compensada'
];

export const COMMON_PES_SIGNS = [
  'IMC fuera de rango óptimo y porcentaje de grasa corporal elevado',
  'Circunferencia de cintura elevada que indica adiposidad visceral aumentada',
  'Recordatorio de 24 horas con exceso calórico y porcentaje de azúcares libres > 15%',
  'Perfil lipídico alterado (triglicéridos elevados, colesterol LDL alto, HDL bajo)',
  'Glucosa alterada en ayunas o elevación de HbA1c',
  'Frecuencia de evacuación < 3 veces por semana con heces duras (Bristol 1-2)',
  'Consumo de agua natural menor a 1.2 litros al día'
];

export default function PesDiagnosis({ 
  problem = '', 
  etiology = '', 
  signs = '', 
  onProblemChange, 
  onEtiologyChange, 
  onSignsChange 
}) {
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Formatted sentence
  const pesStatement = (problem && etiology && signs) 
    ? `${problem} relacionado con ${etiology} evidenciado por ${signs}.`
    : '';

  const handleCopy = () => {
    if (!pesStatement) return;
    navigator.clipboard.writeText(pesStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Explicación NCP */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-teal-50 to-emerald-50 p-4 rounded-2xl border border-teal-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-600 text-white rounded-xl shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
              Diagnóstico Nutricional Formato PES
              <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full bg-teal-200/80 text-teal-800 uppercase">
                Estándar AND / ADA
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Estructura clínica universal: <strong>P</strong>roblema + <strong>E</strong>tiología + <strong>S</strong>ignos/Síntomas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-teal-200 bg-white text-teal-700 hover:bg-teal-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <BookOpen className="w-3.5 h-3.5" />
          {showPresets ? 'Ocultar Sugerencias' : 'Ver Plantillas Rápidas'}
        </button>
      </div>

      {/* Sugerencias Rápidas Desplegables */}
      {showPresets && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-2">
              1. Seleccionar Problema (P)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PES_PROBLEMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onProblemChange(p.text)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-slate-700 transition-all text-left"
                >
                  + {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">
              2. Seleccionar Etiología Común (E)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PES_ETIOLOGIES.map((e, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onEtiologyChange(e)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700 transition-all text-left"
                >
                  + {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-2">
              3. Seleccionar Signos y Síntomas Frecuentes (S)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PES_SIGNS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSignsChange(s)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 text-slate-700 transition-all text-left"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Formulario de los 3 Componentes PES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* P - Problema */}
        <div className="card space-y-2 border-teal-200 bg-teal-50/20">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">
                P
              </span>
              Problema Nutricional
            </label>
            <span className="text-[10px] text-teal-600 font-semibold">¿Qué ocurre?</span>
          </div>
          <textarea
            className="input-field bg-white h-24 text-sm"
            placeholder="Ej: Ingesta excesiva de hidratos de carbono simples y energía..."
            value={problem}
            onChange={(e) => onProblemChange(e.target.value)}
          />
          <p className="text-[10px] text-slate-400 leading-tight">
            Describe la alteración del estado nutricional que el nutriólogo puede tratar de forma independiente.
          </p>
        </div>

        {/* E - Etiología */}
        <div className="card space-y-2 border-amber-200 bg-amber-50/20">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">
                E
              </span>
              Etiología (Causa)
            </label>
            <span className="text-[10px] text-amber-600 font-semibold">"Relacionado con..."</span>
          </div>
          <textarea
            className="input-field bg-white h-24 text-sm"
            placeholder="Ej: Falta de planificación en comidas y consumo habitual de bebidas azucaradas..."
            value={etiology}
            onChange={(e) => onEtiologyChange(e.target.value)}
          />
          <p className="text-[10px] text-slate-400 leading-tight">
            Factores etiológicos o de riesgo que causan o contribuyen al problema.
          </p>
        </div>

        {/* S - Signos y Síntomas */}
        <div className="card space-y-2 border-rose-200 bg-rose-50/20">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">
                S
              </span>
              Signos y Síntomas
            </label>
            <span className="text-[10px] text-rose-600 font-semibold">"Evidenciado por..."</span>
          </div>
          <textarea
            className="input-field bg-white h-24 text-sm"
            placeholder="Ej: IMC 31.2 kg/m², cintura 96 cm, glucosa alterada en ayuno 116 mg/dL..."
            value={signs}
            onChange={(e) => onSignsChange(e.target.value)}
          />
          <p className="text-[10px] text-slate-400 leading-tight">
            Datos antropométricos, bioquímicos, clínicos o dietéticos que demuestran el problema.
          </p>
        </div>
      </div>

      {/* Tarjeta de Sentencia PES Generada */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm border border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Declaración PES Oficial para Expediente
            </h5>
          </div>
          {pesStatement && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          )}
        </div>

        {pesStatement ? (
          <p className="text-sm font-medium leading-relaxed text-slate-100 bg-white/5 p-3 rounded-xl border border-white/10">
            <strong className="text-teal-300 font-bold">{problem}</strong>{' '}
            <span className="text-amber-300 font-semibold">relacionado con</span>{' '}
            <span className="text-amber-100">{etiology}</span>{' '}
            <span className="text-rose-300 font-semibold">evidenciado por</span>{' '}
            <span className="text-rose-100">{signs}</span>.
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Completa los tres campos superiores (Problema, Etiología y Signos/Síntomas) para generar la declaración diagnóstica estandarizada.
          </p>
        )}
      </div>
    </div>
  );
}
