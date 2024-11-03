import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { CognitoIdentityProviderClient, GlobalSignOutCommand, InitiateAuthCommand, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';

import { AWS_REGION } from '$env/static/private';

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

export const POST: RequestHandler = async ({ cookies }) => {
    const AccessToken = cookies.get('AccessToken');

    try {
        const command = new GlobalSignOutCommand({ AccessToken: AccessToken });
        await client.send(command);

        cookies.set('AccessToken', '', {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 0
        });

        return json({ message: 'Successfully signed out' })
    } catch (error) {
        console.error('Cognito sign-out error:', error);
        return json({ error: 'Sign-out failed' }, { status: 500 });
    }
}