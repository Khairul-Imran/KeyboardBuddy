package com.example.backend.Repositories;

public class SQLQueries {
    
    public static final String SQL_INSERT_USER = """
                    insert into users (username, email, password)
                    values(?, ?, ?)
                    """;


}
