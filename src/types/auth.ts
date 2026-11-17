export interface SignupData {
    fullName: string;
    email: string;
    password: string;
}
export interface FirebaseSignupResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}
export interface FirebaseErrorResponse {
    error: { code: number; message: string };
}
