package com.example.backend.Models;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    Integer userId; // PK
    Date joinedDate;
    String username;
    String email;
    String password;
    Boolean hasPremium; // Remember need to be able to tell whether this user has premium or not (component store?)


}
