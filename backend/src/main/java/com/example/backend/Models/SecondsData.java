package com.example.backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecondsData {

    // Not using currently
    Integer second; // At which second was the data gathered
    Integer wordsPerMinute;
    Integer errors;

}
