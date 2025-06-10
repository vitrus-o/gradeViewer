import { defineEventHandler, getRequestHeader, appendHeader } from 'h3'
import type { H3Event } from 'h3'

interface SessionData {
    token: string | null;
    grades: any[];
    lastFetch: number;
}

declare module 'h3' {
    interface H3EventContext {
        session: SessionData
    }
}

export default defineEventHandler(async (event: H3Event) => {
    const storage = useStorage()
    const sessionId = getRequestHeader(event, 'cookie')?.match(/sessionId=([^;]+)/)?.[1] || Date.now().toString()
    if (!getRequestHeader(event, 'cookie')?.includes('sessionId=')) {
        appendHeader(event, 'Set-Cookie', `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`); // 24 hours
    }
    let session = await storage.getItem(`session:${sessionId}`) as SessionData

    if (!session) {
        session = {
            token: null,
            grades: [],
            lastFetch: 0
        }
    }

    event.context.session = session
    event.node.res.on('finish', async () => {
        await storage.setItem(`session:${sessionId}`, session)
    })
})
