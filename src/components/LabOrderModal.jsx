import React, { useState } from 'react';
import { FileText, Printer, Check, Plus, Trash2, X, AlertCircle, Building2, User, Sparkles } from 'lucide-react';
import { CATALOGO_LABORATORIOS } from '../utils/constants';

export const LAB_PACKAGES = [
  {
    id: 'pack_basico',
    name: 'Check-Up Nutricional Básico',
    desc: 'BH + Glucosa + Perfil Lipídico + EGO',
    studies: ['hb', 'hto', 'leuco', 'plaquetas', 'glu_ayuno', 'col_tot', 'trig', 'hdl', 'ldl', 'ego_ph', 'ego_densidad']
  },
  {
    id: 'pack_metabolico',
    name: 'Perfil Metabólico & Resistencia a Insulina',
    desc: 'Glucosa + Insulina + HOMA-IR + HbA1c + Lípidos',
    studies: ['glu_ayuno', 'insulina', 'homa_ir', 'hba1c', 'col_tot', 'trig', 'hdl', 'ldl', 'vldl', 'acido_urico']
  },
  {
    id: 'pack_tiroideo',
    name: 'Perfil Tiroideo',
    desc: 'TSH + T3 Libre + T4 Libre',
    studies: ['tsh', 't3_libre', 't4_libre']
  },
  {
    id: 'pack_hepatico_renal',
    name: 'Función Hepática y Renal',
    desc: 'AST + ALT + GGT + Creatinina + Urea + BUN',
    studies: ['ast', 'alt', 'ggt', 'fa', 'bili_tot', 'creatinina', 'urea', 'bun']
  },
  {
    id: 'pack_nutricional',
    name: 'Vitaminas y Minerales',
    desc: 'Vitamina D + B12 + Hierro + Ferritina',
    studies: ['vit_d', 'vit_b12', 'hierro', 'ferritina', 'calcio', 'magnesio']
  },
  {
    id: 'pack_hormonal',
    name: 'Perfil Hormonal',
    desc: 'Testosterona + Cortisol + Estradiol + Prolactina',
    studies: ['testosterona_tot', 'testosterona_lib', 'cortisol', 'estradiol', 'prolactina']
  }
];

export const DEFAULT_INSTRUCTIONS = [
  'Ayuno estricto de 8 a 12 horas previo a la toma de muestra (únicamente se permite agua simple potable).',
  'Evitar realizar actividad física o ejercicio intenso las 24 horas previas.',
  'Evitar consumo de bebidas alcohólicas o comidas copiosas con alto contenido graso 48 horas antes.',
  'Para Examen General de Orina (EGO): recolectar la primera orina de la mañana con técnica de chorro medio en frasco estéril.',
  'Presentar esta orden impresa o digital al ingresar al laboratorio clínico de su preferencia.'
];

