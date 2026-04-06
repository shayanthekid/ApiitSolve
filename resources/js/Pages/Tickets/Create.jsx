import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        category: 'General',
        priority: 'Medium',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tickets.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold leading-tight text-slate-800 tracking-tight">Submit a New Request</h2>}
        >
            <Head title="New Ticket" />

            <div className="bg-white shadow-sm border border-slate-200 sm:rounded-xl overflow-hidden max-w-3xl mx-auto">
                <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            value={data.subject}
                            onChange={e => setData('subject', e.target.value)}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm text-slate-900"
                            placeholder="Briefly describe the issue..."
                        />
                        <InputError message={errors.subject} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
                            <select
                                id="category"
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm text-slate-900"
                            >
                                <option value="General">General</option>
                                <option value="Network">Network & Internet</option>
                                <option value="Accounts">Accounts & Access</option>
                                <option value="Hardware">Hardware Issue</option>
                                <option value="Software">Software & Services</option>
                                <option value="Facilities">Facilities</option>
                            </select>
                            <InputError message={errors.category} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-slate-700">Priority</label>
                            <select
                                id="priority"
                                value={data.priority}
                                onChange={e => setData('priority', e.target.value)}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm text-slate-900"
                            >
                                <option value="Low">Low - Not urgent</option>
                                <option value="Medium">Medium - Normal severity</option>
                                <option value="High">High - Critical impact</option>
                            </select>
                            <InputError message={errors.priority} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Detailed Description</label>
                        <textarea
                            id="description"
                            rows={5}
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm text-slate-900"
                            placeholder="Please provide as much information as possible."
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-colors"
                        >
                            Submit Ticket
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
