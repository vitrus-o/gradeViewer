import { defineEventHandler, createError } from 'h3'

interface SessionData {
    token: string | null;
    grades: any[];
    lastFetch: number;
}

export default defineEventHandler(async (event) => {
    
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
                'Sec-Ch-Ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                username: process.env.VSU_USERNAME,
                password: process.env.VSU_PASSWORD
            })
        });
        const data = await response.json();
        const token = data?.user?.api_auth_token || "";
        if (!event.context.session) {
            event.context.session = {} as SessionData;
        }
        
        event.context.session.token = token;
        event.context.session.lastFetch = 0;
        event.context.session.grades = [];
        
        return { success: true };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "Authentication failed"
        });
    }
});
