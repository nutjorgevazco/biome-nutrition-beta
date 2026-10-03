// =====================================================================
// PACIENTE Y CONSULTA DEMO AL 100% PARA BIOME NUTRITION / NUTRIPLAN PRO
// Caso clínico integral: Recomposición corporal y Salud Cardiometabólica
// =====================================================================

export const DEMO_CLINIC = {
  name: "Biome Nutrition Clinic",
  phone: "+52 55 4192 8834",
  address: "Av. Insurgentes Sur 1602, Crédito Constructor, Benito Juárez, CDMX",
  color: "#0d9488",
  logo: null,
  instagram: "@biomenutrition.mx",
  facebook: "Biome Nutrition Especialistas",
  email: "consulta@biomenutrition.com"
};

export const DEMO_SUPPLEMENTS = [
  {
    id: "supp_omega3",
    name: "Omega-3 Ultra Puro (EPA 650mg / DHA 450mg)",
    brand: "Nordic Naturals / Biome",
    dose: "1 cápsula blanda con la comida principal para optimizar absorción de lípidos."
  },
  {
    id: "supp_magnesio",
    name: "Bisglicinato de Magnesio Quelado 400 mg",
    brand: "Thorne Research",
    dose: "1 cápsula 45 minutos antes de dormir para modular eje HPA y mejorar latencia del sueño."
  },
  {
    id: "supp_vitd3",
    name: "Vitamina D3 2,000 UI + K2 (MK-7)",
    brand: "Pure Encapsulations",
    dose: "1 perla con el desayuno (vehículo graso para absorción óptima)."
  },
  {
    id: "supp_probioticos",
    name: "Probióticos Multicepa 15 Billones UFC + FOS",
    brand: "Garden of Life",
    dose: "1 cápsula en ayunas con agua tibia para restaurar microbiota y permeabilidad intestinal."
  }
];

