import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.user.isAuthenticated) {
        throw redirect(302, '/auth/sign-in');
    }
    return {
        user: locals.user
    };
}
