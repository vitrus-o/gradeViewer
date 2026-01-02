import { supabase } from './supabase';
import { createError } from 'h3';

/**
 * Authenticates with the VSU portal using provided credentials,
 * and returns an authentication token.
 * @param username - The VSU portal username
 * @param password - The VSU portal password
 * @returns The authentication token.
 */
export async function authenticateWithCredentials(username: string, password: string): Promise<string> {
    try {
        const response = await fetch('https://c1-student.vsu.edu.ph/api/sessions', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-PH,en-US;q=0.9,en;q=0.8,fil;q=0.7',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                'Origin': 'https://my.vsu.edu.ph',
                'Pragma': 'no-cache',
                'Referer': 'https://my.vsu.edu.ph/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        const token = data?.user?.api_auth_token;

        if (!token) {
            console.error("VSU Authentication failed: No token received.", data);
            throw new Error("Failed to get token from VSU - Invalid credentials");
        }
        
        return token;
    } catch (error) {
        console.error("authenticateWithCredentials error:", error);
        throw error;
    }
}

/**
 * Authenticates with the VSU portal, gets a new token,
 * and updates it in the Supabase database.
 * @returns The new authentication token.
 */
export async function reauthenticateAndStoreToken(): Promise<string> {
    try {
        console.log("Attempting to re-authenticate with VSU portal...");
        const response = await fetch('https://c1-student.vsu.edu.ph/api/sessions', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-PH,en-US;q=0.9,en;q=0.8,fil;q=0.7',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                'Origin': 'https://my.vsu.edu.ph',
                'Pragma': 'no-cache',
                'Referer': 'https://my.vsu.edu.ph/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                username: process.env.VSU_USERNAME,
                password: process.env.VSU_PASSWORD
            })
        });

        const data = await response.json();
        const token = data?.user?.api_auth_token;

        if (!token) {
            console.error("VSU Authentication failed: No token received.", data);
            throw new Error("Failed to get token from VSU");
        }
        
        console.log("Successfully received new token from VSU.");

        const { error } = await supabase
            .from('app_session')
            .update({ 
                token: token,
                last_fetch: new Date(0).toISOString(), // Reset cache timer
                grades_cache: [] 
            })
            .eq('id', 1);

        if (error) {
            console.error("Supabase error updating token:", error);
            throw new Error("Failed to store new token in Supabase");
        }
        
        console.log("Successfully stored new token in Supabase.");
        return token;
    } catch (error) {
        console.error("reauthenticateAndStoreToken error:", error);
        throw createError({
            statusCode: 500,
            message: "Authentication process failed."
        });
    }
}