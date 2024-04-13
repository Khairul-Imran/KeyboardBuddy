package com.example.backend.Controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import com.example.backend.Models.Greeting;
import com.example.backend.Models.HelloMessage;

@Controller
public class GreetingController {
    
    @MessageMapping("/hello") // Calling -> /api/hello ****to change to api?****
    @SendTo("/topic/greetings") // Passes the Greeting to topics subscribed
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }

}
