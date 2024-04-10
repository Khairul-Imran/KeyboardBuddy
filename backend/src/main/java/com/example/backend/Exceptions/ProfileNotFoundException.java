package com.example.backend.Exceptions;

public class ProfileNotFoundException extends Exception {
    
    public ProfileNotFoundException() {
        super();
    }

    public ProfileNotFoundException(String message) {
        super(message);
    }

}
