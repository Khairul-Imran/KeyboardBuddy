package com.example.backend.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Models.WordStore;
import com.example.backend.Repositories.WordsRepository;

@Service
public class WordsService {
    
    @Autowired WordsRepository wordsRepository;

    // Time-based tests
    public List<WordStore> getEasyWords() {
        return wordsRepository.getEasyWordsRandomised();
    }

    public List<WordStore> getHardWords() {
        return wordsRepository.getHardWordsRandomised();
    }

    // Word-based tests
    public List<WordStore> getEasyWordsLimited(Integer limit) {
        return wordsRepository.getEasyWordsRandomisedLimited(limit);
    }

    public List<WordStore> getHardWordsLimited(Integer limit) {
        return wordsRepository.getHardWordsRandomisedLimited(limit);
    }
}
