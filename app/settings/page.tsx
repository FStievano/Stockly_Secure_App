'use client';
import { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { AlertTriangle, Database, Trash2, Shield, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SettingsPage() {
  const { userRole, resetDatabase, adminRequests, approveAdminRequest, rejectAdminRequest } = useAppContext();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (userRole !== 'admin') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-lg font-medium text-slate-900">Acesso Negado</h2>
          <p className="mt-2 text-sm text-slate-500">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  const handleReset = async () => {
    setIsResetting(true);
    setMessage(null);
    const result = await resetDatabase();
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setIsResetting(false);
    if (result.success) {
      setIsResetModalOpen(false);
    }
  };

  const handleApprove = async (id: string, userId: string) => {
    const result = await approveAdminRequest(id, userId);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
  };

  const handleReject = async (id: string) => {
    const result = await rejectAdminRequest(id);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
  };

  const pendingRequests = adminRequests.filter(req => req.status === 'pending');
  const historyRequests = adminRequests.filter(req => req.status !== 'pending');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
      </div>

      {message && (
        <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Admin Requests Section */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-900">Solicitações de Acesso Admin</h3>
              <p className="text-sm text-slate-500 mt-1">Gerencie os usuários que solicitaram privilégios de administrador.</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h4 className="text-base font-medium text-slate-900 mb-4">Solicitações Pendentes</h4>
          {pendingRequests.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
              <Shield className="mx-auto h-8 w-8 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">Nenhuma solicitação</h3>
              <p className="mt-1 text-sm text-slate-500">Não há solicitações de acesso pendentes no momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 shadow-sm">
                  <div>
                    <p className="font-medium text-slate-900">{request.email}</p>
                    <p className="text-sm text-slate-500">
                      Solicitado em {format(new Date(request.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(request.id, request.userId)}
                      className="inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {historyRequests.length > 0 && (
            <div className="mt-8">
              <h4 className="text-base font-medium text-slate-900 mb-4">Histórico</h4>
              <div className="space-y-3">
                {historyRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{request.email}</p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(request.createdAt), "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {request.status === 'approved' ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Aprovado
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Rejeitado
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-100 bg-red-50 p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-900">Zona de Perigo</h3>
              <p className="text-sm text-red-700 mt-1">Ações destrutivas que afetam todo o sistema.</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium text-slate-900">Resetar Banco de Dados</h4>
              <p className="text-sm text-slate-500 mt-1">
                Esta ação irá excluir permanentemente todos os colaboradores, ferramentas e movimentações.
                As contas de usuário e solicitações de acesso não serão afetadas.
              </p>
            </div>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="ml-4 flex-shrink-0 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Resetar Dados
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 sm:p-0" onClick={() => !isResetting && setIsResetModalOpen(false)}>
          <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-2 text-center text-lg font-medium text-slate-900">Resetar Banco de Dados</h3>
            <p className="mb-6 text-center text-sm text-slate-500">
              Tem certeza absoluta que deseja resetar o banco de dados? 
              <br/><br/>
              <strong>Esta ação é irreversível</strong> e apagará todos os registros de ferramentas, colaboradores e movimentações.
            </p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={() => setIsResetModalOpen(false)} 
                disabled={isResetting}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleReset} 
                disabled={isResetting}
                className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {isResetting ? 'Resetando...' : 'Sim, Resetar Tudo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
