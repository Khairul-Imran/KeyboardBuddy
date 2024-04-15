export interface UserRegistration {
    username: string;
    email: string;
    password: string;
}

export const DEFAULT_REGISTRATION: UserRegistration = {
    username: '',
    email: '',
    password: ''
}

export interface UserLogin {
    email: string;
    password: string;
}

export const DEFAULT_LOGIN: UserLogin = {
    email: '',
    password: ''
}

export interface User {
    userId: number;

    joinedDate: Date; // Might change
    username: string;
    email: string;

    userProfile: UserProfile;
}

export interface UserProfile {
    profileId: number;

    testsCompleted: number;
    timeSpentTyping: number;
    currentStreak: number;
    selectedTheme: string;
    hasPremium: boolean;

    userId: number;
}

export interface UserSlice {
    user: User;
    // userProfile: UserProfile;
}

// export const USER_SLICE_INIT_STATE: UserSlice = {
//     user: {
//         userId: 0, 
//         joinedDate: new Date(), 
//         username: '', 
//         email: ''}
// }

export const SLICE_INIT_STATE: UserSlice = {
    user: {
        userId: 0, 
        joinedDate: new Date(), 
        username: '', 
        email: '',
    userProfile: {
        profileId: 0, 
        testsCompleted: 0, 
        timeSpentTyping: 0, 
        currentStreak: 0, 
        selectedTheme: '', 
        hasPremium: false, 
        userId: 0}
    }
}

export interface DisplayedTestData {
    testDataId: number;

    testDate: Date;
    testType: string;
    wordsPerMinute: number;
    accuracy: number;
    timeTaken: number; 

    userId: number;
}

export interface PersonalRecords {
    personalRecordsId: number;

    testDate: Date;
    testType: string; 
    wordsPerMinute: number;
    accuracy: number;
    timeTaken: number;
    difficulty?: string;
    timeLimit?: string;
    wordCount?: string;

    userId: number;
}

export interface UserLoginState {
    isUserLoggedIn: boolean;
}