export default function LabOrderModal({ isOpen, onClose, patient, doctorInfo }) {
  if (!isOpen) return null;

  const clinic = JSON.parse(localStorage.getItem('nutriplan_clinic') || '{"name":"Biome Nutrition","phone":"","address":"","color":"#0d9488","doctorName":"L.N. Especialista","license":"Céd. Prof. 12345678"}');

  const [selectedStudies, setSelectedStudies] = useState([
    'glu_ayuno', 'insulina', 'hba1c', 'col_tot', 'trig', 'hdl', 'ldl', 'creatinina', 'acido_urico'
  ]);
  const [customStudy, setCustomStudy] = useState('');
  const [customStudiesList, setCustomStudiesList] = useState([]);
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState(
    patient?.pes_problem || patient?.nutritionalDiagnosis || 'Evaluación del Estado Nutricional y Metabólico'
  );
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS);
  const [newInstruction, setNewInstruction] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);

  // Aplicar paquete completo
  const applyPackage = (pkg) => {
    const combined = Array.from(new Set([...selectedStudies, ...pkg.studies]));
    setSelectedStudies(combined);
  };

  const toggleStudy = (studyId) => {
    if (selectedStudies.includes(studyId)) {
      setSelectedStudies(selectedStudies.filter(id => id !== studyId));
    } else {
      setSelectedStudies([...selectedStudies, studyId]);
    }
  };

  const addCustomStudy = () => {
    if (!customStudy.trim()) return;
    setCustomStudiesList([...customStudiesList, customStudy.trim()]);
    setCustomStudy('');
  };

  const removeCustomStudy = (idx) => {
    setCustomStudiesList(customStudiesList.filter((_, i) => i !== idx));
  };

  const handlePrint = () => {
    window.print();
  };

  // Get full names of selected studies
  const selectedObjects = selectedStudies.map(id => CATALOGO_LABORATORIOS.find(l => l.id === id)).filter(Boolean);

  // Group by category
  const groupedStudies = selectedObjects.reduce((acc, curr) => {
    const group = curr.grupo || 'Otros';
    if (!acc[group]) acc[group] = [];
    acc[group].push(curr.nombre);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/80 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-600 text-white rounded-2xl shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Orden Médica de Estudios de Laboratorio</h3>
              <p className="text-xs text-slate-500">Prescripción de análisis clínicos para entregar o imprimir al paciente.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-primary py-2 px-4 text-xs flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Guardar PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Tabs / Controls */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Seccion de Paquetes Rapidos (no-print) */}
          <div className="no-print space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Paquetes Preconfigurados de Solicitud Rápida
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LAB_PACKAGES.map(pkg => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => applyPackage(pkg)}
                  className="p-2.5 rounded-xl border border-teal-200 bg-teal-50/40 hover:bg-teal-50 hover:border-teal-400 text-left transition-all cursor-pointer group"
                >
                  <span className="text-xs font-bold text-teal-800 block group-hover:text-teal-900">+ {pkg.name}</span>
                  <span className="text-[10px] text-teal-600/80 line-clamp-1">{pkg.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulario de Diagnóstico Presuntivo y Estudios Extra (no-print) */}
          <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Diagnóstico Presuntivo / Indicación Clínica
              </label>
              <input
                type="text"
                className="input-field bg-white text-xs"
                value={clinicalDiagnosis}
                onChange={e => setClinicalDiagnosis(e.target.value)}
                placeholder="Ej. Sospecha de Síndrome Metabólico, Control anual..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Agregar Estudio Personalizado
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input-field bg-white text-xs"
                  value={customStudy}
                  onChange={e => setCustomStudy(e.target.value)}
                  placeholder="Ej: Curva de tolerancia 75g (3 tomas)..."
                  onKeyDown={e => e.key === 'Enter' && addCustomStudy()}
                />
                <button
                  type="button"
                  onClick={addCustomStudy}
                  className="btn-secondary px-3 py-1.5 text-xs shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Selector individual de estudios (no-print) */}
          <div className="no-print space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Estudios Seleccionados ({selectedStudies.length + customStudiesList.length})
              </label>
              <button 
                type="button" 
                onClick={() => setSelectedStudies([])} 
                className="text-[11px] text-rose-500 hover:underline"
              >
                Limpiar Selección
              </button>
            </div>
            <div className="max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-1.5">
              {CATALOGO_LABORATORIOS.map(l => {
                const isSelected = selectedStudies.includes(l.id);
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => toggleStudy(l.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      isSelected 
                        ? 'bg-teal-600 text-white border-teal-700 shadow-2xs font-medium'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{l.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* VISTA PREVIA IMPRIMIBLE FORMAL DE LA ORDEN */}
          <div className="p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0 print:m-0" id="lab-order-printable">
            {/* Membrete Clínico */}
            <div className="flex justify-between items-start border-b-2 border-teal-600 pb-5 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{clinic.name || 'Biome Nutrition'}</h2>
                <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">Clínica de Nutrición Especializada & Salud Metabólica</p>
                <p className="text-xs text-slate-500 mt-1">{clinic.doctorName || 'Nutriólogo Clínico'} • {clinic.license || 'Céd. Profesional'}</p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">Solicitud de Laboratorio</span>
                <span className="text-sm font-semibold text-slate-700 block">{orderDate}</span>
                {clinic.phone && <span className="text-xs text-slate-500">Tel: {clinic.phone}</span>}
              </div>
            </div>

            {/* Ficha del Paciente */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 grid grid-cols-3 gap-4 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Paciente</span>
                <span className="text-sm font-bold text-slate-800">{patient?.name || 'Nombre del Paciente'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Edad / Sexo</span>
                <span className="text-sm font-medium text-slate-700">{patient?.age || '--'} años • {patient?.gender || '--'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Diagnóstico Presuntivo</span>
                <span className="text-sm font-medium text-slate-700 line-clamp-1">{clinicalDiagnosis || 'Evaluación de control'}</span>
              </div>
            </div>

            {/* Título de la Solicitud */}
            <div className="mb-4">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Estudios Solicitados para Análisis Clínico
              </h4>
            </div>

            {/* Lista Agrupada de Estudios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(groupedStudies).map(([group, studies]) => (
                <div key={group} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <h5 className="text-xs font-bold text-teal-800 uppercase tracking-wide border-b border-slate-200 pb-1 mb-2">
                    {group}
                  </h5>
                  <ul className="space-y-1">
                    {studies.map((s, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {customStudiesList.length > 0 && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <h5 className="text-xs font-bold text-indigo-800 uppercase tracking-wide border-b border-slate-200 pb-1 mb-2">
                    Estudios Especiales Adicionales
                  </h5>
                  <ul className="space-y-1">
                    {customStudiesList.map((cs, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span>{cs}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCustomStudy(idx)}
                          className="text-rose-400 hover:text-rose-600 no-print"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Indicaciones para el Paciente */}
            <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-4 mb-8">
              <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Indicaciones Previas a la Toma de Muestra
              </h5>
              <ul className="space-y-1">
                {instructions.map((ins, idx) => (
                  <li key={idx} className="text-xs text-amber-950/80 flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Firma y Cédula Profesional */}
            <div className="flex justify-between items-end pt-8 border-t border-slate-200">
              <div className="text-xs text-slate-400">
                <p>Favor de enviar resultados al correo de la clínica o presentarlos en la próxima consulta.</p>
                <p className="mt-0.5">Válido en cualquier laboratorio clínico certificado.</p>
              </div>

              <div className="text-center w-64">
                <div className="border-b border-slate-400 mb-2 h-12" />
                <p className="text-xs font-bold text-slate-800">{clinic.doctorName || 'Nutriólogo Clínico'}</p>
                <p className="text-[11px] text-slate-500 font-medium">{clinic.license || 'Cédula Profesional'}</p>
                <p className="text-[10px] text-slate-400">Firma del Profesional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
