package com.example.backend.Models;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Quote {
    
    String quote;
    String author;

    public JsonObject toJson() {
        return Json.createObjectBuilder()
            .add("quote", getQuote())
            .add("author", getAuthor())
            .build();
    }
}