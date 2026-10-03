import React, { useState, useEffect } from 'react';
import { Search, Plus, PlusCircle, User, Edit, Trash2, Save, Activity, HeartPulse, Stethoscope, Coffee, Image as ImageIcon, TrendingUp, Calendar as CalendarIcon, Zap, PieChart, Droplet, Printer, Pill, AlertTriangle, ArrowDown, ArrowUp, Minus, Upload, FileText, Target, ClipboardList, Sparkles, BookOpen, Send, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateISAK, calculateMetabolism, calculateProjections } from '../utils/clinicalMath';
import { CATALOGO_LABORATORIOS } from '../utils/constants';
import Somatocarta from './Somatocarta';
import PrintReport from './PrintReport';
import BristolScale from './BristolScale';
import PesDiagnosis from './PesDiagnosis';
import GestationalModule from './GestationalModule';
import PediatricModule from './PediatricModule';
import LabOrderModal from './LabOrderModal';
import CustomFormulaModal from './CustomFormulaModal';
import WhatsAppPlanModal from './WhatsAppPlanModal';
import FoodFrequencyQuestionnaire from './FoodFrequencyQuestionnaire';
import CardioMetabolicCard from './CardioMetabolicCard';
import ErrorBoundary from './ErrorBoundary';
import { DEMO_PATIENT, DEMO_SUPPLEMENTS, DEMO_CLINIC } from '../data/demoPatient';

