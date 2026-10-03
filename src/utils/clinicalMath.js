/**
 * clinicalMath.js
 * Funciones puras para los cálculos clínicos, antropométricos y metabólicos avanzados.
 */

// 1. ISAK y Modelo de 4 Componentes
export const calculateISAK = (formData, isakValues) => {
    try {
        const res = {};
        
        // Sumar todos los pliegues (mm)
        const triceps = parseFloat(isakValues.triceps) || 0;
        const subscapular = parseFloat(isakValues.subscapular) || 0;
        const supraespinal = parseFloat(isakValues.supraespinal) || parseFloat(isakValues.supracrestal) || 0; // Fallback
        const abdominal = parseFloat(isakValues.abdominalFold) || 0;
        const thigh = parseFloat(isakValues.thigh) || 0;
        const calfFold = parseFloat(isakValues.calfFold) || 0;
        const biceps = parseFloat(isakValues.biceps) || 0;
        const supracrestal = parseFloat(isakValues.supracrestal) || 0;
        
        res.sum6 = triceps + subscapular + supraespinal + abdominal + thigh + calfFold;
        
        const isMale = formData.gender === 'Masculino';
        const edad = parseInt(formData.age) || 25;
        const peso_kg = parseFloat(formData.weight) || 0;
        const talla_cm = parseFloat(formData.height) || 0;
        const talla_m = talla_cm / 100;

        // Porcentaje de Grasa YUHASZ / Durnin
        res.grasa_pct = res.sum6 > 0 ? (isMale ? (res.sum6 * 0.097) + 3.64 : (res.sum6 * 0.1429) + 4.56) : 0;
        if (isNaN(res.grasa_pct) || !isFinite(res.grasa_pct)) res.grasa_pct = 0;
        if (res.grasa_pct > 60) res.grasa_pct = 60; 
        if (res.grasa_pct > 0 && res.grasa_pct < 3) res.grasa_pct = 3; 
        
        res.grasa_kg = peso_kg > 0 ? peso_kg * (res.grasa_pct / 100) : 0;
        
        // Diámetros (para masa ósea)
        const d_humero = parseFloat(isakValues.humerus) || 0;
        const d_biest = parseFloat(isakValues.wrist) || parseFloat(isakValues.humerus) || 0; // Usando humerus como fallback si no hay wrist
        const d_femur = parseFloat(isakValues.femur) || 0;
        
        // Masa Ósea (Rocha)
        res.osea_kg = (talla_m > 0 && d_biest > 0 && d_femur > 0) ? 3.02 * Math.pow((Math.pow(talla_m, 2) * (d_biest/100) * (d_femur/100)), 0.712) : 0;
        
        // Masa Residual (Wurch)
        res.residual_kg = peso_kg > 0 ? peso_kg * (isMale ? 0.24 : 0.21) : 0;

        // Perímetros (para masa muscular)
        const p_brazo = parseFloat(isakValues.armCircumference) || 0;
        const p_muslo = parseFloat(isakValues.thighCircumference) || parseFloat(isakValues.armCircumference) || 0; // Fallback
        const p_pierna = parseFloat(isakValues.calfCircumference) || 0;
        
        // Perímetros corregidos
        const pr_brazo_corr = p_brazo - (Math.PI * triceps / 10);
        const pr_muslo_corr = p_muslo - (Math.PI * thigh / 10);
        const pr_pierna_corr = p_pierna - (Math.PI * calfFold / 10);
        
        // Masa Muscular (Lee)
        if (talla_m > 0 && pr_brazo_corr > 0 && pr_muslo_corr > 0 && pr_pierna_corr > 0) {
            res.musculo_kg = talla_m * (0.00744 * Math.pow(pr_brazo_corr, 2) + 0.00088 * Math.pow(pr_muslo_corr, 2) + 0.00441 * Math.pow(pr_pierna_corr, 2)) + (2.4 * (isMale ? 1 : 0)) - (0.048 * edad) + 7.8;
        } else { 
            res.musculo_kg = 0; 
        }

        // Estructuración final de 4 componentes
        res.peso_estructurado = res.grasa_kg + res.osea_kg + res.residual_kg + res.musculo_kg;
        const ptc = res.peso_estructurado > 0 ? res.peso_estructurado : 1;
        res.grasa_estruct_pct = (res.grasa_kg / ptc) * 100; 
        res.musculo_estruct_pct = (res.musculo_kg / ptc) * 100;
        res.osea_estruct_pct = (res.osea_kg / ptc) * 100; 
        res.residual_estruct_pct = (res.residual_kg / ptc) * 100;

        // Somatotipo
        const sum3 = triceps + subscapular + supraespinal;
        const X = talla_cm > 0 ? sum3 * (170.18 / talla_cm) : 0;
        res.endo = X > 0 ? -0.7182 + 0.1451*X - 0.00068*Math.pow(X,2) + 0.0000014*Math.pow(X,3) : 0.1; 
        if(res.endo < 0) res.endo = 0.1;
        
        res.meso = talla_cm > 0 ? (0.858 * d_humero) + (0.601 * d_femur) + (0.188 * pr_brazo_corr) + (0.161 * pr_pierna_corr) - (0.131 * talla_cm) + 4.5 : 0;
        
        const HWR = peso_kg > 0 ? talla_cm / Math.pow(peso_kg, 0.3333) : 0;
        if (HWR >= 40.75) res.ecto = 0.732 * HWR - 28.58; 
        else if (HWR > 38.25 && HWR < 40.75) res.ecto = 0.463 * HWR - 17.63; 
        else res.ecto = 0.1;
        
        // Agua Corporal Total (Watson)
        if (peso_kg > 0 && talla_cm > 0) {
            res.watson_act = isMale 
                ? 2.447 - (0.09156 * edad) + (0.1074 * talla_cm) + (0.3362 * peso_kg)
                : -2.097 + (0.1069 * talla_cm) + (0.2466 * peso_kg);
        } else { 
            res.watson_act = 0; 
        }

        return res;
    } catch (error) { 
        return {}; 
    }
};

