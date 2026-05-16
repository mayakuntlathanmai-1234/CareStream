package com.carestream.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${ALLOWED_ORIGINS:http://localhost:5173}")
    private String allowedOrigins;


    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple memory-based message broker
        // /topic is for broadcasting to multiple subscribers (e.g. global notifications)
        // /queue is for sending messages to a specific user
        config.enableSimpleBroker("/topic", "/queue");
        
        // Prefix for messages sent from client to server (e.g., @MessageMapping)
        config.setApplicationDestinationPrefixes("/app");
        
        // Prefix for user-specific queues
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // The endpoint the React client will connect to: ws://localhost:8080/ws
        registry.addEndpoint("/ws")
                .setAllowedOrigins(allowedOrigins.split(","))
                .withSockJS();
    }
}
