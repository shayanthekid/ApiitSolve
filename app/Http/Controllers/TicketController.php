<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->isAdmin()) {
            $tickets = Ticket::with('requester', 'agent')->latest()->get();
        } elseif ($user->isAgent()) {
            $tickets = Ticket::with('requester', 'agent')->where('assigned_to', $user->id)->latest()->get();
        } else {
            $tickets = $user->tickets()->with('agent')->latest()->get();
        }

        return Inertia::render('Dashboard', [
            'tickets' => $tickets
        ]);
    }

    public function create()
    {
        return Inertia::render('Tickets/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'priority' => 'required|in:Low,Medium,High',
            'description' => 'required|string',
        ]);

        $ticket = Auth::user()->tickets()->create([
            'subject' => $validated['subject'],
            'category' => $validated['category'],
            'priority' => $validated['priority'],
            'description' => $validated['description'],
            'status' => 'Open'
        ]);

        return redirect()->route('tickets.show', $ticket)
            ->with('success', 'Ticket created successfully.');
    }

    public function show(Ticket $ticket)
    {
        $user = Auth::user();
        
        // Protect viewing restrictions
        if ($user->isStudent() && $ticket->user_id !== $user->id) {
            abort(403);
        } elseif ($user->isAgent() && $ticket->assigned_to !== $user->id) {
            abort(403, 'Ticket is not assigned to you.');
        }

        $ticket->load(['requester', 'agent', 'replies.author']);

        $staff = [];
        if ($user->isAdmin()) {
            $staff = \App\Models\User::whereIn('role', ['admin', 'it_agent'])->get(['id', 'name', 'role']);
        }

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket,
            'staff' => $staff
        ]);
    }

    public function assign(Request $request, Ticket $ticket)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Only admins can assign tickets.');
        }

        $validated = $request->validate([
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        $ticket->update(['assigned_to' => $validated['assigned_to']]);

        return back()->with('success', 'Ticket assigned successfully.');
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $user = Auth::user();
        
        if ($user->isStudent()) {
            // Students can only transition their own ticket to Open
            if ($ticket->user_id !== $user->id || $request->status !== 'Open') {
                abort(403);
            }
        } elseif (!$user->isAdmin() && !$user->isAgent()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:Open,In Progress,Waiting on User,Resolved'
        ]);

        $ticket->update(['status' => $validated['status']]);

        // Auto-assign to the agent who changed the status if it's currently unassigned
        if ($ticket->assigned_to === null && in_array($validated['status'], ['In Progress', 'Resolved'])) {
            $ticket->update(['assigned_to' => $user->id]);
        }

        return back()->with('success', 'Status updated successfully.');
    }
}
