import { defineEventHandler } from 'h3'
import { reauthenticateAndStoreToken } from '../utils/vsuAuth'

export default defineEventHandler(async () => {
    try {
        await reauthenticateAndStoreToken();
        return { success: true, message: 'Re-authentication successful. Token has been updated.' };
    } catch (error) {
        return { success: false, message: 'Re-authentication failed.' };
    }
});