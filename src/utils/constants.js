export const CATALOGO_LABORATORIOS = [
  // QUÍMICA SANGUÍNEA Y METABOLISMO
  { id: 'glu_ayuno', grupo: 'Química Sanguínea', nombre: 'Glucosa en Ayuno', unidad: 'mg/dL', ref_min: 70, ref_max: 99 },
  { id: 'glu_post', grupo: 'Química Sanguínea', nombre: 'Glucosa Postprandial', unidad: 'mg/dL', ref_min: 70, ref_max: 140 },
  { id: 'hba1c', grupo: 'Química Sanguínea', nombre: 'Hemoglobina Glucosilada (HbA1c)', unidad: '%', ref_min: 4.0, ref_max: 5.6 },
  { id: 'insulina', grupo: 'Química Sanguínea', nombre: 'Insulina Basal', unidad: 'µU/mL', ref_min: 2.6, ref_max: 24.9 },
  { id: 'homa_ir', grupo: 'Química Sanguínea', nombre: 'Índice HOMA-IR', unidad: 'Índice', ref_min: 0.5, ref_max: 1.9 },
  { id: 'col_tot', grupo: 'Perfil Lipídico', nombre: 'Colesterol Total', unidad: 'mg/dL', ref_min: 125, ref_max: 200 },
  { id: 'trig', grupo: 'Perfil Lipídico', nombre: 'Triglicéridos', unidad: 'mg/dL', ref_min: 35, ref_max: 150 },
  { id: 'hdl', grupo: 'Perfil Lipídico', nombre: 'Colesterol HDL', unidad: 'mg/dL', ref_min: 40, ref_max: 100 },
  { id: 'ldl', grupo: 'Perfil Lipídico', nombre: 'Colesterol LDL', unidad: 'mg/dL', ref_min: 50, ref_max: 100 },
  { id: 'vldl', grupo: 'Perfil Lipídico', nombre: 'Colesterol VLDL', unidad: 'mg/dL', ref_min: 2, ref_max: 30 },
  { id: 'indice_aterogenico', grupo: 'Perfil Lipídico', nombre: 'Índice Aterogénico', unidad: 'Índice', ref_min: 0, ref_max: 4.5 },
  { id: 'acido_urico', grupo: 'Química Sanguínea', nombre: 'Ácido Úrico', unidad: 'mg/dL', ref_min: 2.4, ref_max: 7.0 },
  { id: 'creatinina', grupo: 'Química Sanguínea', nombre: 'Creatinina', unidad: 'mg/dL', ref_min: 0.5, ref_max: 1.2 },
  { id: 'urea', grupo: 'Química Sanguínea', nombre: 'Urea', unidad: 'mg/dL', ref_min: 17, ref_max: 43 },
  { id: 'bun', grupo: 'Química Sanguínea', nombre: 'Nitrógeno Ureico (BUN)', unidad: 'mg/dL', ref_min: 7, ref_max: 20 },
  
  // BIOMETRÍA HEMÁTICA (BH)
  { id: 'hb', grupo: 'Biometría Hemática', nombre: 'Hemoglobina', unidad: 'g/dL', ref_min: 12.0, ref_max: 17.5 },
  { id: 'hto', grupo: 'Biometría Hemática', nombre: 'Hematocrito', unidad: '%', ref_min: 36, ref_max: 50 },
  { id: 'eri', grupo: 'Biometría Hemática', nombre: 'Eritrocitos', unidad: 'M/µL', ref_min: 4.0, ref_max: 5.9 },
  { id: 'vcm', grupo: 'Biometría Hemática', nombre: 'VCM', unidad: 'fL', ref_min: 80, ref_max: 100 },
  { id: 'hcm', grupo: 'Biometría Hemática', nombre: 'HCM', unidad: 'pg', ref_min: 27, ref_max: 33 },
  { id: 'leuco', grupo: 'Biometría Hemática', nombre: 'Leucocitos', unidad: 'K/µL', ref_min: 4.5, ref_max: 11.0 },
  { id: 'linfo', grupo: 'Biometría Hemática', nombre: 'Linfocitos', unidad: '%', ref_min: 20, ref_max: 40 },
  { id: 'plaquetas', grupo: 'Biometría Hemática', nombre: 'Plaquetas', unidad: 'K/µL', ref_min: 150, ref_max: 400 },

  // PERFIL HEPÁTICO
  { id: 'ast', grupo: 'Perfil Hepático', nombre: 'AST / TGO', unidad: 'U/L', ref_min: 8, ref_max: 33 },
  { id: 'alt', grupo: 'Perfil Hepático', nombre: 'ALT / TGP', unidad: 'U/L', ref_min: 4, ref_max: 36 },
  { id: 'ggt', grupo: 'Perfil Hepático', nombre: 'GGT', unidad: 'U/L', ref_min: 5, ref_max: 40 },
  { id: 'fa', grupo: 'Perfil Hepático', nombre: 'Fosfatasa Alcalina', unidad: 'U/L', ref_min: 44, ref_max: 147 },
  { id: 'bili_tot', grupo: 'Perfil Hepático', nombre: 'Bilirrubina Total', unidad: 'mg/dL', ref_min: 0.1, ref_max: 1.2 },
  { id: 'albumina', grupo: 'Perfil Hepático', nombre: 'Albúmina', unidad: 'g/dL', ref_min: 3.5, ref_max: 5.2 },
  { id: 'proteinas_tot', grupo: 'Perfil Hepático', nombre: 'Proteínas Totales', unidad: 'g/dL', ref_min: 6.0, ref_max: 8.3 },

  // PERFIL TIROIDEO
  { id: 'tsh', grupo: 'Perfil Tiroideo', nombre: 'TSH', unidad: 'µUI/mL', ref_min: 0.4, ref_max: 4.0 },
  { id: 't3_libre', grupo: 'Perfil Tiroideo', nombre: 'T3 Libre', unidad: 'pg/mL', ref_min: 2.3, ref_max: 4.1 },
  { id: 't4_libre', grupo: 'Perfil Tiroideo', nombre: 'T4 Libre', unidad: 'ng/dL', ref_min: 0.9, ref_max: 1.7 },

  // VITAMINAS Y MINERALES
  { id: 'vit_d', grupo: 'Vitaminas y Minerales', nombre: 'Vitamina D (25-OH)', unidad: 'ng/mL', ref_min: 30, ref_max: 100 },
  { id: 'vit_b12', grupo: 'Vitaminas y Minerales', nombre: 'Vitamina B12', unidad: 'pg/mL', ref_min: 200, ref_max: 900 },
  { id: 'hierro', grupo: 'Vitaminas y Minerales', nombre: 'Hierro Sérico', unidad: 'µg/dL', ref_min: 60, ref_max: 170 },
  { id: 'ferritina', grupo: 'Vitaminas y Minerales', nombre: 'Ferritina', unidad: 'ng/mL', ref_min: 11, ref_max: 336 },
  { id: 'calcio', grupo: 'Vitaminas y Minerales', nombre: 'Calcio', unidad: 'mg/dL', ref_min: 8.6, ref_max: 10.3 },
  { id: 'magnesio', grupo: 'Vitaminas y Minerales', nombre: 'Magnesio', unidad: 'mg/dL', ref_min: 1.7, ref_max: 2.2 },
  { id: 'sodio', grupo: 'Electrolitos', nombre: 'Sodio', unidad: 'mEq/L', ref_min: 135, ref_max: 145 },
  { id: 'potasio', grupo: 'Electrolitos', nombre: 'Potasio', unidad: 'mEq/L', ref_min: 3.5, ref_max: 5.1 },
  { id: 'cloro', grupo: 'Electrolitos', nombre: 'Cloro', unidad: 'mEq/L', ref_min: 98, ref_max: 107 },

  // EGO Y OTROS
  { id: 'ego_ph', grupo: 'Examen General de Orina', nombre: 'pH Urinario', unidad: '', ref_min: 4.5, ref_max: 8.0 },
  { id: 'ego_densidad', grupo: 'Examen General de Orina', nombre: 'Densidad Específica', unidad: '', ref_min: 1.005, ref_max: 1.030 },
  { id: 'pcr', grupo: 'Marcadores de Inflamación', nombre: 'Proteína C Reactiva (PCR)', unidad: 'mg/L', ref_min: 0, ref_max: 3.0 },
  
  // PERFIL HORMONAL REPRODUCTIVO
  { id: 'testosterona_tot', grupo: 'Perfil Hormonal', nombre: 'Testosterona Total', unidad: 'ng/dL', ref_min: 240, ref_max: 950 },
  { id: 'testosterona_lib', grupo: 'Perfil Hormonal', nombre: 'Testosterona Libre', unidad: 'pg/mL', ref_min: 5, ref_max: 21 },
  { id: 'estradiol', grupo: 'Perfil Hormonal', nombre: 'Estradiol (E2)', unidad: 'pg/mL', ref_min: 15, ref_max: 350 },
  { id: 'progesterona', grupo: 'Perfil Hormonal', nombre: 'Progesterona', unidad: 'ng/mL', ref_min: 0.1, ref_max: 25 },
  { id: 'prolactina', grupo: 'Perfil Hormonal', nombre: 'Prolactina', unidad: 'ng/mL', ref_min: 2, ref_max: 29 },
  { id: 'fsh', grupo: 'Perfil Hormonal', nombre: 'FSH', unidad: 'mUI/mL', ref_min: 1.5, ref_max: 12.4 },
  { id: 'lh', grupo: 'Perfil Hormonal', nombre: 'LH', unidad: 'mUI/mL', ref_min: 1.7, ref_max: 8.6 },
  { id: 'cortisol', grupo: 'Perfil Hormonal', nombre: 'Cortisol', unidad: 'µg/dL', ref_min: 5, ref_max: 23 },
];

