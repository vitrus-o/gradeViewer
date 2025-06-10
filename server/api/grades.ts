import { defineEventHandler, getHeader } from 'h3'

export default defineEventHandler(async (event) => {
    const token = getHeader(event, 'Authorization')?.replace('Token token=', '');
    
    if (!token) {
        throw createError({
            statusCode: 401,
            message: "No authentication token provided"
        });
    }

    try {
        const response = await fetch('https://c1-student.vsu.edu.ph/api/students/grades?sy_year=2024&sy_period=2', {
            method: 'GET',
            headers: {
                'Authorization': `Token token=${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch grades:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch grades"
        });
    }
});
