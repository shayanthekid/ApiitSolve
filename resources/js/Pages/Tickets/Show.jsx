import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Show({ ticket, staff = [] }) {
    const { auth } = usePage().props;
    const isStaff = auth.user.role === 'admin' || auth.user.role === 'it_agent';

    const { data: replyData, setData: setReplyData, post: postReply, processing: replyProcessing, errors: replyErrors, reset } = useForm({
        message: ''
    });

    const submitReply = (e) => {
        e.preventDefault();
        postReply(route('replies.store', ticket.id), {
            preserveScroll: true,
            onSuccess: () => reset('message')
        });
    };

    const changeStatus = (newStatus) => {
        router.patch(route('tickets.updateStatus', ticket.id), { status: newStatus }, { preserveScroll: true });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-orange-100 text-orange-800';
            case 'Waiting on User': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-bold leading-tight text-slate-800 tracking-tight">Ticket #{ticket.id}: {ticket.subject}</h2>}>
            <Head title={`Ticket #${ticket.id}`} />

            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Main Thread */}
                <div className="flex-1 space-y-6">
                    {/* Original Ticket Post */}
                    <div className="bg-white shadow-sm border border-slate-200 sm:rounded-xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
                                        {ticket.requester.name.charAt(0)}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-slate-900">{ticket.requester.name}</p>
                                        <p className="text-xs text-slate-500">Reported on {new Date(ticket.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="prose prose-sm text-slate-700 max-w-none">
                                <p className="whitespace-pre-wrap">{ticket.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Replies */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold text-slate-800">Thread</h3>
                        {ticket.replies.map(reply => (
                            <div key={reply.id} className={`flex gap-4 ${reply.user_id === auth.user.id ? 'justify-end' : ''}`}>
                                {reply.user_id !== auth.user.id && (
                                    <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                        {reply.author.name.charAt(0)}
                                    </div>
                                )}
                                <div className={`relative px-5 py-4 text-sm max-w-[85%] rounded-2xl ${reply.user_id === auth.user.id ? 'bg-brand-600 text-white rounded-br-none shadow-sm' : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-none'}`}>
                                    <div className={`text-xs mb-1 font-semibold ${reply.user_id === auth.user.id ? 'text-brand-100' : 'text-slate-500'}`}>
                                        {reply.author.name} • {new Date(reply.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                    <p className="whitespace-pre-wrap">{reply.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Form */}
                    {ticket.status !== 'Resolved' ? (
                        <div className="bg-white shadow-sm border border-slate-200 sm:rounded-xl overflow-hidden mt-6">
                            <form onSubmit={submitReply}>
                                <div className="p-4 border-b border-slate-100">
                                    <textarea
                                        rows={4}
                                        className="block w-full border-0 focus:ring-0 sm:text-sm text-slate-900 resize-none p-0"
                                        placeholder="Type your reply here..."
                                        value={replyData.message}
                                        onChange={e => setReplyData('message', e.target.value)}
                                    />
                                    <InputError message={replyErrors.message} className="mt-2" />
                                </div>
                                <div className="bg-slate-50 px-4 py-3 flex justify-between items-center sm:px-6">
                                    <p className="text-xs text-slate-500">Replies will notify all parties involved.</p>
                                    <button
                                        type="submit"
                                        disabled={replyProcessing}
                                        className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                                    >
                                        Send Reply
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        ticket.user_id === auth.user.id && (
                            <div className="bg-white shadow-sm border border-slate-200 sm:rounded-xl overflow-hidden mt-6 p-8 text-center flex flex-col items-center justify-center">
                                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">This ticket has been marked as resolved</h3>
                                <p className="text-slate-500 mb-6 max-w-md">If you are still experiencing issues related to this request, you can reopen it to continue the conversation with the support team.</p>
                                <button
                                    onClick={() => changeStatus('Open')}
                                    className="inline-flex justify-center items-center py-2 px-6 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all font-semibold"
                                >
                                    Reopen Ticket
                                </button>
                            </div>
                        )
                    )}
                </div>

                {/* Sidebar Details */}
                <div className="lg:w-80 space-y-6">
                    <div className="bg-white shadow-sm border border-slate-200 sm:rounded-xl overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                            <h3 className="text-sm font-semibold text-slate-800">Ticket Details</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Status</p>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Priority</p>
                                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800">
                                    {ticket.priority}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Category</p>
                                <p className="text-sm text-slate-900">{ticket.category}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Assigned To</p>
                                <p className="text-sm text-slate-900">{ticket.agent ? ticket.agent.name : 'Unassigned'}</p>
                            </div>
                        </div>

                        {/* Staff Actions */}
                        {isStaff && (
                            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                                <h3 className="text-xs font-semibold text-slate-800 uppercase">Agent Actions</h3>
                                <div className="space-y-2">
                                    {ticket.status !== 'Resolved' && (
                                        <button onClick={() => changeStatus('Resolved')} className="w-full text-left px-3 py-2 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-md font-medium transition-colors">
                                            ✓ Mark as Resolved
                                        </button>
                                    )}
                                    {ticket.status !== 'In Progress' && ticket.status !== 'Resolved' && (
                                        <button onClick={() => changeStatus('In Progress')} className="w-full text-left px-3 py-2 text-sm text-brand-700 bg-brand-100 hover:bg-brand-200 rounded-md font-medium transition-colors">
                                            ▶ Start Progress
                                        </button>
                                    )}
                                </div>
                                
                                {auth.user.role === 'admin' && (
                                    <div className="pt-3 border-t border-slate-200 mt-3">
                                        <h3 className="text-xs font-semibold text-slate-800 uppercase mb-2">Assign Ticket</h3>
                                        <select
                                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm text-slate-900"
                                            value={ticket.assigned_to || ''}
                                            onChange={(e) => {
                                                router.patch(route('tickets.assign', ticket.id), { assigned_to: e.target.value || null }, { preserveScroll: true });
                                            }}
                                        >
                                            <option value="">-- Unassigned --</option>
                                            {staff.map(member => (
                                                <option key={member.id} value={member.id}>
                                                    {member.name} ({member.role === 'admin' ? 'Admin' : 'IT'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
