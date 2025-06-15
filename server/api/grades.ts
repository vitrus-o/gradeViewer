import { defineEventHandler, createError, getQuery } from 'h3'

interface SessionData {
    token: string | null;
    grades: any[];
    lastFetch: number;
}

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

export default defineEventHandler(async (event) => {
    
    const session = event.context.session as SessionData;
    const CACHE_DURATION = 5 * 60 * 1000; // 5min
    const query = getQuery(event);
    const forceRefresh = query.force === 'true';

    if (!session?.token) {
        throw createError({
            statusCode: 401,
            message: "No authentication token provided"
        });
    }

    if (!forceRefresh && session.grades?.length > 0 && session.lastFetch && 
        (Date.now() - session.lastFetch < CACHE_DURATION)) {
        return { grades: transformGrades(session.grades) };
    }

    try {
        const response = await fetch('https://c1-student.vsu.edu.ph/api/students/grades?sy_year=2024&sy_period=2', {
            method: 'GET',
            headers: {
                'Authorization': `Token token=${session.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        
        if (data?.messages?.includes("You are not logged in.")) {
            session.token = null;
            throw createError({
                statusCode: 401,
                message: "Authentication expired"
            });
        }

        session.grades = data.grades;
        session.lastFetch = Date.now();

        return { grades: transformGrades(data.grades) };
    } catch (error) {
        console.error("Grades endpoint - Failed to fetch grades:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch grades"
        });
    }
});
