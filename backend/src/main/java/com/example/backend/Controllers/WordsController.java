package com.example.backend.Controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Models.WordStore;
import com.example.backend.Services.WordsService;

import jakarta.json.Json;
import jakarta.json.JsonObject;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "https://quaint-jar-production.up.railway.app/", "https://keyboardbuddy.khairul-imran.dev"})
@RequestMapping("/api/words")
public class WordsController {
    
    @Autowired
    private WordsService wordsService;

    @GetMapping
    public ResponseEntity<String> getWords(
        @RequestParam String testType, 
        @RequestParam String testDifficulty, 
        @RequestParam(required = false) Integer limit) {
            
        List<WordStore> words = new ArrayList<>();
            
        if (testType.equalsIgnoreCase("time")) { // Time-based tests
            if (testDifficulty.equalsIgnoreCase("easy")) {
                words = wordsService.getEasyWords();
                System.out.println("Generating easy words time");
            } else {
                words = wordsService.getHardWords();
                System.out.println("Generating hard words time");
            }            
        } else { // Word-based tests
            if (testDifficulty.equalsIgnoreCase("easy")) {
                words = wordsService.getEasyWordsLimited(limit);
                System.out.println("Generating easy words limited");
            } else {
                words = wordsService.getHardWordsLimited(limit);
                System.out.println("Generating hard words limited");
            }
        }
            
        // JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        // words.stream()
        //     .map(Word::getWord)
        //     .forEach(arrayBuilder::add);
        
        String wordsFormatted = String.join(" ", words.stream()
            .map(WordStore::getWord)
            .collect(Collectors.toList()));
        
        JsonObject wordsFormattedToJsonObject = Json.createObjectBuilder()
            .add("words", wordsFormatted)
            .build();
        
        // JsonArrayBuilder wordsFormattedToJsonArray = Json.createArrayBuilder();


        if (wordsFormattedToJsonObject.isEmpty()) {
            return ResponseEntity.status(404).body(
                Json.createObjectBuilder().add("Message: ", "Cannot get words.").build().toString()
            );
        }
                
        return ResponseEntity.ok(wordsFormattedToJsonObject.toString());
    }
            
}