export const SMAE_GROUPS = [
  { id: 'veg', key: 'Verduras', name: 'Verduras', kcal: 25, prot: 2, carb: 4, fat: 0, color: '#10b981', emoji: '🥦' },
  { id: 'fru', key: 'Frutas', name: 'Frutas', kcal: 60, prot: 0, carb: 15, fat: 0, color: '#f59e0b', emoji: '🍎' },
  { id: 'cer_s', key: 'Cereales', name: 'Cereales s/g', fullName: 'Cereales sin Grasa', kcal: 70, prot: 2, carb: 15, fat: 0, color: '#eab308', emoji: '🍞' },
  { id: 'cer_c', key: 'Cereales c/g', name: 'Cereales c/g', fullName: 'Cereales con Grasa', kcal: 115, prot: 2, carb: 15, fat: 5, color: '#d97706', emoji: '🥐' },
  { id: 'leg', key: 'Leguminosas', name: 'Leguminosas', kcal: 120, prot: 8, carb: 20, fat: 1, color: '#b45309', emoji: '🫘' },
  { id: 'aoa_mb', key: 'AOA', name: 'AOA MBAG', fullName: 'AOA Muy Bajo Aporte', kcal: 40, prot: 7, carb: 0, fat: 1, color: '#ef4444', emoji: '🥩' },
  { id: 'aoa_b', key: 'AOA BAG', name: 'AOA BAG', fullName: 'AOA Bajo Aporte', kcal: 55, prot: 7, carb: 0, fat: 3, color: '#f87171', emoji: '🍗' },
  { id: 'aoa_m', key: 'AOA MAG', name: 'AOA MAG', fullName: 'AOA Moderado Aporte', kcal: 75, prot: 7, carb: 0, fat: 5, color: '#dc2626', emoji: '🍖' },
  { id: 'aoa_a', key: 'AOA AAG', name: 'AOA AAG', fullName: 'AOA Alto Aporte', kcal: 100, prot: 7, carb: 0, fat: 8, color: '#b91c1c', emoji: '🥓' },
  { id: 'lac_d', key: 'Leche', name: 'Leche Des.', fullName: 'Leche Descremada', kcal: 95, prot: 9, carb: 12, fat: 2, color: '#38bdf8', emoji: '🥛' },
  { id: 'lac_s', key: 'Leche Semides', name: 'Leche Semides.', fullName: 'Leche Semidescremada', kcal: 110, prot: 9, carb: 12, fat: 4, color: '#0ea5e9', emoji: '🥛' },
  { id: 'lac_e', key: 'Leche Entera', name: 'Leche Entera', fullName: 'Leche Entera', kcal: 150, prot: 9, carb: 12, fat: 8, color: '#0284c7', emoji: '🥛' },
  { id: 'gra_s', key: 'Grasas', name: 'Grasas s/p', fullName: 'Grasas sin Proteína', kcal: 45, prot: 0, carb: 0, fat: 5, color: '#84cc16', emoji: '🥑' },
  { id: 'gra_c', key: 'Grasas c/p', name: 'Grasas c/p', fullName: 'Grasas con Proteína', kcal: 70, prot: 3, carb: 3, fat: 5, color: '#65a30d', emoji: '🥜' },
  { id: 'azu_s', key: 'Azúcares', name: 'Azúcar s/g', fullName: 'Azúcares sin Grasa', kcal: 40, prot: 0, carb: 10, fat: 0, color: '#ec4899', emoji: '🍯' },
  { id: 'azu_c', key: 'Azúcares c/g', name: 'Azúcar c/g', fullName: 'Azúcares con Grasa', kcal: 85, prot: 0, carb: 10, fat: 5, color: '#db2777', emoji: '🍫' }
];
