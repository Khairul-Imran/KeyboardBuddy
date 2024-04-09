package com.example.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Services.UserService;

@RestController
@CrossOrigin(origins = {"http://localhost:4200"})
@RequestMapping
public class UserController {
    
    @Autowired
    private UserService userService;

    // Login / Register





    

}
