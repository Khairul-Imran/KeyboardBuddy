package com.example.backend.Controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Models.Word;
import com.example.backend.Services.JsonService;
import com.example.backend.Services.WordsService;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;

@RestController
@RequestMapping("/api/words")
public class WordsController {
    
    @Autowired
    private WordsService wordsService;

    @Autowired
    private JsonService jsonService;

    // Time-based tests
    @GetMapping(path = "/easy")
    public ResponseEntity<String> getEasyWords() {
        List<Word> words = wordsService.getEasyWords();
        // JsonArray jsonWordsArray = jsonService.wordListToJson(words);
        // String jsonWordsArrayString = jsonWordsArray.toString();

        String wordsFormatted = String.join(" ", words.stream()
            .map(Word::getWord)
            .collect(Collectors.toList()));

        if (wordsFormatted.isEmpty()) {
            return ResponseEntity.status(404).body(
                Json.createObjectBuilder().add("Message: ", "Cannot get easy words.").build().toString()
            );
        }
        
        return ResponseEntity.ok(wordsFormatted);
    }

    @GetMapping(path = "/hard")
    public ResponseEntity<String> getHardWords() {
        List<Word> words = wordsService.getHardWords();
        // JsonArray jsonWordsArray = jsonService.wordListToJson(words);
        // String jsonWordsArrayString = jsonWordsArray.toString();

        String wordsFormatted = String.join(" ", words.stream()
            .map(Word::getWord)
            .collect(Collectors.toList()));

        if (wordsFormatted.isEmpty()) {
            return ResponseEntity.status(404).body(
                Json.createObjectBuilder().add("Message: ", "Cannot get hard words.").build().toString()
            );
        }
        
        return ResponseEntity.ok(wordsFormatted);
    }


    // Word-based tests

}