// 2. Fórmulas Metabólicas
export const calculateMetabolism = (weight, height, ageStr, gender, fatPct) => {
    const w = parseFloat(weight) || 0; 
    const h = parseFloat(height) || 0; 
    const age = parseInt(ageStr) || 0; 
    const m = gender === 'Masculino';
    const grasa = parseFloat(fatPct) || 15; 
    const mlg = w * (1 - (grasa / 100)); // Masa libre de grasa

    if (w <= 0 || h <= 0 || age <= 0) return { harris: 0, mifflin: 0, valencia: 0, owens: 0, cunningham: 0, tinsley: 0 };
    
    const harris = m ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * age) : 447.593 + (9.247 * w) + (3.098 * h) - (4.33 * age);
    const mifflin = m ? (10 * w) + (6.25 * h) - (5 * age) + 5 : (10 * w) + (6.25 * h) - (5 * age) - 161;
    const owens = m ? 879 + (10.2 * w) : 795 + (7.18 * w);
    
    let valencia = 0;
    if (age < 30) valencia = m ? (15.3 * w) + 679 : (14 * w) + 496; 
    else if (age <= 60) valencia = m ? (11.6 * w) + 879 : (8.7 * w) + 829; 
    else valencia = m ? (13.5 * w) + 487 : (10.5 * w) + 596;
    
    const cunningham = 500 + (22 * mlg);
    const tinsley = (24.8 * mlg) + 10;

    return { 
        harris: Math.round(harris), 
        mifflin: Math.round(mifflin), 
        owens: Math.round(owens), 
        valencia: Math.round(valencia), 
        cunningham: Math.round(cunningham), 
        tinsley: Math.round(tinsley) 
    };
};

// 3. Proyección de Metas
export const calculateProjections = (currentWeight, idealWeight, baseGet, finalKcal) => {
    const pa = parseFloat(currentWeight) || 0; 
    const pi = parseFloat(idealWeight) || 0;
    const exceso = Math.max(0, pa - pi);
    const meta_10 = pa * 0.10; 
    const meta_5 = pa * 0.05;
    
    const kcal_ideal = exceso * 7200; 
    const kcal_10 = meta_10 * 7200; 
    const kcal_5 = meta_5 * 7200;
    
    const deficit_diario = baseGet - finalKcal;

    const calcTiempo = (kcal) => {
        if (deficit_diario <= 0 || kcal <= 0) return { dias: '-', sem: '-', mes: '-' };
        const dias = Math.round(kcal / deficit_diario);
        return { dias, sem: (dias / 7).toFixed(1), mes: (dias / 30).toFixed(2) };
    };
    
    const calcDeficitReq = (kcal) => {
        if (kcal <= 0) return { m1: 0, m2: 0, m3: 0, m6: 0 };
        return { 
            m1: Math.round(kcal / 30), 
            m2: Math.round(kcal / 60), 
            m3: Math.round(kcal / 90), 
            m6: Math.round(kcal / 180) 
        };
    };

    return {
        peso_actual: pa, peso_ideal: pi, exceso, meta_10, meta_5,
        kcal_ideal, kcal_10, kcal_5, deficit_diario,
        tiempo_ideal: calcTiempo(kcal_ideal), 
        tiempo_10: calcTiempo(kcal_10), 
        tiempo_5: calcTiempo(kcal_5),
        req_ideal: calcDeficitReq(kcal_ideal), 
        req_10: calcDeficitReq(kcal_10), 
        req_5: calcDeficitReq(kcal_5)
    };
};

