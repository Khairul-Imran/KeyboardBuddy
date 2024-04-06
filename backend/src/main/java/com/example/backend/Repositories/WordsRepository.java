package com.example.backend.Repositories;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.Models.WordStore;

@Repository
public class WordsRepository {

    @Autowired MongoTemplate mongoTemplate;

    // Time-based tests
    public List<WordStore> getEasyWordsRandomised() {
        int limit = 100; // Manually setting limit.
        long wordCount = mongoTemplate.estimatedCount("easywords");
        int randomSkipPoint = (int) (Math.random() * (wordCount - limit));

        Query query = new Query();
        query.skip(randomSkipPoint).limit(limit);

        List<WordStore> retrievedWords = mongoTemplate.find(query, Document.class, "easywords")
            .stream()
            .map(w -> WordStore.fromJson(w))
            .toList();
        
        List<WordStore> words = new ArrayList<>(retrievedWords);
        
        Collections.shuffle(words);
        return words;
    }

    public List<WordStore> getHardWordsRandomised() {
        int limit = 80; // Manually setting limit
        long wordCount = mongoTemplate.estimatedCount("hardwords");
        int randomSkipPoint = (int) (Math.random() * (wordCount - limit));

        Query query = new Query();
        query.skip(randomSkipPoint).limit(limit);

        List<WordStore> retrievedWords = mongoTemplate.find(query, Document.class, "hardwords")
            .stream()
            .map(w -> WordStore.fromJson(w))
            .toList();
        
        List<WordStore> words = new ArrayList<>(retrievedWords);

        Collections.shuffle(words);
        return words;
    }


    // Words-based tests
    // Allow user to do tests based on wordcount too. 10 / 15 / 20 / 40 etc.
    // Have each query have a limit chosen by the user
    public List<WordStore> getEasyWordsRandomisedLimited(Integer limit) {
        long wordCount = mongoTemplate.estimatedCount("easywords");
        int randomSkipPoint = (int) (Math.random() * (wordCount - limit));

        Query query = new Query();
        query.skip(randomSkipPoint).limit(limit);

        List<WordStore> retrievedWords = mongoTemplate.find(query, Document.class, "easywords")
            .stream()
            .map(w -> WordStore.fromJson(w))
            .toList();

        List<WordStore> words = new ArrayList<>(retrievedWords);
        
        Collections.shuffle(words);
        return words;
    }

    public List<WordStore> getHardWordsRandomisedLimited(Integer limit) {
        long wordCount = mongoTemplate.estimatedCount("hardwords");
        int randomSkipPoint = (int) (Math.random() * (wordCount - limit));

        Query query = new Query();
        query.skip(randomSkipPoint).limit(limit);

        List<WordStore> retrievedWords = mongoTemplate.find(query, Document.class, "hardwords")
            .stream()
            .map(w -> WordStore.fromJson(w))
            .toList();

        List<WordStore> words = new ArrayList<>(retrievedWords);

        Collections.shuffle(words);
        return words;
    }
    
}