export const DEMO_PATIENT = {
  id: "paciente_modelo_01",
  name: "Lic. Sofía Morales Garza",
  age: 32,
  gender: "Femenino",
  phone: "+52 55 4192 8834",
  email: "sofia.morales@gmail.com",
  profileType: "ADULT",
  profileImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80",

  // 1. MOTIVO Y ANAMNESIS CLÍNICA
  chiefComplaint: "Paciente acude por fatiga postprandial marcada (somnolencia severa a las 3:00 pm), distensión abdominal vespertina con inflamación evidente, y aumento gradual de 5.5 kg en los últimos 8 meses. Refiere episodios de hambre ansiosa por carbohidratos simples después de las 6:00 pm tras jornadas laborales demandantes.",
  nutritionalDiagnosis: "Sobrepeso Grado I (IMC inicial 26.3 kg/m²) con predominio de grasa visceral y androide leve (ICC 0.78, ICT 0.51), secundario a patrón alimentario irregular con elevada densidad energética, omisión de colaciones y sedentarismo ocupacional. Compatible con hiperinsulinemia compensatoria en remisión.",

  // 2. DIAGNÓSTICO PES OFICIAL (AND / ADA)
  pesProblem: "Ingesta excesiva de carbohidratos simples y grasas saturadas (NI-5.6.2)",
  pesEtiology: "un patrón de alimentación desordenado condicionado por jornadas laborales prolongadas, omisión de colaciones y episodios de ingesta emocional vespertina",
  pesSigns: "un porcentaje de grasa corporal inicial de 31.8%, glucosa en ayunas previa de 104 mg/dL, triglicéridos en 185 mg/dL y una razón cintura/estatura de 0.51.",

  // 3. MEDICACIÓN Y OBJETIVOS
  medications: "Metformina 500 mg (1 tableta con la cena), Suplementación de Vitamina D3 2000 UI/día.",
  treatmentGoals: "1. Reducción sostenida de masa grasa (-5 kg) conservando e incrementando masa muscular magra.\n2. Optimizar sensibilidad insulínica (HOMA-IR meta < 1.8, HbA1c < 5.4%).\n3. Erradicar distensión y mantener tránsito intestinal diario normal (Bristol Tipo 4).\n4. Fomentar saciedad y eliminar picos de ansiedad vespertina mediante distribución equilibrada de macros.",
  specialIndications: "Alimentación con baja carga glucémica y rica en fibra prebiótica soluble (≥30g/día). Priorizar grasas monoinsaturadas (aceite de oliva extra virgen, aguacate) y omega-3. Hidratación mínima de 2.3 L/día. Caminata ligera de 10-15 min post-almuerzo.",
  consultNotes: "Tercera consulta de seguimiento (Semana 8). Paciente muestra un apego sobresaliente del 92%. Reporta eliminación total de la fatiga postprandial y digestión ligera sin distensión. Ha logrado descender 4.7 kg totales desde la consulta inicial con ganancia neta de +0.8 kg de músculo. Reducción acumulada de 5.5 cm de cintura. Se ajusta plan a 1,550 kcal con rotación de recetas gastronómicas.",
  nextAppointment: "2026-10-24",

  // 4. ANTROPOMETRÍA ACTUAL (ISAK Y BIOIMPEDANCIA)
  weight: "66.8",
  idealWeight: "57.5",
  targetWeight: "62.0",
  height: "165",
  waist: "76.5",
  hip: "99.0",
  abdominal: "81.0",

  // Pliegues cutáneos (mm)
  triceps: "16.5",
  biceps: "8.0",
  subscapular: "15.0",
  supracrestal: "17.5",
  supraespinal: "12.0",
  abdominalFold: "20.0",
  thigh: "22.5",
  calfFold: "13.0",

  // Diámetros y perímetros óseos (cm)
  humerus: "6.2",
  femur: "9.0",
  armCircumference: "27.8",
  calfCircumference: "35.0",

  // Bioimpedancia eléctrica
  visceralFat: "5",
  fatMass: "17.7",
  muscleMass: "28.2",
  residualMass: "12.5",

  // 5. APARATOS, SISTEMAS Y SALUD DIGESTIVA (BRISTOL)
  pathologies: "Resistencia a la insulina leve en control; Dislipidemia mixta revertida.",
  familyHistory: "Madre con Diabetes Mellitus Tipo 2; Padre con Hipertensión Arterial Sistémica.",
  surgeries: "Apendicectomía (2018), sin complicaciones.",
  allergies: "Intolerancia a la lactosa no fermentada (tolera yogurt griego y quesos madurados).",
  bloodPressure: "115/75",
  
  colitis: "No",
  reflujo: "No",
  estrenimiento: "No",
  bristolType: 4,
  bowelFrequency: "1 a 2 veces al día",
  digestiveSymptoms: [],
  gastrointestinalNotes: "Heces cilíndricas consistentes tipo Bristol 4. Excelente tolerancia a leguminosas tras remojo previo de 12 horas. Ausencia de reflujo y distensión.",
  cardiovascularNotes: "Frecuencia cardiaca en reposo 64 lpm. Sin disnea, palpitaciones ni edema periférico.",
  endocrinoNotes: "Sensibilidad a la insulina en franca mejoría; sin acantosis nigricans.",
  nerviosoNotes: "Calidad de sueño profunda (7.5 horas). Ansiedad vespertina bajo control tras ajuste de colación proteica.",
  musculoesqueleticoNotes: "Entrenamiento de fuerza 4 días/semana sin molestias articulares.",
  renalNotes: "Diuresis clara, sin oliguria ni retención de líquidos.",
  tegumentarioNotes: "Piel hidratada, elasticidad cutánea normal, uñas firmes.",

  // 6. BIOQUÍMICA / LABORATORIOS CLÍNICOS
  laboratorios_agregados: [
    "glu_ayuno", "hba1c", "insulina", "homa_ir", 
    "col_tot", "trig", "hdl", "ldl", 
    "tsh", "vit_d", "creatinina", "acido_urico"
  ],
  laboratorios_valores: {
    glu_ayuno: "91",
    hba1c: "5.2",
    insulina: "7.4",
    homa_ir: "1.66",
    col_tot: "182",
    trig: "135",
    hdl: "56",
    ldl: "99",
    tsh: "1.88",
    vit_d: "44",
    creatinina: "0.82",
    acido_urico: "4.0"
  },

  // 7. CUESTIONARIO DE FRECUENCIA ALIMENTARIA (FCA - NUTRIMIND)
  fcaAnswers: {
    verduras: "diario",
    frutas: "frecuente",
    leguminosas: "frecuente",
    pescados: "moderado",
    carnes_magras: "frecuente",
    lacteos: "moderado",
    embutidos: "nunca",
    refrescos: "nunca",
    ultraprocesados: "nunca",
    alcohol: "quincenal"
  },

  // 8. METABOLISMO, ENERGÍA Y ESTRATEGIA
  energyFormula: "mifflin",
  activityFactor: "1.3",
  stressFactor: "1.0",
  strategy: "Déficit Moderado (-350 kcal)",
  assignedKcal: 1550,
  p_pct: 25, // 97g proteína (1.45 g/kg)
  c_pct: 45, // 174g carbohidratos
  g_pct: 30, // 52g lípidos
  waterIntake: 2350,
  ml_kg: 35,
  mealsPerDay: 5,
  appetiteLevel: "Estable y Saciada",
  physicalActivity: "moderate",
  sleepQuality: "7.5 horas continuas y reparadoras",
  recall24h: "Desayuno (8:00): Omelette de 3 claras con espinaca y aguacate + 1 reb. pan Ezequiel + café negro.\nColación 1 (11:30): 1 manzana verde con 1 cda de crema de almendras.\nComida (14:30): 130g pechuga de pollo asada + 1/2 taza arroz integral + ensalada verde mixta con 1 cdta aceite de oliva + 1/2 taza frijoles.\nColación 2 (18:00): 1 taza yogurt griego natural sin azúcar + 1/2 taza blueberries + 4 nueces.\nCena (21:00): 2 tostadas horneadas de atún a la mexicana con 1/3 aguacate + té de menta.",

  // 9. SUPLEMENTACIÓN ASIGNADA
  assignedSupplements: ["supp_omega3", "supp_magnesio", "supp_vitd3", "supp_probioticos"],

  // 10. HISTORIAL CLÍNICO DE EVOLUCIÓN (3 CONSULTAS PARA GRÁFICAS Y DELTAS)
  history: [
    {
      date: "2026-08-07",
      weight: 71.5,
      imc: 26.3,
      bodyFat: 31.8,
      muscleMass: 27.4,
      waist: 82.0,
      hip: 103.0,
      bloodPressure: "125/82",
      consultNotes: "Consulta inicial. Diagnóstico de sobrepeso y resistencia a la insulina incipiente. Se inicia pauta de adaptación a 1,700 kcal, retiro estricto de refrescos y ultraprocesados."
    },
    {
      date: "2026-09-04",
      weight: 68.4,
      imc: 25.1,
      bodyFat: 28.5,
      muscleMass: 27.9,
      waist: 79.0,
      hip: 101.0,
      bloodPressure: "118/78",
      consultNotes: "Excelente evolución a 4 semanas: -3.1 kg de peso neto y -3.0 cm de cintura. Disminución de triglicéridos de 185 a 155 mg/dL. Se ajusta plan a 1550 kcal."
    },
    {
      date: "2026-10-02",
      weight: 66.8,
      imc: 24.5,
      bodyFat: 26.5,
      muscleMass: 28.2,
      waist: 76.5,
      hip: 99.0,
      bloodPressure: "115/75",
      consultNotes: "Control actual (Semana 8). Adherencia ejemplar del 92%. Grasa en 26.5% y masa muscular en ascenso (+0.8 kg acumulado). Tránsito intestinal diario Bristol 4. Se programa seguimiento en 3 semanas."
    }
  ],

  // 11. CUADRO DE EQUIVALENTES SMAE
  portionDistribution: {
    veg: { total: 5, Desayuno: 1, "Colación 1": 0, Comida: 3, "Colación 2": 0, Cena: 1 },
    fru: { total: 3, Desayuno: 1, "Colación 1": 1, Comida: 0, "Colación 2": 1, Cena: 0 },
    cer_s: { total: 5, Desayuno: 1, "Colación 1": 0, Comida: 2, "Colación 2": 0, Cena: 2 },
    cer_c: { total: 0, Desayuno: 0, "Colación 1": 0, Comida: 0, "Colación 2": 0, Cena: 0 },
    leg: { total: 1, Desayuno: 0, "Colación 1": 0, Comida: 1, "Colación 2": 0, Cena: 0 },
    aoa_mb: { total: 4, Desayuno: 2, "Colación 1": 0, Comida: 2, "Colación 2": 0, Cena: 0 },
    aoa_b: { total: 2, Desayuno: 0, "Colación 1": 0, Comida: 1, "Colación 2": 0, Cena: 1 },
    aoa_m: { total: 0, Desayuno: 0, "Colación 1": 0, Comida: 0, "Colación 2": 0, Cena: 0 },
    aoa_a: { total: 0, Desayuno: 0, "Colación 1": 0, Comida: 0, "Colación 2": 0, Cena: 0 },
    lec_d: { total: 1, Desayuno: 0, "Colación 1": 0, Comida: 0, "Colación 2": 1, Cena: 0 },
    gra_s: { total: 4, Desayuno: 1, "Colación 1": 0, Comida: 2, "Colación 2": 0, Cena: 1 },
    gra_c: { total: 1.5, Desayuno: 0, "Colación 1": 0.5, Comida: 0, "Colación 2": 1, Cena: 0 },
    azu_s: { total: 0, Desayuno: 0, "Colación 1": 0, Comida: 0, "Colación 2": 0, Cena: 0 }
  },

  // 12. MENÚ SEMANAL COMPLETO CON FOTOS GASTRONÓMICAS E INSTRUCCIONES
  weeklyMenu: {
    Lunes: [
      {
        id: "meal_lunes_0",
        name: "Desayuno",
        dishTitle: "Omelette de Claras con Espinacas Tiernas y Aguacate",
        instructions: "Batir las claras, verter en sartén caliente con aceite en aerosol. Rellenar con espinacas salteadas y doblar. Acompañar con el aguacate en rebanadas y tortilla de maíz.",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
        items: [
          { uid: "l1_1", foodId: "aoa01", name: "Clara de huevo", group: "AOA", subgroup: "Muy bajo aporte", portions: 2, qty: "4 piezas (130g)", kcal: 68, prot: 14, carb: 0, fat: 0 },
          { uid: "l1_2", foodId: "v01", name: "Espinaca cruda", group: "Verduras", subgroup: "", portions: 1, qty: "2 tazas", kcal: 25, prot: 2, carb: 4, fat: 0 },
          { uid: "l1_3", foodId: "g01", name: "Aguacate Hass", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1/3 pieza (45g)", kcal: 45, prot: 0, carb: 1, fat: 5 },
          { uid: "l1_4", foodId: "c01", name: "Tortilla de maíz nixtamalizada", group: "Cereales", subgroup: "Sin grasa", portions: 1, qty: "1 pieza", kcal: 70, prot: 2, carb: 15, fat: 0 },
          { uid: "l1_5", foodId: "f03", name: "Papaya picada", group: "Frutas", subgroup: "", portions: 1, qty: "1 taza", kcal: 60, prot: 1, carb: 15, fat: 0 }
        ]
      },
      {
        id: "meal_lunes_1",
        name: "Colación 1",
        dishTitle: "Gajos de Manzana Verde con Crema de Almendras",
        instructions: "Cortar la manzana en gajos delgados y espolvorear canela en polvo. Servir con la crema de almendras natural.",
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80",
        items: [
          { uid: "l2_1", foodId: "f01", name: "Manzana verde", group: "Frutas", subgroup: "", portions: 1, qty: "1 pieza mediana", kcal: 60, prot: 0, carb: 15, fat: 0 },
          { uid: "l2_2", foodId: "g05", name: "Crema de almendras natural sin azúcar", group: "Grasas", subgroup: "Con proteína", portions: 0.5, qty: "1 cucharadita (8g)", kcal: 35, prot: 1.5, carb: 1.5, fat: 2.5 }
        ]
      },
      {
        id: "meal_lunes_2",
        name: "Comida",
        dishTitle: "Pechuga al Romero con Quinoa y Ensalada Mediterránea",
        instructions: "Sellar la pechuga a la plancha sazonada con romero fresco, ajo y sal marina. Servir sobre cama de quinoa al vapor con espinacas baby, pepino y aderezo de aceite de oliva.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
        items: [
          { uid: "l3_1", foodId: "aoa02", name: "Pechuga de pollo sin piel", group: "AOA", subgroup: "Muy bajo aporte", portions: 3, qty: "120g en crudo", kcal: 135, prot: 27, carb: 0, fat: 3 },
          { uid: "l3_2", foodId: "c04", name: "Quinoa cocida al vapor", group: "Cereales", subgroup: "Sin grasa", portions: 2, qty: "2/3 taza", kcal: 140, prot: 4, carb: 30, fat: 1 },
          { uid: "l3_3", foodId: "leg01", name: "Frijoles de la olla", group: "Leguminosas", subgroup: "", portions: 1, qty: "1/2 taza", kcal: 120, prot: 8, carb: 20, fat: 1 },
          { uid: "l3_4", foodId: "v06", name: "Pepino con cáscara", group: "Verduras", subgroup: "", portions: 1.5, qty: "2 tazas", kcal: 35, prot: 1.5, carb: 7.5, fat: 0 },
          { uid: "l3_5", foodId: "v02", name: "Jitomate cherry", group: "Verduras", subgroup: "", portions: 1, qty: "1 taza", kcal: 25, prot: 1, carb: 5, fat: 0 },
          { uid: "l3_6", foodId: "g02", name: "Aceite de oliva extra virgen", group: "Grasas", subgroup: "Sin proteína", portions: 2, qty: "2 cucharaditas (10ml)", kcal: 90, prot: 0, carb: 0, fat: 10 }
        ]
      },
      {
        id: "meal_lunes_3",
        name: "Colación 2",
        dishTitle: "Bowl de Yogurt Griego con Blueberries y Nueces",
        instructions: "Colocar el yogurt griego en un tazón, añadir las moras azules frescas y decorar con las mitades de nuez picadas.",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
        items: [
          { uid: "l4_1", foodId: "l01", name: "Yogurt griego natural 0% grasa", group: "Leche", subgroup: "Descremada", portions: 1, qty: "3/4 taza (150g)", kcal: 95, prot: 15, carb: 6, fat: 0 },
          { uid: "l4_2", foodId: "f04", name: "Blueberries / Moras azules", group: "Frutas", subgroup: "", portions: 1, qty: "3/4 taza", kcal: 60, prot: 0, carb: 15, fat: 0 },
          { uid: "l4_3", foodId: "g06", name: "Nueces de castilla en mitades", group: "Grasas", subgroup: "Con proteína", portions: 1, qty: "3 piezas completas (6 mitades)", kcal: 70, prot: 3, carb: 3, fat: 5 }
        ]
      },
      {
        id: "meal_lunes_4",
        name: "Cena",
        dishTitle: "Tostadas Horneadas de Atún Fresco a la Mexicana",
        instructions: "Drenar el atún en agua. Mezclar con jitomate, cebolla morada picada, cilantro y jugo de limón. Montar sobre tostadas Saníssimo y coronar con aguacate.",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
        items: [
          { uid: "l5_1", foodId: "aoa03", name: "Atún en agua drenado", group: "AOA", subgroup: "Bajo aporte", portions: 2, qty: "1 lata (120g)", kcal: 110, prot: 24, carb: 0, fat: 1.5 },
          { uid: "l5_2", foodId: "c02", name: "Tostadas de maíz horneadas (Saníssimo)", group: "Cereales", subgroup: "Sin grasa", portions: 2, qty: "2 piezas", kcal: 70, prot: 2, carb: 15, fat: 0 },
          { uid: "l5_3", foodId: "v02", name: "Pico de gallo (Jitomate, cebolla y cilantro)", group: "Verduras", subgroup: "", portions: 1, qty: "1 taza", kcal: 25, prot: 1, carb: 5, fat: 0 },
          { uid: "l5_4", foodId: "g01", name: "Aguacate fresco", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1/3 pieza", kcal: 45, prot: 0, carb: 1, fat: 5 }
        ]
      }
    ],
    Martes: [
      {
        id: "meal_martes_0",
        name: "Desayuno",
        dishTitle: "Bowl de Avena Cocida con Proteína y Fresas",
        instructions: "Cocinar la avena en agua con canela. Mezclar con proteína o claras pasteurizadas y servir caliente con fresas frescas en rebanadas.",
        image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&q=80",
        items: [
          { uid: "m1_1", foodId: "c03", name: "Avena en hojuelas", group: "Cereales", subgroup: "Sin grasa", portions: 1, qty: "1/2 taza en seco", kcal: 70, prot: 3, carb: 14, fat: 1 },
          { uid: "m1_2", foodId: "aoa01", name: "Claras de huevo pasteurizadas", group: "AOA", subgroup: "Muy bajo aporte", portions: 2, qty: "1/2 taza", kcal: 68, prot: 14, carb: 0, fat: 0 },
          { uid: "m1_3", foodId: "f04", name: "Fresas rebanadas", group: "Frutas", subgroup: "", portions: 1, qty: "1 taza", kcal: 60, prot: 1, carb: 15, fat: 0 },
          { uid: "m1_4", foodId: "g07", name: "Semillas de chía", group: "Grasas", subgroup: "Con proteína", portions: 1, qty: "1 cucharada", kcal: 45, prot: 2, carb: 3, fat: 3 }
        ]
      },
      {
        id: "meal_martes_1",
        name: "Colación 1",
        dishTitle: "Crudités de Pepino y Jícama con Limón y Chile Tajín",
        instructions: "Cortar en bastones uniformes y aderezar con jugo de limón fresco y sal marina baja en sodio.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
        items: [
          { uid: "m2_1", foodId: "v06", name: "Pepino en bastones", group: "Verduras", subgroup: "", portions: 1, qty: "1.5 tazas", kcal: 25, prot: 1, carb: 5, fat: 0 },
          { uid: "m2_2", foodId: "v11", name: "Jícama picada", group: "Verduras", subgroup: "", portions: 1, qty: "1/2 taza", kcal: 25, prot: 1, carb: 5, fat: 0 },
          { uid: "m2_3", foodId: "f06", name: "Gajos de naranja", group: "Frutas", subgroup: "", portions: 1, qty: "1 pieza", kcal: 60, prot: 1, carb: 15, fat: 0 }
        ]
      },
      {
        id: "meal_martes_2",
        name: "Comida",
        dishTitle: "Filete de Salmón Chileno con Espárragos y Arroz Salvaje",
        instructions: "Cocinar el salmón a fuego medio 4 minutos por lado para conservar omegas. Saltear espárragos con ajo y aceite de oliva. Acompañar con arroz.",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
        items: [
          { uid: "m3_1", foodId: "aoa04", name: "Filete de salmón fresco", group: "AOA", subgroup: "Moderado aporte", portions: 3, qty: "120g", kcal: 180, prot: 25, carb: 0, fat: 9 },
          { uid: "m3_2", foodId: "c05", name: "Arroz integral al vapor", group: "Cereales", subgroup: "Sin grasa", portions: 2, qty: "2/3 taza", kcal: 140, prot: 3, carb: 30, fat: 1 },
          { uid: "m3_3", foodId: "v08", name: "Espárragos a la plancha", group: "Verduras", subgroup: "", portions: 2, qty: "12 piezas", kcal: 50, prot: 4, carb: 8, fat: 0 },
          { uid: "m3_4", foodId: "g02", name: "Aceite de oliva virgen extra", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1 cucharadita", kcal: 45, prot: 0, carb: 0, fat: 5 }
        ]
      },
      {
        id: "meal_martes_3",
        name: "Colación 2",
        dishTitle: "Smoothie Verde Alcalinizante Proteico",
        instructions: "Licuar espinaca cruda con 1 taza de leche de almendras sin azúcar, 1/2 plátano y 1 scoop de proteína de suero aislada.",
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80",
        items: [
          { uid: "m4_1", foodId: "f02", name: "Plátano maduro", group: "Frutas", subgroup: "", portions: 1, qty: "1/2 pieza", kcal: 60, prot: 1, carb: 15, fat: 0 },
          { uid: "m4_2", foodId: "v01", name: "Espinaca baby", group: "Verduras", subgroup: "", portions: 1, qty: "2 tazas", kcal: 25, prot: 2, carb: 4, fat: 0 },
          { uid: "m4_3", foodId: "aoa05", name: "Proteína Whey Isolate", group: "AOA", subgroup: "Muy bajo aporte", portions: 1, qty: "1 scoop (25g)", kcal: 90, prot: 22, carb: 1, fat: 0 }
        ]
      },
      {
        id: "meal_martes_4",
        name: "Cena",
        dishTitle: "Quesadillas Ligeras de Panela Asada con Pico de Nopal",
        instructions: "Asar las rebanadas de panela. Colocar en tortillas de maíz calientes y cubrir con ensalada fresca de nopales cocidos.",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80",
        items: [
          { uid: "m5_1", foodId: "aoa06", name: "Queso panela artesanal bajo en grasa", group: "AOA", subgroup: "Bajo aporte", portions: 2, qty: "80g", kcal: 110, prot: 14, carb: 2, fat: 5 },
          { uid: "m5_2", foodId: "c01", name: "Tortilla de maíz", group: "Cereales", subgroup: "Sin grasa", portions: 2, qty: "2 piezas", kcal: 140, prot: 4, carb: 30, fat: 1 },
          { uid: "m5_3", foodId: "v09", name: "Nopal cocido picado", group: "Verduras", subgroup: "", portions: 2, qty: "2 tazas", kcal: 50, prot: 4, carb: 8, fat: 0 },
          { uid: "m5_4", foodId: "g01", name: "Aguacate", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1/3 pieza", kcal: 45, prot: 0, carb: 1, fat: 5 }
        ]
      }
    ],
    Miércoles: [
      {
        id: "meal_miercoles_0",
        name: "Desayuno",
        dishTitle: "Hot Cakes Saludables de Avena y Plátano",
        instructions: "Licuar la avena con el plátano, claras de huevo y canela. Cocinar a fuego lento en sartén antiadherente. Decorar con fresas.",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
        items: [
          { uid: "mi1_1", foodId: "c03", name: "Harina de avena integral", group: "Cereales", subgroup: "Sin grasa", portions: 1, qty: "1/2 taza", kcal: 70, prot: 3, carb: 14, fat: 1 },
          { uid: "mi1_2", foodId: "f02", name: "Plátano maduro", group: "Frutas", subgroup: "", portions: 1, qty: "1/2 pieza", kcal: 60, prot: 1, carb: 15, fat: 0 },
          { uid: "mi1_3", foodId: "aoa01", name: "Clara de huevo", group: "AOA", subgroup: "Muy bajo aporte", portions: 2, qty: "4 piezas", kcal: 68, prot: 14, carb: 0, fat: 0 },
          { uid: "mi1_4", foodId: "f04", name: "Fresas picadas", group: "Frutas", subgroup: "", portions: 1, qty: "1 taza", kcal: 60, prot: 1, carb: 15, fat: 0 }
        ]
      },
      {
        id: "meal_miercoles_1",
        name: "Colación 1",
        dishTitle: "Yogurt Griego con Semillas de Calabaza",
        instructions: "Servir el yogurt griego frío y espolvorear las semillas de calabaza tostadas.",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
        items: [
          { uid: "mi2_1", foodId: "l01", name: "Yogurt griego natural 0%", group: "Leche", subgroup: "Descremada", portions: 1, qty: "3/4 taza", kcal: 95, prot: 15, carb: 6, fat: 0 },
          { uid: "mi2_2", foodId: "g08", name: "Semillas de calabaza tostadas", group: "Grasas", subgroup: "Con proteína", portions: 1, qty: "1 cucharada sopera", kcal: 45, prot: 2, carb: 2, fat: 3.5 }
        ]
      },
      {
        id: "meal_miercoles_2",
        name: "Comida",
        dishTitle: "Fajitas de Arrachera Magra con Pimientos y Frijoles Negros",
        instructions: "Saltear la arrachera magra en tiras con pimiento morrón tricolor y cebolla. Servir con frijoles negros de la olla.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
        items: [
          { uid: "mi3_1", foodId: "aoa07", name: "Bistec de res magro / Arrachera limpia", group: "AOA", subgroup: "Bajo aporte", portions: 3, qty: "120g", kcal: 165, prot: 24, carb: 0, fat: 7 },
          { uid: "mi3_2", foodId: "v19", name: "Pimiento morrón tricolor en juliana", group: "Verduras", subgroup: "", portions: 2, qty: "2 tazas", kcal: 50, prot: 2, carb: 10, fat: 0 },
          { uid: "mi3_3", foodId: "leg02", name: "Frijoles negros de la olla", group: "Leguminosas", subgroup: "", portions: 1, qty: "1/2 taza", kcal: 120, prot: 8, carb: 20, fat: 1 },
          { uid: "mi3_4", foodId: "c01", name: "Tortilla de maíz", group: "Cereales", subgroup: "Sin grasa", portions: 2, qty: "2 piezas", kcal: 140, prot: 4, carb: 30, fat: 1 },
          { uid: "mi3_5", foodId: "g01", name: "Aguacate en cubos", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1/3 pieza", kcal: 45, prot: 0, carb: 1, fat: 5 }
        ]
      },
      {
        id: "meal_miercoles_3",
        name: "Colación 2",
        dishTitle: "Pera en Rebanadas con Nueces Pecanas",
        instructions: "Lavar la pera y cortar con cáscara. Disfrutar con las nueces.",
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80",
        items: [
          { uid: "mi4_1", foodId: "f05", name: "Pera D'Anjou", group: "Frutas", subgroup: "", portions: 1, qty: "1/2 pieza grande", kcal: 60, prot: 0, carb: 15, fat: 0 },
          { uid: "mi4_2", foodId: "g06", name: "Nueces pecanas", group: "Grasas", subgroup: "Con proteína", portions: 1, qty: "4 mitades", kcal: 50, prot: 1, carb: 1, fat: 5 }
        ]
      },
      {
        id: "meal_miercoles_4",
        name: "Cena",
        dishTitle: "Ensalada Tibia de Quinoa con Huevo Poché y Verduras",
        instructions: "Calentar la quinoa con espinacas y calabacitas salteadas. Montar un huevo poché tierno y rociar con aceite de oliva.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
        items: [
          { uid: "mi5_1", foodId: "aoa08", name: "Huevo entero de libre pastoreo", group: "AOA", subgroup: "Moderado aporte", portions: 1, qty: "1 pieza", kcal: 75, prot: 7, carb: 0, fat: 5 },
          { uid: "mi5_2", foodId: "aoa01", name: "Clara de huevo", group: "AOA", subgroup: "Muy bajo aporte", portions: 2, qty: "2 piezas", kcal: 34, prot: 7, carb: 0, fat: 0 },
          { uid: "mi5_3", foodId: "c04", name: "Quinoa cocida", group: "Cereales", subgroup: "Sin grasa", portions: 1, qty: "1/3 taza", kcal: 70, prot: 2, carb: 15, fat: 0.5 },
          { uid: "mi5_4", foodId: "v03", name: "Calabacita tierna en cubos", group: "Verduras", subgroup: "", portions: 1.5, qty: "1.5 tazas", kcal: 35, prot: 2, carb: 6, fat: 0 },
          { uid: "mi5_5", foodId: "g02", name: "Aceite de oliva extra virgen", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1 cucharadita", kcal: 45, prot: 0, carb: 0, fat: 5 }
        ]
      }
    ],
    Jueves: [
      {
        id: "meal_jueves_0",
        name: "Desayuno",
        dishTitle: "Tostadas de Pan Ezequiel con Aguacate y Huevo Poché",
        instructions: "Tostar el pan, untar con el aguacate aplastado y colocar encima los huevos pochados con sal rosa y hojuelas de chile.",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
        items: [
          { uid: "j1_1", foodId: "c06", name: "Pan de granos germinados (Ezequiel)", group: "Cereales", subgroup: "Sin grasa", portions: 1, qty: "1 rebanada", kcal: 80, prot: 4, carb: 15, fat: 0.5 },
          { uid: "j1_2", foodId: "aoa08", name: "Huevo entero", group: "AOA", subgroup: "Moderado aporte", portions: 1, qty: "1 pieza", kcal: 75, prot: 7, carb: 0, fat: 5 },
          { uid: "j1_3", foodId: "aoa01", name: "Clara de huevo", group: "AOA", subgroup: "Muy bajo aporte", portions: 2, qty: "2 piezas", kcal: 34, prot: 7, carb: 0, fat: 0 },
          { uid: "j1_4", foodId: "g01", name: "Aguacate", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1/3 pieza", kcal: 45, prot: 0, carb: 1, fat: 5 },
          { uid: "j1_5", foodId: "f07", name: "Mandarinas frescas", group: "Frutas", subgroup: "", portions: 1, qty: "2 piezas", kcal: 60, prot: 1, carb: 15, fat: 0 }
        ]
      },
      {
        id: "meal_jueves_1",
        name: "Colación 1",
        dishTitle: "Zanahorias Baby con Hummus de Garbanzo Artesanal",
        instructions: "Servir las zanahorias baby crujientes con 2 cucharadas soperas de hummus.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
        items: [
          { uid: "j2_1", foodId: "v07", name: "Zanahoria cruda en bastones", group: "Verduras", subgroup: "", portions: 1.5, qty: "1 taza", kcal: 35, prot: 1, carb: 7, fat: 0 },
          { uid: "j2_2", foodId: "leg03", name: "Hummus de garbanzo", group: "Leguminosas", subgroup: "", portions: 0.5, qty: "2 cucharadas", kcal: 60, prot: 3, carb: 8, fat: 2 }
        ]
      },
      {
        id: "meal_jueves_2",
        name: "Comida",
        dishTitle: "Tacos de Pescado Blanco a la Plancha con Ensalada de Col",
        instructions: "Sazonar los filetes de tilapia con limón y pimienta. Servir en tortillas calientes con ensalada de col morada y aderezo de aguacate.",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80",
        items: [
          { uid: "j3_1", foodId: "aoa09", name: "Filete de pescado blanco (Tilapia/Mero)", group: "AOA", subgroup: "Muy bajo aporte", portions: 3, qty: "135g", kcal: 120, prot: 26, carb: 0, fat: 1.5 },
          { uid: "j3_2", foodId: "c01", name: "Tortilla de maíz", group: "Cereales", subgroup: "Sin grasa", portions: 2, qty: "2 piezas", kcal: 140, prot: 4, carb: 30, fat: 1 },
          { uid: "j3_3", foodId: "v21", name: "Col morada rallada finamente", group: "Verduras", subgroup: "", portions: 2, qty: "2 tazas", kcal: 50, prot: 2, carb: 10, fat: 0 },
          { uid: "j3_4", foodId: "g01", name: "Guacamole casero sin crema", group: "Grasas", subgroup: "Sin proteína", portions: 2, qty: "2 cucharadas soperas (60g)", kcal: 90, prot: 1, carb: 2, fat: 9 }
        ]
      },
      {
        id: "meal_jueves_3",
        name: "Colación 2",
        dishTitle: "Yogurt Griego con Frambuesas",
        instructions: "Mezclar el yogurt griego con frambuesas frescas.",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
        items: [
          { uid: "j4_1", foodId: "l01", name: "Yogurt griego natural 0%", group: "Leche", subgroup: "Descremada", portions: 1, qty: "3/4 taza", kcal: 95, prot: 15, carb: 6, fat: 0 },
          { uid: "j4_2", foodId: "f04", name: "Frambuesas frescas", group: "Frutas", subgroup: "", portions: 1, qty: "1 taza", kcal: 60, prot: 1, carb: 15, fat: 0 }
        ]
      },
      {
        id: "meal_jueves_4",
        name: "Cena",
        dishTitle: "Sopa de Verduras de Temporada con Pollo Deshebrado",
        instructions: "Caldo de pollo desgrasado con calabacita, chayote, zanahoria y pechuga deshebrada. Acompañar con tostadas horneadas.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
        items: [
          { uid: "j5_1", foodId: "aoa02", name: "Pechuga de pollo cocida y deshebrada", group: "AOA", subgroup: "Muy bajo aporte", portions: 2, qty: "80g", kcal: 90, prot: 18, carb: 0, fat: 2 },
          { uid: "j5_2", foodId: "v08", name: "Chayote y calabacita cocidos", group: "Verduras", subgroup: "", portions: 2, qty: "2 tazas", kcal: 50, prot: 3, carb: 8, fat: 0 },
          { uid: "j5_3", foodId: "c02", name: "Tostadas horneadas Saníssimo", group: "Cereales", subgroup: "Sin grasa", portions: 2, qty: "2 piezas", kcal: 70, prot: 2, carb: 15, fat: 0 },
          { uid: "j5_4", foodId: "g01", name: "Aguacate", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1/3 pieza", kcal: 45, prot: 0, carb: 1, fat: 5 }
        ]
      }
    ],
    Viernes: [
      {
        id: "meal_viernes_0",
        name: "Desayuno",
        dishTitle: "Huevos Revueltos a la Mexicana con Frijoles",
        instructions: "Picar jitomate, cebolla y chile serrano. Saltear y agregar 1 huevo + 2 claras. Servir con frijoles y tortilla.",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
        items: [
          { uid: "v1_1", foodId: "aoa08", name: "Huevo entero", group: "AOA", subgroup: "Moderado aporte", portions: 1, qty: "1 pieza", kcal: 75, prot: 7, carb: 0, fat: 5 },
          { uid: "v1_2", foodId: "aoa01", name: "Claras de huevo", group: "AOA", subgroup: "Muy bajo aporte", portions: 2, qty: "2 piezas", kcal: 34, prot: 7, carb: 0, fat: 0 },
          { uid: "v1_3", foodId: "leg01", name: "Frijoles de la olla", group: "Leguminosas", subgroup: "", portions: 1, qty: "1/2 taza", kcal: 120, prot: 8, carb: 20, fat: 1 },
          { uid: "v1_4", foodId: "c01", name: "Tortilla de maíz", group: "Cereales", subgroup: "Sin grasa", portions: 1, qty: "1 pieza", kcal: 70, prot: 2, carb: 15, fat: 0 },
          { uid: "v1_5", foodId: "f03", name: "Papaya fresca", group: "Frutas", subgroup: "", portions: 1, qty: "1 taza", kcal: 60, prot: 1, carb: 15, fat: 0 }
        ]
      },
      {
        id: "meal_viernes_1",
        name: "Colación 1",
        dishTitle: "Manzana Roja con Semillas de Chía en Agua de Limón",
        instructions: "Comer la manzana en gajos y acompañar con agua fresca de limón con 1 cucharada de chía.",
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80",
        items: [
          { uid: "v2_1", foodId: "f01", name: "Manzana roja", group: "Frutas", subgroup: "", portions: 1, qty: "1 pieza", kcal: 60, prot: 0, carb: 15, fat: 0 },
          { uid: "v2_2", foodId: "g07", name: "Semillas de chía", group: "Grasas", subgroup: "Con proteína", portions: 1, qty: "1 cucharada", kcal: 45, prot: 2, carb: 3, fat: 3 }
        ]
      },
      {
        id: "meal_viernes_2",
        name: "Comida",
        dishTitle: "Pechuga Cordon Bleu Saludable (Horneada sin Empanizar)",
        instructions: "Rellenar la pechuga con rebanada de jamón de pavo y queso panela. Hornear 25 min a 180°C. Acompañar con puré de coliflor y ensalada.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
        items: [
          { uid: "v3_1", foodId: "aoa02", name: "Pechuga de pollo aplanada", group: "AOA", subgroup: "Muy bajo aporte", portions: 3, qty: "120g", kcal: 135, prot: 27, carb: 0, fat: 3 },
          { uid: "v3_2", foodId: "aoa06", name: "Queso panela artesanal", group: "AOA", subgroup: "Bajo aporte", portions: 1, qty: "40g", kcal: 55, prot: 7, carb: 1, fat: 2.5 },
          { uid: "v3_3", foodId: "v17", name: "Puré de coliflor al ajo", group: "Verduras", subgroup: "", portions: 2, qty: "2 tazas", kcal: 50, prot: 4, carb: 8, fat: 0 },
          { uid: "v3_4", foodId: "c05", name: "Arroz integral", group: "Cereales", subgroup: "Sin grasa", portions: 1, qty: "1/3 taza", kcal: 70, prot: 1.5, carb: 15, fat: 0.5 },
          { uid: "v3_5", foodId: "g02", name: "Aceite de oliva", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1 cucharadita", kcal: 45, prot: 0, carb: 0, fat: 5 }
        ]
      },
      {
        id: "meal_viernes_3",
        name: "Colación 2",
        dishTitle: "Yogurt Griego con Crema de Cacahuate",
        instructions: "Revolver el yogurt griego frío con la crema de cacahuate hasta obtener una consistencia cremosa tipo postre.",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
        items: [
          { uid: "v4_1", foodId: "l01", name: "Yogurt griego natural 0%", group: "Leche", subgroup: "Descremada", portions: 1, qty: "3/4 taza", kcal: 95, prot: 15, carb: 6, fat: 0 },
          { uid: "v4_2", foodId: "g09", name: "Crema de cacahuate natural sin azúcar", group: "Grasas", subgroup: "Con proteína", portions: 1, qty: "1 cucharada", kcal: 70, prot: 3, carb: 3, fat: 6 }
        ]
      },
      {
        id: "meal_viernes_4",
        name: "Cena",
        dishTitle: "Tazón Poke Ligero de Salmón con Pepino, Arroz y Edamames",
        instructions: "Armar el bowl con base de arroz al vapor, salmón en cubos marinado con salsa de soya baja en sodio, pepino persa y aguacate.",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
        items: [
          { uid: "v5_1", foodId: "aoa04", name: "Salmón fresco en cubos", group: "AOA", subgroup: "Moderado aporte", portions: 2, qty: "90g", kcal: 135, prot: 18, carb: 0, fat: 7 },
          { uid: "v5_2", foodId: "c05", name: "Arroz al vapor", group: "Cereales", subgroup: "Sin grasa", portions: 1, qty: "1/3 taza", kcal: 70, prot: 1.5, carb: 15, fat: 0.5 },
          { uid: "v5_3", foodId: "v06", name: "Pepino en rodajas", group: "Verduras", subgroup: "", portions: 1.5, qty: "1.5 tazas", kcal: 35, prot: 1, carb: 7, fat: 0 },
          { uid: "v5_4", foodId: "g01", name: "Aguacate en abanico", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1/3 pieza", kcal: 45, prot: 0, carb: 1, fat: 5 }
        ]
      }
    ],
    Sábado: [
      {
        id: "meal_sabado_0",
        name: "Desayuno",
        dishTitle: "Huevos Rancheros Ligeros con Salsa Casera y Panela",
        instructions: "Montar 2 tortillas de maíz pasadas por comal con huevos estrellados o revueltos con poco spray. Bañar en salsa roja casera y espolvorear panela.",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
        items: [
          { uid: "s1_1", foodId: "aoa08", name: "Huevo entero", group: "AOA", subgroup: "Moderado aporte", portions: 1, qty: "1 pieza", kcal: 75, prot: 7, carb: 0, fat: 5 },
          { uid: "s1_2", foodId: "aoa01", name: "Claras de huevo", group: "AOA", subgroup: "Muy bajo aporte", portions: 2, qty: "2 piezas", kcal: 34, prot: 7, carb: 0, fat: 0 },
          { uid: "s1_3", foodId: "c01", name: "Tortilla de maíz", group: "Cereales", subgroup: "Sin grasa", portions: 2, qty: "2 piezas", kcal: 140, prot: 4, carb: 30, fat: 1 },
          { uid: "s1_4", foodId: "aoa06", name: "Queso panela rallado", group: "AOA", subgroup: "Bajo aporte", portions: 1, qty: "40g", kcal: 55, prot: 7, carb: 1, fat: 2.5 },
          { uid: "s1_5", foodId: "f08", name: "Sandía picada", group: "Frutas", subgroup: "", portions: 1, qty: "1 taza", kcal: 60, prot: 1, carb: 15, fat: 0 }
        ]
      },
      {
        id: "meal_sabado_1",
        name: "Colación 1",
        dishTitle: "Plátano con Mantequilla de Almendras",
        instructions: "Cortar el plátano en rodajas y untar ligeramente.",
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80",
        items: [
          { uid: "s2_1", foodId: "f02", name: "Plátano dominico", group: "Frutas", subgroup: "", portions: 1, qty: "2 piezas pequeñas", kcal: 60, prot: 1, carb: 15, fat: 0 },
          { uid: "s2_2", foodId: "g05", name: "Crema de almendras", group: "Grasas", subgroup: "Con proteína", portions: 1, qty: "1 cucharadita", kcal: 45, prot: 1.5, carb: 1.5, fat: 3.5 }
        ]
      },
      {
        id: "meal_sabado_2",
        name: "Comida",
        dishTitle: "Corte de Lomo de Cerdo Magro a la Parrilla con Ensalada César Ligera",
        instructions: "Marinar el lomo con mostaza dijon y hierbas finas. Asar al término deseado. Servir con lechuga romana aderezada con yogurt y limón.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
        items: [
          { uid: "s3_1", foodId: "aoa10", name: "Lomo de cerdo magro limpio", group: "AOA", subgroup: "Bajo aporte", portions: 3, qty: "130g", kcal: 150, prot: 27, carb: 0, fat: 4.5 },
          { uid: "s3_2", foodId: "c07", name: "Papa cocida con cáscara", group: "Cereales", subgroup: "Sin grasa", portions: 1.5, qty: "1 pieza chica (100g)", kcal: 105, prot: 2, carb: 23, fat: 0 },
          { uid: "s3_3", foodId: "v05", name: "Lechuga romana picada", group: "Verduras", subgroup: "", portions: 2, qty: "3 tazas", kcal: 35, prot: 2, carb: 6, fat: 0 },
          { uid: "s3_4", foodId: "g02", name: "Aceite de oliva extra virgen", group: "Grasas", subgroup: "Sin proteína", portions: 1.5, qty: "1.5 cucharaditas", kcal: 67, prot: 0, carb: 0, fat: 7.5 }
        ]
      },
      {
        id: "meal_sabado_3",
        name: "Colación 2",
        dishTitle: "Yogurt Griego Helado con Canela y Chía",
        instructions: "Congelar el yogurt griego 20 minutos antes para textura tipo nieve suave.",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
        items: [
          { uid: "s4_1", foodId: "l01", name: "Yogurt griego natural 0%", group: "Leche", subgroup: "Descremada", portions: 1, qty: "3/4 taza", kcal: 95, prot: 15, carb: 6, fat: 0 },
          { uid: "s4_2", foodId: "g07", name: "Semillas de chía", group: "Grasas", subgroup: "Con proteína", portions: 1, qty: "1 cucharada", kcal: 45, prot: 2, carb: 3, fat: 3 }
        ]
      },
      {
        id: "meal_sabado_4",
        name: "Cena",
        dishTitle: "Tacos de Champiñones Salteados con Panela y Aguacate",
        instructions: "Saltear champiñones con epazote y cebolla. Servir en tortillas de maíz con panela asada y aguacate.",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80",
        items: [
          { uid: "s5_1", foodId: "v10", name: "Champiñones frescos rebanados", group: "Verduras", subgroup: "", portions: 2, qty: "2 tazas", kcal: 50, prot: 4, carb: 6, fat: 0 },
          { uid: "s5_2", foodId: "aoa06", name: "Queso panela artesanal", group: "AOA", subgroup: "Bajo aporte", portions: 1.5, qty: "60g", kcal: 82, prot: 10, carb: 1.5, fat: 4 },
          { uid: "s5_3", foodId: "c01", name: "Tortilla de maíz", group: "Cereales", subgroup: "Sin grasa", portions: 2, qty: "2 piezas", kcal: 140, prot: 4, carb: 30, fat: 1 },
          { uid: "s5_4", foodId: "g01", name: "Aguacate", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1/3 pieza", kcal: 45, prot: 0, carb: 1, fat: 5 }
        ]
      }
    ],
    Domingo: [
      {
        id: "meal_domingo_0",
        name: "Desayuno",
        dishTitle: "Toast de Salmón Ahumado con Huevo y Eneldo",
        instructions: "Tostar el pan integral, untar con aguacate, colocar láminas de salmón ahumado y huevo poché encima.",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
        items: [
          { uid: "d1_1", foodId: "c06", name: "Pan de masa madre o integral", group: "Cereales", subgroup: "Sin grasa", portions: 1, qty: "1 rebanada grande", kcal: 80, prot: 3, carb: 15, fat: 0.5 },
          { uid: "d1_2", foodId: "aoa11", name: "Salmón ahumado", group: "AOA", subgroup: "Moderado aporte", portions: 1.5, qty: "50g", kcal: 90, prot: 11, carb: 0, fat: 5 },
          { uid: "d1_3", foodId: "aoa01", name: "Clara de huevo pochada", group: "AOA", subgroup: "Muy bajo aporte", portions: 2, qty: "2 piezas", kcal: 34, prot: 7, carb: 0, fat: 0 },
          { uid: "d1_4", foodId: "g01", name: "Aguacate aplastado", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1/3 pieza", kcal: 45, prot: 0, carb: 1, fat: 5 },
          { uid: "d1_5", foodId: "f04", name: "Fresas frescas", group: "Frutas", subgroup: "", portions: 1, qty: "1 taza", kcal: 60, prot: 1, carb: 15, fat: 0 }
        ]
      },
      {
        id: "meal_domingo_1",
        name: "Colación 1",
        dishTitle: "Naranja en Rodajas con Canela y Nueces",
        instructions: "Cortar la naranja en rodajas y acompañar con nueces picadas.",
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80",
        items: [
          { uid: "d2_1", foodId: "f06", name: "Naranja fresca", group: "Frutas", subgroup: "", portions: 1, qty: "1 pieza", kcal: 60, prot: 1, carb: 15, fat: 0 },
          { uid: "d2_2", foodId: "g06", name: "Nueces en mitades", group: "Grasas", subgroup: "Con proteína", portions: 1, qty: "4 mitades", kcal: 50, prot: 1, carb: 1, fat: 5 }
        ]
      },
      {
        id: "meal_domingo_2",
        name: "Comida",
        dishTitle: "Bowl Mediterráneo de Pollo al Limón con Hummus y Ensalada Griega",
        instructions: "Base de arroz integral y lechuga. Añadir pechuga asada en cubos, jitomate cherry, pepino, aceitunas y 2 cdas de hummus.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
        items: [
          { uid: "d3_1", foodId: "aoa02", name: "Pechuga de pollo al limón", group: "AOA", subgroup: "Muy bajo aporte", portions: 3, qty: "120g", kcal: 135, prot: 27, carb: 0, fat: 3 },
          { uid: "d3_2", foodId: "c05", name: "Arroz integral", group: "Cereales", subgroup: "Sin grasa", portions: 1.5, qty: "1/2 taza", kcal: 105, prot: 2.5, carb: 22, fat: 0.8 },
          { uid: "d3_3", foodId: "leg03", name: "Hummus de garbanzo", group: "Leguminosas", subgroup: "", portions: 0.5, qty: "2 cucharadas", kcal: 60, prot: 3, carb: 8, fat: 2 },
          { uid: "d3_4", foodId: "v02", name: "Jitomate y pepino persa", group: "Verduras", subgroup: "", portions: 2, qty: "2 tazas", kcal: 50, prot: 2, carb: 10, fat: 0 },
          { uid: "d3_5", foodId: "g02", name: "Aceite de oliva extra virgen", group: "Grasas", subgroup: "Sin proteína", portions: 1, qty: "1 cucharadita", kcal: 45, prot: 0, carb: 0, fat: 5 }
        ]
      },
      {
        id: "meal_domingo_3",
        name: "Colación 2",
        dishTitle: "Batido de Proteína con Leche de Almendras y Frutos Rojos",
        instructions: "Licuar 1 scoop de proteína con 250ml de leche de almendras sin azúcar y 1/2 taza de berries congeladas.",
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80",
        items: [
          { uid: "d4_1", foodId: "aoa05", name: "Proteína Whey Isolate", group: "AOA", subgroup: "Muy bajo aporte", portions: 1, qty: "1 scoop (25g)", kcal: 90, prot: 22, carb: 1, fat: 0 },
          { uid: "d4_2", foodId: "f04", name: "Frutos rojos mixtos", group: "Frutas", subgroup: "", portions: 1, qty: "3/4 taza", kcal: 60, prot: 0, carb: 15, fat: 0 }
        ]
      },
      {
        id: "meal_domingo_4",
        name: "Cena",
        dishTitle: "Crema Ligera de Calabacita y Poro con Panela Asada",
        instructions: "Cocer la calabacita con poro y licuar con caldo vegetal. Servir caliente con cubos de panela asada y semillas de girasol.",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
        items: [
          { uid: "d5_1", foodId: "v03", name: "Calabacita tierna y poro", group: "Verduras", subgroup: "", portions: 2, qty: "2 tazas", kcal: 50, prot: 3, carb: 8, fat: 0 },
          { uid: "d5_2", foodId: "aoa06", name: "Queso panela artesanal", group: "AOA", subgroup: "Bajo aporte", portions: 2, qty: "80g", kcal: 110, prot: 14, carb: 2, fat: 5 },
          { uid: "d5_3", foodId: "c02", name: "Tostadas horneadas Saníssimo", group: "Cereales", subgroup: "Sin grasa", portions: 1.5, qty: "2 piezas", kcal: 70, prot: 2, carb: 15, fat: 0 },
          { uid: "d5_4", foodId: "g10", name: "Semillas de girasol", group: "Grasas", subgroup: "Con proteína", portions: 1, qty: "1 cucharada", kcal: 45, prot: 2, carb: 2, fat: 4 }
        ]
      }
    ]
  }
};
