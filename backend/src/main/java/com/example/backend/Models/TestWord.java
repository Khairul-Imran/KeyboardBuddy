package com.example.backend.Models;

import lombok.Data;
import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestWord {
    
    TestLetter[] letters;
    Boolean fullyCorrect;

    public JsonObject toJson() {
        JsonObjectBuilder testWordJsonObjectBuilder = Json.createObjectBuilder();

        JsonArrayBuilder jsonLettersArrayBuilder = Json.createArrayBuilder();
        for (TestLetter letter : letters) {
            JsonObject letterJson = Json.createObjectBuilder()
                .add("letter", letter.getLetter())
                .build();
            
            jsonLettersArrayBuilder.add(letterJson);
        }

        JsonArray jsonLettersArray = jsonLettersArrayBuilder.build();

        testWordJsonObjectBuilder.add("letters", jsonLettersArray);
        testWordJsonObjectBuilder.add("fullyCorrect", getFullyCorrect());

        return testWordJsonObjectBuilder.build();
    }

    // Might not need to bother with a fromJson here.

}
