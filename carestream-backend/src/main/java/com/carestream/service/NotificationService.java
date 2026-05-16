package com.carestream.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcasts a global notification to all connected clients (e.g., Admins)
     */
    public void broadcastGlobalNotification(String message, String type) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("message", message);
        payload.put("type", type);
        payload.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/notifications", payload);
    }

    /**
     * Sends a direct notification to a specific user (Patient or Doctor)
     */
    public void sendUserNotification(String username, String message, String type) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("message", message);
        payload.put("type", type);
        payload.put("timestamp", System.currentTimeMillis());

        // Sends to /user/{username}/queue/notifications
        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", payload);
    }
}
