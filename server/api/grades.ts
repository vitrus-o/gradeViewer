import { defineEventHandler, createError, getQuery, getHeader } from 'h3'
import { supabase } from '../utils/supabase'
import { reauthenticateAndStoreToken } from '../utils/vsuAuth'
import { authenticateWithCredentials } from '../utils/vsuAuth'

interface GradeData {
    offer: {
        subject: {
            subject_no: string;
            description: string;
        }
    };
    grade_status: {
        final: {
            status: number;
            status_label: string;
            submitted: string | null;
            remark?: string;
        }
    }
}

function transformGrades(rawGrades: any[]): GradeData[] {
    return rawGrades.map(grade => {
        const isPassed = (grade?.grade?.remark == 'PASSED' && grade?.grade_status?.final?.status == 1);
        return {
            offer: {
                subject: {
                    subject_no: grade.offer.subject.subject_no,
                    description: grade.offer.subject.description
                }
            },
            grade_status: {
                final: {
                    status: isPassed ? "1.5" : grade.grade_status.final.status,
                    status_label: isPassed ? "Encoded" : grade.grade_status.final.status_label,
                    submitted: isPassed ? "Encoded but not submitted" : grade.grade_status.final.submitted,
                    remark: grade.grade_status.final.remark
                }
            }
        };
    });
}

async function fetchGradesFromVSU(token: string) {
    const response = await fetch('https://c1-student.vsu.edu.ph/api/students/grades?sy_year=2025&sy_period=1', {
        method: 'GET',
        headers: {
            'Authorization': `Token token=${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    return response.json();
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const forceRefresh = query.force === 'true';

    const userUsername = getHeader(event, 'x-vsu-username');
    const userPassword = getHeader(event, 'x-vsu-password');

    if (userUsername && userPassword) {
        try {
            const token = await authenticateWithCredentials(userUsername, userPassword);
            const gradesResponse = await fetchGradesFromVSU(token);

            if (gradesResponse?.messages?.includes("You are not logged in.")) {
                throw new Error("Invalid credentials or authentication failed");
            }

            if (!gradesResponse.grades) {
                throw new Error(`Invalid grades response from VSU API: ${JSON.stringify(gradesResponse)}`);
            }

            return { grades: transformGrades(gradesResponse.grades) };
        } catch (error: any) {
            console.error("Grades endpoint - User auth failed:", error.message);
            throw createError({
                statusCode: 401,
                message: "Authentication failed. Please check your credentials."
            });
        }
    }

    const CACHE_DURATION = 5 * 60 * 1000; // 5min

    const { data: sessionData, error: sessionError } = await supabase
        .from('app_session')
        .select('*')
        .eq('id', 1)
        .single();

    if (sessionError || !sessionData) {
        throw createError({ statusCode: 500, message: 'Could not fetch app session from database.' });
    }

    const lastFetch = sessionData.last_fetch ? new Date(sessionData.last_fetch).getTime() : 0;
    if (!forceRefresh && sessionData.grades_cache?.length > 0 && (Date.now() - lastFetch < CACHE_DURATION)) {
        return { grades: transformGrades(sessionData.grades_cache) };
    }

    let token = sessionData.token;
    if (!token) {
        token = await reauthenticateAndStoreToken();
    }
    
    try {
        let gradesResponse = await fetchGradesFromVSU(token);

        if (gradesResponse?.messages?.includes("You are not logged in.")) {
            console.log("Token expired. Re-authenticating...");
            const newToken = await reauthenticateAndStoreToken();
            gradesResponse = await fetchGradesFromVSU(newToken);

            if (gradesResponse?.messages?.includes("You are not logged in.")) {
                 throw new Error("Authentication failed even after refreshing token.");
            }
        }
        
        if (!gradesResponse.grades) {
             throw new Error(`Invalid grades response from VSU API: ${JSON.stringify(gradesResponse)}`);
        }

        const { error: updateError } = await supabase
            .from('app_session')
            .update({ grades_cache: gradesResponse.grades, last_fetch: new Date().toISOString() })
            .eq('id', 1);

        if (updateError) {
            console.error("Failed to update cache in Supabase:", updateError);
        }

        return { grades: transformGrades(gradesResponse.grades) };

    } catch (error: any) {
        console.error("Grades endpoint - Failed to fetch grades:", error.message);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch grades from VSU"
        });
    }
});
