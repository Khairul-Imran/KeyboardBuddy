package com.example.backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String sendToEmail, String subject, String content) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("keyboardbuddy69@gmail.com");
        message.setTo(sendToEmail);
        message.setText(content);
        message.setSubject(subject);

        javaMailSender.send(message);

        System.out.println("Email has been sent successfully to: " + sendToEmail);

    }

}
