<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $notifications,
            'count' => $notifications->count(),
        ]);
    }

    /**
     * Get unread notifications for the authenticated user
     */
    public function getUnread(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->where('read', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $notifications,
            'count' => $notifications->count(),
        ]);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        try {
            $notification = Notification::find($id);
            
            if (!$notification) {
                return response()->json(['message' => 'Notification not found'], 404);
            }

            // Check if the notification belongs to the authenticated user
            if ($notification->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $notification->update([
                'read' => true,
                'read_at' => now(),
            ]);

            return response()->json([
                'message' => 'Notification marked as read',
                'data' => $notification,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error marking notification as read', [
                'notification_id' => $id,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['message' => 'Error updating notification'], 500);
        }
    }

    /**
     * Mark all notifications as read for the authenticated user
     */
    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('read', false)
            ->update([
                'read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    /**
     * Delete a notification
     */
    public function delete(Request $request, $id)
    {
        try {
            \Log::info('Delete notification request', [
                'notification_id' => $id,
                'user_id' => $request->user()->id,
            ]);

            $notification = Notification::find($id);
            
            if (!$notification) {
                \Log::warning('Notification not found', ['notification_id' => $id]);
                return response()->json(['message' => 'Notification not found'], 404);
            }

            // Check if the notification belongs to the authenticated user
            if ($notification->user_id !== $request->user()->id) {
                \Log::warning('Unauthorized notification delete attempt', [
                    'notification_id' => $notification->id,
                    'notification_user_id' => $notification->user_id,
                    'requesting_user_id' => $request->user()->id,
                ]);
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $notification->delete();

            \Log::info('Notification deleted successfully', ['notification_id' => $id]);

            return response()->json([
                'message' => 'Notification deleted',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error deleting notification', [
                'notification_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Error deleting notification'], 500);
        }
    }

    /**
     * Delete all notifications for the authenticated user
     */
    public function deleteAll(Request $request)
    {
        try {
            $deleted = Notification::where('user_id', $request->user()->id)->delete();

            return response()->json([
                'message' => 'All notifications deleted',
                'deleted_count' => $deleted,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error deleting all notifications', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['message' => 'Error deleting notifications'], 500);
        }
    }
}
