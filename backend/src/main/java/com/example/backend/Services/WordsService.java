package com.example.backend.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Models.Word;
import com.example.backend.Repositories.WordsRepository;

@Service
public class WordsService {
    
    @Autowired WordsRepository wordsRepository;

    // Time-based tests
    public List<Word> getEasyWords() {
        return wordsRepository.getEasyWordsRandomised();
    }

    public List<Word> getHardWords() {
        return wordsRepository.getHardWordsRandomised();
    }

    // Word-based tests
    public List<Word> getEasyWordsLimited(int limit) {
        return wordsRepository.getEasyWordsRandomisedLimited(limit);
    }

    public List<Word> getHardWordsLimited(int limit) {
        return wordsRepository.getHardWordsRandomisedLimited(limit);
    }
}
