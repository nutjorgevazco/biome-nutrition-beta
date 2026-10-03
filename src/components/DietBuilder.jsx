import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Save, Trash2, Copy, Clipboard, Check, Sparkles, 
  ChevronRight, ChevronLeft, Flame, Beef, Wheat, Droplet, 
  ShoppingCart, Printer, ChefHat, RefreshCw, Layers, Calendar, 
  Utensils, Coffee, Apple, Moon, Clock, Share2, AlertCircle, ArrowRight,
  Camera, Image as ImageIcon, LayoutGrid, List, X, ExternalLink, Send
} from 'lucide-react';
import smaeData from '../data/smae.json';
import { SMAE_GROUPS } from '../utils/constants';
import WhatsAppPlanModal from './WhatsAppPlanModal';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DEFAULT_MEALS = ['Desayuno', 'Colación 1', 'Comida', 'Colación 2', 'Cena'];

// Galería de fotos gastronómicas de alta calidad para platillos
const PRESET_DISH_IMAGES = [
  { name: 'Omelette de Claras con Espinacas', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80' },
  { name: 'Avena Horneada con Frutos Rojos', url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&q=80' },
  { name: 'Pechuga a la Plancha con Vegetales', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80' },
  { name: 'Ensalada Mediterránea con Quinoa', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80' },
  { name: 'Filete de Salmón con Espárragos', url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80' },
  { name: 'Smoothie Verde Detox / Proteico', url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80' },
  { name: 'Yogurt Griego con Semillas y Fruta', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80' },
  { name: 'Tacos de Pollo con Tortilla de Maíz', url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80' },
  { name: 'Bowl de Aguacate, Arroz y Proteína', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80' },
  { name: 'Hot Cakes de Avena y Plátano', url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80' }
];

const getMealIcon = (mealName, size = 18) => {
  const lower = mealName.toLowerCase();
  if (lower.includes('desayuno') || lower.includes('matutino')) return <Coffee size={size} className="text-amber-500" />;
  if (lower.includes('colación') || lower.includes('snack') || lower.includes('merienda')) return <Apple size={size} className="text-emerald-500" />;
  if (lower.includes('comida') || lower.includes('almuerzo')) return <Utensils size={size} className="text-blue-500" />;
  if (lower.includes('cena')) return <Moon size={size} className="text-indigo-500" />;
  return <Clock size={size} className="text-slate-400" />;
};

const getFoodEmoji = (group) => {
  const g = SMAE_GROUPS.find(item => item.name === group || item.key === group || item.id === group);
  if (g && g.emoji) return g.emoji;
  const emojis = {
    'Verduras': '🥦', 'Frutas': '🍎', 'Cereales': '🍞', 'Cereales c/g': '🥐',
    'Leguminosas': '🫘', 'AOA': '🥩', 'Leche': '🥛', 'Grasas': '🥑',
    'Azúcares': '🍯', 'Bebidas': '🥤'
  };
  return emojis[group] || '🍽️';
};

const getSMAEGroupInfo = (groupName) => {
  const g = SMAE_GROUPS.find(item => 
    item.name === groupName || 
    item.key === groupName || 
    item.id === groupName ||
    item.fullName === groupName
  );
  if (g) return g;
  return {
    id: groupName,
    name: groupName,
    fullName: groupName,
    emoji: getFoodEmoji(groupName),
    color: '#64748b'
  };
};

export default function DietBuilder() {
  const [patients, setPatients] = useState(() => {
    return JSON.parse(localStorage.getItem('nutriplan_patients') || '[]');
  });

  const [selectedPatientId, setSelectedPatientId] = useState(() => {
    const list = JSON.parse(localStorage.getItem('nutriplan_patients') || '[]');
    return list.length > 0 ? list[0].id : '';
  });

  const activePatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId);
  }, [patients, selectedPatientId]);

  // Tab principal: 'equivalentes' o 'menu'
  const [activeStepTab, setActiveStepTab] = useState('menu');

  // Modo de visualización y control del panel lateral enfocado para editar platillos
  const [menuViewMode, setMenuViewMode] = useState('cards');
  const [isMealDrawerOpen, setIsMealDrawerOpen] = useState(false);

  // Día activo
  const [activeDay, setActiveDay] = useState('Lunes');

  // ID del tiempo de comida seleccionado
  const [selectedMealId, setSelectedMealId] = useState('');

  // Portapapeles
  const [copiedDayData, setCopiedDayData] = useState(null);
  const [copiedMealData, setCopiedMealData] = useState(null);

  // Modales
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [showRecipesModal, setShowRecipesModal] = useState(false);
  const [showImageSelectorModal, setShowImageSelectorModal] = useState(false);
  const [imageSelectorTargetMealId, setImageSelectorTargetMealId] = useState(null);
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');
  const [replaceTargetItem, setReplaceTargetItem] = useState(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Base de alimentos y recetas
  const allFoods = useMemo(() => {
    const saved = localStorage.getItem('nutriplan_foods');
    return saved ? JSON.parse(saved) : smaeData;
  }, []);

  const recipes = useMemo(() => {
    return JSON.parse(localStorage.getItem('nutriplan_recipes') || '[]');
  }, []);

  // Cuadro dietosintético
  const [portionDistribution, setPortionDistribution] = useState(() => {
    const initial = {};
    SMAE_GROUPS.forEach(g => {
      initial[g.id] = { total: 0 };
      DEFAULT_MEALS.forEach(m => initial[g.id][m] = 0);
    });
    return initial;
  });

  // Estructura del plan semanal de menús con soporte de imagen para cada platillo
  const [weeklyMenu, setWeeklyMenu] = useState(() => {
    const plan = {};
    DAYS.forEach(d => {
      plan[d] = DEFAULT_MEALS.map((m, idx) => ({
        id: `meal_${d}_${idx}`,
        name: m,
        dishTitle: '',
        instructions: '',
        image: '',
        items: []
      }));
    });
    return plan;
  });

  // Metas nutricionales
  const [targetMacros, setTargetMacros] = useState({ kcal: 2000, prot: 100, carb: 250, fat: 65 });

  // Sincronizar al cambiar paciente activo
  useEffect(() => {
    if (activePatient) {
      const cal = parseFloat(activePatient.assignedKcal) || activePatient.finalKcal || activePatient.get || 2000;
      const c = parseFloat(activePatient.c_pct) || 50;
      const p = parseFloat(activePatient.p_pct) || 20;
      const f = parseFloat(activePatient.g_pct) || 30;

      setTargetMacros({
        kcal: cal,
        carb: (cal * (c / 100)) / 4,
        prot: (cal * (p / 100)) / 4,
        fat: (cal * (f / 100)) / 9
      });

      if (activePatient.portionDistribution) {
        setPortionDistribution(activePatient.portionDistribution);
      } else {
        const initial = {};
        SMAE_GROUPS.forEach(g => {
          initial[g.id] = { total: 0 };
          DEFAULT_MEALS.forEach(m => initial[g.id][m] = 0);
        });
        setPortionDistribution(initial);
      }

      if (activePatient.weeklyMenu) {
        setWeeklyMenu(activePatient.weeklyMenu);
      } else if (activePatient.dietPlan && typeof activePatient.dietPlan === 'object') {
        const migrated = {};
        DAYS.forEach(d => {
          if (Array.isArray(activePatient.dietPlan[d])) {
            migrated[d] = activePatient.dietPlan[d];
          } else {
            migrated[d] = DEFAULT_MEALS.map((m, idx) => {
              const legacyItems = (activePatient.dietPlan[d] && activePatient.dietPlan[d][m]) || [];
              return {
                id: `meal_${d}_${idx}`,
                name: m,
                dishTitle: '',
                instructions: '',
                image: '',
                items: legacyItems.map(item => ({
                  uid: item.uniqueId || Math.random().toString(36).substr(2, 9),
                  foodId: item.id,
                  name: item.name,
                  group: item.group,
                  subgroup: item.subgroup || '',
                  baseQty: item.qty || '1 porción',
                  portions: 1,
                  qty: item.qty || '1 porción',
                  unit: item.unit || '',
                  kcal: item.kcal || 0,
                  prot: item.prot || 0,
                  carb: item.carb || 0,
                  fat: item.fat || 0
                }))
              };
            });
          }
        });
        setWeeklyMenu(migrated);
      } else {
        const plan = {};
        DAYS.forEach(d => {
          plan[d] = DEFAULT_MEALS.map((m, idx) => ({
            id: `meal_${d}_${idx}`,
            name: m,
            dishTitle: '',
            instructions: '',
            image: '',
            items: []
          }));
        });
        setWeeklyMenu(plan);
      }
    }
  }, [activePatient]);

  // Selección automática del primer tiempo de comida
  useEffect(() => {
    const currentMeals = weeklyMenu[activeDay] || [];
    if (currentMeals.length > 0 && !currentMeals.some(m => m.id === selectedMealId)) {
      setSelectedMealId(currentMeals[0].id);
    }
  }, [activeDay, weeklyMenu, selectedMealId]);

  // Guardar datos
  const handleSave = () => {
    if (!selectedPatientId) {
      alert('Por favor selecciona un paciente antes de guardar.');
      return;
    }

    const currentPatients = JSON.parse(localStorage.getItem('nutriplan_patients') || '[]');
    const updated = currentPatients.map(p => {
      if (p.id === selectedPatientId) {
        return {
          ...p,
          portionDistribution,
          weeklyMenu,
          dietPlan: weeklyMenu
        };
      }
      return p;
    });

    setPatients(updated);
    localStorage.setItem('nutriplan_patients', JSON.stringify(updated));

    const btn = document.getElementById('save-diet-btn');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = `<span class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> ¡Guardado!</span>`;
      btn.classList.add('bg-emerald-600', 'text-white');
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.classList.remove('bg-emerald-600', 'text-white');
      }, 2000);
    }
  };

  // ==========================================
  // 1. CUADRO DIETOSINTÉTICO
  // ==========================================
  const portionTotals = useMemo(() => {
    let totKcal = 0, totProt = 0, totCarb = 0, totFat = 0;
    SMAE_GROUPS.forEach(g => {
      const r = portionDistribution[g.id] || { total: 0 };
      const count = parseFloat(r.total) || 0;
      totKcal += count * g.kcal;
      totProt += count * g.prot;
      totCarb += count * g.carb;
      totFat += count * g.fat;
    });
    return {
      kcal: Math.round(totKcal),
      prot: parseFloat(totProt.toFixed(1)),
      carb: parseFloat(totCarb.toFixed(1)),
      fat: parseFloat(totFat.toFixed(1))
    };
  }, [portionDistribution]);

  const handlePortionChange = (groupId, field, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    setPortionDistribution(prev => {
      const updated = { ...prev };
      const groupData = { ...(updated[groupId] || { total: 0 }) };
      groupData[field] = num;

      if (field !== 'total') {
        let sum = 0;
        DEFAULT_MEALS.forEach(m => {
          sum += parseFloat(groupData[m]) || 0;
        });
        groupData.total = sum;
      } else {
        const ratios = [0.25, 0.10, 0.35, 0.10, 0.20];
        DEFAULT_MEALS.forEach((m, idx) => {
          groupData[m] = Math.round((num * ratios[idx]) * 2) / 2;
        });
      }

      updated[groupId] = groupData;
      return updated;
    });
  };

  // ==========================================
  // GENERADOR DINÁMICO DE COMBINACIONES DE EQUIVALENTES SMAE
  // ==========================================
  const [combinationCount, setCombinationCount] = useState(0);

  const clearPortionDistribution = () => {
    const emptyDist = {};
    SMAE_GROUPS.forEach(g => {
      emptyDist[g.id] = { total: 0 };
      DEFAULT_MEALS.forEach(m => emptyDist[g.id][m] = 0);
    });
    setPortionDistribution(emptyDist);
    setCombinationCount(0);
  };

  const autoDistributeEquivalents = () => {
    const targetKcal = targetMacros.kcal || 2000;
    const targetProt = targetMacros.prot || Math.round((targetKcal * 0.20) / 4);
    const targetCarb = targetMacros.carb || Math.round((targetKcal * 0.50) / 4);
    const targetFat = targetMacros.fat || Math.round((targetKcal * 0.30) / 9);

    // 1. Verduras: aleatorio entre 3 y 6
    const vegOptions = targetKcal > 2200 ? [4, 5, 6, 7] : [3, 4, 5];
    const vegCount = vegOptions[Math.floor(Math.random() * vegOptions.length)];

    // 2. Frutas: aleatorio
    const fruOptions = targetKcal > 2200 ? [3, 4, 5] : [2, 3, 4];
    const fruCount = fruOptions[Math.floor(Math.random() * fruOptions.length)];

    // 3. Lácteos: tipo y ración aleatoria
    const lacTypes = [
      { id: 'lac_d', kcal: 95, p: 9, c: 12, f: 2 },
      { id: 'lac_s', kcal: 110, p: 9, c: 12, f: 4 },
      { id: 'lac_e', kcal: 150, p: 9, c: 12, f: 8 }
    ];
    const chosenLac = lacTypes[Math.floor(Math.random() * lacTypes.length)];
    const lacCountChoices = [0, 0.5, 1, 1.5, 2];
    const lacCount = lacCountChoices[Math.floor(Math.random() * lacCountChoices.length)];

    // 4. Leguminosas: 0, 0.5, 1, o 1.5, 2
    const legChoices = [0, 0.5, 1, 1.5, 2];
    const legCount = legChoices[Math.floor(Math.random() * legChoices.length)];

    // Conteo acumulado de macronutrientes
    let usedCarb = (vegCount * 4) + (fruCount * 15) + (lacCount * chosenLac.c) + (legCount * 20);
    let usedProt = (vegCount * 2) + (fruCount * 0) + (lacCount * chosenLac.p) + (legCount * 8);
    let usedFat = (vegCount * 0) + (fruCount * 0) + (lacCount * chosenLac.f) + (legCount * 1);

    // 5. Cereales: cubrir carbohidratos restantes
    const remCarb = Math.max(0, targetCarb - usedCarb);
    let totalCer = Math.max(1, Math.round((remCarb / 15) * 2) / 2);

    let cer_c = 0;
    if (totalCer >= 4 && Math.random() > 0.4) {
      cer_c = Math.random() > 0.5 ? 1 : 2;
    }
    let cer_s = Math.max(1, totalCer - cer_c);

    usedCarb += (cer_s * 15) + (cer_c * 15);
    usedProt += (cer_s * 2) + (cer_c * 2);
    usedFat += (cer_c * 5);

    // 6. AOA: cubrir proteínas restantes
    const remProt = Math.max(0, targetProt - usedProt);
    let totalAoa = Math.max(1, Math.round((remProt / 7) * 2) / 2);

    // Variación aleatoria entre subtipos de AOA (MBAG, BAG, MAG)
    let aoa_mb = 0, aoa_b = 0, aoa_m = 0;
    // Forzamos aleatoriedad mayor usando combinationCount como semilla adicional
    const aoaMode = Math.floor(Math.random() * 5); 
    if (aoaMode === 0) {
      aoa_b = totalAoa;
    } else if (aoaMode === 1) {
      aoa_mb = totalAoa;
    } else if (aoaMode === 2) {
      aoa_mb = Math.round((totalAoa * 0.4) * 2) / 2;
      aoa_b = Math.max(0.5, totalAoa - aoa_mb);
    } else if (aoaMode === 3) {
      aoa_b = Math.round((totalAoa * 0.6) * 2) / 2;
      aoa_m = Math.max(0.5, totalAoa - aoa_b);
    } else {
      aoa_mb = Math.round((totalAoa * 0.3) * 2) / 2;
      aoa_b = Math.round((totalAoa * 0.4) * 2) / 2;
      aoa_m = Math.max(0, totalAoa - aoa_mb - aoa_b);
    }

    usedProt += (aoa_mb + aoa_b + aoa_m) * 7;
    usedFat += (aoa_mb * 1) + (aoa_b * 3) + (aoa_m * 5);

    // 7. Grasas: cubrir lípidos restantes
    const remFat = Math.max(0, targetFat - usedFat);
    let totalGra = Math.max(1, Math.round((remFat / 5) * 2) / 2);

    let gra_c = 0;
    let gra_s = totalGra;
    if (totalGra >= 3 && Math.random() > 0.3) {
      gra_c = Math.random() > 0.5 ? 1 : 2;
      gra_s = Math.max(0.5, totalGra - gra_c);
      usedProt += gra_c * 3;
      usedCarb += gra_c * 3;
    }
    usedFat += (gra_s * 5) + (gra_c * 5);

    // 8. Ajuste fino de adecuación calórica (tolerancia 97% - 103%)
    let totalKcal = (vegCount * 25) + (fruCount * 60) + (lacCount * chosenLac.kcal) + (legCount * 120) +
                    (cer_s * 70) + (cer_c * 115) +
                    (aoa_mb * 40) + (aoa_b * 55) + (aoa_m * 75) +
                    (gra_s * 45) + (gra_c * 70);

    if (totalKcal < targetKcal * 0.96) {
      cer_s += 0.5;
    } else if (totalKcal > targetKcal * 1.04 && cer_s > 1) {
      cer_s -= 0.5;
    }

    // Inicializar nueva distribución limpia
    const newDist = {};
    SMAE_GROUPS.forEach(g => {
      newDist[g.id] = { total: 0 };
      DEFAULT_MEALS.forEach(m => newDist[g.id][m] = 0);
    });

    // Variación de porcentajes de comida para no siempre ser iguales
    const variationProfile = Math.floor(Math.random() * 3);
    let mealRatios;
    if (variationProfile === 0) {
      mealRatios = [0.30, 0.10, 0.35, 0.05, 0.20]; // Desayuno fuerte
    } else if (variationProfile === 1) {
      mealRatios = [0.20, 0.15, 0.40, 0.10, 0.15]; // Comida muy fuerte
    } else {
      mealRatios = [0.25, 0.10, 0.30, 0.10, 0.25]; // Balanceado, cena más fuerte
    }

    const assignGroup = (groupId, totalQty) => {
      if (!totalQty || totalQty <= 0) return;
      newDist[groupId] = { total: totalQty };
      let currentSum = 0;
      DEFAULT_MEALS.forEach((m, idx) => {
        if (idx === DEFAULT_MEALS.length - 1) {
          newDist[groupId][m] = Math.max(0, Math.round((totalQty - currentSum) * 2) / 2);
        } else {
          const val = Math.round((totalQty * mealRatios[idx]) * 2) / 2;
          newDist[groupId][m] = val;
          currentSum += val;
        }
      });
      // Asegurar que la suma exacta de los tiempos sea idéntica al total
      const assignedSum = DEFAULT_MEALS.reduce((acc, m) => acc + (newDist[groupId][m] || 0), 0);
      const diff = Math.round((totalQty - assignedSum) * 2) / 2;
      if (diff !== 0) {
        newDist[groupId]['Comida'] = Math.max(0, (newDist[groupId]['Comida'] || 0) + diff);
      }
    };

    assignGroup('veg', vegCount);
    assignGroup('fru', fruCount);
    assignGroup('cer_s', cer_s);
    if (cer_c > 0) assignGroup('cer_c', cer_c);
    if (legCount > 0) assignGroup('leg', legCount);
    if (lacCount > 0) assignGroup(chosenLac.id, lacCount);
    if (aoa_mb > 0) assignGroup('aoa_mb', aoa_mb);
    if (aoa_b > 0) assignGroup('aoa_b', aoa_b);
    if (aoa_m > 0) assignGroup('aoa_m', aoa_m);
    assignGroup('gra_s', gra_s);
    if (gra_c > 0) assignGroup('gra_c', gra_c);

    setPortionDistribution(newDist);
    setCombinationCount(prev => prev + 1);
  };

  // ==========================================
  // 2. DISEÑADOR DE MENÚS (NUTRIPHASE V5 STYLE)
  // ==========================================
  const activeDayMeals = weeklyMenu[activeDay] || [];
  const activeMeal = activeDayMeals.find(m => m.id === selectedMealId) || activeDayMeals[0];

  const dailyMenuMacros = useMemo(() => {
    let kcal = 0, prot = 0, carb = 0, fat = 0;
    activeDayMeals.forEach(meal => {
      meal.items.forEach(item => {
        kcal += item.kcal;
        prot += item.prot;
        carb += item.carb;
        fat += item.fat;
      });
    });
    return {
      kcal: Math.round(kcal),
      prot: parseFloat(prot.toFixed(1)),
      carb: parseFloat(carb.toFixed(1)),
      fat: parseFloat(fat.toFixed(1))
    };
  }, [activeDayMeals]);

  const activeMealMacros = useMemo(() => {
    if (!activeMeal) return { kcal: 0, prot: 0, carb: 0, fat: 0 };
    let kcal = 0, prot = 0, carb = 0, fat = 0;
    activeMeal.items.forEach(item => {
      kcal += item.kcal;
      prot += item.prot;
      carb += item.carb;
      fat += item.fat;
    });
    return {
      kcal: Math.round(kcal),
      prot: parseFloat(prot.toFixed(1)),
      carb: parseFloat(carb.toFixed(1)),
      fat: parseFloat(fat.toFixed(1))
    };
  }, [activeMeal]);

  const mealEquivalentsStatus = useMemo(() => {
    if (!activeMeal) return [];
    const mealName = activeMeal.name;
    const status = [];

    SMAE_GROUPS.forEach(group => {
      const assigned = (portionDistribution[group.id] && portionDistribution[group.id][mealName]) || 0;
      let consumed = 0;
      activeMeal.items.forEach(item => {
        if (item.group === group.name || item.group === group.key || item.group === group.id) {
          consumed += item.portions;
        }
      });

      if (assigned > 0 || consumed > 0) {
        status.push({
          group: group.name,
          color: group.color,
          emoji: group.emoji,
          assigned,
          consumed: Math.round(consumed * 10) / 10,
          diff: Math.round((assigned - consumed) * 10) / 10
        });
      }
    });

    return status;
  }, [activeMeal, portionDistribution]);

  const updateActiveMealProperty = (prop, value) => {
    if (!activeMeal) return;
    setWeeklyMenu(prev => {
      const dayMeals = prev[activeDay].map(m => {
        if (m.id === activeMeal.id) {
          return { ...m, [prop]: value };
        }
        return m;
      });
      return { ...prev, [activeDay]: dayMeals };
    });
  };

  const updateMealPropertyById = (mealId, prop, value) => {
    setWeeklyMenu(prev => {
      const dayMeals = prev[activeDay].map(m => {
        if (m.id === mealId) {
          return { ...m, [prop]: value };
        }
        return m;
      });
      return { ...prev, [activeDay]: dayMeals };
    });
  };

  // Subir imagen desde la computadora local (FileReader -> base64)
  const handleFileUpload = (e, mealId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen debe pesar menos de 2MB para un rendimiento óptimo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        updateMealPropertyById(mealId || activeMeal?.id, 'image', base64);
        setShowImageSelectorModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const setDishImagePreset = (url) => {
    const targetId = imageSelectorTargetMealId || activeMeal?.id;
    if (targetId) {
      updateMealPropertyById(targetId, 'image', url);
    }
    setShowImageSelectorModal(false);
    setCustomImageUrlInput('');
  };

  const applyCustomImageUrl = () => {
    if (!customImageUrlInput.trim()) return;
    const targetId = imageSelectorTargetMealId || activeMeal?.id;
    if (targetId) {
      updateMealPropertyById(targetId, 'image', customImageUrlInput.trim());
    }
    setShowImageSelectorModal(false);
    setCustomImageUrlInput('');
  };

  const removeDishImage = (mealId) => {
    updateMealPropertyById(mealId || activeMeal?.id, 'image', '');
  };

  const addFoodToActiveMeal = (food, portions = 1) => {
    if (!activeMeal) return;
    const p = Math.max(0.25, parseFloat(portions) || 1);
    
    const newItem = {
      uid: Math.random().toString(36).substr(2, 9),
      foodId: food.id,
      name: food.name,
      group: food.group,
      subgroup: food.subgroup || '',
      baseQty: food.qty || '1 porción',
      portions: p,
      qty: p === 1 ? food.qty : `${p} x (${food.qty})`,
      unit: food.unit || '',
      kcal: Math.round(food.kcal * p),
      prot: parseFloat((food.prot * p).toFixed(1)),
      carb: parseFloat((food.carb * p).toFixed(1)),
      fat: parseFloat((food.fat * p).toFixed(1))
    };

    setWeeklyMenu(prev => {
      const dayMeals = prev[activeDay].map(m => {
        if (m.id === activeMeal.id) {
          return { ...m, items: [...m.items, newItem] };
        }
        return m;
      });
      return { ...prev, [activeDay]: dayMeals };
    });
  };

  const updateItemPortions = (itemUid, newPortions) => {
    const p = Math.max(0.1, parseFloat(newPortions) || 0);
    setWeeklyMenu(prev => {
      const dayMeals = prev[activeDay].map(m => {
        if (m.id === activeMeal.id) {
          const updatedItems = m.items.map(it => {
            if (it.uid === itemUid) {
              const originalFood = allFoods.find(f => f.id === it.foodId) || it;
              const baseKcal = (originalFood.kcal / (originalFood.portions || 1)) || it.kcal;
              const baseProt = (originalFood.prot / (originalFood.portions || 1)) || it.prot;
              const baseCarb = (originalFood.carb / (originalFood.portions || 1)) || it.carb;
              const baseFat = (originalFood.fat / (originalFood.portions || 1)) || it.fat;

              return {
                ...it,
                portions: p,
                qty: p === 1 ? it.baseQty : `${p} x (${it.baseQty})`,
                kcal: Math.round(baseKcal * p),
                prot: parseFloat((baseProt * p).toFixed(1)),
                carb: parseFloat((baseCarb * p).toFixed(1)),
                fat: parseFloat((baseFat * p).toFixed(1))
              };
            }
            return it;
          });
          return { ...m, items: updatedItems };
        }
        return m;
      });
      return { ...prev, [activeDay]: dayMeals };
    });
  };

  const removeItemFromActiveMeal = (itemUid) => {
    setWeeklyMenu(prev => {
      const dayMeals = prev[activeDay].map(m => {
        if (m.id === activeMeal.id) {
          return { ...m, items: m.items.filter(it => it.uid !== itemUid) };
        }
        return m;
      });
      return { ...prev, [activeDay]: dayMeals };
    });
  };

  const replaceItem = (newFood) => {
    if (!replaceTargetItem) return;
    const p = replaceTargetItem.portions || 1;
    
    setWeeklyMenu(prev => {
      const dayMeals = prev[activeDay].map(m => {
        if (m.id === activeMeal.id) {
          const updatedItems = m.items.map(it => {
            if (it.uid === replaceTargetItem.uid) {
              return {
                ...it,
                foodId: newFood.id,
                name: newFood.name,
                group: newFood.group,
                baseQty: newFood.qty,
                qty: p === 1 ? newFood.qty : `${p} x (${newFood.qty})`,
                kcal: Math.round(newFood.kcal * p),
                prot: parseFloat((newFood.prot * p).toFixed(1)),
                carb: parseFloat((newFood.carb * p).toFixed(1)),
                fat: parseFloat((newFood.fat * p).toFixed(1))
              };
            }
            return it;
          });
          return { ...m, items: updatedItems };
        }
        return m;
      });
      return { ...prev, [activeDay]: dayMeals };
    });
    setReplaceTargetItem(null);
  };

  const addNewMealToDay = () => {
    const mealName = prompt('Nombre del nuevo tiempo de comida:', 'Pre-Entreno');
    if (!mealName || !mealName.trim()) return;

    const newId = `meal_${activeDay}_${Date.now()}`;
    const newMealObj = {
      id: newId,
      name: mealName.trim(),
      dishTitle: '',
      instructions: '',
      image: '',
      items: []
    };

    setWeeklyMenu(prev => ({
      ...prev,
      [activeDay]: [...prev[activeDay], newMealObj]
    }));
    setSelectedMealId(newId);
  };

  const deleteMealFromDay = (mealId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este tiempo de comida y sus alimentos?')) return;
    setWeeklyMenu(prev => {
      const updated = prev[activeDay].filter(m => m.id !== mealId);
      return { ...prev, [activeDay]: updated };
    });
  };

  const copyCurrentDay = () => {
    const dayData = JSON.parse(JSON.stringify(weeklyMenu[activeDay]));
    setCopiedDayData({ dayName: activeDay, meals: dayData });
    alert(`¡Día ${activeDay} copiado! Ahora selecciona otro día y presiona "Pegar Día".`);
  };

  const pasteDay = () => {
    if (!copiedDayData) {
      alert('Primero copia un día usando el botón "Copiar Día".');
      return;
    }
    if (!window.confirm(`¿Reemplazar el menú de ${activeDay} con el contenido copiado de ${copiedDayData.dayName}?`)) return;

    const clonedMeals = copiedDayData.meals.map(m => ({
      ...m,
      id: `meal_${activeDay}_${Math.random().toString(36).substr(2, 7)}`,
      items: m.items.map(it => ({
        ...it,
        uid: Math.random().toString(36).substr(2, 9)
      }))
    }));

    setWeeklyMenu(prev => ({
      ...prev,
      [activeDay]: clonedMeals
    }));
  };

  const copyCurrentMeal = () => {
    if (!activeMeal) return;
    const mealData = JSON.parse(JSON.stringify(activeMeal));
    setCopiedMealData(mealData);
    alert(`¡${activeMeal.name} copiado! Puedes pegarlo en otro tiempo de comida o día.`);
  };

  const pasteMeal = () => {
    if (!copiedMealData || !activeMeal) {
      alert('Primero copia un tiempo de comida usando "Copiar".');
      return;
    }
    if (!window.confirm(`¿Pegar el contenido copiado en ${activeMeal.name}?`)) return;

    setWeeklyMenu(prev => {
      const dayMeals = prev[activeDay].map(m => {
        if (m.id === activeMeal.id) {
          return {
            ...m,
            dishTitle: copiedMealData.dishTitle,
            instructions: copiedMealData.instructions,
            image: copiedMealData.image || m.image,
            items: copiedMealData.items.map(it => ({
              ...it,
              uid: Math.random().toString(36).substr(2, 9)
            }))
          };
        }
        return m;
      });
      return { ...prev, [activeDay]: dayMeals };
    });
  };

  const insertRecipeToMeal = (recipe) => {
    if (!activeMeal) return;
    
    const newItems = recipe.ingredients.map(ing => ({
      uid: Math.random().toString(36).substr(2, 9),
      foodId: ing.id,
      name: ing.name,
      group: ing.group,
      subgroup: ing.subgroup || '',
      baseQty: ing.qty || '1 porción',
      portions: ing.portions || 1,
      qty: ing.qty || '1 porción',
      unit: ing.unit || '',
      kcal: ing.kcal || 0,
      prot: ing.prot || 0,
      carb: ing.carb || 0,
      fat: ing.fat || 0
    }));

    setWeeklyMenu(prev => {
      const dayMeals = prev[activeDay].map(m => {
        if (m.id === activeMeal.id) {
          return {
            ...m,
            dishTitle: recipe.name,
            instructions: recipe.instructions || m.instructions,
            image: recipe.image_url || m.image,
            items: [...m.items, ...newItems]
          };
        }
        return m;
      });
      return { ...prev, [activeDay]: dayMeals };
    });

    setShowRecipesModal(false);
  };

  const [quickSearch, setQuickSearch] = useState('');
  const [quickFilterGroup, setQuickFilterGroup] = useState('Todos');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredQuickFoods = useMemo(() => {
    let list = allFoods;
    if (quickFilterGroup !== 'Todos') {
      list = list.filter(f => f.group === quickFilterGroup || f.subgroup === quickFilterGroup);
    }
    if (quickSearch.trim()) {
      const q = quickSearch.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || (f.group && f.group.toLowerCase().includes(q)));
    }
    return list.slice(0, 30);
  }, [allFoods, quickSearch, quickFilterGroup]);

  // ==========================================
  // 3. RESUMEN SEMANAL DE MACROS (barra por día)
  // ==========================================
  const weeklyMacrosSummary = useMemo(() => {
    return DAYS.map(day => {
      const meals = weeklyMenu[day] || [];
      let kcal = 0, prot = 0, carb = 0, fat = 0;
      meals.forEach(m => m.items.forEach(it => {
        kcal += it.kcal; prot += it.prot; carb += it.carb; fat += it.fat;
      }));
      const target = targetMacros.kcal || 2000;
      const pct = Math.min(100, Math.round((kcal / target) * 100));
      return { day, kcal: Math.round(kcal), prot: parseFloat(prot.toFixed(1)), carb: parseFloat(carb.toFixed(1)), fat: parseFloat(fat.toFixed(1)), pct };
    });
  }, [weeklyMenu, targetMacros]);

  // ==========================================
  // 4. MOTOR DE SUGERENCIAS NUTRICIONALES "NutriAsistente"
  // ==========================================
  const getSuggestedFoods = useMemo(() => {
    if (!activeMeal) return [];
    const gapKcal = (targetMacros.kcal / (activeDayMeals.length || 5)) - activeMealMacros.kcal;
    const gapProt = (targetMacros.prot / (activeDayMeals.length || 5)) - activeMealMacros.prot;
    const gapCarb = (targetMacros.carb / (activeDayMeals.length || 5)) - activeMealMacros.carb;
    const gapFat  = (targetMacros.fat  / (activeDayMeals.length || 5)) - activeMealMacros.fat;

    // Score each food: how well does it fill the biggest gaps?
    const scored = allFoods.map(food => {
      let score = 0;
      if (gapKcal > 50 && food.kcal > 0)  score += Math.min(2, food.kcal / gapKcal);
      if (gapProt > 5 && food.prot > 3)   score += (food.prot / Math.max(1, gapProt)) * 2;
      if (gapCarb > 10 && food.carb > 5)  score += (food.carb / Math.max(1, gapCarb));
      if (gapFat  > 3 && food.fat  > 1)   score += (food.fat  / Math.max(1, gapFat)) * 0.5;
      // Penalize foods already in meal
      if (activeMeal.items.some(it => it.foodId === food.id)) score -= 5;
      return { food, score };
    });

    return scored
      .filter(s => s.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(s => s.food);
  }, [activeMeal, activeMealMacros, targetMacros, activeDayMeals, allFoods]);

  // ==========================================
  // SVG DONUT CHART helper
  // ==========================================
  const MacroDonut = ({ kcal, prot, carb, fat, targetKcal, size = 80 }) => {
    const r = size / 2 - 8;
    const circ = 2 * Math.PI * r;
    const cx = size / 2, cy = size / 2;
    const totalMacroKcal = prot * 4 + carb * 4 + fat * 9;
    const protPct = totalMacroKcal > 0 ? (prot * 4) / totalMacroKcal : 0;
    const carbPct = totalMacroKcal > 0 ? (carb * 4) / totalMacroKcal : 0;
    const fatPct  = totalMacroKcal > 0 ? (fat  * 9) / totalMacroKcal : 0;
    const fillPct = Math.min(1, targetKcal > 0 ? kcal / targetKcal : 0);
    // Segments: prot (rose), carb (blue), fat (amber)
    const segments = [
      { pct: protPct * fillPct, color: '#f43f5e' },
      { pct: carbPct * fillPct, color: '#3b82f6' },
      { pct: fatPct  * fillPct, color: '#f59e0b' },
    ];
    let offset = 0;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="7"/>
        {segments.map((seg, i) => {
          const dash = seg.pct * circ;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth="7"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset * circ}
              strokeLinecap="round"
            />
          );
          offset += seg.pct;
          return el;
        })}
      </svg>
    );
  };

  const weeklyShoppingList = useMemo(() => {
    const list = {};
    DAYS.forEach(day => {
      const meals = weeklyMenu[day] || [];
      meals.forEach(m => {
        m.items.forEach(it => {
          const grp = it.group || 'Otros';
          if (!list[grp]) list[grp] = {};
          if (!list[grp][it.name]) {
            list[grp][it.name] = { count: 0, qty: it.baseQty, portions: 0 };
          }
          list[grp][it.name].portions += it.portions;
          list[grp][it.name].count += 1;
        });
      });
    });
    return list;
  }, [weeklyMenu]);

  const copyShoppingListToWhatsApp = () => {
    let text = `🛒 *LISTA DE COMPRAS SEMANAL - ${activePatient?.name || 'PACIENTE'}*\n\n`;
    Object.keys(weeklyShoppingList).sort().forEach(group => {
      text += `📍 *${group.toUpperCase()}*\n`;
      Object.keys(weeklyShoppingList[group]).sort().forEach(foodName => {
        const item = weeklyShoppingList[group][foodName];
        text += ` • ${foodName}: ${item.portions} raciones (${item.qty})\n`;
      });
      text += `\n`;
    });
    text += `_Generado con BiomeNutrition Pro_`;
    navigator.clipboard.writeText(text);
    alert('¡Lista de compras copiada! Lista para pegar en WhatsApp.');
  };

  const getAdequacyColor = (current, target) => {
    if (!target || target === 0) return 'text-slate-600 bg-slate-100';
    const pct = (current / target) * 100;
    if (pct >= 95 && pct <= 105) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if ((pct >= 90 && pct < 95) || (pct > 105 && pct <= 110)) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden text-slate-800">
      
      {/* HEADER DE CONTROL PRINCIPAL */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4 shadow-sm z-20">
        
        {/* Selector de Paciente y Sub-Tabs */}
        <div className="flex items-center gap-4">
          <div className="w-64">
            <select 
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Selecciona un paciente...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({Math.round(p.assignedKcal || p.finalKcal || p.get || 2000)} kcal)
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Resumen de Metas Diarias y Acciones */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Flame size={14} className="text-amber-500" />
              <span>Meta: <strong className="font-bold">{Math.round(targetMacros.kcal)} kcal</strong></span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-blue-600 font-semibold">P: {Math.round(targetMacros.prot)}g</span>
            <span className="text-emerald-600 font-semibold">C: {Math.round(targetMacros.carb)}g</span>
            <span className="text-amber-600 font-semibold">G: {Math.round(targetMacros.fat)}g</span>
          </div>

          <button
            onClick={() => setShowShoppingListModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            title="Ver lista de compras semanal"
          >
            <ShoppingCart size={15} />
            <span className="hidden sm:inline">Lista de Compras</span>
          </button>

          <button
            type="button"
            onClick={() => setShowWhatsAppModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Enviar plan formateado por WhatsApp (Estilo Avena)"
          >
            <Send size={15} className="text-emerald-600" />
            <span className="hidden sm:inline">Enviar WhatsApp</span>
          </button>

          <button
            id="save-diet-btn"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Save size={15} />
            Guardar Plan
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL CON SIDEBAR */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* SIDEBAR NAVEGACIÓN */}
        <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 hidden md:flex shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Configuración</h3>
            <button 
              onClick={() => setActiveStepTab('equivalentes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeStepTab === 'equivalentes' 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Layers size={16} />
              Cuadro SMAE
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Días de la Semana</h3>
            <div className="space-y-1">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => { setActiveStepTab('menu'); setActiveDay(day); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeStepTab === 'menu' && activeDay === day 
                      ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Reutilizamos el icono de lista pero simplificado para no importar otro */}
                    <div className={`w-1.5 h-1.5 rounded-full ${activeStepTab === 'menu' && activeDay === day ? 'bg-white' : 'bg-slate-300'}`} />
                    {day}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ÁREA DE CONTENIDO */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">

        {/* ======================================================== */}
        {/* PASO 1: CUADRO DIETOSINTÉTICO & EQUIVALENTES             */}
        {/* ======================================================== */}
        {activeStepTab === 'equivalentes' && (
          <div className="h-full overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* PANEL DE CONTROL UNIFICADO Y ELEGANTE DEL CUADRO */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-2 font-heading">
                    <Layers className="text-primary-600" size={18} />
                    Distribución de Raciones SMAE (Cuadro Dietosintético)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Meta clínica: <strong className="text-slate-800 font-bold">{Math.round(targetMacros.kcal || 2000)} kcal</strong> • Ajusta raciones en la tabla o autocalcula una distribución matemática.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {portionTotals.kcal > 0 && (
                    <button
                      onClick={clearPortionDistribution}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold rounded-xl transition-all border border-slate-200/80"
                      title="Reiniciar todas las raciones a 0"
                    >
                      <Trash2 size={14} />
                      Limpiar
                    </button>
                  )}

                  <button
                    onClick={autoDistributeEquivalents}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-xl shadow-sm transition-all hover:shadow-md active:scale-95"
                    title="Calcula y acomoda una combinación matemática de raciones SMAE que cumple con las calorías y macros objetivo"
                  >
                    <Sparkles size={16} />
                    {combinationCount === 0 ? 'Auto-Distribuir Raciones ✨' : `Generar Otra Combinación 🔀 (#${combinationCount + 1})`}
                  </button>
                </div>
              </div>

              {/* MEDIDORES COMPACTOS DE ADECUACIÓN (EN LÍNEA) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-2.5">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Calorías</span>
                    <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-md ${
                      Math.abs(portionTotals.kcal - targetMacros.kcal) < 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {targetMacros.kcal > 0 ? ((portionTotals.kcal / targetMacros.kcal) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="text-base font-black text-slate-800 font-heading">
                    {portionTotals.kcal} <span className="text-xs font-medium text-slate-400">/ {Math.round(targetMacros.kcal)} kcal</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (portionTotals.kcal / (targetMacros.kcal || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-2.5">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Proteínas</span>
                    <span className="text-[11px] font-black px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800">
                      {targetMacros.prot > 0 ? ((portionTotals.prot / targetMacros.prot) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="text-base font-black text-rose-600 font-heading">
                    {portionTotals.prot}g <span className="text-xs font-medium text-slate-400">/ {Math.round(targetMacros.prot)}g</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (portionTotals.prot / (targetMacros.prot || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-2.5">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Carbohidratos</span>
                    <span className="text-[11px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      {targetMacros.carb > 0 ? ((portionTotals.carb / targetMacros.carb) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="text-base font-black text-blue-600 font-heading">
                    {portionTotals.carb}g <span className="text-xs font-medium text-slate-400">/ {Math.round(targetMacros.carb)}g</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (portionTotals.carb / (targetMacros.carb || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-2.5">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lípidos</span>
                    <span className="text-[11px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {targetMacros.fat > 0 ? ((portionTotals.fat / targetMacros.fat) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="text-base font-black text-amber-600 font-heading">
                    {portionTotals.fat}g <span className="text-xs font-medium text-slate-400">/ {Math.round(targetMacros.fat)}g</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (portionTotals.fat / (targetMacros.fat || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* BARRA INFORMATIVA DE OPCIÓN DINÁMICA */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                {combinationCount > 0 ? (
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50/80 border border-emerald-200/70 px-3.5 py-1.5 rounded-xl font-medium w-full sm:w-auto">
                    <span className="font-black bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-md text-[10px]">
                      OPCIÓN #{combinationCount}
                    </span>
                    <span>
                      Raciones acomodadas ({portionTotals.kcal} kcal • {Math.round((portionTotals.kcal / (targetMacros.kcal || 2000)) * 100)}% adecuación). Puedes pulsar de nuevo para ver otra alternativa.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-xl">
                    <span className="text-amber-500 font-bold">💡</span>
                    <span>
                      Pulsa <strong>"Auto-Distribuir Raciones"</strong> para que el sistema acomode las equivalentes de verduras, frutas, cereales, AOA y grasas cumpliendo el gasto energético de {Math.round(targetMacros.kcal || 2000)} kcal.
                    </span>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 font-medium">
                  {SMAE_GROUPS.reduce((acc, g) => acc + (parseFloat(portionDistribution[g.id]?.total) || 0), 0)} raciones asignadas
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Grupo SMAE</th>
                      <th className="py-3 px-2 text-center">Total</th>
                      {DEFAULT_MEALS.map(m => (
                        <th key={m} className="py-3 px-2 text-center">{m}</th>
                      ))}
                      <th className="py-3 px-3 text-right">Kcal</th>
                      <th className="py-3 px-3 text-right">Prot (g)</th>
                      <th className="py-3 px-3 text-right">Líp (g)</th>
                      <th className="py-3 px-3 text-right">Carb (g)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {SMAE_GROUPS.map(g => {
                      const data = portionDistribution[g.id] || { total: 0 };
                      const count = parseFloat(data.total) || 0;
                      return (
                        <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-slate-800 flex items-center gap-2">
                            <span>{g.emoji}</span>
                            <span style={{ color: g.color }}>{g.fullName || g.name}</span>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <input 
                              type="number" 
                              step="0.5" 
                              min="0"
                              value={data.total || ''} 
                              onChange={(e) => handlePortionChange(g.id, 'total', e.target.value)}
                              className="w-14 text-center font-bold bg-slate-100 focus:bg-white border border-slate-200 rounded-lg py-1 outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </td>
                          {DEFAULT_MEALS.map(m => (
                            <td key={m} className="py-2.5 px-2 text-center">
                              <input 
                                type="number" 
                                step="0.5" 
                                min="0"
                                value={data[m] || ''} 
                                onChange={(e) => handlePortionChange(g.id, m, e.target.value)}
                                className="w-12 text-center text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-lg py-1 outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </td>
                          ))}
                          <td className="py-2.5 px-3 text-right font-bold text-amber-600">{Math.round(count * g.kcal)}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-rose-600">{(count * g.prot).toFixed(1)}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-amber-500">{(count * g.fat).toFixed(1)}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-blue-600">{(count * g.carb).toFixed(1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-100 text-slate-800 font-bold border-t-2 border-slate-200">
                    <tr>
                      <td className="py-3 px-4 uppercase text-xs tracking-wider">Totales Cuadro</td>
                      <td className="py-3 px-2 text-center text-primary-700">
                        {SMAE_GROUPS.reduce((acc, g) => acc + (parseFloat(portionDistribution[g.id]?.total) || 0), 0)} raciones
                      </td>
                      {DEFAULT_MEALS.map(m => {
                        const sumMeal = SMAE_GROUPS.reduce((acc, g) => acc + (parseFloat(portionDistribution[g.id]?.[m]) || 0), 0);
                        return <td key={m} className="py-3 px-2 text-center text-slate-600">{sumMeal}</td>;
                      })}
                      <td className="py-3 px-3 text-right text-amber-600 font-black">{portionTotals.kcal}</td>
                      <td className="py-3 px-3 text-right text-rose-600 font-black">{portionTotals.prot}g</td>
                      <td className="py-3 px-3 text-right text-amber-500 font-black">{portionTotals.fat}g</td>
                      <td className="py-3 px-3 text-right text-blue-600 font-black">{portionTotals.carb}g</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveStepTab('menu')}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Pasar al Diseñador de Menús
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PASO 2: DISEÑADOR DE MENÚS (NUTRISTUDIO CLEAN WORKFLOW)  */}
        {/* ======================================================== */}
        {activeStepTab === 'menu' && (
          <div className="h-full flex flex-col overflow-hidden relative">
            
            {/* TABLERO PRINCIPAL EN TARJETAS VISUALES (MENU BOARD) */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/70">
              <div className="max-w-7xl mx-auto space-y-5">

                {/* RESUMEN VISUAL SEMANAL */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Resumen Calórico Semanal</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {weeklyMacrosSummary.map(({ day, kcal, pct }) => {
                      const shortDay = day.slice(0, 3);
                      const isActive = day === activeDay && activeStepTab === 'menu';
                      const barColor = pct >= 95 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : pct >= 40 ? 'bg-blue-400' : 'bg-slate-300';
                      return (
                        <button
                          key={day}
                          onClick={() => setActiveDay(day)}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${ isActive ? 'bg-primary-50 border border-primary-200' : 'hover:bg-slate-50' }`}
                        >
                          <span className={`text-[10px] font-black uppercase ${ isActive ? 'text-primary-700' : 'text-slate-500' }`}>{shortDay}</span>
                          <div className="w-full h-14 bg-slate-100 rounded-lg overflow-hidden flex flex-col justify-end">
                            <div
                              className={`w-full ${barColor} rounded-lg transition-all duration-500`}
                              style={{ height: `${Math.max(4, pct)}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-bold text-slate-500">{kcal > 0 ? kcal : '—'}</span>
                          <span className={`text-[9px] font-black px-1 py-0.5 rounded-full ${ pct >= 95 ? 'bg-emerald-100 text-emerald-700' : pct >= 40 ? 'bg-amber-100 text-amber-700' : 'text-slate-400' }`}>
                            {pct > 0 ? `${pct}%` : '0%'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-heading">
                      <Utensils size={20} className="text-primary-600" />
                      Menú del {activeDay}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeDayMeals.length} tiempos de comida • Da clic en cualquier tarjeta para editar sus alimentos, foto e instrucciones.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Métricas Diarias Compactas */}
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-xl text-xs">
                      <div className="text-slate-700 flex items-center gap-1.5">
                        <Flame size={14} className="text-amber-500" />
                        <span className="font-bold">{dailyMenuMacros.kcal}</span>
                        <span className="text-slate-400 text-[11px]">/ {Math.round(targetMacros.kcal)} kcal</span>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ml-1 ${
                          Math.abs(dailyMenuMacros.kcal - targetMacros.kcal) < 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {targetMacros.kcal > 0 ? ((dailyMenuMacros.kcal / targetMacros.kcal) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                      <button
                        onClick={copyCurrentDay}
                        className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        title="Copiar menú completo de este día"
                      >
                        <Copy size={13} />
                        <span className="hidden lg:inline">Copiar Día</span>
                      </button>
                      <button
                        onClick={pasteDay}
                        className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        title="Pegar menú copiado en este día"
                      >
                        <Clipboard size={13} />
                        <span className="hidden lg:inline">Pegar Día</span>
                      </button>
                    </div>

                    <button
                      onClick={addNewMealToDay}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                    >
                      <Plus size={14} />
                      Añadir Tiempo
                    </button>
                  </div>
                </div>

                {/* GRID DE CARDS GASTRONÓMICAS DE PLATILLOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeDayMeals.map(meal => {
                    const mealKcal = meal.items.reduce((acc, it) => acc + it.kcal, 0);
                    const mealProt = meal.items.reduce((acc, it) => acc + it.prot, 0).toFixed(1);
                    const mealCarb = meal.items.reduce((acc, it) => acc + it.carb, 0).toFixed(1);
                    const mealFat = meal.items.reduce((acc, it) => acc + it.fat, 0).toFixed(1);

                    return (
                      <div
                        key={meal.id}
                        onClick={() => {
                          setSelectedMealId(meal.id);
                          setIsMealDrawerOpen(true);
                        }}
                        className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary-300 transition-all flex flex-col group cursor-pointer relative"
                      >
                        {/* FOTOGRAFÍA GASTRONÓMICA */}
                        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                          {meal.image ? (
                            <img 
                              src={meal.image} 
                              alt={meal.dishTitle || meal.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-gradient-to-br from-slate-100 to-slate-200/60">
                              {getMealIcon(meal.name, 36)}
                              <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
                                Sin Foto Asignada
                              </span>
                            </div>
                          )}

                          {/* Badge Tiempo de Comida (Top Left) */}
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-800 shadow-sm flex items-center gap-1.5">
                            {getMealIcon(meal.name, 14)}
                            {meal.name}
                          </div>

                          {/* Badge Calorías (Top Right) */}
                          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-black text-white shadow-sm">
                            {mealKcal} kcal
                          </div>

                          {/* Botón flotante para cambiar foto */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageSelectorTargetMealId(meal.id);
                              setShowImageSelectorModal(true);
                            }}
                            className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Cambiar Foto"
                          >
                            <Camera size={14} />
                          </button>
                        </div>

                        {/* CONTENIDO DE LA CARD */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h4 className="text-base font-black text-slate-800 leading-tight mb-1 font-heading group-hover:text-primary-700 transition-colors">
                              {meal.dishTitle || <span className="italic text-slate-400 font-normal">Sin título de platillo</span>}
                            </h4>

                            {meal.instructions && (
                              <p className="text-xs text-slate-500 italic line-clamp-2 mt-1">
                                "{meal.instructions}"
                              </p>
                            )}

                            {/* Resumen de ingredientes */}
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Ingredientes ({meal.items.length}):
                              </span>
                              {meal.items.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">Clic para añadir alimentos...</p>
                              ) : (
                                <ul className="text-xs text-slate-600 space-y-1">
                                  {meal.items.slice(0, 4).map(it => (
                                    <li key={it.uid} className="flex justify-between items-center text-[11px]">
                                      <span className="truncate pr-2 font-medium">• {it.name}</span>
                                      <span className="text-slate-400 font-semibold shrink-0">{it.qty}</span>
                                    </li>
                                  ))}
                                  {meal.items.length > 4 && (
                                    <li className="text-[10px] text-primary-600 font-bold pt-0.5">
                                      + {meal.items.length - 4} ingredientes más...
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          </div>

                          {/* Barra de macros y botón editar */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                              <span className="text-rose-600">P: {mealProt}g</span>
                              <span>•</span>
                              <span className="text-blue-600">C: {mealCarb}g</span>
                              <span>•</span>
                              <span className="text-amber-500">G: {mealFat}g</span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMealId(meal.id);
                                setIsMealDrawerOpen(true);
                              }}
                              className="px-3.5 py-1.5 bg-slate-100 hover:bg-primary-600 text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                            >
                              ✏️ Editar Platillo
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* ======================================================== */}
            {/* PANEL LATERAL ENFOCADO (FOCUSED SLIDE-OVER DRAWER)      */}
            {/* ======================================================== */}
            {isMealDrawerOpen && activeMeal && (
              <div className="fixed inset-0 z-50 flex justify-end">
                {/* Backdrop con desenfoque suave */}
                <div 
                  onClick={() => setIsMealDrawerOpen(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
                />

                {/* Panel deslizante */}
                <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in-right overflow-hidden">
                  
                  {/* HEADER DEL PANEL ENFOCADO */}
                  <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      {/* DONUT CHART MACRO */}
                      <div className="relative shrink-0">
                        <MacroDonut
                          kcal={activeMealMacros.kcal}
                          prot={activeMealMacros.prot}
                          carb={activeMealMacros.carb}
                          fat={activeMealMacros.fat}
                          targetKcal={targetMacros.kcal / (activeDayMeals.length || 5)}
                          size={64}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[9px] font-black text-slate-700 leading-none text-center">
                            {activeMealMacros.kcal}<br/>kcal
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-slate-800 font-heading">
                            Editando: {activeMeal.name}
                          </h3>
                          <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {activeDay}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-rose-600">P: {activeMealMacros.prot}g</span>
                          <span className="text-[11px] font-bold text-blue-600">C: {activeMealMacros.carb}g</span>
                          <span className="text-[11px] font-bold text-amber-500">G: {activeMealMacros.fat}g</span>
                        </div>
                        {/* Barra de progreso de kcal */}
                        <div className="mt-1 w-48 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              activeMealMacros.kcal / (targetMacros.kcal / (activeDayMeals.length || 5)) >= 0.95 ? 'bg-emerald-500' : 'bg-primary-500'
                            }`}
                            style={{ width: `${Math.min(100, (activeMealMacros.kcal / Math.max(1, targetMacros.kcal / (activeDayMeals.length || 5))) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Navegación entre tiempos de comida & Cerrar */}
                    <div className="flex items-center gap-2">
                      {/* Anterior / Siguiente Meal */}
                      {(() => {
                        const idx = activeDayMeals.findIndex(m => m.id === activeMeal.id);
                        const prev = idx > 0 ? activeDayMeals[idx - 1] : null;
                        const next = idx < activeDayMeals.length - 1 ? activeDayMeals[idx + 1] : null;
                        return (
                          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                            <button
                              disabled={!prev}
                              onClick={() => prev && setSelectedMealId(prev.id)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent"
                              title={prev ? `Ir a ${prev.name}` : 'Primer tiempo'}
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <span className="px-2 text-[11px] text-slate-400 font-semibold">{idx + 1}/{activeDayMeals.length}</span>
                            <button
                              disabled={!next}
                              onClick={() => next && setSelectedMealId(next.id)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent"
                              title={next ? `Ir a ${next.name}` : 'Último tiempo'}
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        );
                      })()}

                      <button
                        onClick={() => setIsMealDrawerOpen(false)}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                        title="Cerrar panel"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* CUERPO DEL PANEL (SCROLLABLE) */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-slate-50/50">
                    
                    {/* BLOQUE 1: PLATILLO & PRESENTACIÓN */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        {/* Miniatura de Foto */}
                        <div 
                          onClick={() => {
                            setImageSelectorTargetMealId(activeMeal.id);
                            setShowImageSelectorModal(true);
                          }}
                          className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 group cursor-pointer shadow-xs"
                          title="Clic para cambiar foto del platillo"
                        >
                          {activeMeal.image ? (
                            <img src={activeMeal.image} alt="Platillo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                              <Camera size={24} />
                              <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Añadir Foto</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Camera size={16} />
                          </div>
                        </div>

                        {/* Nombre del Platillo & Acciones */}
                        <div className="flex-1 w-full space-y-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                              Nombre del Platillo
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Omelette de Claras con Espinacas y Aguacate"
                              value={activeMeal.dishTitle || ''}
                              onChange={(e) => updateActiveMealProperty('dishTitle', e.target.value)}
                              className="w-full px-3.5 py-2 text-sm font-bold text-slate-800 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 font-heading"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setImageSelectorTargetMealId(activeMeal.id);
                                setShowImageSelectorModal(true);
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
                            >
                              <ImageIcon size={13} />
                              Foto / Presets
                            </button>
                            <button
                              onClick={() => setShowRecipesModal(true)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold rounded-lg transition-all border border-primary-200/50"
                            >
                              <ChefHat size={13} />
                              Importar Receta
                            </button>
                            {activeMeal.image && (
                              <button
                                onClick={() => removeDishImage(activeMeal.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg text-xs"
                                title="Quitar foto"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Instrucciones de preparación */}
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                          Preparación / Instrucciones Culinarias
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Ej: Batir las claras, verter en sartén a fuego medio con gotas de aceite de oliva, añadir las espinacas y doblar..."
                          value={activeMeal.instructions || ''}
                          onChange={(e) => updateActiveMealProperty('instructions', e.target.value)}
                          className="w-full px-3 py-2 text-xs text-slate-700 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        />
                      </div>
                    </div>

                    {/* BLOQUE 2: TABLA DE INGREDIENTES */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
                      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                          <Utensils size={14} className="text-primary-600" />
                          Ingredientes y Raciones ({activeMeal.items.length})
                        </span>
                        <div className="text-[11px] font-bold text-slate-500">
                          Total: {activeMealMacros.kcal} kcal
                        </div>
                      </div>

                      {activeMeal.items.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <p className="text-xs">No hay alimentos en este platillo.</p>
                          <p className="text-[11px] text-slate-400 mt-1">Usa el buscador rápido de abajo para añadir alimentos del SMAE.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                              <tr>
                                <th className="py-2.5 px-3">Alimento</th>
                                <th className="py-2.5 px-2 text-center">Ración</th>
                                <th className="py-2.5 px-2 text-right">Kcal</th>
                                <th className="py-2.5 px-2 text-right">P</th>
                                <th className="py-2.5 px-2 text-right">C</th>
                                <th className="py-2.5 px-2 text-right">G</th>
                                <th className="py-2.5 px-2 text-center">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {activeMeal.items.map(item => {
                                const group = getSMAEGroupInfo(item.group);
                                return (
                                  <tr key={item.uid} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-2.5 px-3">
                                      <div className="font-bold text-slate-800 leading-tight flex items-center gap-1.5">
                                        <span>{group.emoji}</span>
                                        <span>{item.name}</span>
                                      </div>
                                      <span className="text-[10px] font-medium" style={{ color: group.color }}>
                                        {group.fullName || item.group}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-2 text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          onClick={() => updateItemPortions(item.uid, Math.max(0.5, item.portions - 0.5))}
                                          className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                                        >
                                          -
                                        </button>
                                        <span className="font-bold text-xs w-8 text-center">{item.portions}</span>
                                        <button
                                          onClick={() => updateItemPortions(item.uid, item.portions + 0.5)}
                                          className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                                        >
                                          +
                                        </button>
                                      </div>
                                      <span className="text-[10px] text-slate-400 block">{item.qty}</span>
                                    </td>
                                    <td className="py-2.5 px-2 text-right font-bold text-amber-600">{item.kcal}</td>
                                    <td className="py-2.5 px-2 text-right font-medium text-rose-600">{item.prot}</td>
                                    <td className="py-2.5 px-2 text-right font-medium text-blue-600">{item.carb}</td>
                                    <td className="py-2.5 px-2 text-right font-medium text-amber-500">{item.fat}</td>
                                    <td className="py-2.5 px-2 text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          onClick={() => setReplaceTargetItem(item)}
                                          className="p-1 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                                          title="Sustituir alimento"
                                        >
                                          <RefreshCw size={13} />
                                        </button>
                                        <button
                                          onClick={() => removeItemFromActiveMeal(item.uid)}
                                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                          title="Eliminar"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* BLOQUE 3: BUSCADOR RÁPIDO DE ALIMENTOS SMAE */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Search size={14} className="text-primary-600" />
                          Buscador Rápido de Alimentos SMAE
                        </span>
                        <select
                          value={quickFilterGroup}
                          onChange={(e) => setQuickFilterGroup(e.target.value)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 outline-none"
                        >
                          <option value="Todos">Todos los grupos</option>
                          {SMAE_GROUPS.map(g => (
                            <option key={g.id} value={g.name}>{g.emoji} {g.fullName || g.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
                        <input
                          type="text"
                          placeholder="Escribe el nombre del alimento (ej: huevo, avena, manzana, pollo)..."
                          value={quickSearch}
                          onChange={(e) => setQuickSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                        />
                      </div>

                      {/* Resultados rápidos */}
                      <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl custom-scrollbar">
                        {filteredQuickFoods.slice(0, 15).map(food => {
                          const grp = getSMAEGroupInfo(food.group);
                          return (
                            <div
                              key={food.id}
                              onClick={() => addFoodToActiveMeal(food, 1)}
                              className="p-2.5 hover:bg-primary-50/60 transition-colors flex items-center justify-between cursor-pointer group"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-base">{grp.emoji}</span>
                                <div>
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-primary-700 block">
                                    {food.name}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {food.qty} • <span style={{ color: grp.color }}>{food.group}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="text-[10px] text-right font-medium text-slate-500 hidden sm:block">
                                  <span className="font-bold text-amber-600">{food.kcal} kcal</span> • P:{food.prot}g C:{food.carb}g G:{food.fat}g
                                </div>
                                <button
                                  className="px-2 py-1 bg-primary-100 group-hover:bg-primary-600 text-primary-700 group-hover:text-white rounded-lg text-[11px] font-bold transition-colors"
                                >
                                  + Añadir
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* BLOQUE 4: RACIONES ASIGNADAS VS CONSUMIDAS EN ESTE TIEMPO */}
                    {mealEquivalentsStatus.length > 0 && (
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Adecuación de Raciones SMAE para este tiempo:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {mealEquivalentsStatus.map(st => (
                            <div
                              key={st.group}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                                st.diff === 0 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                  : st.diff > 0 
                                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}
                            >
                              <span>{st.emoji}</span>
                              <span>{st.group}:</span>
                              <span>{st.consumed} / {st.assigned}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* BLOQUE 5: NUTRIASISTENTE — SUGERENCIAS INTELIGENTES */}
                    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200/60 rounded-2xl p-4 shadow-xs space-y-3">
                      <button
                        onClick={() => setShowSuggestions(s => !s)}
                        className="w-full flex items-center justify-between"
                      >
                        <span className="text-xs font-black text-indigo-800 flex items-center gap-2">
                          <span className="text-base">✨</span>
                          NutriAsistente — Sugerencias para completar este platillo
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${ showSuggestions ? 'bg-indigo-200 text-indigo-800' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' }`}>
                          {showSuggestions ? 'Ocultar ▲' : 'Ver sugerencias ▼'}
                        </span>
                      </button>

                      {showSuggestions && (
                        <>
                          {/* Análisis de gaps */}
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: 'Proteínas', current: activeMealMacros.prot, target: Math.round(targetMacros.prot / (activeDayMeals.length || 5)), unit: 'g', color: 'rose' },
                              { label: 'Carbohidratos', current: activeMealMacros.carb, target: Math.round(targetMacros.carb / (activeDayMeals.length || 5)), unit: 'g', color: 'blue' },
                              { label: 'Grasas', current: activeMealMacros.fat, target: Math.round(targetMacros.fat / (activeDayMeals.length || 5)), unit: 'g', color: 'amber' },
                            ].map(({ label, current, target, unit, color }) => {
                              const pct = Math.min(100, Math.round((current / Math.max(1, target)) * 100));
                              const colors = {
                                rose: { bar: 'bg-rose-400', text: 'text-rose-700', bg: 'bg-rose-100' },
                                blue: { bar: 'bg-blue-400', text: 'text-blue-700', bg: 'bg-blue-100' },
                                amber: { bar: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-100' },
                              }[color];
                              return (
                                <div key={label} className={`${colors.bg} rounded-xl p-2 text-center`}>
                                  <span className={`text-[9px] font-bold uppercase ${colors.text} block`}>{label}</span>
                                  <span className={`text-sm font-black ${colors.text}`}>{current}<span className="text-[9px] font-medium">/{target}{unit}</span></span>
                                  <div className="w-full bg-white/60 h-1 rounded-full mt-1 overflow-hidden">
                                    <div className={`${colors.bar} h-full rounded-full`} style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {getSuggestedFoods.length === 0 ? (
                            <p className="text-xs text-emerald-700 font-bold text-center py-2">✅ Este platillo está bien balanceado. ¡Excelente!</p>
                          ) : (
                            <>
                              <p className="text-[10px] text-indigo-600 font-semibold">Alimentos que ayudarían a completar los macros faltantes:</p>
                              <div className="space-y-1.5">
                                {getSuggestedFoods.map(food => {
                                  const grp = getSMAEGroupInfo(food.group);
                                  return (
                                    <div
                                      key={food.id}
                                      className="flex items-center justify-between bg-white/70 border border-indigo-100 rounded-xl p-2.5 hover:bg-white transition-colors"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-base">{grp.emoji}</span>
                                        <div>
                                          <span className="text-xs font-bold text-slate-800 block">{food.name}</span>
                                          <span className="text-[9px] text-slate-500">{food.qty} • <span className="text-amber-600 font-bold">{food.kcal} kcal</span> • P:{food.prot}g C:{food.carb}g G:{food.fat}g</span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => addFoodToActiveMeal(food, 1)}
                                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition-colors shrink-0"
                                      >
                                        + Añadir
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>

                  </div>

                  {/* FOOTER DEL PANEL */}
                  <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
                    <div className="text-xs font-bold text-slate-700">
                      Total Platillo: <span className="text-primary-700 font-black">{activeMealMacros.kcal} kcal</span>
                    </div>
                    <button
                      onClick={() => setIsMealDrawerOpen(false)}
                      className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      ✓ Listo, Guardar Platillo
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: SELECTOR Y SUBIDA DE IMAGEN DE PLATILLO           */}
      {/* ======================================================== */}
      {showImageSelectorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-white/60 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-50 text-primary-600 rounded-2xl shadow-sm">
                  <Camera size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Foto del Platillo</h3>
                  <p className="text-xs text-slate-500">
                    Sube una foto desde tu equipo o selecciona una de la galería gastronómica
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowImageSelectorModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Opción 1: Subir desde la computadora */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Subir archivo desde tu computadora
                </h4>
                <label className="border-2 border-dashed border-slate-300 hover:border-primary-500 bg-slate-50 hover:bg-primary-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center">
                  <Camera size={32} className="text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-700">Haz clic aquí para seleccionar una imagen</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Formatos JPG, PNG, WEBP (Máx. 2MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, imageSelectorTargetMealId)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Opción 2: Pegar URL de imagen */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. O pegar enlace directo de imagen (URL)
                </h4>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/foto-platillo.jpg"
                    value={customImageUrlInput}
                    onChange={(e) => setCustomImageUrlInput(e.target.value)}
                    className="flex-1 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={applyCustomImageUrl}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Aplicar
                  </button>
                </div>
              </div>

              {/* Opción 3: Galería de fotos gastronómicas de alta resolución */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  3. O selecciona de la galería gastronómica saludable
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRESET_DISH_IMAGES.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setDishImagePreset(preset.url)}
                      className="group rounded-2xl overflow-hidden border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer relative bg-slate-100 flex flex-col"
                    >
                      <div className="h-24 w-full overflow-hidden">
                        <img 
                          src={preset.url} 
                          alt={preset.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <div className="p-2 bg-white">
                        <span className="text-[10px] font-bold text-slate-700 block truncate leading-tight">
                          {preset.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/80">
              <button
                onClick={() => setShowImageSelectorModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: LISTA DE COMPRAS SEMANAL CONSOLIDADA              */}
      {/* ======================================================== */}
      {showShoppingListModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-white/60 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Lista de Compras Semanal</h3>
                  <p className="text-xs text-slate-500">
                    Ingredientes acumulados para {activePatient?.name || 'el paciente'} de Lunes a Domingo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowShoppingListModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {Object.keys(weeklyShoppingList).length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="font-semibold text-slate-600">Aún no hay alimentos en el menú semanal.</p>
                  <p className="text-xs">Agrega alimentos a los tiempos de comida para generar la lista.</p>
                </div>
              ) : (
                Object.keys(weeklyShoppingList).sort().map(group => (
                  <div key={group} className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-1 flex items-center gap-2">
                      <span>{getFoodEmoji(group)}</span>
                      {group}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.keys(weeklyShoppingList[group]).sort().map(foodName => {
                        const item = weeklyShoppingList[group][foodName];
                        return (
                          <div key={foodName} className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs">
                            <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold text-slate-800 block truncate">{foodName}</span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {item.portions} raciones ({item.qty})
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/80">
              <span className="text-xs text-slate-400">
                Organizada por grupos del SMAE
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyShoppingListToWhatsApp}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Share2 size={14} />
                  Copiar para WhatsApp
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
                >
                  <Printer size={14} />
                  Imprimir
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CATÁLOGO DE RECETAS                               */}
      {/* ======================================================== */}
      {showRecipesModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-white/60 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">
                  <ChefHat size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Recetario del Paciente</h3>
                  <p className="text-xs text-slate-500">
                    Inserta una receta completa en {activeMeal?.name} ({activeDay})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRecipesModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
              {recipes.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <ChefHat size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="font-semibold text-slate-600">No hay recetas guardadas en la biblioteca.</p>
                  <p className="text-xs">Crea recetas en el módulo de Recetas para insertarlas aquí.</p>
                </div>
              ) : (
                recipes.map(rec => (
                  <div
                    key={rec.id}
                    className="p-4 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl shadow-sm transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 text-sm">{rec.name}</h4>
                        <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                          {Math.round(rec.macros?.kcal || 0)} kcal
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {rec.instructions || `${rec.ingredients.length} ingredientes`}
                      </p>
                      <div className="flex gap-2 text-[10px] text-slate-400 mt-2 font-medium">
                        <span>P: {Math.round(rec.macros?.prot || 0)}g</span>
                        <span>C: {Math.round(rec.macros?.carb || 0)}g</span>
                        <span>G: {Math.round(rec.macros?.fat || 0)}g</span>
                      </div>
                    </div>

                    <button
                      onClick={() => insertRecipeToMeal(rec)}
                      className="w-full py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
                    >
                      Insertar Receta al Platillo
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SUSTITUCIÓN DE ALIMENTOS DEL MISMO GRUPO          */}
      {/* ======================================================== */}
      {replaceTargetItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl border border-white/60 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="text-base font-black text-slate-800">Sustitución de Alimento</h3>
                <p className="text-xs text-slate-500">
                  Opciones equivalentes de <strong className="text-primary-700">{replaceTargetItem.group}</strong> para reemplazar "{replaceTargetItem.name}"
                </p>
              </div>
              <button
                onClick={() => setReplaceTargetItem(null)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {allFoods
                .filter(f => f.group === replaceTargetItem.group && f.name !== replaceTargetItem.name)
                .slice(0, 30)
                .map(subFood => (
                  <div
                    key={subFood.id}
                    onClick={() => replaceItem(subFood)}
                    className="p-3 bg-slate-50 hover:bg-primary-50 border border-slate-200/70 hover:border-primary-300 rounded-xl transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{getFoodEmoji(subFood.group)}</span>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{subFood.name}</h5>
                        <p className="text-[10px] text-slate-500">{subFood.qty} • {subFood.kcal} kcal</p>
                      </div>
                    </div>
                    <span className="text-xs text-primary-600 font-bold">Seleccionar</span>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

      {/* MODAL: ENVIAR PLAN POR WHATSAPP (ESTILO AVENA) */}
      <WhatsAppPlanModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        patient={activePatient}
        currentPlan={weeklyMenu}
        macros={targetMacros}
      />

    </div>
  );
}
