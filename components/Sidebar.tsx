'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wrench, Users, ArrowRightLeft, LayoutDashboard, LogOut, ShieldAlert, ShieldQuestion, ClipboardList, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

import { useAppContext } from '@/lib/AppContext';

export function Sidebar() {
  const pathname = usePathname();
  const { user, userRole, requestAdminAccess, adminRequests } = useAppContext();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Ferramentas', href: '/tools', icon: Wrench },
    { name: 'Colaboradores', href: '/employees', icon: Users },
    { name: 'Movimentações', href: '/movements', icon: ArrowRightLeft },
    { name: 'Em Uso', href: '/in-use-tools', icon: ClipboardList },
  ];

  if (userRole === 'admin') {
    navItems.push({ name: 'Configurações', href: '/settings', icon: Settings });
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const pendingRequest = adminRequests.find(r => r.userId === user?.uid && r.status === 'pending');

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-slate-300">
      <div className="flex h-16 items-center justify-center border-b border-slate-800 bg-amber-500 text-slate-900">
        <Wrench className="mr-2 h-6 w-6" />
        <span className="text-xl font-bold uppercase tracking-wider">Stockly</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                isActive
                  ? 'bg-slate-800 text-amber-500'
                  : 'hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon
                className={clsx(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-white'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-4">
        <div className="mb-4 px-2">
          <p className="truncate text-sm font-medium text-white" title={user?.email || ''}>
            {user?.email}
          </p>
          <p className="text-xs text-slate-400">
            {userRole === 'admin' ? 'Administrador' : 'Usuário Padrão'}
          </p>
        </div>
        
        {userRole === 'user' && (
          <button
            onClick={requestAdminAccess}
            disabled={!!pendingRequest}
            className="group mb-2 flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-amber-500 hover:bg-slate-800 hover:text-amber-400 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ShieldQuestion className="mr-3 h-5 w-5 flex-shrink-0" />
            {pendingRequest ? 'Solicitação Pendente' : 'Solicitar Admin'}
          </button>
        )}

        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-white" />
          Sair
        </button>
      </div>
    </div>
  );
}