export default function Patients() {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('nutriplan_patients');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [view, setView] = useState('list');
  const [activeTab, setActiveTab] = useState('A');
  const [searchTerm, setSearchTerm] = useState('');
  const [labSearch, setLabSearch] = useState('');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Modales Clínicos Especializados
  const [showLabOrderModal, setShowLabOrderModal] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [customFormulas, setCustomFormulas] = useState(() => {
    const saved = localStorage.getItem('nutriplan_custom_formulas');
    return saved ? JSON.parse(saved) : [];
  });

  const getProfileEmoji = (gender, profileType) => {
    if (profileType === 'PEDIATRIC') return '👶';
    if (profileType === 'GESTATIONAL') return '🤰';
    if (profileType === 'GERIATRIC') return gender === 'Masculino' ? '👴' : '👵';
    return gender === 'Masculino' ? '👨' : '👩';
  };

  const [formData, setFormData] = useState({
    id: '', name: '', age: '', gender: 'Femenino', phone: '', email: '', profileType: 'ADULT',
    // Campos Clínicos Esenciales (Fase 1 Auditoría)
    chiefComplaint: '', // Motivo de consulta
    nutritionalDiagnosis: '', // Diagnóstico nutricional legado
    // Diagnóstico PES Estandarizado (AND / ADA)
    pesProblem: '',
    pesEtiology: '',
    pesSigns: '',
    medications: '', // Medicamentos actuales
    treatmentGoals: '', // Objetivos del tratamiento
    specialIndications: '', // Indicaciones especiales
    consultNotes: '', // Notas de consulta actual (se guarda en snapshot al guardar)
    nextAppointment: '', // Fecha próxima cita
    weight: '', idealWeight: '', height: '', waist: '', hip: '', abdominal: '',
    triceps: '', biceps: '', subscapular: '', supracrestal: '', supraespinal: '', abdominalFold: '', thigh: '', calfFold: '',
    humerus: '', femur: '', armCircumference: '', calfCircumference: '',
    visceralFat: '', fatMass: '', muscleMass: '', residualMass: '',
    pathologies: '', familyHistory: '', surgeries: '', allergies: '', bloodPressure: '',
    // Aparatos y Sistemas
    gastrointestinalNotes: '', cardiovascularNotes: '', endocrinoNotes: '', 
    nerviosoNotes: '', musculoesqueleticoNotes: '', renalNotes: '', tegumentarioNotes: '',
    // Salud Digestiva & Escala de Bristol
    colitis: 'No', reflujo: 'No', estrenimiento: 'No', intestinalNotes: '',
    bristolType: 4,
    bowelFrequency: '1 a 2 veces al día',
    digestiveSymptoms: [],
    // Labs dinámicos
    laboratorios_agregados: [],
    laboratorios_valores: {},
    // Geriátrico
    fragilityIndex: '', sarcopeniaRisk: '',
    // Gineco & Control Prenatal Gestacional
    cycleDuration: '', abortions: '', cesareans: '', papDate: '', mastographyDate: '', menopauseDate: '', contraceptives: '', regularCycles: 'Sí', gynecoNotes: '',
    gestational_fum: '',
    gestational_preWeight: '',
    gestational_weeks: '',
    gestational_type: 'UNICO',
    gestational_bp: '',
    gestational_glucose: '',
    gestational_edema: 'Ausente',
    gestational_supplements: ['folic', 'iron'],
    gestational_fundalHeight: '',
    // Evaluación Pediátrica
    pediatric_birthWeight: '',
    pediatric_birthHeight: '',
    pediatric_headCircumference: '',
    pediatric_milkFeeding: 'LME',
    pediatric_complementaryType: 'BLW',
    pediatric_acStartMonth: '6',
    pediatric_milestones: '',
    pediatric_allergies: '',
    energyFormula: 'mifflin', rapidFactor: '25', waterIntake: '', mealsPerDay: '', appetiteLevel: '', physicalActivity: 'sedentary', sleepQuality: '', recall24h: '',
    photoFront: '', photoProfile: '', photoBack: '', profileImageUrl: '',
    history: [],
    stressFactor: '1.0', activityFactor: '1.2', strategy: 'Mantenimiento',
    assignedKcal: '', p_pct: 20, c_pct: 50, g_pct: 30, ml_kg: 35, targetWeight: ''
  });

  const [calc, setCalc] = useState({ 
    imc: 0, geb: 0, get: 0, bodyFat: 0, watsonAct: 0,
    somatotype: { endo: 0, meso: 0, ecto: 0, classification: '' },
    isakDetails: {}, metabolismDetails: {}, projections: {}
  });

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printConfig, setPrintConfig] = useState({
    general: true,
    composition: true,
    labs: true,
    macros: true,
    menu: true,
    shopping: true,
    supplements: true
  });

  useEffect(() => {
    localStorage.setItem('nutriplan_patients', JSON.stringify(patients));
  }, [patients]);

  const loadDemoPatient = () => {
    // 1. Guardar suplementos si no existen
    const curSupps = JSON.parse(localStorage.getItem('nutriplan_supplements') || '[]');
    if (curSupps.length === 0) {
      localStorage.setItem('nutriplan_supplements', JSON.stringify(DEMO_SUPPLEMENTS));
    }
    // 2. Guardar clínica si no existe
    const curClinic = JSON.parse(localStorage.getItem('nutriplan_clinic') || '{}');
    if (!curClinic.name) {
      localStorage.setItem('nutriplan_clinic', JSON.stringify(DEMO_CLINIC));
    }
    // 3. Añadir cita en agenda si no existe
    const curAppts = JSON.parse(localStorage.getItem('nutriplan_appointments') || '[]');
    if (curAppts.length === 0) {
      localStorage.setItem('nutriplan_appointments', JSON.stringify([
        {
          id: 'appt_demo_01',
          patientId: DEMO_PATIENT.id,
          patientName: DEMO_PATIENT.name,
          date: DEMO_PATIENT.nextAppointment,
          time: '10:00',
          notes: 'Consulta 4: Evaluación antropométrica intermedia y ajuste de plan'
        }
      ]));
    }
    // 4. Actualizar lista de pacientes y abrir en modo edición
    const updated = [
      DEMO_PATIENT,
      ...patients.filter(p => p.id !== DEMO_PATIENT.id)
    ];
    setPatients(updated);
    localStorage.setItem('nutriplan_patients', JSON.stringify(updated));
    setFormData(DEMO_PATIENT);
    setActiveTab('E');
    setView('edit');
  };

  // Carga inicial automática si el sistema no tiene pacientes
  useEffect(() => {
    const saved = localStorage.getItem('nutriplan_patients');
    if (!saved || JSON.parse(saved).length === 0) {
      loadDemoPatient();
    }
  }, []);

  // Recálculo automático
  useEffect(() => {
    const w = parseFloat(formData.weight) || 0;
    const h = parseFloat(formData.height) || 0;
    let imc = 0;
    if (w > 0 && h > 0) {
      imc = w / ((h / 100) * (h / 100));
    }

    // 1. ISAK y 4 Componentes
    const isakResults = calculateISAK(formData, formData);
    
    // 2. Metabolismo
    const metabResults = calculateMetabolism(w, h, formData.age, formData.gender, isakResults.grasa_pct || 15);
    
    // Determinar GEB base
    let baseGeb = metabResults[formData.energyFormula] || 0;
    if (formData.energyFormula === 'rapido') {
      baseGeb = (parseFloat(formData.rapidFactor) || 25) * w;
    } else if (formData.energyFormula && formData.energyFormula.startsWith('custom_')) {
      const fId = formData.energyFormula.replace('custom_', '');
      const customF = customFormulas.find(f => f.id === fId);
      if (customF) {
        const isMale = formData.gender === 'Masculino';
        baseGeb = Math.round(
          (parseFloat(customF.coeffWeight) || 0) * w +
          (parseFloat(customF.coeffHeight) || 0) * h -
          (parseFloat(customF.coeffAge) || 0) * (parseFloat(formData.age) || 30) +
          (isMale ? (parseFloat(customF.constantMale) || 0) : (parseFloat(customF.constantFemale) || 0))
        );
        metabResults[formData.energyFormula] = baseGeb;
      }
    }

    // GET con Factores
    let afMultiplier = 1.2;
    if (formData.energyFormula !== 'rapido') {
      afMultiplier = parseFloat(formData.activityFactor) || 1.2;
    }
    const stressMultiplier = parseFloat(formData.stressFactor) || 1.0;
    const calculatedGet = Math.round(baseGeb * afMultiplier * stressMultiplier);

    // Kcal Finales (Estrategia)
    let finalKcal = calculatedGet;
    if (formData.assignedKcal) {
      finalKcal = parseInt(formData.assignedKcal);
    } else {
      if (formData.strategy === 'Déficit Calórico') finalKcal -= 500;
      if (formData.strategy === 'Superávit Calórico') finalKcal += 500;
    }

    // 3. Proyecciones
    const projections = calculateProjections(w, formData.targetWeight || formData.idealWeight, calculatedGet, finalKcal);

    // Clasificación Somatotipo Heath-Carter
    let classif = '';
    const { endo=0, meso=0, ecto=0 } = isakResults;
    if (endo > meso && endo > ecto) classif = 'Endomorfo';
    else if (meso > endo && meso > ecto) classif = 'Mesomorfo';
    else if (ecto > endo && ecto > meso) classif = 'Ectomorfo';
    else if (endo > 0 && meso > 0 && ecto > 0) classif = 'Equilibrado';

    setCalc({ 
      imc, 
      geb: baseGeb, 
      get: calculatedGet, 
      finalKcal,
      bodyFat: isakResults.grasa_pct || 0,
      watsonAct: isakResults.watson_act || 0,
      somatotype: { endo, meso, ecto, classification: classif },
      isakDetails: isakResults,
      metabolismDetails: metabResults,
      projections
    });
  }, [formData]);

  const handleSave = () => {
    if (!formData.name) return alert('El nombre es obligatorio');
    
    // Create history snapshot
    const today = new Date().toLocaleDateString('es-ES');
    const newSnapshot = {
      date: today,
      weight: parseFloat(formData.weight) || 0,
      bodyFat: calc.bodyFat || 0,
      muscleMass: parseFloat(formData.muscleMass) || 0,
      imc: calc.imc || 0,
      waist: parseFloat(formData.waist) || 0,
      hip: parseFloat(formData.hip) || 0,
      bloodPressure: formData.bloodPressure || '',
      consultNotes: formData.consultNotes || '',
    };
    
    let updatedHistory = Array.isArray(formData.history) ? [...formData.history] : [];
    const todayIndex = updatedHistory.findIndex(h => h.date === today);
    if (todayIndex >= 0) {
      updatedHistory[todayIndex] = newSnapshot;
    } else {
      updatedHistory.push(newSnapshot);
    }
    
    // Leer de localStorage para NO sobreescribir el weeklyMenu si fue editado en DietBuilder
    const currentPatients = JSON.parse(localStorage.getItem('nutriplan_patients') || '[]');
    const existingPatient = formData.id ? currentPatients.find(p => p.id === formData.id) || {} : {};

    const finalData = { 
      ...existingPatient, // Preservar campos externos (como weeklyMenu, portionDistribution)
      ...formData,        // Aplicar cambios clínicos
      ...calc, 
      history: updatedHistory, 
      lastVisit: today 
    };
    
    if (formData.id) {
      const updatedList = currentPatients.map(p => p.id === formData.id ? finalData : p);
      setPatients(updatedList);
      localStorage.setItem('nutriplan_patients', JSON.stringify(updatedList));
    } else {
      const updatedList = [...currentPatients, { ...finalData, id: Date.now().toString() }];
      setPatients(updatedList);
      localStorage.setItem('nutriplan_patients', JSON.stringify(updatedList));
    }
    setView('list');
  };

  const createNew = () => {
    setFormData({ 
      id: '', name: '', age: '', gender: 'Femenino', phone: '', email: '', profileType: 'ADULT',
      chiefComplaint: '', nutritionalDiagnosis: '', medications: '', treatmentGoals: '', specialIndications: '', consultNotes: '', nextAppointment: '',
      pesProblem: '', pesEtiology: '', pesSigns: '',
      bristolType: 4, bowelFrequency: '1 a 2 veces al día', digestiveSymptoms: [],
      gestational_fum: '', gestational_preWeight: '', gestational_weeks: '', gestational_type: 'UNICO', gestational_bp: '', gestational_glucose: '', gestational_edema: 'Ausente', gestational_supplements: ['folic', 'iron'], gestational_fundalHeight: '',
      pediatric_birthWeight: '', pediatric_birthHeight: '', pediatric_headCircumference: '', pediatric_milkFeeding: 'LME', pediatric_complementaryType: 'BLW', pediatric_acStartMonth: '6', pediatric_milestones: '', pediatric_allergies: '',
      weight: '', idealWeight: '', height: '', waist: '', hip: '', abdominal: '',
      triceps: '', biceps: '', subscapular: '', supracrestal: '', supraespinal: '', abdominalFold: '', thigh: '', calfFold: '',
      humerus: '', femur: '', armCircumference: '', calfCircumference: '',
      visceralFat: '', fatMass: '', muscleMass: '', residualMass: '',
      glucose: '', hba1c: '', cholesterol: '', triglycerides: '', hdl: '', ldl: '', creatinina: '',
      pathologies: '', familyHistory: '', surgeries: '', allergies: '', bloodPressure: '',
      colitis: 'No', reflujo: 'No', estrenimiento: 'No', intestinalNotes: '',
      laboratorios_agregados: [], laboratorios_valores: {},
      fragilityIndex: '', sarcopeniaRisk: '',
      cycleDuration: '', abortions: '', cesareans: '', papDate: '', mastographyDate: '', menopauseDate: '', contraceptives: '', regularCycles: 'Sí', gynecoNotes: '',
      gastrointestinalNotes: '', cardiovascularNotes: '', endocrinoNotes: '', nerviosoNotes: '', musculoesqueleticoNotes: '', renalNotes: '', tegumentarioNotes: '',
      energyFormula: 'mifflin', rapidFactor: '25', waterIntake: '', mealsPerDay: '', appetiteLevel: '', physicalActivity: 'sedentary', sleepQuality: '', recall24h: '',
      photoFront: '', photoProfile: '', photoBack: '', profileImageUrl: '', history: [],
      stressFactor: '1.0', activityFactor: '1.2', strategy: 'Mantenimiento',
      assignedKcal: '', p_pct: 20, c_pct: 50, g_pct: 30, ml_kg: 35, targetWeight: '',
      assignedSupplements: []
    });
    setActiveTab('A');
    setView('edit');
  };

  if (view === 'edit') {
    return (
      <ErrorBoundary fallbackAction={() => setView('list')}>
      <div className="no-print p-4 md:p-6 h-full overflow-y-auto custom-scrollbar bg-transparent">
        <div className="flex justify-between items-center mb-6 shrink-0 bg-white/50 p-4 rounded-3xl backdrop-blur-md border border-white">
          <h2 className="text-xl font-bold text-slate-800">{formData.id ? 'Expediente Clínico' : 'Nuevo Expediente'}</h2>
          <div className="space-x-3 flex items-center">
            <button type="button" onClick={loadDemoPatient} className="btn-secondary py-2 text-sm bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 shadow-2xs flex items-center" title="Recargar consulta modelo al 100% con todos los datos clínicos"><Sparkles className="w-4 h-4 mr-1.5 text-teal-600" /> Paciente Modelo 100%</button>
            <button type="button" onClick={() => setShowWhatsAppModal(true)} className="btn-secondary py-2 text-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-2xs flex items-center"><Send className="w-4 h-4 mr-1.5 text-emerald-600" /> WhatsApp</button>
            <button type="button" onClick={() => setShowPrintModal(true)} className="btn-secondary py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700"><Printer className="w-4 h-4 mr-2" /> Imprimir / PDF</button>
            <button type="button" onClick={() => setView('list')} className="btn-secondary py-2 text-sm">Cancelar</button>
            <button type="button" onClick={handleSave} className="btn-primary py-2 text-sm"><Save className="w-4 h-4 mr-2" /> Guardar</button>
          </div>
        </div>

        {/* Encabezado Fijo */}
        <div className="card mb-6 flex flex-col md:flex-row gap-6 shrink-0 shadow-sm border-none bg-white items-center md:items-start">
          {/* Avatar / Foto de Perfil */}
          <div 
            className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-5xl cursor-pointer group relative shrink-0"
            title="Haz clic para añadir una URL de foto de perfil"
            onClick={() => {
              const url = window.prompt("Ingresa la URL de la foto del paciente (opcional):", formData.profileImageUrl || "");
              if (url !== null) setFormData({...formData, profileImageUrl: url});
            }}
          >
            {formData.profileImageUrl ? (
              <img src={formData.profileImageUrl} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              getProfileEmoji(formData.gender, formData.profileType)
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre Completo</label>
              <input type="text" className="w-full border-b-2 border-slate-100 bg-transparent py-1 font-bold text-lg focus:border-primary-500 outline-none transition-colors text-slate-800" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. Ana Pérez" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Edad</label>
              <input type="number" className="w-full border-b-2 border-slate-100 bg-transparent py-1 focus:border-primary-500 outline-none transition-colors text-slate-800 font-medium" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sexo</label>
              <select className="w-full border-b-2 border-slate-100 bg-transparent py-1 focus:border-primary-500 outline-none transition-colors text-slate-800 font-medium cursor-pointer" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option>Femenino</option>
                <option>Masculino</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Perfil</label>
              <select className="w-full border-b-2 border-slate-100 bg-transparent py-1 focus:border-primary-500 outline-none transition-colors font-bold text-primary-600 cursor-pointer" value={formData.profileType} onChange={e => setFormData({...formData, profileType: e.target.value})}>
                <option value="ADULT">Adulto</option>
                <option value="PEDIATRIC">Pediátrico</option>
                <option value="GESTATIONAL">Gestacional</option>
                <option value="GERIATRIC">Adulto Mayor</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teléfono</label>
              <input type="text" className="w-full border-b-2 border-slate-100 bg-transparent py-1 focus:border-primary-500 outline-none transition-colors text-slate-800 font-medium" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
        </div>

        {/* MOTIVO DE CONSULTA + DIAGNÓSTICO + MEDICAMENTOS */}
        <div className="card mb-6 shrink-0 shadow-sm border-none bg-white space-y-4">
          <div className="flex items-center gap-2 text-primary-700 border-b border-slate-100 pb-2">
            <ClipboardList className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Consulta Actual</h3>
            {formData.nextAppointment && (
              <span className="ml-auto text-xs font-bold bg-primary-50 text-primary-700 px-3 py-1 rounded-full border border-primary-200">
                <CalendarIcon className="w-3 h-3 inline mr-1" />Próxima cita: {formData.nextAppointment}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Motivo de Consulta</label>
              <textarea className="input-field h-16" placeholder="Ej: Paciente acude por deseo de bajar de peso, referida por endocrinólogo..." value={formData.chiefComplaint} onChange={e => setFormData({...formData, chiefComplaint: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Diagnóstico Nutricional</label>
              <textarea className="input-field h-16" placeholder="Ej: Obesidad grado I (IMC 32.1) por exceso de ingesta calórica y sedentarismo" value={formData.nutritionalDiagnosis} onChange={e => setFormData({...formData, nutritionalDiagnosis: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">💊 Medicamentos Actuales</label>
              <textarea className="input-field h-16" placeholder="Ej: Metformina 850mg c/12h, Levotiroxina 50mcg/día, Losartán 50mg/día" value={formData.medications} onChange={e => setFormData({...formData, medications: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">🎯 Objetivos del Tratamiento</label>
              <textarea className="input-field h-16" placeholder="Ej: Reducir HbA1c a <7% en 3 meses, bajar 5kg en 8 semanas, mejorar perfil lipídico" value={formData.treatmentGoals} onChange={e => setFormData({...formData, treatmentGoals: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">⚠️ Indicaciones Especiales</label>
              <input type="text" className="input-field" placeholder="Ej: Sin lácteos, máx 1500mg sodio, alimentación blanda" value={formData.specialIndications} onChange={e => setFormData({...formData, specialIndications: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">📅 Próxima Cita</label>
              <input type="date" className="input-field" value={formData.nextAppointment} onChange={e => setFormData({...formData, nextAppointment: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">📝 Notas de Seguimiento (esta consulta)</label>
            <textarea className="input-field h-20" placeholder="Ej: Paciente refiere buena adherencia, redujo refrescos a 1/semana, mejoró sueño. Se ajusta plan a 1600kcal." value={formData.consultNotes} onChange={e => setFormData({...formData, consultNotes: e.target.value})} />
          </div>
        </div>

        {/* TABS ABCDE */}
        <div className="flex flex-wrap gap-2 mb-6 shrink-0">
          <button onClick={() => setActiveTab('E')} className={`px-5 py-2.5 flex items-center gap-2 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'E' ? 'bg-white text-primary-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-black/5'}`}><TrendingUp className="w-4 h-4"/> Evolución</button>
          <button onClick={() => setActiveTab('A')} className={`px-5 py-2.5 flex items-center gap-2 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'A' ? 'bg-white text-primary-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-black/5'}`}><Activity className="w-4 h-4"/> Antropometría</button>
          <button onClick={() => setActiveTab('M')} className={`px-5 py-2.5 flex items-center gap-2 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'M' ? 'bg-white text-primary-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-black/5'}`}><Zap className="w-4 h-4"/> Metabolismo y Dieto</button>
          <button onClick={() => setActiveTab('B')} className={`px-5 py-2.5 flex items-center gap-2 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'B' ? 'bg-white text-primary-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-black/5'}`}><HeartPulse className="w-4 h-4"/> Bioquímica</button>
          <button onClick={() => setActiveTab('C')} className={`px-5 py-2.5 flex items-center gap-2 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'C' ? 'bg-white text-primary-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-black/5'}`}><Stethoscope className="w-4 h-4"/> Clínico</button>
          <button onClick={() => setActiveTab('D')} className={`px-5 py-2.5 flex items-center gap-2 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'D' ? 'bg-white text-primary-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-black/5'}`}><Coffee className="w-4 h-4"/> Dieta</button>
          <button onClick={() => setActiveTab('S')} className={`px-5 py-2.5 flex items-center gap-2 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'S' ? 'bg-white text-primary-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-black/5'}`}><Pill className="w-4 h-4"/> Suplementos</button>
          <button onClick={() => setActiveTab('P')} className={`px-5 py-2.5 flex items-center gap-2 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'P' ? 'bg-white text-primary-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-black/5'}`}><ImageIcon className="w-4 h-4"/> Fotos</button>
        </div>

        <div className="pb-16">
          {activeTab === 'E' && (
            <div className="space-y-6">
              {(!formData.history || formData.history.length === 0) ? (
                <div className="card text-center p-12 text-slate-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-2">No hay historial clínico</h3>
                  <p>Guarda el expediente por primera vez para generar la visita inicial de este paciente.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* PANEL COMPARATIVO: Cambios desde última consulta */}
                  {formData.history.length >= 2 && (() => {
                    const current = formData.history[formData.history.length - 1];
                    const prev = formData.history[formData.history.length - 2];
                    const delta = (curr, old) => {
                      if (curr === undefined || curr === null || old === undefined || old === null) return null;
                      const c = parseFloat(curr);
                      const o = parseFloat(old);
                      if (isNaN(c) || isNaN(o)) return null;
                      return parseFloat((c - o).toFixed(1));
                    };
                    const DeltaChip = ({ label, value, unit, inverted = false }) => {
                      if (value === null || value === 0) return <div className="text-center"><span className="text-xs text-slate-400 block">{label}</span><span className="font-bold text-slate-600">Sin cambio</span></div>;
                      const isGood = inverted ? value > 0 : value < 0;
                      return (
                        <div className="text-center">
                          <span className="text-xs text-slate-400 block mb-1">{label}</span>
                          <span className={`font-black text-lg ${isGood ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {value > 0 ? '+' : ''}{value}{unit}
                          </span>
                          <span className="block">{isGood ? <ArrowDown className="w-4 h-4 mx-auto text-emerald-500" /> : <ArrowUp className="w-4 h-4 mx-auto text-rose-500" />}</span>
                        </div>
                      );
                    };
                    return (
                      <div className="card lg:col-span-2 bg-gradient-to-r from-primary-50 to-emerald-50 border-primary-100">
                        <h3 className="font-bold text-primary-800 border-b border-primary-100 pb-2 mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" /> Cambios desde última consulta
                          <span className="text-xs font-normal text-slate-500 ml-2">({prev.date} → {current.date})</span>
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                          <DeltaChip label="Peso" value={delta(current.weight, prev.weight)} unit="kg" />
                          <DeltaChip label="IMC" value={delta(current.imc, prev.imc)} unit="" />
                          <DeltaChip label="% Grasa" value={delta(current.bodyFat, prev.bodyFat)} unit="%" />
                          <DeltaChip label="Músculo" value={delta(current.muscleMass, prev.muscleMass)} unit="kg" inverted />
                          <DeltaChip label="Cintura" value={delta(current.waist, prev.waist)} unit="cm" />
                          <DeltaChip label="Cadera" value={delta(current.hip, prev.hip)} unit="cm" />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Gráfica de Peso */}
                  <div className="card">
                    <h3 className="font-semibold text-lg text-primary-700 border-b border-slate-100 pb-2 mb-4 flex justify-between items-center">
                      <span>Evolución de Peso (kg)</span>
                      <span className="text-sm font-normal text-slate-500">{formData.history.length} consultas</span>
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formData.history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                            labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
                          />
                          <Line type="monotone" dataKey="weight" name="Peso (kg)" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Gráfica de Grasa vs Músculo */}
                  <div className="card">
                    <h3 className="font-semibold text-lg text-primary-700 border-b border-slate-100 pb-2 mb-4 flex justify-between items-center">
                      <span>Composición Corporal</span>
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formData.history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'auto']} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                            labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                          <Line type="monotone" dataKey="bodyFat" name="% Grasa" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="muscleMass" name="Masa Muscular (kg)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Gráfica de Cintura / ICC */}
                  {formData.history.some(h => h.waist > 0) && (
                    <div className="card">
                      <h3 className="font-semibold text-lg text-rose-700 border-b border-rose-100 pb-2 mb-4 flex justify-between items-center">
                        <span>Evolución de Cintura (cm)</span>
                        <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-full">Riesgo Metabólico</span>
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={formData.history.filter(h => h.waist > 0)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                            <Line type="monotone" dataKey="waist" name="Cintura (cm)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="hip" name="Cadera (cm)" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Tabla de Historial — ahora incluye cintura, notas */}
                  <div className={`card ${formData.history.some(h => h.waist > 0) ? '' : 'lg:col-span-2'}`}>
                    <h3 className="font-semibold text-lg text-primary-700 border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary-500" /> Registro de Consultas
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th className="pb-3 px-4 font-semibold">Fecha</th>
                            <th className="pb-3 px-4 font-semibold">Peso</th>
                            <th className="pb-3 px-4 font-semibold">IMC</th>
                            <th className="pb-3 px-4 font-semibold">% Grasa</th>
                            <th className="pb-3 px-4 font-semibold">M. Muscular</th>
                            <th className="pb-3 px-4 font-semibold">Cintura</th>
                            <th className="pb-3 px-4 font-semibold">PA</th>
                            <th className="pb-3 px-4 font-semibold">Notas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.history.map((record, idx) => (
                            <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-4 font-medium text-slate-700">{record.date}</td>
                              <td className="py-3 px-4 text-slate-600">{record.weight ? `${Number(record.weight).toFixed(1)} kg` : '-'}</td>
                              <td className="py-3 px-4 text-slate-600">{record.imc ? Number(record.imc).toFixed(1) : '-'}</td>
                              <td className="py-3 px-4 text-amber-600 font-medium">{record.bodyFat ? `${Number(record.bodyFat).toFixed(1)}%` : '-'}</td>
                              <td className="py-3 px-4 text-blue-600 font-medium">{record.muscleMass ? `${Number(record.muscleMass).toFixed(1)} kg` : '-'}</td>
                              <td className="py-3 px-4 text-rose-600 font-medium">{record.waist ? `${Number(record.waist).toFixed(1)} cm` : '-'}</td>
                              <td className="py-3 px-4 text-slate-600 text-xs">{record.bloodPressure || '-'}</td>
                              <td className="py-3 px-4 text-slate-500 text-xs max-w-xs truncate" title={record.consultNotes || ''}>{record.consultNotes || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'A' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 space-y-6">
                <div className="card">
                  <h3 className="font-semibold text-lg text-primary-700 border-b border-slate-100 pb-2 mb-4">Antropometría Básica</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div><label className="block text-xs text-slate-500 mb-1 uppercase">Peso Actual (kg)</label><input type="number" step="0.1" className="input-field" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} /></div>
                    <div><label className="block text-xs text-slate-500 mb-1 uppercase">Talla (cm)</label><input type="number" className="input-field" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} /></div>
                    <div><label className="block text-xs text-slate-500 mb-1 uppercase">Cintura (cm)</label><input type="number" step="0.1" className="input-field" value={formData.waist} onChange={e => setFormData({...formData, waist: e.target.value})} /></div>
                    <div><label className="block text-xs text-slate-500 mb-1 uppercase">Cadera (cm)</label><input type="number" step="0.1" className="input-field" value={formData.hip} onChange={e => setFormData({...formData, hip: e.target.value})} /></div>
                    <div><label className="block text-xs text-slate-500 mb-1 uppercase">Abdominal (cm)</label><input type="number" step="0.1" className="input-field" value={formData.abdominal} onChange={e => setFormData({...formData, abdominal: e.target.value})} /></div>
                  </div>
                </div>

                {/* Índices Cardiometabólicos y Calculadora Multimétodo de Peso Ideal (Nutrimind Style) */}
                <CardioMetabolicCard
                  waist={formData.waist}
                  hip={formData.hip}
                  height={formData.height}
                  gender={formData.gender}
                  weight={formData.weight}
                  onSelectIdealWeight={(val) => setFormData(prev => ({ ...prev, idealWeight: val, targetWeight: val }))}
                />

                <div className="card">
                  <h3 className="font-semibold text-lg text-primary-700 border-b border-slate-100 pb-2 mb-4">Pliegues (mm)</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div><label className="block text-xs text-slate-500 mb-1">Tríceps</label><input type="number" step="0.1" className="input-field" value={formData.triceps} onChange={e => setFormData({...formData, triceps: e.target.value})} /></div>
                    <div><label className="block text-xs text-slate-500 mb-1">Bíceps</label><input type="number" step="0.1" className="input-field" value={formData.biceps} onChange={e => setFormData({...formData, biceps: e.target.value})} /></div>
                    <div><label className="block text-xs text-slate-500 mb-1">Subescapular</label><input type="number" step="0.1" className="input-field" value={formData.subscapular} onChange={e => setFormData({...formData, subscapular: e.target.value})} /></div>
                    <div><label className="block text-xs text-slate-500 mb-1">Supracrestal</label><input type="number" step="0.1" className="input-field" value={formData.supracrestal} onChange={e => setFormData({...formData, supracrestal: e.target.value})} /></div>
                    <div><label className="block text-xs text-slate-500 mb-1">Supraespinal</label><input type="number" step="0.1" className="input-field" value={formData.supraespinal} onChange={e => setFormData({...formData, supraespinal: e.target.value})} /></div>
                    <div><label className="block text-xs text-slate-500 mb-1">Abdominal</label><input type="number" step="0.1" className="input-field" value={formData.abdominalFold} onChange={e => setFormData({...formData, abdominalFold: e.target.value})} /></div>
                    <div><label className="block text-xs text-slate-500 mb-1">Muslo Frontal</label><input type="number" step="0.1" className="input-field" value={formData.thigh} onChange={e => setFormData({...formData, thigh: e.target.value})} /></div>
                    <div><label className="block text-xs text-slate-500 mb-1">Pantorrilla</label><input type="number" step="0.1" className="input-field" value={formData.calfFold} onChange={e => setFormData({...formData, calfFold: e.target.value})} /></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="font-semibold text-lg text-primary-700 border-b border-slate-100 pb-2 mb-4">Perímetros y Diámetros</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs text-slate-500 mb-1">D. Húmero (cm)</label><input type="number" step="0.1" className="input-field" value={formData.humerus} onChange={e => setFormData({...formData, humerus: e.target.value})} /></div>
                      <div><label className="block text-xs text-slate-500 mb-1">D. Fémur (cm)</label><input type="number" step="0.1" className="input-field" value={formData.femur} onChange={e => setFormData({...formData, femur: e.target.value})} /></div>
                      <div><label className="block text-xs text-slate-500 mb-1">P. Brazo (cm)</label><input type="number" step="0.1" className="input-field" value={formData.armCircumference} onChange={e => setFormData({...formData, armCircumference: e.target.value})} /></div>
                      <div><label className="block text-xs text-slate-500 mb-1">P. Pantorrilla (cm)</label><input type="number" step="0.1" className="input-field" value={formData.calfCircumference} onChange={e => setFormData({...formData, calfCircumference: e.target.value})} /></div>
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="font-semibold text-lg text-primary-700 border-b border-slate-100 pb-2 mb-4">Bioimpedancia Eléctrica</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs text-slate-500 mb-1">Grasa Visceral</label><input type="number" step="0.1" className="input-field" value={formData.visceralFat} onChange={e => setFormData({...formData, visceralFat: e.target.value})} /></div>
                      <div><label className="block text-xs text-slate-500 mb-1">Masa Grasa (kg)</label><input type="number" step="0.1" className="input-field" value={formData.fatMass} onChange={e => setFormData({...formData, fatMass: e.target.value})} /></div>
                      <div><label className="block text-xs text-slate-500 mb-1">Masa Muscular (kg)</label><input type="number" step="0.1" className="input-field" value={formData.muscleMass} onChange={e => setFormData({...formData, muscleMass: e.target.value})} /></div>
                      <div><label className="block text-xs text-slate-500 mb-1">Masa Residual</label><input type="number" step="0.1" className="input-field" value={formData.residualMass} onChange={e => setFormData({...formData, residualMass: e.target.value})} /></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar de Resultados Antropométricos */}
              <div className="col-span-4 space-y-6">
                <div className="card bg-slate-900 text-white border-none shadow-xl">
                  <h3 className="font-bold text-xl mb-4 text-slate-200 border-b border-slate-700 pb-2">Composición (4 Componentes)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                      <span className="text-slate-300">Grasa (Yuhasz)</span>
                      <span className="font-bold text-xl text-yellow-400">{Number(calc.isakDetails?.grasa_kg || 0).toFixed(1)} <span className="text-sm">kg</span></span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                      <span className="text-slate-300">Músculo (Lee)</span>
                      <span className="font-bold text-xl text-rose-400">{Number(calc.isakDetails?.musculo_kg || 0).toFixed(1)} <span className="text-sm">kg</span></span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                      <span className="text-slate-300">Ósea (Rocha)</span>
                      <span className="font-bold text-xl text-slate-200">{Number(calc.isakDetails?.osea_kg || 0).toFixed(1)} <span className="text-sm">kg</span></span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                      <span className="text-slate-300">Residual (Wurch)</span>
                      <span className="font-bold text-xl text-blue-300">{Number(calc.isakDetails?.residual_kg || 0).toFixed(1)} <span className="text-sm">kg</span></span>
                    </div>
                    <div className="flex justify-between items-center bg-cyan-900/50 border border-cyan-800 p-3 rounded-lg mt-4">
                      <span className="text-cyan-300 text-sm">Agua (Watson)</span>
                      <span className="font-bold text-xl text-cyan-400">{Number(calc.watsonAct || 0).toFixed(2)} <span className="text-sm">L</span></span>
                    </div>
                  </div>
                </div>

                <div className="card shadow-xl">
                  <h3 className="font-bold text-slate-700 border-b border-slate-100 pb-2 mb-4 text-center">Somatocarta</h3>
                  <Somatocarta endo={calc.somatotype?.endo || 0} meso={calc.somatotype?.meso || 0} ecto={calc.somatotype?.ecto || 0} />
                  <div className="text-center mt-4 pt-4 border-t border-slate-100">
                    <span className="font-black text-primary-600 text-lg">{calc.somatotype?.classification || '-'}</span>
                    <div className="flex justify-center gap-4 mt-2 text-xs font-bold text-slate-500">
                       <span>Endo: {Number(calc.somatotype?.endo || 0).toFixed(1)}</span>
                       <span>Meso: {Number(calc.somatotype?.meso || 0).toFixed(1)}</span>
                       <span>Ecto: {Number(calc.somatotype?.ecto || 0).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'M' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card shadow-md space-y-6">
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4"><Zap className="w-5 h-5 text-amber-500" /> Metabolismo Basal</h2>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">1. Ecuación Predictiva</label>
                      <button
                        type="button"
                        onClick={() => setShowFormulaModal(true)}
                        className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Fórmulas Propias...
                      </button>
                    </div>
                    <select className="input-field font-semibold text-slate-700" value={formData.energyFormula} onChange={e => setFormData({...formData, energyFormula: e.target.value})}>
                      <option value="mifflin">Mifflin-St Jeor ({calc.metabolismDetails?.mifflin || 0} kcal)</option>
                      <option value="harris">Harris-Benedict ({calc.metabolismDetails?.harris || 0} kcal)</option>
                      <option value="valencia">Valencia ({calc.metabolismDetails?.valencia || 0} kcal)</option>
                      <option value="owens">Owens ({calc.metabolismDetails?.owens || 0} kcal)</option>
                      <option value="cunningham">Cunningham ({calc.metabolismDetails?.cunningham || 0} kcal)</option>
                      <option value="tinsley">Tinsley ({calc.metabolismDetails?.tinsley || 0} kcal)</option>
                      {customFormulas.map(cf => (
                        <option key={cf.id} value={`custom_${cf.id}`}>
                          ★ {cf.name} ({calc.metabolismDetails?.[`custom_${cf.id}`] || calc.geb} kcal)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">2. Factor de Actividad Física</label>
                    <select className="input-field font-semibold text-slate-700" value={formData.activityFactor} onChange={e => setFormData({...formData, activityFactor: e.target.value})}>
                      <option value="1.2">Sedentario (1.2)</option>
                      <option value="1.375">Ligero (1.375)</option>
                      <option value="1.55">Moderado (1.55)</option>
                      <option value="1.725">Activo (1.725)</option>
                      <option value="1.9">Atleta Rendimiento (1.9)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">3. Factor de Estrés</label>
                    <select className="input-field font-semibold text-slate-700" value={formData.stressFactor} onChange={e => setFormData({...formData, stressFactor: e.target.value})}>
                      <option value="1.0">Ninguno / Sano (1.0)</option>
                      <option value="1.1">Cirugía Menor (1.1)</option>
                      <option value="1.2">Infección Leve (1.2)</option>
                      <option value="1.35">Trauma Esquelético (1.35)</option>
                      <option value="1.5">Sepsis / Cáncer (1.5)</option>
                      <option value="1.6">Quemaduras Moderadas (1.6)</option>
                    </select>
                  </div>
                </div>

                <div className="card shadow-md space-y-6 bg-slate-900 text-white border-none">
                  <h2 className="text-xl font-black text-slate-100 flex items-center gap-2 border-b border-slate-700 pb-4"><Activity className="w-5 h-5 text-teal-400" /> Prescripción Final</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setFormData({...formData, strategy: 'Mantenimiento', assignedKcal: ''})} className={`p-3 rounded-xl text-xs font-bold uppercase transition-all ${formData.strategy === 'Mantenimiento' ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Mantenimiento</button>
                    <button onClick={() => setFormData({...formData, strategy: 'Déficit Calórico', assignedKcal: ''})} className={`p-3 rounded-xl text-xs font-bold uppercase transition-all ${formData.strategy === 'Déficit Calórico' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Déficit (-500)</button>
                    <button onClick={() => setFormData({...formData, strategy: 'Superávit Calórico', assignedKcal: ''})} className={`p-3 rounded-xl text-xs font-bold uppercase transition-all ${formData.strategy === 'Superávit Calórico' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Superávit (+500)</button>
                    <button onClick={() => setFormData({...formData, strategy: 'Personalizado'})} className={`p-3 rounded-xl text-xs font-bold uppercase transition-all ${formData.strategy === 'Personalizado' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Manual</button>
                  </div>

                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Gasto Energético Total</p>
                    <p className="text-3xl font-black text-slate-300 mb-6">{calc.get} <span className="text-sm text-slate-500">kcal</span></p>
                    
                    <p className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2">Kcal a Prescribir</p>
                    <input type="number" className="bg-transparent border-b-2 border-teal-500 text-5xl font-black text-white text-center w-full focus:outline-none pb-2" value={formData.assignedKcal !== '' ? formData.assignedKcal : calc.finalKcal} onChange={e => setFormData({...formData, assignedKcal: e.target.value, strategy: 'Personalizado'})} placeholder={calc.finalKcal} />
                  </div>
                </div>
              </div>

              <div className="card shadow-md">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-6"><TrendingUp className="w-5 h-5 text-indigo-500" /> Proyección de Metas (-7,200 kcal/kg)</h2>
                
                <div className="flex items-center gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <label className="text-sm font-bold text-slate-600">Peso Ideal Objetivo:</label>
                  <input type="number" step="0.1" className="input-field w-32 font-black text-lg text-indigo-600 text-center" value={formData.targetWeight} onChange={e => setFormData({...formData, targetWeight: e.target.value})} placeholder="Ej. 70" />
                  <span className="font-bold text-slate-400">kg</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse">
                    <thead className="bg-slate-100 text-xs uppercase font-black text-slate-500">
                      <tr>
                        <th className="p-3 text-left">Meta</th>
                        <th className="p-3 text-rose-500">Peso a Perder</th>
                        <th className="p-3">Semanas (con déficit actual)</th>
                        <th className="p-3 text-teal-600">Déficit req. (1 mes)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-left">Llegar a Ideal</td>
                        <td className="p-3 text-rose-600 font-bold">{Number(calc.projections?.exceso || 0).toFixed(1)} kg</td>
                        <td className="p-3">{calc.projections?.tiempo_ideal?.sem || '-'}</td>
                        <td className="p-3 text-teal-600 font-bold">-{calc.projections?.req_ideal?.m1 || 0} kcal</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-left">Reducir 10%</td>
                        <td className="p-3 text-amber-600 font-bold">{Number(calc.projections?.meta_10 || 0).toFixed(1)} kg</td>
                        <td className="p-3">{calc.projections?.tiempo_10?.sem || '-'}</td>
                        <td className="p-3 text-teal-600 font-bold">-{calc.projections?.req_10?.m1 || 0} kcal</td>
                      </tr>
                    </tbody>
                  </table>
                  {(calc.projections?.deficit_diario || 0) <= 0 && <p className="text-center text-rose-500 text-xs font-bold mt-4">Requiere un déficit calórico para calcular tiempos.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'B' && (
            <div className="space-y-6">
              <div className="card max-w-4xl">
                <div className="border-b border-slate-100 pb-3 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-semibold text-lg text-primary-700 flex items-center gap-2">
                      <HeartPulse className="w-5 h-5" /> Parámetros Bioquímicos
                    </h3>
                    <p className="text-xs text-slate-400">Valores analíticos de laboratorio con semáforo clínico de referencia.</p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowLabOrderModal(true)}
                      className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Prescribir Orden de Laboratorio (PDF)
                    </button>
                    <div className="relative flex-1 sm:w-60">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar estudio (ej. Glucosa)..." 
                        className="input-field pl-9 py-1.5 text-sm"
                        value={labSearch}
                        onChange={e => setLabSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {labSearch && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Resultados de búsqueda</h4>
                    <div className="space-y-2">
                      {CATALOGO_LABORATORIOS.filter(lab => lab.nombre.toLowerCase().includes(labSearch.toLowerCase())).map(lab => (
                        <div key={lab.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100 shadow-sm hover:border-primary-300 transition-colors">
                          <div>
                            <span className="font-semibold text-slate-700 text-sm">{lab.nombre}</span>
                            <span className="text-xs text-slate-400 ml-2">({lab.grupo})</span>
                          </div>
                          <button 
                            onClick={() => {
                              if (!formData.laboratorios_agregados?.includes(lab.id)) {
                                setFormData({
                                  ...formData, 
                                  laboratorios_agregados: [...(formData.laboratorios_agregados || []), lab.id]
                                });
                              }
                              setLabSearch('');
                            }}
                            className="text-primary-600 hover:bg-primary-50 p-1 rounded-md transition-colors"
                          >
                            <PlusCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-6">
                  {formData.laboratorios_agregados?.map(labId => {
                    const lab = CATALOGO_LABORATORIOS.find(l => l.id === labId);
                    if (!lab) return null;
                    const val = parseFloat(formData.laboratorios_valores?.[lab.id]);
                    const hasVal = !isNaN(val);
                    const isLow = hasVal && val < lab.ref_min;
                    const isHigh = hasVal && val > lab.ref_max;
                    const isOutOfRange = isLow || isHigh;
                    return (
                      <div key={lab.id} className={`relative group rounded-xl p-3 border-2 transition-colors ${isOutOfRange ? (isHigh ? 'border-rose-300 bg-rose-50/60' : 'border-amber-300 bg-amber-50/60') : hasVal ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-100 bg-white'}`}>
                        <label className="block text-sm text-slate-600 mb-1 font-semibold">{lab.nombre} <span className="text-xs text-slate-400 font-normal">({lab.unidad})</span></label>
                        <div className="flex items-center">
                          <input 
                            type="number" 
                            step="0.01"
                            className={`input-field pr-8 ${isOutOfRange ? 'font-black' : ''}`}
                            style={isOutOfRange ? { color: isHigh ? '#dc2626' : '#d97706' } : {}}
                            value={formData.laboratorios_valores?.[lab.id] || ''} 
                            onChange={e => setFormData({...formData, laboratorios_valores: {...(formData.laboratorios_valores || {}), [lab.id]: e.target.value}})} 
                          />
                          <button 
                            onClick={() => setFormData({...formData, laboratorios_agregados: formData.laboratorios_agregados.filter(id => id !== lab.id)})}
                            className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-opacity"
                            title="Quitar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-slate-400">Ref: {lab.ref_min} - {lab.ref_max}</span>
                          {isOutOfRange && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${isHigh ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'}`}>
                              <AlertTriangle className="w-3 h-3" />
                              {isHigh ? '↑ ALTO' : '↓ BAJO'}
                            </span>
                          )}
                          {hasVal && !isOutOfRange && (
                            <span className="text-[10px] font-bold text-emerald-600">✓ Normal</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {(!formData.laboratorios_agregados || formData.laboratorios_agregados.length === 0) && (
                    <div className="col-span-3 text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                      <p>No hay estudios agregados.</p>
                      <p className="text-sm">Usa el buscador de arriba para añadir parámetros.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'C' && (
            <div className="grid grid-cols-2 gap-6">
              {/* Diagnóstico PES Estandarizado (AND / ADA) */}
              <div className="col-span-2">
                <PesDiagnosis
                  problem={formData.pesProblem || ''}
                  etiology={formData.pesEtiology || ''}
                  signs={formData.pesSigns || ''}
                  onProblemChange={val => setFormData({...formData, pesProblem: val})}
                  onEtiologyChange={val => setFormData({...formData, pesEtiology: val})}
                  onSignsChange={val => setFormData({...formData, pesSigns: val})}
                />
              </div>

              {/* Módulo Especial Condicional: Pediátrico */}
              {formData.profileType === 'PEDIATRIC' && (
                <div className="col-span-2">
                  <PediatricModule formData={formData} setFormData={setFormData} />
                </div>
              )}

              {/* Módulo Especial Condicional: Gestacional */}
              {formData.profileType === 'GESTATIONAL' && (
                <div className="col-span-2">
                  <GestationalModule formData={formData} setFormData={setFormData} />
                </div>
              )}

              <div className="card space-y-4 col-span-2">
                <h3 className="font-semibold text-lg text-primary-700 border-b border-slate-100 pb-2">Antecedentes Personales y Heredofamiliares</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm text-slate-600 mb-1 font-semibold">Patologías Personales (Dx)</label><textarea className="input-field h-20" value={formData.pathologies} onChange={e => setFormData({...formData, pathologies: e.target.value})} placeholder="Ej. Diabetes Tipo 2, Hipotiroidismo..." /></div>
                  <div><label className="block text-sm text-slate-600 mb-1 font-semibold">Antecedentes Familiares</label><textarea className="input-field h-20" value={formData.familyHistory} onChange={e => setFormData({...formData, familyHistory: e.target.value})} placeholder="Ej. Abuela materna con HTA..." /></div>
                  <div><label className="block text-sm text-slate-600 mb-1 font-semibold">Cirugías</label><textarea className="input-field h-16" value={formData.surgeries} onChange={e => setFormData({...formData, surgeries: e.target.value})} /></div>
                  <div className="space-y-4">
                    <div><label className="block text-sm text-slate-600 mb-1 font-semibold">Alergias / Intolerancias</label><input type="text" className="input-field" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-600 mb-1 font-semibold">Presión Arterial (Última toma)</label><input type="text" placeholder="120/80" className="input-field" value={formData.bloodPressure} onChange={e => setFormData({...formData, bloodPressure: e.target.value})} /></div>
                  </div>
                </div>
              </div>

              <div className="card space-y-4">
                <h3 className="font-semibold text-lg text-teal-700 border-b border-teal-100 pb-2 flex items-center gap-2"><HeartPulse className="w-5 h-5" /> Cardiovascular y Respiratorio</h3>
                <div><label className="block text-sm text-slate-600 mb-1">Signos y Síntomas (Ej. disnea, palpitaciones, asma, apnea del sueño)</label><textarea className="input-field h-20" value={formData.cardiovascularNotes} onChange={e => setFormData({...formData, cardiovascularNotes: e.target.value})} /></div>
              </div>

              <div className="card space-y-4 col-span-2">
                <h3 className="font-semibold text-lg text-emerald-700 border-b border-emerald-100 pb-2 flex items-center gap-2">
                  <Coffee className="w-5 h-5" /> Aparato Digestivo y Escala de Bristol
                </h3>
                <BristolScale
                  value={formData.bristolType || 4}
                  onChange={val => setFormData({...formData, bristolType: val})}
                  frequency={formData.bowelFrequency || '1 a 2 veces al día'}
                  onFrequencyChange={val => setFormData({...formData, bowelFrequency: val})}
                  symptoms={formData.digestiveSymptoms || []}
                  onSymptomsChange={val => setFormData({...formData, digestiveSymptoms: val})}
                />
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Notas Digestivas Adicionales (tratamiento farmacológico, probióticos, alimentos no tolerados)
                  </label>
                  <textarea 
                    className="input-field h-16 text-xs bg-white" 
                    value={formData.gastrointestinalNotes || ''} 
                    onChange={e => setFormData({...formData, gastrointestinalNotes: e.target.value})} 
                    placeholder="Ej: Empeora distensión con leguminosas sin remojo; toma omeprazol por las mañanas..."
                  />
                </div>
              </div>

              <div className="card space-y-4">
                <h3 className="font-semibold text-lg text-amber-700 border-b border-amber-100 pb-2 flex items-center gap-2"><Zap className="w-5 h-5" /> Endocrino y Metabólico</h3>
                <div><label className="block text-sm text-slate-600 mb-1">Signos (Ej. resistencia insulina, alteraciones tiroideas, termorregulación)</label><textarea className="input-field h-20" value={formData.endocrinoNotes} onChange={e => setFormData({...formData, endocrinoNotes: e.target.value})} /></div>
              </div>

              <div className="card space-y-4">
                <h3 className="font-semibold text-lg text-indigo-700 border-b border-indigo-100 pb-2 flex items-center gap-2"><Activity className="w-5 h-5" /> Nervioso y Psicológico</h3>
                <div><label className="block text-sm text-slate-600 mb-1">Signos (Ej. ansiedad, estrés crónico, depresión, cefaleas)</label><textarea className="input-field h-20" value={formData.nerviosoNotes} onChange={e => setFormData({...formData, nerviosoNotes: e.target.value})} /></div>
              </div>

              <div className="card space-y-4">
                <h3 className="font-semibold text-lg text-rose-700 border-b border-rose-100 pb-2 flex items-center gap-2"><User className="w-5 h-5" /> Musculoesquelético</h3>
                <div><label className="block text-sm text-slate-600 mb-1">Signos (Ej. dolor articular, lesiones, debilidad, calambres)</label><textarea className="input-field h-20" value={formData.musculoesqueleticoNotes} onChange={e => setFormData({...formData, musculoesqueleticoNotes: e.target.value})} /></div>
              </div>

              <div className="card space-y-4">
                <h3 className="font-semibold text-lg text-sky-700 border-b border-sky-100 pb-2 flex items-center gap-2"><Droplet className="w-5 h-5" /> Renal y Tegumentario</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm text-slate-600 mb-1">Renal (Infecciones, retención de líquidos)</label><textarea className="input-field h-12" value={formData.renalNotes} onChange={e => setFormData({...formData, renalNotes: e.target.value})} /></div>
                  <div><label className="block text-sm text-slate-600 mb-1">Tegumentario (Caída de cabello, uñas, manchas, acantosis)</label><textarea className="input-field h-12" value={formData.tegumentarioNotes} onChange={e => setFormData({...formData, tegumentarioNotes: e.target.value})} /></div>
                </div>
              </div>

              {formData.profileType === 'GERIATRIC' && (
                <div className="card col-span-2 space-y-4 border-amber-200 bg-amber-50">
                  <h3 className="font-semibold text-lg text-amber-700 border-b border-amber-200 pb-2">Valoración Geriátrica</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm text-slate-600 mb-1">Índice de Fragilidad</label><input type="text" className="input-field bg-white" value={formData.fragilityIndex} onChange={e => setFormData({...formData, fragilityIndex: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-600 mb-1">Riesgo de Sarcopenia</label><input type="text" className="input-field bg-white" value={formData.sarcopeniaRisk} onChange={e => setFormData({...formData, sarcopeniaRisk: e.target.value})} /></div>
                  </div>
                </div>
              )}

              {formData.gender === 'Femenino' && (
                <div className="card col-span-2 space-y-4 border-pink-100 bg-pink-50/30">
                  <h3 className="font-semibold text-lg text-pink-600 border-b border-pink-100 pb-2">Ginecología / Control Prenatal</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div><label className="block text-sm text-slate-600 mb-1">Duración del Ciclo</label><input type="text" className="input-field bg-white" value={formData.cycleDuration} onChange={e => setFormData({...formData, cycleDuration: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-600 mb-1">Ciclos Regulares</label><select className="input-field bg-white" value={formData.regularCycles} onChange={e => setFormData({...formData, regularCycles: e.target.value})}><option>Sí</option><option>No</option></select></div>
                    <div><label className="block text-sm text-slate-600 mb-1">Anticonceptivos</label><input type="text" className="input-field bg-white" value={formData.contraceptives} onChange={e => setFormData({...formData, contraceptives: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-600 mb-1">Abortos</label><input type="number" className="input-field bg-white" value={formData.abortions} onChange={e => setFormData({...formData, abortions: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-600 mb-1">Cesáreas</label><input type="number" className="input-field bg-white" value={formData.cesareans} onChange={e => setFormData({...formData, cesareans: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-600 mb-1">Fecha Papanicolaou</label><input type="date" className="input-field bg-white" value={formData.papDate} onChange={e => setFormData({...formData, papDate: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-600 mb-1">Fecha Mastografía</label><input type="date" className="input-field bg-white" value={formData.mastographyDate} onChange={e => setFormData({...formData, mastographyDate: e.target.value})} /></div>
                    <div><label className="block text-sm text-slate-600 mb-1">Fecha Menopausia</label><input type="date" className="input-field bg-white" value={formData.menopauseDate} onChange={e => setFormData({...formData, menopauseDate: e.target.value})} /></div>
                  </div>
                  <div><label className="block text-sm text-slate-600 mb-1">Notas Ginecológicas</label><textarea className="input-field bg-white h-16" value={formData.gynecoNotes} onChange={e => setFormData({...formData, gynecoNotes: e.target.value})} /></div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'D' && (
            <div className="space-y-6 max-w-4xl">
              <div className="card space-y-6">
                <h3 className="font-semibold text-lg text-primary-700 border-b border-slate-100 pb-2">Hábitos Alimentarios y Estilo de Vida</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div><label className="block text-sm text-slate-600 mb-1">💧 Agua (Litros/día)</label><input type="number" step="0.1" className="input-field" placeholder="Ej. 1.5" value={formData.waterIntake} onChange={e => setFormData({...formData, waterIntake: e.target.value})} /></div>
                  <div><label className="block text-sm text-slate-600 mb-1">🍽️ Comidas al día</label><input type="number" className="input-field" placeholder="Ej. 3" value={formData.mealsPerDay} onChange={e => setFormData({...formData, mealsPerDay: e.target.value})} /></div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">😋 Nivel de Apetito</label>
                    <select className="input-field" value={formData.appetiteLevel} onChange={e => setFormData({...formData, appetiteLevel: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      <option>Muy bajo (casi no tiene hambre)</option>
                      <option>Bajo</option>
                      <option>Normal / Moderado</option>
                      <option>Alto</option>
                      <option>Muy alto / Compulsivo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">🏃 Actividad Física Habitual</label>
                    <select className="input-field" value={formData.physicalActivity} onChange={e => setFormData({...formData, physicalActivity: e.target.value})}>
                      <option value="sedentary">Sedentario (sin ejercicio)</option>
                      <option value="light">Ligero (camina 20-30 min/día)</option>
                      <option value="moderate">Moderado (ejercicio 3x/semana)</option>
                      <option value="active">Activo (entrena 5+ días/semana)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">😴 Calidad de Sueño</label>
                    <select className="input-field" value={formData.sleepQuality} onChange={e => setFormData({...formData, sleepQuality: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      <option>Muy mala (insomnio frecuente)</option>
                      <option>Regular (se despierta varias veces)</option>
                      <option>Buena (duerme 6-7 hrs)</option>
                      <option>Muy buena (duerme 7-9 hrs sin interrupciones)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">🕐 Horario de Comidas Habitual</label>
                    <input type="text" className="input-field" value={formData.mealSchedule || ''} onChange={e => setFormData({...formData, mealSchedule: e.target.value})} placeholder="Ej. Desayuno 8am, Comida 3pm, Cena 9pm" />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm text-slate-600 mb-1">🚫 Alimentos Rechazados / Intolerancias Reportadas</label>
                    <input type="text" className="input-field" value={formData.foodDislikes || ''} onChange={e => setFormData({...formData, foodDislikes: e.target.value})} placeholder="Ej: No le gusta el brócoli, intolerante a la lactosa, alérgica a mariscos..." />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm text-slate-600 mb-1">📋 Recordatorio de 24 Horas (R24h)</label>
                    <textarea className="input-field h-36" placeholder="Desayuno: 2 huevos revueltos, 2 tortillas, café con leche&#10;Colación: 1 manzana&#10;Comida: Arroz con pollo, ensalada, agua natural&#10;Cena: 1 quesadilla, vaso de leche" value={formData.recall24h} onChange={e => setFormData({...formData, recall24h: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Cuestionario de Frecuencia de Consumo de Alimentos (Nutrimind Style) */}
              <div className="card space-y-4">
                <FoodFrequencyQuestionnaire
                  answers={formData.fcaAnswers || {}}
                  onChange={(newAnswers) => setFormData(prev => ({ ...prev, fcaAnswers: newAnswers }))}
                />
              </div>
            </div>
          )}

          {activeTab === 'S' && (() => {
            const globalSupps = JSON.parse(localStorage.getItem('nutriplan_supplements') || '[]');
            const patientSupps = formData.assignedSupplements || [];
            
            const toggleSupp = (suppId) => {
              if (patientSupps.includes(suppId)) {
                setFormData({...formData, assignedSupplements: patientSupps.filter(id => id !== suppId)});
              } else {
                setFormData({...formData, assignedSupplements: [...patientSupps, suppId]});
              }
            };

            return (
              <div className="card max-w-3xl mx-auto">
                <h3 className="font-semibold text-lg text-primary-700 border-b border-slate-100 pb-2 mb-4">Suplementación Clínica / Deportiva</h3>
                {globalSupps.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No tienes suplementos registrados en tu catálogo.</p>
                    <p className="text-sm">Ve al panel de "Ajustes" para agregar suplementos.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {globalSupps.map(supp => (
                      <label key={supp.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${patientSupps.includes(supp.id) ? 'border-primary-500 bg-primary-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                        <div className="pt-1">
                          <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" 
                            checked={patientSupps.includes(supp.id)}
                            onChange={() => toggleSupp(supp.id)}
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{supp.name} {supp.brand && <span className="text-slate-400 font-normal ml-1">({supp.brand})</span>}</h4>
                          <p className="text-sm text-slate-600 mt-1">{supp.dose}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'P' && (() => {
            const handleProgressPhoto = (slot) => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 3 * 1024 * 1024) {
                  alert('La imagen debe pesar menos de 3MB.');
                  return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                  setFormData({...formData, [slot]: ev.target?.result || ''});
                };
                reader.readAsDataURL(file);
              };
              input.click();
            };

            const photoSlots = [
              { key: 'photoFront', label: 'Frente' },
              { key: 'photoProfile', label: 'Perfil' },
              { key: 'photoBack', label: 'Espalda' }
            ];

            return (
              <div className="card max-w-4xl space-y-6">
                <h3 className="font-semibold text-lg text-primary-700 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Registro Fotográfico
                  <span className="text-xs font-normal text-slate-400 ml-2">Haz clic en cualquier casilla para subir una foto desde tu dispositivo</span>
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  {photoSlots.map(slot => (
                    <div key={slot.key} className="relative group">
                      <div
                        onClick={() => handleProgressPhoto(slot.key)}
                        className={`border-2 rounded-2xl flex flex-col items-center justify-center overflow-hidden bg-slate-50 text-slate-400 cursor-pointer transition-all hover:border-primary-400 hover:shadow-lg ${
                          formData[slot.key] ? 'border-primary-300 h-72' : 'border-dashed border-slate-300 h-56'
                        }`}
                      >
                        {formData[slot.key] ? (
                          <img src={formData[slot.key]} alt={slot.label} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Upload className="w-10 h-10 mb-2 text-slate-300" />
                            <span className="font-medium text-sm">{slot.label}</span>
                            <span className="text-xs text-slate-400 mt-1">Clic para subir</span>
                          </>
                        )}
                      </div>
                      {formData[slot.key] && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-bold text-slate-600">{slot.label}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleProgressPhoto(slot.key)}
                              className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-colors"
                            >
                              Cambiar
                            </button>
                            <button
                              onClick={() => setFormData({...formData, [slot.key]: ''})}
                              className="text-xs px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-medium transition-colors"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      <PrintReport formData={formData} calc={calc} printConfig={printConfig} />
      
      {/* MODAL: OPCIONES DE IMPRESIÓN (PDF) */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2 font-heading">
              <Printer className="text-primary-600" /> Exportar a PDF
            </h3>
            <p className="text-sm text-slate-500 mb-6">Selecciona las secciones que deseas incluir en el documento del paciente.</p>
            
            <div className="space-y-2 mb-6 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
              {Object.entries({
                general: 'Datos Generales y Antropometría',
                composition: 'Composición Corporal y Metas',
                labs: 'Resultados Bioquímicos',
                macros: 'Distribución de Macronutrientes',
                menu: 'Menú Semanal Detallado',
                shopping: 'Lista de Compras del Supermercado',
                supplements: 'Suplementación y Recomendaciones'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={printConfig[key]}
                    onChange={(e) => setPrintConfig({...printConfig, [key]: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-bold text-slate-700">{label}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPrintModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setShowPrintModal(false);
                  setTimeout(() => window.print(), 300);
                }}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
              >
                <Printer size={18} /> Generar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Orden Médica de Laboratorio */}
      <LabOrderModal
        isOpen={showLabOrderModal}
        onClose={() => setShowLabOrderModal(false)}
        patient={formData}
      />

      {/* Modal de Constructor de Fórmulas Personalizadas */}
      <CustomFormulaModal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
        currentPatient={formData}
        onSaveFormula={(newF) => {
          setCustomFormulas(prev => [...prev.filter(f => f.id !== newF.id), newF]);
          setFormData(prev => ({ ...prev, energyFormula: `custom_${newF.id}` }));
        }}
      />

      {/* Modal de Exportación a WhatsApp (estilo Avena) */}
      <WhatsAppPlanModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        patient={formData}
      />

      </ErrorBoundary>
    );
  }

  // LIST VIEW
  return (
    <div className="p-8 h-full overflow-y-auto bg-[#141414] text-white flex flex-col items-center">
      <div className="w-full max-w-7xl mb-12 flex justify-between items-center px-8 mt-4">
        <h2 className="text-3xl font-light tracking-wider">Perfiles de Pacientes</h2>
        <div className="flex gap-4 items-center">
          <div className="relative group">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 transition-colors group-focus-within:text-white" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-[#2b2b2b] text-white border border-transparent rounded-sm focus:border-white focus:bg-black outline-none transition-all"
            />
          </div>
          <button 
            onClick={loadDemoPatient} 
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-sm transition-all shadow-md text-xs font-bold tracking-wider uppercase cursor-pointer"
            title="Cargar y abrir consulta clínica modelo al 100%"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" /> Consulta Modelo 100%
          </button>
          <button onClick={createNew} className="flex items-center gap-2 border border-gray-400 px-4 py-2 hover:text-white hover:border-white transition-colors uppercase tracking-widest text-sm font-semibold cursor-pointer">
            <Plus className="w-5 h-5" /> Nuevo
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl">
        <h1 className="text-5xl md:text-6xl text-center mb-12 font-medium tracking-tight">¿Quién tiene cita hoy?</h1>

        {patients.length === 0 ? (
          <div className="text-center text-gray-400 mt-8 flex flex-col items-center">
            <User className="w-24 h-24 mx-auto mb-6 opacity-20" />
            <p className="text-xl mb-4">Aún no hay pacientes registrados.</p>
            <button 
              onClick={loadDemoPatient}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg text-sm cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" /> Cargar Consulta Modelo al 100%
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 max-w-5xl">
            {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(patient => (
              <div 
                key={patient.id} 
                className="flex flex-col items-center group w-44 cursor-pointer relative p-3 rounded-2xl hover:bg-white/5 transition-all"
                onClick={() => { 
                  setFormData(patient); 
                  setActiveTab(patient.history && patient.history.length > 0 ? 'E' : 'A');
                  setView('edit'); 
                }}
              >
                {/* Avatar */}
                <div className="w-36 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#333] border-2 border-transparent group-hover:border-teal-400 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center text-7xl shadow-2xl relative">
                  {patient.profileImageUrl ? (
                    <img src={patient.profileImageUrl} alt={patient.name} className="w-full h-full object-cover" />
                  ) : (
                    getProfileEmoji(patient.gender, patient.profileType)
                  )}
                  
                  {/* Delete button (top right) */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`¿Eliminar el expediente de ${patient.name}?`)) {
                        setPatients(patients.filter(p => p.id !== patient.id));
                      }
                    }} 
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                    title="Eliminar paciente"
                  >
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>

                <h3 className="mt-3 text-gray-300 group-hover:text-white transition-colors text-base font-semibold text-center truncate w-full px-1">
                  {patient.name}
                </h3>
                <div className="flex gap-2 text-[11px] text-gray-400 mt-1">
                  <span className="px-1.5 py-0.5 border border-gray-700 rounded-md">{patient.age} años</span>
                  <span className="px-1.5 py-0.5 bg-teal-950 text-teal-300 border border-teal-800 rounded-md font-medium">{patient.strategy ? patient.strategy.split(' ')[0] : patient.profileType}</span>
                </div>
                <span className="mt-2 text-xs text-teal-400 font-bold group-hover:underline flex items-center gap-1">
                  Abrir Consulta <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
