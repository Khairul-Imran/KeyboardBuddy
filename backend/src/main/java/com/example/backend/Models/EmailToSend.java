package com.example.backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailToSend {
    
    String sendToEmail;
    String subject;
    String content;

}
