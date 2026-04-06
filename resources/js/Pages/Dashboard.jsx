import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ tickets }) {
    const { auth } = usePage().props;
    const isStudent = auth.user.role === 'student';

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-orange-100 text-orange-800';
            case 'Waiting on User': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-slate-800 tracking-tight">
                    {isStudent ? 'My Tickets' : 'All Tickets'}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="bg-white shadow-sm border border-slate-200 sm:rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold">Subject</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Priority</th>
                                {!isStudent && <th className="px-6 py-4 font-semibold">Requester</th>}
                                <th className="px-6 py-4 font-semibold">Assigned To</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm flex-1">
                            {(!tickets || tickets.length === 0) ? (
                                <tr>
                                    <td colSpan={isStudent ? 6 : 7} className="px-6 py-12 text-center text-slate-500 bg-white">
                                        <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-semibold text-slate-900">No tickets</h3>
                                        <p className="mt-1 text-sm text-slate-500">Get started by creating a new request.</p>
                                    </td>
                                </tr>
                            ) : (
                                tickets.map(ticket => (
                                    <tr key={ticket.id} className="hover:bg-slate-50 transition-colors group bg-white">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            <Link href={route('tickets.show', ticket.id)}>
                                                {ticket.subject}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{ticket.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        {!isStudent && (
                                            <td className="px-6 py-4 text-slate-500">{ticket.requester?.name}</td>
                                        )}
                                        <td className="px-6 py-4 text-slate-500">
                                            {ticket.agent ? ticket.agent.name : <span className="text-slate-400 italic">Unassigned</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={route('tickets.show', ticket.id)} className="text-brand-600 hover:text-brand-800 font-medium text-sm transition-colors lg:opacity-0 lg:group-hover:opacity-100">
                                                View <span aria-hidden="true">&rarr;</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
