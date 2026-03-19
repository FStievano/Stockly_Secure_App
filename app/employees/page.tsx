'use client';
import { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Plus, Search, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { Competency, Employee } from '@/lib/types';
import Image from 'next/image';

const ALL_COMPETENCIES: Competency[] = ['NR-10', 'NR-12', 'NR-35', 'Geral', 'Operação de Empilhadeira', 'Soldagem'];

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, removeEmployee, userRole, activeLoans } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [photo, setPhoto] = useState('');
  const [competencies, setCompetencies] = useState<Competency[]>(['Geral']);

  const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddClick = () => {
    setEditingId(null);
    setName('');
    setRole('');
    setPhoto('');
    setCompetencies(['Geral']);
    setIsModalOpen(true);
  };

  const handleEditClick = (emp: Employee) => {
    setEditingId(emp.id);
    setName(emp.name);
    setRole(emp.role);
    setPhoto(emp.photo.includes('api.dicebear.com') ? '' : emp.photo);
    setCompetencies(emp.competencies);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPhoto = photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
    
    if (editingId) {
      updateEmployee(editingId, { name, role, photo: finalPhoto, competencies });
    } else {
      addEmployee({ name, role, photo: finalPhoto, competencies });
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    // Reset form
    setName('');
    setRole('');
    setPhoto('');
    setCompetencies(['Geral']);
  };

  const confirmDelete = () => {
    if (deletingId) {
      removeEmployee(deletingId);
      setDeletingId(null);
    }
  };

  const toggleCompetency = (comp: Competency) => {
    if (competencies.includes(comp)) {
      setCompetencies(competencies.filter(c => c !== comp));
    } else {
      setCompetencies([...competencies, comp]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Colaboradores</h1>
        {userRole === 'admin' && (
          <button
            onClick={handleAddClick}
            className="flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Colaborador
          </button>
        )}
      </div>

      <div className="flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar colaboradores..."
          className="ml-2 block w-full border-0 p-0 text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEmployees.map((employee) => {
          const hasActiveLoans = activeLoans.some(loan => loan.employeeId === employee.id);
          return (
          <div key={employee.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            {userRole === 'admin' && (
              <div className="absolute right-2 top-2 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100 z-10">
                <button onClick={() => handleEditClick(employee)} className="rounded-full border border-slate-100 bg-white p-1.5 text-slate-400 shadow-sm hover:text-amber-500">
                  <Pencil className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setDeletingId(employee.id)} 
                  disabled={hasActiveLoans}
                  title={hasActiveLoans ? "Não é possível excluir colaborador com empréstimos ativos" : "Excluir"}
                  className={`rounded-full border border-slate-100 bg-white p-1.5 shadow-sm ${hasActiveLoans ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-red-500'}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-slate-50">
                  <Image src={employee.photo} alt={employee.name} fill className="object-cover" unoptimized />
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-slate-900">{employee.name}</h3>
                <p className="text-sm text-slate-500">{employee.role}</p>
              </div>
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Competências</h4>
                <div className="flex flex-wrap gap-1">
                  {employee.competencies.map(comp => (
                    <span key={comp} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          );
        })}
        {filteredEmployees.length === 0 && (
          <div className="col-span-full p-6 text-center text-sm text-slate-500">Nenhum colaborador encontrado.</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 sm:p-0" onClick={() => setIsModalOpen(false)}>
          <div className="relative w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">
                    {editingId ? 'Editar Colaborador' : 'Adicionar Novo Colaborador'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
                      <input required type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Função / Cargo</label>
                      <input required type="text" value={role} onChange={e => setRole(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">URL da Foto (Opcional)</label>
                      <input type="url" value={photo} onChange={e => setPhoto(e.target.value)} placeholder="Deixe em branco para gerar avatar" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Competências / Treinamentos</label>
                      <div className="flex flex-wrap gap-2">
                        {ALL_COMPETENCIES.map(comp => (
                          <button
                            key={comp}
                            type="button"
                            onClick={() => toggleCompetency(comp)}
                            className={`rounded-full px-3 py-1 text-xs font-medium border ${competencies.includes(comp) ? 'bg-amber-100 border-amber-500 text-amber-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                          >
                            {comp}
                          </button>
                        ))}
                      </div>
                      {competencies.length === 0 && <p className="text-xs text-red-500 mt-1">Selecione ao menos uma competência.</p>}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button disabled={competencies.length === 0} type="submit" className="inline-flex w-full justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-base font-medium text-slate-900 shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                    Salvar
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancelar
                  </button>
                </div>
              </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 sm:p-0" onClick={() => setDeletingId(null)}>
          <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-2 text-center text-lg font-medium text-slate-900">Excluir Colaborador</h3>
            <p className="mb-6 text-center text-sm text-slate-500">
              Tem certeza que deseja remover este colaborador? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center space-x-3">
              <button onClick={() => setDeletingId(null)} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
