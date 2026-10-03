import React from 'react';

const Somatocarta = ({ endo = 0, meso = 0, ecto = 0 }) => {
    // Calculo de X e Y basado en el somatotipo de Heath-Carter
    const x = (isNaN(ecto) ? 0 : ecto) - (isNaN(endo) ? 0 : endo); 
    const y = 2 * (isNaN(meso) ? 0 : meso) - ((isNaN(endo) ? 0 : endo) + (isNaN(ecto) ? 0 : ecto));
    
    // Mapeo al SVG viewBox (300x300, centro en 150,150)
    const px = 150 + (x * 10); 
    const py = 150 - (y * 10);
    
    const showCoords = !isNaN(x) && !isNaN(y) && (x !== 0 || y !== 0);

    return (
        <div className="relative w-full max-w-[280px] mx-auto aspect-square bg-slate-50 rounded-[40px] border-4 border-slate-100 shadow-inner flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 300 300" className="w-full h-full opacity-90">
                {/* Triángulo de Reuleaux (bordes curvos) */}
                <path d="M 150 20 C 220 50, 280 140, 260 250 C 150 220, 150 220, 40 250 C 20 140, 80 50, 150 20 Z" fill="none" stroke="#e2e8f0" strokeWidth="3"/>
                <path d="M 150 60 C 190 80, 230 140, 215 215 C 150 195, 150 195, 85 215 C 70 140, 110 80, 150 60 Z" fill="none" stroke="#f1f5f9" strokeWidth="2"/>
                
                {/* Ejes centrales */}
                <line x1="150" y1="150" x2="150" y2="20" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                <line x1="150" y1="150" x2="40" y2="250" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                <line x1="150" y1="150" x2="260" y2="250" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                
                {/* Etiquetas de los polos */}
                <text x="150" y="19" fontSize="11" fontWeight="900" fill="#3b82f6" textAnchor="middle">MESOMORFO</text>
                <text x="50" y="269" fontSize="11" fontWeight="900" fill="#f43f5e" textAnchor="middle">ENDOMORFO</text>
                <text x="250" y="269" fontSize="11" fontWeight="900" fill="#f59e0b" textAnchor="middle">ECTOMORFO</text>
                
                {/* Punto graficado */}
                <circle cx={px} cy={py} r="8" fill="#14b8a6" stroke="white" strokeWidth="2" className="drop-shadow-lg"/>
                
                {/* Coordenadas */}
                {showCoords && (
                    <text x={px > 150 ? px - 25 : px + 30} y={py - 14} fontSize="12" fontWeight="900" fill="#0f172a" textAnchor="middle">
                        ({x.toFixed(1)}, {y.toFixed(1)})
                    </text>
                )}
            </svg>
        </div>
    );
};

export default Somatocarta;
