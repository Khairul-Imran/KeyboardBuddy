package com.example.backend.Repositories;

public class SQLQueries {
    
    public static final String SQL_INSERT_USER = """
                    insert into users (username, email, password)
                    values(?, ?, ?)
                    """;
    
    public static final String SQL_INSERT_USER_PROFILE = """
                    insert into user_profiles (tests_completed, time_spent_typing, current_streak, selected_theme, user_id)
                    values(?, ?, ?, ?, ?)
                    """;

    public static final String SQL_GET_LATEST_USER_ID = """
                    select last_insert_id()
                    as user_id
                    """;
    
    public static final String SQL_GET_USER_BY_EMAIL = """
                    select * from users
                    where email = ?
                    """;

    public static final String SQL_GET_USER_PROFILE_BY_USER_ID = """
                    select * from user_profiles
                    where user_id = ?
                    """;

}
