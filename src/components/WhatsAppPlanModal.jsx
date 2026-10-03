import React, { useState, useEffect } from 'react';
import { Send, Copy, Check, X, Smartphone, Sparkles, Calendar, Droplet, Pill, Flame } from 'lucide-react';

export default function WhatsAppPlanModal({ isOpen, onClose, patient, currentPlan, macros }) {
  if (!isOpen) return null;

  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [includeHydration, setIncludeHydration] = useState(true);
  const [includeSupplements, setIncludeSupplements] = useState(true);
  const [includeTips, setIncludeTips] = useState(true);
  const [customPhone, setCustomPhone] = useState(patient?.phone || '');
  const [copied, setCopied] = useState(false);
  const [formattedMessage, setFormattedMessage] = useState('');

  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const MEALS_ORDER = ['Despertar', 'Pre-Entreno', 'Desayuno', 'Colación 1', 'Comida', 'Colación 2', 'Post-Entreno', 'Cena', 'Colación 3'];

  // Construir el mensaje formateado para WhatsApp
  useEffect(() => {
    const pName = patient?.name || 'Estimado(a) paciente';
    const kcal = patient?.assignedKcal || macros?.kcal || patient?.calc?.finalKcal || '--';
    const strategy = patient?.strategy || 'Plan Nutricional Personalizado';
    const clinic = JSON.parse(localStorage.getItem('nutriplan_clinic') || '{"name":"Biome Nutrition"}');

    // Normalizar menú del día
    let dayMeals = [];
    const sourcePlan = currentPlan || patient?.weeklyMenu || patient?.dietPlan;
    if (sourcePlan && sourcePlan[selectedDay]) {
      if (Array.isArray(sourcePlan[selectedDay])) {
        dayMeals = sourcePlan[selectedDay];
      } else {
        // Objeto legado { Desayuno: [...] }
        dayMeals = Object.entries(sourcePlan[selectedDay]).map(([mName, items]) => ({
          name: mName,
          items: Array.isArray(items) ? items : []
        }));
      }
    }

    // Ordenar tiempos de comida
    dayMeals.sort((a, b) => {
      const idxA = MEALS_ORDER.indexOf(a.name);
      const idxB = MEALS_ORDER.indexOf(b.name);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

    let msg = `🥗 *PLAN NUTRICIONAL - ${clinic.name?.toUpperCase() || 'BIOME NUTRITION'}*\n`;
    msg += `👤 *Paciente:* ${pName}\n`;
    msg += `🎯 *Estrategia:* ${strategy}\n`;
    if (kcal !== '--') {
      msg += `🔥 *Meta Energética:* ${kcal} kcal`;
      if (patient?.p_pct) {
        msg += ` (P: ${patient.p_pct}% | C: ${patient.c_pct || 50}% | G: ${patient.g_pct || 30}%)\n`;
      } else {
        msg += `\n`;
      }
    }
    msg += `📅 *Menú Sugerido:* ${selectedDay}\n`;
    msg += `─────────────────────────\n\n`;

    if (dayMeals.length === 0 || !dayMeals.some(m => m.items && m.items.length > 0)) {
      msg += `_(No hay alimentos asignados para el día ${selectedDay}. Selecciona otro día o añade alimentos en el planificador)_\n\n`;
    } else {
      dayMeals.forEach(meal => {
        if (!meal.items || meal.items.length === 0) return;
        
        let emoji = '🍽️';
        if (meal.name.includes('Desayuno')) emoji = '🍳';
        if (meal.name.includes('Comida')) emoji = '🥩';
        if (meal.name.includes('Cena')) emoji = '🥑';
        if (meal.name.includes('Colación') || meal.name.includes('Snack')) emoji = '🍏';
        if (meal.name.includes('Entreno')) emoji = '⚡';

        msg += `${emoji} *${meal.name.toUpperCase()}*\n`;
        if (meal.dishTitle) {
          msg += `_Platillo: ${meal.dishTitle}_\n`;
        }

        meal.items.forEach(item => {
          const qty = item.qty || item.baseQty || '1 ración';
          msg += `  • ${item.name} (${qty})\n`;
        });

        if (meal.instructions) {
          msg += `  📝 _Tip: ${meal.instructions}_\n`;
        }
        msg += `\n`;
      });
    }

    if (includeHydration) {
      const water = patient?.waterIntake || Math.round((Number(patient?.weight) || 70) * (Number(patient?.ml_kg) || 35));
      const glasses = Math.round(water / 250);
      msg += `💧 *META DE HIDRATACIÓN DIARIA*\n`;
      msg += `• Mínimo *${(water / 1000).toFixed(1)} Litros* al día (aprox. ${glasses} vasos de 250ml).\n`;
      msg += `• Tip: Bebe 1 vaso al despertar y 1 antes de cada comida principal.\n\n`;
    }

    if (includeSupplements && patient?.assignedSupplements?.length > 0) {
      msg += `💊 *SUPLEMENTACIÓN RECOMENDADA*\n`;
      patient.assignedSupplements.forEach(supp => {
        msg += `• *${supp.name}:* ${supp.dosage || 'Dosis indicada'} (${supp.timing || 'Con alimentos'})\n`;
      });
      msg += `\n`;
    }

    if (includeTips) {
      msg += `✨ *REGLAS DE ORO PARA EL ÉXITO:*\n`;
      msg += `1. Mastica despacio (al menos 20 minutos por comida).\n`;
      msg += `2. Si no tienes algún ingrediente, ¡no te preocupes! Consúltame tu equivalencia.\n`;
      msg += `3. Registra cómo te sientes con las porciones para ajustar en nuestra próxima sesión.\n\n`;
      msg += `_¡Mucho éxito con tu plan! Estoy para apoyarte paso a paso._ 💪🥑`;
    }

    setFormattedMessage(msg);
  }, [selectedDay, includeHydration, includeSupplements, includeTips, patient, currentPlan, macros]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    // Limpiar número
    let phone = customPhone.replace(/[^0-9]/g, '');
    if (phone.length === 10) {
      // México default código +52
      phone = '52' + phone;
    }
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(formattedMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                Enviar Plan por WhatsApp
                <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                  Estilo Avena
                </span>
              </h3>
              <p className="text-xs text-slate-500">Genera un mensaje con formato claro, horarios y emojis para tu paciente.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-5 border-b border-slate-100 bg-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-slate-600">Día del Menú:</label>
              <select
                className="input-field py-1 px-3 text-xs font-semibold bg-slate-50 w-auto"
                value={selectedDay}
                onChange={e => setSelectedDay(e.target.value)}
              >
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">WhatsApp:</label>
              <input
                type="text"
                placeholder="Ej. 5512345678"
                className="input-field py-1 px-3 text-xs w-36 bg-slate-50"
                value={customPhone}
                onChange={e => setCustomPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 pt-1 border-t border-slate-100">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHydration}
                onChange={e => setIncludeHydration(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Incluir Hidratación</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSupplements}
                onChange={e => setIncludeSupplements(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Incluir Suplementos</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTips}
                onChange={e => setIncludeTips(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Incluir Consejos de Éxito</span>
            </label>
          </div>
        </div>

        {/* Message Live Preview */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed custom-scrollbar">
          <textarea
            className="w-full h-full bg-transparent resize-none border-none outline-none text-emerald-300 font-mono text-xs leading-relaxed"
            value={formattedMessage}
            onChange={e => setFormattedMessage(e.target.value)}
            rows={15}
          />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center gap-3">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Puedes editar el texto arriba antes de enviarlo.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="btn-secondary py-2.5 px-4 text-xs flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado al Portapapeles' : 'Copiar Texto'}
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="btn-primary py-2.5 px-5 text-xs flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm flex-1 sm:flex-initial"
            >
              <Send className="w-4 h-4" />
              Enviar a WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
