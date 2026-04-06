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
        if ($user->isAdmin() || $user->isAgent()) {
            $tickets = Ticket::with('requester', 'agent')->latest()->get();
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
        if (!$user->isAdmin() && !$user->isAgent() && $ticket->user_id !== $user->id) {
            abort(403);
        }

        $ticket->load(['requester', 'agent', 'replies.author']);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket
        ]);
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $user = Auth::user();
        if (!$user->isAdmin() && !$user->isAgent()) {
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
