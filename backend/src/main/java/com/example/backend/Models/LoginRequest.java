package com.example.backend.Models;

import java.io.StringReader;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    @NotBlank(message = "Email is required.")
    @Email(message = "Valid email format is required.")
    String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 5, max = 10, message = "Password must be between 5 and 10 characters long.")
    String password;

    // Not really using this....
    public JsonObject toJson() {
        return Json.createObjectBuilder()
            .add("email", getEmail())
            .add("password", getPassword())
            .build();
    }

    public static LoginRequest toLoginRequest(String stringLoginRequest) {
        JsonReader reader = Json.createReader(new StringReader(stringLoginRequest));
        JsonObject json = reader.readObject();

        return new LoginRequest(json.getString("email"), json.getString("password"));
    }

}
