package com.example.backend.Controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Models.Word;
import com.example.backend.Services.WordsService;

import jakarta.json.Json;

@RestController
@RequestMapping("/api/words")
public class WordsController {
    
    @Autowired
    private WordsService wordsService;

    @GetMapping
    public ResponseEntity<String> getWords(
        @RequestParam String testType, 
        @RequestParam String testDifficulty, 
        @RequestParam(required = false) Integer limit) {
            
        List<Word> words = new ArrayList<>();
            
        if (testType.equalsIgnoreCase("time")) { // Time-based tests
            if (testDifficulty.equalsIgnoreCase("easy")) {
                words = wordsService.getEasyWords();
            } else {
                words = wordsService.getHardWords();
            }            
        } else { // Word-based tests
            if (testDifficulty.equalsIgnoreCase("easy")) {
                words = wordsService.getEasyWordsLimited(limit);
            } else {
                words = wordsService.getHardWordsLimited(limit);
            }
        }
            
        String wordsFormatted = String.join(" ", words.stream()
            .map(Word::getWord)
            .collect(Collectors.toList()));
            
        if (wordsFormatted.isEmpty()) {
            return ResponseEntity.status(404).body(
                Json.createObjectBuilder().add("Message: ", "Cannot get words.").build().toString()
                );
            }
                
        return ResponseEntity.ok(wordsFormatted);
    }
            
            // // Time-based tests
            // @GetMapping(path = "/easy-time")
            // public ResponseEntity<String> getEasyWords() {
            //     List<Word> words = wordsService.getEasyWords();
        
            //     String wordsFormatted = String.join(" ", words.stream()
            //         .map(Word::getWord)
            //         .collect(Collectors.toList()));
        
            //     if (wordsFormatted.isEmpty()) {
            //         return ResponseEntity.status(404).body(
            //             Json.createObjectBuilder().add("Message: ", "Cannot get easy words.").build().toString()
            //         );
            //     }
                
            //     return ResponseEntity.ok(wordsFormatted);
            // }
        
            // @GetMapping(path = "/hard")
            // public ResponseEntity<String> getHardWords() {
            //     List<Word> words = wordsService.getHardWords();
        
            //     String wordsFormatted = String.join(" ", words.stream()
            //         .map(Word::getWord)
            //         .collect(Collectors.toList()));
        
            //     if (wordsFormatted.isEmpty()) {
            //         return ResponseEntity.status(404).body(
            //             Json.createObjectBuilder().add("Message: ", "Cannot get hard words.").build().toString()
            //         );
            //     }
                
            //     return ResponseEntity.ok(wordsFormatted);
            // }
}
