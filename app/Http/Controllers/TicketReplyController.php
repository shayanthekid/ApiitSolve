<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketReplyController extends Controller
{
    public function store(Request $request, Ticket $ticket)
    {
        $user = Auth::user();
        if (!$user->isAdmin() && !$user->isAgent() && $ticket->user_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $ticket->replies()->create([
            'user_id' => $user->id,
            'message' => $validated['message'],
        ]);

        // Auto update status
        if ($user->isAdmin() || $user->isAgent()) {
            // Agent replied, waiting on user
            $ticket->update(['status' => 'Waiting on User']);
            if ($ticket->assigned_to === null) {
                $ticket->update(['assigned_to' => $user->id]);
            }
        } else {
            // Student replied back
            $ticket->update(['status' => 'In Progress']); // Or 'Open'
        }

        return back()->with('success', 'Reply added.');
    }
}
