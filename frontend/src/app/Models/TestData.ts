export interface TestData {
    // testId: number;
    // date: Date;
    testType: string; // E.g. time 15 easy (type / how long / difficulty)
    wordsPerMinute: number;
    accuracy: number;
    timeTaken: number; // For word-based tests
    secondsData: SecondsData[];
}

export interface SecondsData {
    second: number; // At which second was this data gathered.
    wordsPerMinute: number;
    accuracy: number;
    errors: number;
}

export interface Error {
    second: number;
    character: string;
    fromWord: string;
}

export interface TypedLetter {
    character: string;
    correct: boolean;
    second: number; // At which interval was it typed.
}