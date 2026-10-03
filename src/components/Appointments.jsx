import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock, User, Calendar as CalendarIcon, X } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('nutriplan_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const savedPatients = localStorage.getItem('nutriplan_patients');
    if (savedPatients) setPatients(JSON.parse(savedPatients));
  }, []);

  useEffect(() => {
    localStorage.setItem('nutriplan_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // String YYYY-MM-DD
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '', patientId: '', patientName: '', time: '', notes: ''
  });

  // Date Helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  
  const formatDateString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Generate Calendar Grid
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(new Date(currentYear, currentMonth, i));
  }

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, app) => {
    if (!acc[app.date]) acc[app.date] = [];
    acc[app.date].push(app);
    return acc;
  }, {});

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!formData.patientName || !formData.time) {
      return alert('Paciente y hora son obligatorios');
    }
    const newAppointment = { ...formData, date: selectedDate, id: formData.id || Date.now().toString() };
    
    if (formData.id) {
      setAppointments(appointments.map(a => a.id === formData.id ? newAppointment : a));
    } else {
      setAppointments([...appointments, newAppointment]);
    }
    setShowForm(false);
    setFormData({ id: '', patientId: '', patientName: '', time: '', notes: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar cita?')) {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  // Get selected day's appointments sorted by time
  const selectedDayAppointments = selectedDate && appointmentsByDate[selectedDate] 
    ? [...appointmentsByDate[selectedDate]].sort((a, b) => a.time.localeCompare(b.time))
    : [];

  const todayStr = formatDateString(new Date());

  return (
    <div className="h-full flex flex-col p-6 bg-slate-50/50">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary-600" /> Mi Agenda
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"><ChevronLeft className="w-5 h-5"/></button>
          <span className="font-bold text-lg text-slate-700 min-w-[140px] text-center capitalize">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"><ChevronRight className="w-5 h-5"/></button>
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          <button onClick={handleToday} className="px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50 rounded-xl transition-colors">Hoy</button>
        </div>
      </div>

      {/* Main Layout: Calendar + Side Panel */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        
        {/* Calendar Grid */}
        <div className="flex-1 bg-white rounded-3xl shadow-soft border border-primary-50 flex flex-col overflow-hidden">
          
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
            {dayNames.map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-6 bg-slate-100 gap-[1px]">
            {calendarCells.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} className="bg-white/50"></div>;
              
              const dateStr = formatDateString(date);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const dayAppointments = appointmentsByDate[dateStr] || [];

              return (
                <div 
                  key={dateStr} 
                  onClick={() => handleDayClick(dateStr)}
                  className={`bg-white p-2 cursor-pointer transition-all flex flex-col group ${isSelected ? 'ring-2 ring-inset ring-primary-500 bg-primary-50/20' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-600 text-white shadow-md' : 'text-slate-700 group-hover:bg-slate-100'}`}>
                      {date.getDate()}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="text-[10px] font-bold text-primary-600 bg-primary-100 px-1.5 rounded-md">{dayAppointments.length}</span>
                    )}
                  </div>
                  
                  {/* Appointment Badges (Max 3) */}
                  <div className="flex-1 overflow-hidden space-y-1">
                    {dayAppointments.slice(0, 3).map((app, idx) => (
                      <div key={idx} className="text-[10px] truncate bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                        {app.time} - {app.patientName.split(' ')[0]}
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-[10px] text-slate-400 font-medium px-1">+{dayAppointments.length - 3} más</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel (Details / Form) */}
        {selectedDate && (
          <div className="w-80 flex flex-col bg-white rounded-3xl shadow-soft border border-primary-50 overflow-hidden shrink-0 transition-all duration-300 transform origin-right">
            
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800">
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <p className="text-xs text-slate-500">{selectedDayAppointments.length} cita(s) programada(s)</p>
              </div>
              <button onClick={() => setSelectedDate(null)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X className="w-4 h-4"/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {showForm ? (
                <div className="animate-fade-in">
                  <h4 className="font-bold text-primary-700 mb-4 text-sm uppercase tracking-wider">{formData.id ? 'Editar Cita' : 'Nueva Cita'}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Paciente</label>
                      <input 
                        type="text" 
                        list="patients-list"
                        className="input-field py-2" 
                        value={formData.patientName} 
                        onChange={e => setFormData({...formData, patientName: e.target.value})} 
                        placeholder="Nombre del paciente..."
                      />
                      <datalist id="patients-list">
                        {patients.map(p => <option key={p.id} value={p.name} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Hora</label>
                      <input type="time" className="input-field py-2" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Motivo / Notas</label>
                      <textarea className="input-field py-2 resize-none h-24" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Detalles de la cita..."></textarea>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-glow transition-all">Guardar</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayAppointments.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CalendarIcon className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-500 text-sm">Día libre. No hay citas.</p>
                    </div>
                  ) : (
                    selectedDayAppointments.map(app => (
                      <div key={app.id} className="p-3 border border-slate-100 bg-slate-50/50 rounded-2xl group hover:border-primary-200 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1.5 text-primary-700 font-bold text-sm bg-white px-2 py-0.5 rounded shadow-sm">
                            <Clock className="w-3.5 h-3.5"/> {app.time}
                          </div>
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setFormData(app); setShowForm(true); }} className="p-1 text-slate-400 hover:text-primary-600"><User className="w-3.5 h-3.5"/></button>
                            <button onClick={() => handleDelete(app.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">{app.patientName}</h4>
                        {app.notes && <p className="text-xs text-slate-500 mt-1 italic leading-tight">{app.notes}</p>}
                      </div>
                    ))
                  )}
                  
                  <button onClick={() => setShowForm(true)} className="w-full mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-primary-200 text-primary-600 font-semibold rounded-2xl hover:bg-primary-50 hover:border-primary-300 transition-all">
                    <Plus className="w-4 h-4"/> Agendar Cita
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
