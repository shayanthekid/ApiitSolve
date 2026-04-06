import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 bg-white border-r border-slate-200 transition-all duration-300 hidden md:flex flex-col`}>
                <div className="h-16 flex items-center justify-center border-b border-slate-200 flex-shrink-0">
                    <Link href="/" className="flex items-center justify-center overflow-hidden">
                        <ApplicationLogo className="block h-8 w-auto fill-current text-brand-600" />
                        {sidebarOpen && <span className="ml-3 font-bold text-xl tracking-tight text-slate-800">Helpdesk</span>}
                    </Link>
                </div>
                <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
                    <NavLink href={route('dashboard')} active={route().current('dashboard')} className={sidebarOpen ? 'px-3 py-2' : 'justify-center px-0 py-2'} title="Dashboard">
                        <svg className={`w-5 h-5 shrink-0 ${sidebarOpen ? 'mr-3' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        {sidebarOpen && 'Dashboard'}
                    </NavLink>
                    {user.role === 'student' && (
                        <NavLink href={route('tickets.create')} active={route().current('tickets.create')} className={sidebarOpen ? 'px-3 py-2' : 'justify-center px-0 py-2'} title="New Ticket">
                            <svg className={`w-5 h-5 shrink-0 ${sidebarOpen ? 'mr-3' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            {sidebarOpen && 'New Ticket'}
                        </NavLink>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-700 hidden md:block mr-4 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        
                        {/* Global Search Placeholder */}
                        <div className="relative ml-2 sm:ml-0 hidden sm:block w-64 lg:w-96">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors text-slate-900" placeholder="Search tickets..." />
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md cursor-pointer group">
                                    <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-semibold rounded-md text-slate-700 bg-white group-hover:text-brand-600 focus:outline-none transition ease-in-out duration-150">
                                        {user.name}
                                        <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                                    <p className="text-xs text-slate-500 uppercase font-semibold">{user.role}</p>
                                </div>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {header && (
                        <div className="mb-6 flex justify-between items-end">
                            {header}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
