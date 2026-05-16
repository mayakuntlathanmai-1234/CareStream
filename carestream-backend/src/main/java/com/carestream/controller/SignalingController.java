package com.carestream.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SignalingController {
    
    private static final Logger logger = LoggerFactory.getLogger(SignalingController.class);

    @MessageMapping("/call/{appointmentId}")
    @SendTo("/topic/call/{appointmentId}")
    public String handleSignaling(@DestinationVariable String appointmentId, @Payload String message) {
        // Simply relay the WebRTC signaling message to all other subscribers of this appointment's topic
        logger.debug("Relaying signaling message for appointment {}: {}", appointmentId, message);
        return message;
    }
}
