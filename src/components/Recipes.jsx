import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Save, Trash2, Flame, Beef, Droplet, ChefHat } from 'lucide-react';
import smaeData from '../data/smae.json';

const FOOD_GROUPS = ['Todos', 'Verduras', 'Frutas', 'Cereales', 'Leguminosas', 'AOA', 'Leche', 'Grasas', 'Azúcares'];

export default function Recipes() {
  const [recipes, setRecipes] = useState(() => {
    return JSON.parse(localStorage.getItem('nutriplan_recipes') || '[]');
  });

  const allFoods = useMemo(() => {
    const saved = localStorage.getItem('nutriplan_foods');
    return saved ? JSON.parse(saved) : smaeData;
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState('Todos');
  const [view, setView] = useState('list'); // 'list' or 'edit'
  
  // Current editing recipe
  const [currentRecipe, setCurrentRecipe] = useState({
    id: '', name: '', instructions: '', image_url: '', ingredients: []
  });

  useEffect(() => {
    localStorage.setItem('nutriplan_recipes', JSON.stringify(recipes));
  }, [recipes]);

  const filteredFoods = useMemo(() => {
    let foods = allFoods;
    if (activeGroup !== 'Todos') {
      foods = foods.filter(f => f.group === activeGroup);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      foods = foods.filter(f => f.name.toLowerCase().includes(lower) || (f.subgroup && f.subgroup.toLowerCase().includes(lower)));
    }
    return foods;
  }, [searchTerm, activeGroup]);

  // Calculated Macros for current recipe
  const recipeMacros = useMemo(() => {
    let kcal = 0, prot = 0, carb = 0, fat = 0;
    currentRecipe.ingredients.forEach(food => {
      kcal += food.kcal;
      prot += food.prot;
      carb += food.carb;
      fat += food.fat;
    });
    return { kcal, prot, carb, fat };
  }, [currentRecipe.ingredients]);

  const handleAddIngredient = (food) => {
    setCurrentRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ...food, uniqueId: Date.now() + Math.random() }]
    }));
  };

  const handleRemoveIngredient = (uniqueId) => {
    setCurrentRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(f => f.uniqueId !== uniqueId)
    }));
  };

  const handleSaveRecipe = () => {
    if (!currentRecipe.name.trim()) {
      alert("La receta debe tener un nombre.");
      return;
    }
    if (currentRecipe.ingredients.length === 0) {
      alert("Agrega al menos un ingrediente a la receta.");
      return;
    }

    const recipeToSave = { ...currentRecipe, macros: recipeMacros };
    
    if (currentRecipe.id) {
      setRecipes(recipes.map(r => r.id === currentRecipe.id ? recipeToSave : r));
    } else {
      setRecipes([...recipes, { ...recipeToSave, id: Date.now().toString() }]);
    }
    
    setView('list');
  };

  const createNew = () => {
    setCurrentRecipe({ id: '', name: '', instructions: '', image_url: '', ingredients: [] });
    setView('edit');
  };

  const editRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    setView('edit');
  };

  const deleteRecipe = (id, e) => {
    e.stopPropagation();
    if(window.confirm('¿Eliminar esta receta?')) {
      setRecipes(recipes.filter(r => r.id !== id));
    }
  };

  if (view === 'edit') {
    return (
      <div className="flex h-full overflow-hidden bg-slate-50">
        {/* LEFT SIDEBAR - ALIMENTOS */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
          <div className="p-4 border-b border-slate-100 bg-slate-800 text-white">
            <h3 className="font-bold tracking-wide flex items-center gap-2"><Search className="w-4 h-4"/> Catálogo SMAE</h3>
            <p className="text-xs text-slate-400 mt-1">Busca y añade ingredientes</p>
          </div>
          <div className="p-3 border-b border-slate-100">
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Buscar alimento..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {FOOD_GROUPS.map(g => (
                <button key={g} onClick={() => setActiveGroup(g)} className={`text-[10px] px-2 py-1 rounded-md font-semibold transition-colors ${activeGroup === g ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{g}</button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right">{filteredFoods.length} alimentos</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredFoods.map(food => (
              <div key={food.id} className="bg-white border border-slate-200 rounded-lg p-3 hover:border-primary-400 hover:shadow-md transition-all group flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{food.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{food.qty}</p>
                </div>
                <button 
                  onClick={() => handleAddIngredient(food)}
                  className="bg-primary-50 text-primary-600 p-2 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - RECIPE BUILDER */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center z-10 shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{currentRecipe.id ? 'Editar Receta' : 'Nueva Receta'}</h2>
              <p className="text-sm text-slate-500">Diseña un platillo completo para usarlo rápidamente.</p>
            </div>
            <div className="space-x-3 flex">
              <button onClick={() => setView('list')} className="btn-secondary py-2 text-sm">Cancelar</button>
              <button onClick={handleSaveRecipe} className="btn-primary py-2 text-sm"><Save className="w-4 h-4 mr-2" /> Guardar Receta</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar flex flex-col gap-6">
            
            {/* Header / Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
              <div className="col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre del Platillo</label>
                  <input type="text" className="w-full border-b-2 border-slate-200 bg-transparent py-2 text-xl font-bold text-slate-800 focus:border-primary-500 outline-none transition-colors placeholder:text-slate-300" value={currentRecipe.name} onChange={e => setCurrentRecipe({...currentRecipe, name: e.target.value})} placeholder="Ej. Hotcakes de Avena Fit" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Modo de Preparación (Opcional)</label>
                  <textarea className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-shadow text-slate-700 min-h-[100px] resize-none" value={currentRecipe.instructions} onChange={e => setCurrentRecipe({...currentRecipe, instructions: e.target.value})} placeholder="Ej. Licuar la avena con el huevo y cocinar a fuego lento..."></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">URL de Imagen (Opcional)</label>
                  <input type="text" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-shadow text-slate-700" value={currentRecipe.image_url || ''} onChange={e => setCurrentRecipe({...currentRecipe, image_url: e.target.value})} placeholder="https://ejemplo.com/platillo.jpg" />
                </div>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Macros de la Receta</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Calorías</p>
                    <p className="text-2xl font-black text-slate-800">{recipeMacros.kcal.toFixed(0)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1 text-blue-500"><Droplet className="w-3 h-3 inline mr-0.5"/>Carbs</p>
                    <p className="text-lg font-bold text-slate-700">{recipeMacros.carb.toFixed(0)}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1 text-rose-500"><Beef className="w-3 h-3 inline mr-0.5"/>Prot</p>
                    <p className="text-lg font-bold text-slate-700">{recipeMacros.prot.toFixed(0)}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1 text-amber-500"><Flame className="w-3 h-3 inline mr-0.5"/>Grasas</p>
                    <p className="text-lg font-bold text-slate-700">{recipeMacros.fat.toFixed(0)}g</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col min-h-[250px]">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Ingredientes ({currentRecipe.ingredients.length})</h3>
              </div>
              <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                {currentRecipe.ingredients.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <ChefHat className="w-12 h-12 mb-4 opacity-50" />
                    <p className="font-semibold text-lg">Platillo Vacío</p>
                    <p className="text-sm mt-1">Busca alimentos en el catálogo de la izquierda y añádelos aquí.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentRecipe.ingredients.map(food => (
                      <div key={food.uniqueId} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="font-bold text-slate-700 text-sm">{food.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{food.qty} <span className="mx-2 text-slate-300">|</span> <span className="text-amber-600 font-medium">{food.kcal} kcal</span></p>
                        </div>
                        <button onClick={() => handleRemoveIngredient(food.uniqueId)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
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

  // LIST VIEW
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Mis Recetas</h2>
          <p className="text-slate-500 mt-1">Crea platillos y guárdalos para tus planes alimenticios.</p>
        </div>
        <button onClick={createNew} className="btn-primary shadow-md">
          <Plus className="w-5 h-5 mr-2" /> Crear Receta
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm max-w-lg mx-auto mt-20">
          <ChefHat className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Aún no tienes recetas</h3>
          <p className="mb-6">Crea platillos comunes para ahorrar tiempo al armar dietas.</p>
          <button onClick={createNew} className="btn-primary mx-auto">
            <Plus className="w-5 h-5 mr-2" /> Comenzar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div key={recipe.id} onClick={() => editRecipe(recipe)} className={`bg-white rounded-2xl border border-slate-200 hover:border-primary-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden ${recipe.image_url ? 'min-h-[250px]' : 'p-5'}`}>
              
              {recipe.image_url ? (
                <>
                  <div className="absolute inset-0 z-0 bg-slate-900">
                    <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-60 opacity-40 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full p-5 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold pr-8 text-white drop-shadow-md">{recipe.name}</h3>
                      <button onClick={(e) => deleteRecipe(recipe.id, e)} className="text-white/50 hover:text-red-400 transition-colors bg-black/20 p-1.5 rounded-full backdrop-blur-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2 mt-auto drop-shadow-sm font-medium">
                      {recipe.ingredients.map(i => i.name).join(', ')}
                    </p>
                    
                    <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/20">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400">KCAL</p>
                        <p className="font-bold">{recipe.macros.kcal.toFixed(0)}</p>
                      </div>
                      <div className="text-center border-l border-white/20">
                        <p className="text-[10px] font-bold text-gray-400">PROT</p>
                        <p className="font-bold">{recipe.macros.prot.toFixed(0)}g</p>
                      </div>
                      <div className="text-center border-l border-white/20">
                        <p className="text-[10px] font-bold text-gray-400">CARB</p>
                        <p className="font-bold">{recipe.macros.carb.toFixed(0)}g</p>
                      </div>
                      <div className="text-center border-l border-white/20">
                        <p className="text-[10px] font-bold text-gray-400">GRAS</p>
                        <p className="font-bold">{recipe.macros.fat.toFixed(0)}g</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <h3 className="text-lg font-bold text-slate-800 pr-8">{recipe.name}</h3>
                    <button onClick={(e) => deleteRecipe(recipe.id, e)} className="text-slate-300 hover:text-red-500 transition-colors absolute right-0 top-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px] relative z-10">
                    {recipe.ingredients.map(i => i.name).join(', ')}
                  </p>
                  
                  <div className="mt-auto grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 relative z-10">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400">KCAL</p>
                      <p className="font-bold text-slate-700">{recipe.macros.kcal.toFixed(0)}</p>
                    </div>
                    <div className="text-center border-l border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400">PROT</p>
                      <p className="font-bold text-slate-700">{recipe.macros.prot.toFixed(0)}g</p>
                    </div>
                    <div className="text-center border-l border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400">CARB</p>
                      <p className="font-bold text-slate-700">{recipe.macros.carb.toFixed(0)}g</p>
                    </div>
                    <div className="text-center border-l border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400">GRAS</p>
                      <p className="font-bold text-slate-700">{recipe.macros.fat.toFixed(0)}g</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
