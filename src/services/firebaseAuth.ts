import axios, { create, isAxiosError } from "axios"
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { SignupData, FirebaseSignupResponse, FirebaseErrorResponse } from "../types/auth"

const SESSION_KEY = "firebase_refresh_token";

const firebaseApi = create({
    baseURL: "https://identitytoolkit.googleapis.com/v1",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    }
})

export const signupUser = async (
    userData: SignupData
): Promise<FirebaseSignupResponse> => {
    const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
        throw new Error("Firebase API key is missing.");
    }
    try {
        const response = await firebaseApi.post<FirebaseSignupResponse>(
            `/accounts:signUp?key=${apiKey}`,
            {
                email: userData.email,
                password: userData.password,
                returnSecureToken: true
            }
        );
        return response.data;
    } catch (error: unknown) {
        if (isAxiosError<FirebaseErrorResponse>(error)) {
            const firebaseMessage =
                error.response?.data?.error?.message;

            throw new Error(
                firebaseMessage || "Unable to create your account."
            );
        }
        throw error;
    }
};

export const updateUserDisplayName = async (
    idToken: string,
    fullName: string
) => {
    const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
        throw new Error("Firebase API key is missing.");
    }
    const response = await firebaseApi.post(
        `/accounts:update?key=${apiKey}`,
        {
            idToken,
            displayName: fullName,
            returnSecureToken: true
        }
    );
    return response.data;
};

export interface FirebaseProfile {
    displayName: string;
    email: string;
}

export const saveRefreshToken = (refreshToken: string) =>
    Platform.OS === "web"
        ? Promise.resolve().then(() => { if (typeof localStorage !== "undefined") localStorage.setItem(SESSION_KEY, refreshToken); })
        : SecureStore.setItemAsync(SESSION_KEY, refreshToken);

const readRefreshToken = () =>
    Platform.OS === "web"
        ? Promise.resolve(typeof localStorage === "undefined" ? null : localStorage.getItem(SESSION_KEY))
        : SecureStore.getItemAsync(SESSION_KEY);

export const getSavedProfile = async (): Promise<FirebaseProfile | null> => {
    const refreshToken = await readRefreshToken();
    if (!refreshToken) return null;

    const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) throw new Error("Firebase API key is missing.");

    try {
        const refreshed = await axios.post<{ id_token: string; refresh_token: string }>(
            `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
            new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }).toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 15000 }
        );
        await saveRefreshToken(refreshed.data.refresh_token);
        const response = await firebaseApi.post<{ users?: { displayName?: string; email?: string }[] }>(
            `/accounts:lookup?key=${apiKey}`,
            { idToken: refreshed.data.id_token }
        );
        const user = response.data.users?.[0];
        if (!user) return null;
        return { displayName: user.displayName ?? "", email: user.email ?? "" };
    } catch (error: unknown) {
        if (isAxiosError<FirebaseErrorResponse>(error)) {
            const message = error.response?.data?.error?.message;
            throw new Error(message || "Unable to load your profile.");
        }
        throw error;
    }
};
