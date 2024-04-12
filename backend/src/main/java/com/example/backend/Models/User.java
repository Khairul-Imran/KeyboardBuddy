package com.example.backend.Models;

import java.sql.Date;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    Integer userId; // PK
    Date joinedDate;
    String username;
    String email;
    String password;
    UserProfile userProfile;

    public JsonObject toJson() {

        JsonObject userProfile = this.getUserProfile().toJson();

        return Json.createObjectBuilder()
            .add("userId", getUserId())
            .add("joinedDate", getJoinedDate().getTime())
            .add("username", getUsername())
            .add("email", getEmail())
            .add("password", getPassword())
            .add("userProfile", userProfile)
            .build();
    }

}
