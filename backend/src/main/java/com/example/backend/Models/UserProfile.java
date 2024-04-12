package com.example.backend.Models;

import java.io.StringReader;

import org.bson.Document;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    
    Integer profileId; // PK

    Integer testsCompleted;
    Integer timeSpentTyping;
    Integer currentStreak; // Consecutive days doing at least 1 test.
    String selectedTheme;
    Boolean hasPremium;

    Integer userId; // FK

    public JsonObject toJson() {
        return Json.createObjectBuilder()
            .add("profileId", getProfileId())
            .add("testsCompleted", getTestsCompleted())
            .add("timeSpentTyping", getTimeSpentTyping())
            .add("currentStreak", getCurrentStreak())
            .add("selectedTheme", getSelectedTheme())
            .add("hasPremium", getHasPremium())
            .add("userId", getUserId())
            .build();
    }

    public static UserProfile toUserProfile(Document document) {
        UserProfile userProfile = new UserProfile();
        userProfile.setProfileId(document.getInteger("profileId"));
        userProfile.setTestsCompleted(document.getInteger("testsCompleted"));
        userProfile.setTimeSpentTyping(document.getInteger("timeSpentTyping"));
        userProfile.setCurrentStreak(document.getInteger("currentStreak"));
        userProfile.setSelectedTheme(document.getString("selectedTheme"));
        userProfile.setHasPremium(document.getBoolean("hasPremium"));
        userProfile.setUserId(document.getInteger("userId"));

        return userProfile;
    }   

}
