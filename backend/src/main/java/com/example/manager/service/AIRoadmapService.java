package com.example.manager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class AIRoadmapService {

    private static final Logger logger = LoggerFactory.getLogger(AIRoadmapService.class);
    
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final Random random = new Random();

    public AIRoadmapService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String generateRoadmap(String taskTitle, String taskDescription, String priority) {
        try {
            String prompt = buildPrompt(taskTitle, taskDescription, priority);
            String aiResponse = callGeminiAPI(prompt);
            
            if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                return formatAIResponse(aiResponse, taskTitle, priority);
            } else {
                logger.warn("AI API failed, using fallback implementation");
                return generateMockRoadmap(taskTitle, taskDescription, priority);
            }
        } catch (Exception e) {
            logger.error("Error generating AI roadmap: ", e);
            return generateMockRoadmap(taskTitle, taskDescription, priority);
        }
    }

    private String buildPrompt(String taskTitle, String taskDescription, String priority) {
        return String.format(
            "Create a detailed task roadmap for: %s. Description: %s. Priority: %s. Include steps, timeline, tips, and success metrics.",
            taskTitle, taskDescription, priority
        );
    }

    private String callGeminiAPI(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", Arrays.asList(part));
            requestBody.put("contents", Arrays.asList(content));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(geminiApiUrl, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return extractTextFromResponse(response.getBody());
            }
            return null;
        } catch (Exception e) {
            logger.error("Error calling Gemini API: ", e);
            return null;
        }
    }

    private String extractTextFromResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText();
                }
            }
            return null;
        } catch (Exception e) {
            logger.error("Error parsing Gemini API response: ", e);
            return null;
        }
    }

    private String formatAIResponse(String aiResponse, String taskTitle, String priority) {
        return String.format("🎯 AI-Generated Task Roadmap\n\n📋 Task: %s\n🔥 Priority: %s\n\n%s", 
                           taskTitle, priority, aiResponse);
    }

    private String generateMockRoadmap(String taskTitle, String taskDescription, String priority) {
        StringBuilder roadmap = new StringBuilder();
        roadmap.append("🎯 Task Roadmap\n\n");
        roadmap.append("📋 Task: ").append(taskTitle).append("\n");
        roadmap.append("🔥 Priority: ").append(priority).append("\n\n");
        roadmap.append("📈 Steps:\n");
        roadmap.append("1. Break down the task\n");
        roadmap.append("2. Create action plan\n");
        roadmap.append("3. Execute systematically\n");
        roadmap.append("4. Monitor progress\n");
        roadmap.append("5. Complete and review\n");
        return roadmap.toString();
    }

    public String regenerateRoadmap(String taskTitle, String taskDescription, String priority) {
        return "🔄 UPDATED " + generateRoadmap(taskTitle, taskDescription, priority);
    }
}
