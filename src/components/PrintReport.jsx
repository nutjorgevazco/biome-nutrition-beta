import React from 'react';
import { Activity, Stethoscope, Droplet, User, HeartPulse, PieChart, ShoppingCart, Camera, Globe, Mail } from 'lucide-react';
import { CATALOGO_LABORATORIOS } from '../utils/constants';
import { calculateCardiometabolicRisks } from '../utils/clinicalMath';

export default function PrintReport({ 
  formData, 
  calc, 
  printConfig = {
    general: true,
    composition: true,
    labs: true,
    macros: true,
    menu: true,
    shopping: true,
    supplements: true
  } 
}) {
  if (!formData || !calc) return null;
  
  const clinic = JSON.parse(localStorage.getItem('nutriplan_clinic') || '{"name":"Biome Nutrition","phone":"","address":"","color":"#0f172a","logo":null}');
  const globalSupps = JSON.parse(localStorage.getItem('nutriplan_supplements') || '[]');
  const patientSupps = formData.assignedSupplements || [];

  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const MEALS = ['Desayuno', 'Colación 1', 'Comida', 'Colación 2', 'Cena'];

  // Normalizar acceso al plan de dieta
  const getDayMeals = (day) => {
    const plan = formData.weeklyMenu || formData.dietPlan;
    if (!plan || !plan[day]) return [];
    if (Array.isArray(plan[day])) {
      return plan[day];
    }
    // Formato legado { Desayuno: [...] }
    return MEALS.map((mealName, idx) => ({
      id: `m_${idx}`,
      name: mealName,
      dishTitle: '',
      instructions: '',
      items: plan[day][mealName] || []
    }));
  };

  const hasFoodInDay = (day) => {
    const meals = getDayMeals(day);
    return meals.some(m => m.items && m.items.length > 0);
  };

  const MASTER_MEALS_ORDER = ['Despertar', 'Pre-Entreno', 'Desayuno', 'Colación 1', 'Comida', 'Colación 2', 'Post-Entreno', 'Cena', 'Colación 3'];
  const allMealsSet = new Set();
  DAYS.forEach(day => {
    const meals = getDayMeals(day);
    meals.forEach(m => {
      if (m.items && m.items.length > 0) allMealsSet.add(m.name);
    });
  });

  const uniqueMeals = Array.from(allMealsSet).sort((a, b) => {
    const indexA = MASTER_MEALS_ORDER.indexOf(a);
    const indexB = MASTER_MEALS_ORDER.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return 0;
  });

  // Generate Shopping List
  const shoppingList = {};
  DAYS.forEach(day => {
    const meals = getDayMeals(day);
    meals.forEach(meal => {
      if (meal.items) {
        meal.items.forEach(food => {
          const group = food.group || 'Otros';
          if (!shoppingList[group]) shoppingList[group] = {};
          if (!shoppingList[group][food.name]) shoppingList[group][food.name] = [];
          shoppingList[group][food.name].push(food.qty || food.baseQty || '1 ración');
        });
      }
    });
  });

  const summarizeQuantities = (qtyArray) => {
    const counts = {};
    qtyArray.forEach(q => {
      counts[q] = (counts[q] || 0) + 1;
    });
    return Object.entries(counts).map(([q, count]) => count > 1 ? `${q} (x${count})` : q).join(', ');
  };

  return (
    <div className="print-only w-full max-w-4xl mx-auto font-sans text-slate-800 hidden">
      {/* HEADER */}
      <div className="flex justify-between items-start border-b-2 pb-6 mb-8" style={{ borderColor: clinic.color }}>
        <div className="flex items-center gap-4">
          {clinic.logo ? (
            <img src={clinic.logo} alt="Logo" className="w-16 h-16 object-contain" />
          ) : (
            <Activity className="w-10 h-10" style={{ color: clinic.color }} />
          )}
          <div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: clinic.color }}>{clinic.name || 'Biome Nutrition'}</h1>
            <p className="text-sm text-slate-500 font-medium">Reporte Clínico y Nutricional</p>
          </div>
        </div>
        <div className="text-right text-sm text-slate-600">
          <p className="font-semibold text-slate-800">{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          {clinic.phone && <p>Tel: {clinic.phone}</p>}
        </div>
      </div>

      {/* PATIENT INFO (GENERAL) */}
      {printConfig.general && (
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 flex justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Paciente</p>
            <p className="text-xl font-bold text-slate-800">{formData.name || 'Sin Nombre'}</p>
            {formData.profileType && formData.profileType !== 'ADULT' && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 mt-1 inline-block">
                Perfil: {formData.profileType}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm"><span className="text-slate-400">Edad:</span> {formData.age || '-'} años</p>
            <p className="text-sm"><span className="text-slate-400">Sexo:</span> {formData.gender}</p>
            <p className="text-sm"><span className="text-slate-400">Estatura:</span> {formData.height || '-'} cm</p>
          </div>
        </div>
      )}

      {/* Diagnóstico PES Oficial (AND / ADA) */}
      {printConfig.general && formData.pesProblem && formData.pesEtiology && formData.pesSigns && (
        <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 mb-6">
          <p className="text-[10px] uppercase font-bold text-teal-800 tracking-wider mb-1">
            Diagnóstico Nutricional PES (Estándar AND / ADA)
          </p>
          <p className="text-xs text-slate-800 leading-relaxed">
            <strong className="text-teal-900">{formData.pesProblem}</strong> relacionado con{' '}
            <span className="text-slate-700">{formData.pesEtiology}</span> evidenciado por{' '}
            <span className="text-slate-700">{formData.pesSigns}</span>.
          </p>
        </div>
      )}

      {/* Control Gestacional si aplica */}
      {printConfig.general && formData.profileType === 'GESTATIONAL' && (
        <div className="bg-pink-50/70 border border-pink-200 rounded-xl p-3.5 mb-6">
          <p className="text-[10px] uppercase font-bold text-pink-800 tracking-wider mb-1">
            Control Prenatal Materno-Fetal (Guías IOM)
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-700">
            <div><strong>Edad Gestacional:</strong> {formData.gestational_weeks || '--'} semanas</div>
            <div><strong>Peso Pregestacional:</strong> {formData.gestational_preWeight || '--'} kg</div>
            <div><strong>Presión Arterial:</strong> {formData.gestational_bp || formData.bloodPressure || '--'}</div>
          </div>
        </div>
      )}

      {/* Evaluación Pediátrica si aplica */}
      {printConfig.general && formData.profileType === 'PEDIATRIC' && (
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 mb-6">
          <p className="text-[10px] uppercase font-bold text-sky-800 tracking-wider mb-1">
            Evaluación Pediátrica OMS
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-700">
            <div><strong>Alimentación:</strong> {formData.pediatric_milkFeeding || 'LME'}</div>
            <div><strong>Perímetro Cefálico:</strong> {formData.pediatric_headCircumference || '--'} cm</div>
            <div><strong>Alim. Complementaria:</strong> {formData.pediatric_complementaryType || 'BLW'}</div>
          </div>
        </div>
      )}

      {/* PAGE 1: CLINICAL & ANTHROPOMETRY */}
      {printConfig.composition && (
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Antropometría */}
          <div>
            <h2 className="text-lg font-bold text-primary-700 border-b border-primary-100 pb-2 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Composición Corporal
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Peso Actual</span>
                <span className="font-bold text-slate-800">{formData.weight || '-'} kg</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Masa Grasa</span>
                <span className="font-bold text-slate-800">{calc.fatMassKg || '-'} kg ({calc.fatMassPct || '-'}%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Masa Muscular</span>
                <span className="font-bold text-slate-800">{calc.muscleMassKg || '-'} kg ({calc.muscleMassPct || '-'}%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Masa Ósea / Residual</span>
                <span className="font-bold text-slate-800">{calc.boneMassKg || '-'} / {calc.residualMassKg || '-'} kg</span>
              </div>
            </div>
          </div>

          {/* Metas / Proyección */}
          <div>
            <h2 className="text-lg font-bold text-primary-700 border-b border-primary-100 pb-2 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" /> Metas y Requerimientos
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Estrategia</span>
                <span className="font-bold text-primary-600">{formData.strategy}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Peso Meta</span>
                <span className="font-bold text-slate-800">{calc.projectedWeight || formData.targetWeight || '-'} kg</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Kcal Asignadas</span>
                <span className="font-bold text-slate-800">{formData.assignedKcal || calc.targetKcal || '-'} kcal</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Agua Sugerida</span>
                <span className="font-bold text-slate-800">
                  {formData.waterIntake || Math.round((Number(formData.weight) || 70) * (Number(formData.ml_kg) || 35))} ml/día
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Riesgo Cardiometabólico y Grasa Visceral (Nutrimind Style) */}
      {printConfig.composition && (() => {
        const cardio = (formData.waist || formData.hip)
          ? calculateCardiometabolicRisks(formData.waist, formData.hip, formData.height, formData.gender)
          : null;
        if (!cardio || (cardio.icc === 0 && cardio.ict === 0)) return null;

        return (
          <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-3.5 mb-8 page-break-inside-avoid">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] uppercase font-bold text-teal-900 tracking-wider flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-teal-700" /> Evaluación de Riesgo Cardiometabólico y Grasa Visceral
              </p>
              <span className="text-[10px] text-teal-700 font-semibold">Cintura: {formData.waist || '--'} cm | Cadera: {formData.hip || '--'} cm</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Índice Cintura/Cadera (ICC)</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-black text-sm text-slate-800">{cardio.icc || '--'}</span>
                  <span className={`text-[10px] font-bold ${cardio.iccRisk === 'low' ? 'text-emerald-700' : cardio.iccRisk === 'moderate' ? 'text-amber-700' : 'text-rose-700'}`}>
                    {cardio.iccRisk === 'low' ? 'Bajo' : cardio.iccRisk === 'moderate' ? 'Moderado' : 'Alto'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">{cardio.iccDistribution}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Índice Cintura/Estatura (ICT)</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-black text-sm text-slate-800">{cardio.ict || '--'}</span>
                  <span className={`text-[10px] font-bold ${cardio.ictRisk === 'low' ? 'text-emerald-700' : cardio.ictRisk === 'moderate' ? 'text-amber-700' : 'text-rose-700'}`}>
                    {cardio.ictRisk === 'low' ? 'Óptimo' : cardio.ictRisk === 'moderate' ? 'Aumentado' : 'Crítico'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">{cardio.ictCategory ? cardio.ictCategory.split(':')[0] : 'Óptimo'}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Peso Teórico / Referencia</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-black text-sm text-slate-800">{formData.idealWeight || formData.targetWeight || '--'} kg</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Objetivo metabólico sugerido</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Laboratorios (si hay) */}
      {printConfig.labs && formData.laboratorios_agregados?.length > 0 && (
        <div className="mb-8 page-break-inside-avoid">
          <h2 className="text-lg font-bold text-primary-700 border-b border-primary-100 pb-2 mb-4 flex items-center gap-2">
            <Droplet className="w-5 h-5" /> Resultados Bioquímicos Relevantes
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {formData.laboratorios_agregados.map(labId => {
              const lab = CATALOGO_LABORATORIOS.find(l => l.id === labId);
              const val = formData.laboratorios_valores?.[labId];
              if (!lab || !val) return null;
              
              const numVal = parseFloat(val);
              const min = parseFloat(lab.ref_min);
              const max = parseFloat(lab.ref_max);
              const isAlert = numVal < min || numVal > max;

              return (
                <div key={labId} className={`p-3 rounded-lg border ${isAlert ? 'border-rose-200 bg-rose-50' : 'border-slate-100 bg-slate-50'}`}>
                  <p className="text-xs text-slate-500 mb-1">{lab.nombre}</p>
                  <p className={`text-lg font-bold ${isAlert ? 'text-rose-600' : 'text-slate-800'}`}>
                    {val} <span className="text-xs font-normal text-slate-500">{lab.unidad}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Ref: {lab.ref_min} - {lab.ref_max}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PAGE BREAK PARA LA DIETA (Condicional) */}
      {(printConfig.macros || printConfig.menu) && <div className="page-break-before"></div>}

      {/* HEADER DE LA SEGUNDA PÁGINA */}
      {(printConfig.macros || printConfig.menu) && (
        <div className="flex items-center gap-2 mb-8 border-b-2 pb-2" style={{ borderColor: clinic.color, color: clinic.color }}>
          <Activity className="w-6 h-6" />
          <h2 className="text-2xl font-black tracking-tight">{clinic.name || 'Biome Nutrition'} <span className="text-lg font-normal text-slate-400 ml-2">| Plan Alimenticio</span></h2>
        </div>
      )}

      {/* MACROS */}
      {printConfig.macros && (
        <div className="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 text-center tracking-widest">Distribución de Macronutrientes</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-500 mb-1">Proteínas ({formData.p_pct || 20}%)</p>
              <p className="text-xl font-bold text-slate-800">{calc.macros?.proteinGrams || '-'} g</p>
            </div>
            <div className="border-x border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Carbohidratos ({formData.c_pct || 50}%)</p>
              <p className="text-xl font-bold text-slate-800">{calc.macros?.carbGrams || '-'} g</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Grasas ({formData.g_pct || 30}%)</p>
              <p className="text-xl font-bold text-slate-800">{calc.macros?.fatGrams || '-'} g</p>
            </div>
          </div>
        </div>
      )}

      {/* DIETA / MENÚ EN FORMATO TABLA (TIPO SCREENSHOT) */}
      {printConfig.menu && (
        <div className="mb-8 w-full overflow-hidden">
          <h3 className="text-lg font-bold text-primary-700 border-b border-primary-100 pb-2 mb-4">Planeación Semanal</h3>
          {uniqueMeals.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 bg-slate-50/50">
              <p className="font-semibold text-slate-600 mb-2">No se ha asignado un menú semanal.</p>
              <p className="text-sm">Diseña el menú en el módulo de DietBuilder para que aparezca aquí.</p>
            </div>
          ) : (
            <table className="w-full border-collapse border border-slate-200 text-left table-fixed bg-white shadow-sm rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="bg-slate-800 text-white font-bold p-2 text-center text-[10px] w-20 border border-slate-700 align-middle">
                    Horario
                  </th>
                  {DAYS.map(day => (
                    <th key={day} className="bg-slate-800 text-white font-bold p-2 text-center border border-slate-700 align-middle">
                      <div className="text-[11px]">{day}</div>
                      <div className="text-[8px] font-normal opacity-80 mt-0.5">Menú principal</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uniqueMeals.map(mealName => (
                  <tr key={mealName} className="break-inside-avoid">
                    {/* Horario */}
                    <td className="bg-slate-100 border border-slate-200 p-2 text-center align-middle">
                      <span className="font-bold text-slate-800 text-[10px]">{mealName}</span>
                    </td>
                    {/* Días */}
                    {DAYS.map(day => {
                      const meals = getDayMeals(day);
                      const meal = meals.find(m => m.name === mealName);
                      
                      if (!meal || !meal.items || meal.items.length === 0) {
                        return <td key={day} className="border border-slate-200 p-2 bg-slate-50/30"></td>;
                      }

                      return (
                        <td key={day} className="border border-slate-200 p-2.5 bg-white align-top">
                          {meal.image && (
                            <div className="w-full h-14 rounded-md overflow-hidden mb-2 border border-slate-100 shadow-sm">
                              <img src={meal.image} alt={meal.dishTitle || meal.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          {meal.dishTitle ? (
                            <h5 className="font-bold text-slate-800 text-[10px] mb-1.5 leading-tight">{meal.dishTitle}</h5>
                          ) : (
                            <h5 className="font-bold text-primary-700 text-[10px] mb-1.5 leading-tight">{meal.name}</h5>
                          )}
                          
                          <ul className="text-[8px] text-slate-700 space-y-1 mb-2">
                            {meal.items.map(food => (
                              <li key={food.uid || food.uniqueId || food.name} className="flex gap-1.5 items-start leading-tight">
                                <span className="text-slate-400 mt-[1px] text-[6px]">●</span>
                                <span>{food.qty || food.baseQty} de {food.name}</span>
                              </li>
                            ))}
                          </ul>
                          {meal.instructions && (
                            <p className="text-[8px] text-slate-500 italic bg-slate-50 p-1.5 rounded border border-slate-100 leading-tight">
                              {meal.instructions}
                            </p>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* PAGE BREAK PARA LA LISTA DE COMPRAS */}
      {printConfig.shopping && Object.keys(shoppingList).length > 0 && (
        <>
          <div className="page-break-before"></div>
          <div className="flex items-center gap-2 mb-8 border-b-2 pb-2" style={{ borderColor: clinic.color, color: clinic.color }}>
            <ShoppingCart className="w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight">Lista de <span className="font-light text-slate-500">Compras</span></h2>
          </div>

          <div className="mb-8 columns-1 md:columns-2 gap-8">
            {Object.keys(shoppingList).sort().map(group => (
              <div key={group} className="mb-6 break-inside-avoid">
                <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3 uppercase tracking-wider text-sm">{group}</h3>
                <ul className="space-y-2">
                  {Object.keys(shoppingList[group]).sort().map(foodName => (
                    <li key={foodName} className="flex items-start gap-3 text-sm text-slate-700">
                      <div className="w-4 h-4 border border-slate-400 rounded-sm shrink-0 mt-0.5"></div>
                      <div>
                        <span className="font-medium">{foodName}</span>
                        <div className="text-xs text-slate-500">{summarizeQuantities(shoppingList[group][foodName])}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm text-slate-600 text-center italic break-inside-avoid mb-8">
            "Organiza tus compras por pasillo y asegúrate de elegir opciones frescas y de temporada."
          </div>
        </>
      )}

      {/* SUPLEMENTOS Y RECOMENDACIONES (Si aplican) */}
      {printConfig.supplements && patientSupps.length > 0 && (
        <div className="mb-8 break-inside-avoid">
          <div className="flex items-center gap-2 mb-4 border-b-2 pb-2" style={{ borderColor: clinic.color, color: clinic.color }}>
            <Activity className="w-5 h-5" />
            <h3 className="text-xl font-bold tracking-tight">Suplementación Indicada</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {patientSupps.map(suppId => {
              const supp = globalSupps.find(s => s.id === suppId);
              if (!supp) return null;
              return (
                <div key={supp.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <h4 className="font-bold text-slate-800">{supp.name} {supp.brand && <span className="text-slate-400 font-normal">({supp.brand})</span>}</h4>
                  <p className="text-sm text-slate-600 mt-1">{supp.dose}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-auto pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
        <div className="flex justify-center gap-6 mb-3">
          {clinic.instagram && <div className="flex items-center gap-1"><Camera className="w-3 h-3"/> {clinic.instagram}</div>}
          {clinic.facebook && <div className="flex items-center gap-1"><Globe className="w-3 h-3"/> {clinic.facebook}</div>}
          {clinic.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3"/> {clinic.email}</div>}
        </div>
        {clinic.address && <p className="mb-1 font-semibold text-slate-500">{clinic.address}</p>}
        <p>Generado con BiomeNutrition - Software para Especialistas.</p>
        <p>Consulte a su médico antes de realizar cambios drásticos en su alimentación.</p>
      </div>

    </div>
  );
}