// 4. Índices de Riesgo Cardiometabólico (Nutrimind Style)
export const calculateCardiometabolicRisks = (waist, hip, height, gender) => {
    const w = parseFloat(waist) || 0;
    const hi = parseFloat(hip) || 0;
    const h = parseFloat(height) || 0;
    const isMale = gender === 'Masculino';

    const res = {
        icc: 0,
        iccCategory: 'Sin datos',
        iccRisk: 'normal',
        iccDistribution: 'Normal',
        ict: 0,
        ictCategory: 'Sin datos',
        ictRisk: 'normal'
    };

    if (w > 0 && hi > 0) {
        res.icc = +(w / hi).toFixed(2);
        if (isMale) {
            if (res.icc < 0.90) {
                res.iccCategory = 'Riesgo Bajo (<0.90)';
                res.iccRisk = 'low';
                res.iccDistribution = 'Ginecoide / Periférica';
            } else if (res.icc <= 0.95) {
                res.iccCategory = 'Riesgo Moderado (0.90 - 0.95)';
                res.iccRisk = 'moderate';
                res.iccDistribution = 'Intermedia';
            } else {
                res.iccCategory = 'Riesgo Alto / Crítico (>0.95)';
                res.iccRisk = 'high';
                res.iccDistribution = 'Androide / Grasa Central (Manzana)';
            }
        } else {
            if (res.icc < 0.80) {
                res.iccCategory = 'Riesgo Bajo (<0.80)';
                res.iccRisk = 'low';
                res.iccDistribution = 'Ginecoide / Periférica (Pera)';
            } else if (res.icc <= 0.85) {
                res.iccCategory = 'Riesgo Moderado (0.80 - 0.85)';
                res.iccRisk = 'moderate';
                res.iccDistribution = 'Intermedia';
            } else {
                res.iccCategory = 'Riesgo Alto / Crítico (>0.85)';
                res.iccRisk = 'high';
                res.iccDistribution = 'Androide / Grasa Central (Manzana)';
            }
        }
    }

    if (w > 0 && h > 0) {
        res.ict = +(w / h).toFixed(2);
        if (res.ict < 0.50) {
            res.ictCategory = 'Óptimo (<0.50): Cintura menor a mitad de estatura';
            res.ictRisk = 'low';
        } else if (res.ict < 0.60) {
            res.ictCategory = 'Aumentado (0.50 - 0.59): Alerta de Grasa Visceral';
            res.ictRisk = 'moderate';
        } else {
            res.ictCategory = 'Muy Alto (≥0.60): Alto Riesgo Cardiometabólico';
            res.ictRisk = 'high';
        }
    }

    return res;
};

// 5. Calculadora Multimétodo de Peso Teórico / Ideal (Nutrimind Style)
export const calculateIdealWeights = (height_cm, gender) => {
    const h = parseFloat(height_cm) || 0;
    const isMale = gender === 'Masculino';

    if (h <= 0) return { hamwi: 0, devine: 0, miller: 0, imc22: 0, average: 0 };

    const inchesOver5Ft = Math.max(0, (h - 152.4) / 2.54);

    let hamwi = isMale ? (48.0 + (2.7 * inchesOver5Ft)) : (45.5 + (2.2 * inchesOver5Ft));
    let devine = isMale ? (50.0 + (2.3 * inchesOver5Ft)) : (45.5 + (2.3 * inchesOver5Ft));
    let miller = isMale ? (56.2 + (1.41 * inchesOver5Ft)) : (53.1 + (1.36 * inchesOver5Ft));
    let imc22 = 22.0 * Math.pow(h / 100, 2);

    hamwi = +hamwi.toFixed(1);
    devine = +devine.toFixed(1);
    miller = +miller.toFixed(1);
    imc22 = +imc22.toFixed(1);

    const average = +((hamwi + devine + miller + imc22) / 4).toFixed(1);

    return {
        hamwi,
        devine,
        miller,
        imc22,
        average
    };
};

