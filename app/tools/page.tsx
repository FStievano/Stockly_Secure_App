'use client';
import { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Plus, Search, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { Competency, Tool } from '@/lib/types';

const ALL_COMPETENCIES: Competency[] = ['NR-10', 'NR-12', 'NR-35', 'Geral', 'Operação de Empilhadeira', 'Soldagem'];

export default function ToolsPage() {
  const { tools, addTool, updateTool, removeTool, userRole, activeLoans } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredCompetencies, setRequiredCompetencies] = useState<Competency[]>(['Geral']);
  const [totalQuantity, setTotalQuantity] = useState(1);

  const filteredTools = tools.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddClick = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setRequiredCompetencies(['Geral']);
    setTotalQuantity(1);
    setIsModalOpen(true);
  };

  const handleEditClick = (tool: Tool) => {
    setEditingId(tool.id);
    setName(tool.name);
    setDescription(tool.description);
    setRequiredCompetencies(tool.requiredCompetencies);
    setTotalQuantity(tool.totalQuantity);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTool(editingId, { name, description, requiredCompetencies, totalQuantity });
    } else {
      addTool({ name, description, requiredCompetencies, totalQuantity });
    }
    setIsModalOpen(false);
    setEditingId(null);
    // Reset form
    setName('');
    setDescription('');
    setRequiredCompetencies(['Geral']);
    setTotalQuantity(1);
  };

  const confirmDelete = () => {
    if (deletingId) {
      removeTool(deletingId);
      setDeletingId(null);
    }
  };

  const toggleCompetency = (comp: Competency) => {
    if (requiredCompetencies.includes(comp)) {
      setRequiredCompetencies(requiredCompetencies.filter(c => c !== comp));
    } else {
      setRequiredCompetencies([...requiredCompetencies, comp]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Ferramentas</h1>
        {userRole === 'admin' && (
          <button
            onClick={handleAddClick}
            className="flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Ferramenta
          </button>
        )}
      </div>

      <div className="flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar ferramentas..."
          className="ml-2 block w-full border-0 p-0 text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Competências Exigidas</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Disponível / Total</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              {userRole === 'admin' && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Ações</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredTools.map((tool) => {
              const hasActiveLoans = activeLoans.some(loan => loan.toolId === tool.id);
              const isDeleteDisabled = tool.availableQuantity < tool.totalQuantity || hasActiveLoans;
              return (
              <tr key={tool.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{tool.name}</div>
                  <div className="text-sm text-slate-500">{tool.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {tool.requiredCompetencies.map(comp => (
                      <span key={comp} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                        {comp}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  <span className="font-medium text-slate-900">{tool.availableQuantity}</span> / {tool.totalQuantity}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {tool.availableQuantity > 0 ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Disponível
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Em uso
                    </span>
                  )}
                </td>
                {userRole === 'admin' && (
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => handleEditClick(tool)} className="text-slate-400 hover:text-amber-500 mr-3">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setDeletingId(tool.id)} 
                      disabled={isDeleteDisabled}
                      title={isDeleteDisabled ? "Não é possível excluir ferramenta em uso" : "Excluir"}
                      className={`text-slate-400 ${isDeleteDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:text-red-500'}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
              );
            })}
          </tbody>
        </table>
        {filteredTools.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-500">Nenhuma ferramenta encontrada.</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 sm:p-0" onClick={() => setIsModalOpen(false)}>
          <div className="relative w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">
                    {editingId ? 'Editar Ferramenta' : 'Adicionar Nova Ferramenta'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Nome</label>
                      <input required type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Descrição</label>
                      <textarea required value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm" rows={3}></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Quantidade Total</label>
                      <input required type="number" min="1" value={totalQuantity} onChange={e => setTotalQuantity(parseInt(e.target.value))} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Competências Exigidas</label>
                      <div className="flex flex-wrap gap-2">
                        {ALL_COMPETENCIES.map(comp => (
                          <button
                            key={comp}
                            type="button"
                            onClick={() => toggleCompetency(comp)}
                            className={`rounded-full px-3 py-1 text-xs font-medium border ${requiredCompetencies.includes(comp) ? 'bg-amber-100 border-amber-500 text-amber-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                          >
                            {comp}
                          </button>
                        ))}
                      </div>
                      {requiredCompetencies.length === 0 && <p className="text-xs text-red-500 mt-1">Selecione ao menos uma competência (ex: Geral).</p>}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button disabled={requiredCompetencies.length === 0} type="submit" className="inline-flex w-full justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-base font-medium text-slate-900 shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
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
            <h3 className="mb-2 text-center text-lg font-medium text-slate-900">Excluir Ferramenta</h3>
            <p className="mb-6 text-center text-sm text-slate-500">
              Tem certeza que deseja remover esta ferramenta? Esta ação não pode ser desfeita.
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
