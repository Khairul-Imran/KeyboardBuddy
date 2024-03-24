package com.example.backend.Models;

import lombok.Data;

import org.bson.Document;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestLetter {

    char letter;
    Boolean correct;

    public JsonObject toJson() {
        return Json.createObjectBuilder()
            .add("letter", getLetter())
            .add("correct", getCorrect())
            .build();
    }

    public static TestLetter fromJson(Document document) {
        TestLetter letter = new TestLetter();
        letter.setLetter(document.getString("letter").charAt(0));
        letter.setCorrect(document.getBoolean("correct"));

        return letter;
    }

}
