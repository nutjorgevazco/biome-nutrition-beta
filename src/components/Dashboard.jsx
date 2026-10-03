import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Calendar, Activity, Clock, ChevronRight, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard({ onNavigateToPatients }) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    avgIMC: 0,
    upcomingAppointments: [],
    appointmentsToday: 0,
    recentPatients: [],
    retentionRate: 0,
    imcData: [],
    strategyData: []
  });

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    // Load stats from localStorage data
    const patients = JSON.parse(localStorage.getItem('nutriplan_patients') || '[]');
    
    const todayStr = new Date().toISOString().split('T')[0];

    let totalIMC = 0;
    let patientsWithIMC = 0;
    let retained = 0;

    const imcCounts = { 'Bajo Peso': 0, 'Normal': 0, 'Sobrepeso': 0, 'Obesidad': 0 };
    const strategyCounts = {};
    const upcoming = [];

    patients.forEach(p => {
      // IMC Calc
      if (p.imc > 0) {
        totalIMC += p.imc;
        patientsWithIMC++;
        
        if (p.imc < 18.5) imcCounts['Bajo Peso']++;
        else if (p.imc < 25) imcCounts['Normal']++;
        else if (p.imc < 30) imcCounts['Sobrepeso']++;
        else imcCounts['Obesidad']++;
      }

      // Strategy Calc
      if (p.strategy) {
        let strategyName = p.strategy.split(' ')[0]; // Simplify name
        if (strategyName === 'Déficit') strategyName = 'Déficit Calórico';
        if (strategyName === 'Superávit') strategyName = 'Aumento Masa';
        strategyCounts[strategyName] = (strategyCounts[strategyName] || 0) + 1;
      }

      // Retention Calc (has more than 1 history snapshot = came back)
      if (p.history && p.history.length > 0) {
        retained++;
      }

      // Upcoming Appointments
      if (p.nextAppointment && p.nextAppointment >= todayStr) {
        upcoming.push({
          id: p.id,
          name: p.name,
          date: p.nextAppointment,
          isToday: p.nextAppointment === todayStr
        });
      }
    });

    const avgIMC = patientsWithIMC > 0 ? totalIMC / patientsWithIMC : 0;
    const retentionRate = patients.length > 0 ? Math.round((retained / patients.length) * 100) : 0;

    upcoming.sort((a, b) => a.date.localeCompare(b.date));

    const imcData = Object.keys(imcCounts).map(key => ({ name: key, value: imcCounts[key] })).filter(d => d.value > 0);
    const strategyData = Object.keys(strategyCounts).map(key => ({ name: key, value: strategyCounts[key] })).filter(d => d.value > 0);
    
    // Sort by most recent added (assume id is timestamp or reverse array)
    const recent = [...patients].reverse().slice(0, 5);

    setStats({
      totalPatients: patients.length,
      avgIMC: avgIMC.toFixed(1),
      upcomingAppointments: upcoming,
      appointmentsToday: upcoming.filter(a => a.isToday).length,
      recentPatients: recent,
      retentionRate,
      imcData,
      strategyData
    });
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50 custom-scrollbar">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight font-heading">Dashboard</h1>
          <p className="text-slate-500 mt-1">Resumen de actividad y estadísticas clínicas</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Pacientes Totales</p>
            <p className="text-3xl font-black text-slate-800">{stats.totalPatients}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <Activity className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">IMC Promedio</p>
            <p className="text-3xl font-black text-slate-800">{stats.avgIMC}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 shadow-md flex items-center gap-5 text-white">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary-100 uppercase tracking-wider mb-1">Citas Hoy</p>
            <p className="text-3xl font-black text-white">{stats.appointmentsToday}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-7 h-7 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Retención</p>
            <p className="text-3xl font-black text-slate-800">{stats.retentionRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CHARTS SECTION */}
        <div className="col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* IMC CHART */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-primary-500"/> Diagnósticos de IMC</h3>
              {stats.imcData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Sin datos suficientes</div>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.imcData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.imcData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} pacientes`, 'Cantidad']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 text-xs mt-2 flex-wrap">
                    {stats.imcData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1 text-slate-600">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        {entry.name} ({entry.value})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STRATEGY CHART */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500"/> Estrategias Asignadas</h3>
              {stats.strategyData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Sin datos suficientes</div>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.strategyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                      <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* RECENT PATIENTS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-slate-400"/> Pacientes Agregados Recientemente</h3>
            {stats.recentPatients.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No hay pacientes registrados aún.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {stats.recentPatients.map(p => (
                  <div key={p.id} className="flex justify-between items-center py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">
                        {p.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.age} años • {p.gender}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary-600">{p.weight ? `${p.weight} kg` : '-'}</p>
                      <p className="text-xs text-slate-400">IMC {p.imc ? p.imc.toFixed(1) : '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR: UPCOMING APPOINTMENTS */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Clock className="w-5 h-5 text-rose-500"/> Próximas Citas</h3>
              <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-full">{stats.upcomingAppointments.length}</span>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              {stats.upcomingAppointments.length === 0 ? (
                <div className="text-center text-slate-400 py-10">
                  <Calendar className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                  <p className="text-sm">No tienes citas agendadas.</p>
                  <p className="text-xs mt-1">Registra la próxima cita en el expediente de cada paciente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.upcomingAppointments.map((app, i) => (
                    <div key={`${app.id}-${i}`} className={`p-4 rounded-xl border ${app.isToday ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-slate-800">{app.name}</p>
                        {app.isToday && <span className="text-[10px] uppercase font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded text-right shrink-0">HOY</span>}
                      </div>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> 
                        {new Date(app.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
