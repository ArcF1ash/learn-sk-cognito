import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand, ForgotPasswordCommand, GlobalSignOutCommand, InitiateAuthCommand, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';
import { AWS_REGION, AWS_COGNITO_CLIENT_ID, AWS_COGNITO_CLIENT_SECRET } from '$env/static/private';

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

function generateSecretHash(username: string) {
    return createHmac("sha256", AWS_COGNITO_CLIENT_SECRET)
    .update(username + AWS_COGNITO_CLIENT_ID)
    .digest("base64");
}

export const actions: Actions = {
    requestResetPassword: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = String(data.get('email'));
        
        try {
            const command = new ForgotPasswordCommand({
                ClientId: AWS_COGNITO_CLIENT_ID,
                Username: email,
                SecretHash: generateSecretHash(email)
            });
            await client.send(command);

            // Store email in a temporary cookie
            cookies.set('email', email, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 300
            });
            
            return { success: true, id: 'requestResetPassword' };
        }
        catch (error) {
            return fail(400, { email, incorrect: true });
        }
    },
    confirmResetPassword: async ({ request, cookies }) => {
        const data = await request.formData();
        const code = String(data.get('code'));
        const newPassword = String(data.get('newPassword'));
        
        // Retrieve the email from the temporary cookie
        const email = String(cookies.get('email'));
        
        try {
            const command = new ConfirmForgotPasswordCommand({
                ClientId: AWS_COGNITO_CLIENT_ID,
                ConfirmationCode: code,
                Password: newPassword,
                Username: email,
                SecretHash: generateSecretHash(email)
            });
            await client.send(command);
            
            cookies.delete('email', { path: '/'});

            return { success: true, id: 'confirmResetPassword' };
        } catch (error) {
            return fail(400, { error: 'Failed to reset password.' });
        }
    },
    signIn: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = String(data.get('email'));
        const password = String(data.get('password'));

        try {
            const command = new InitiateAuthCommand({
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: AWS_COGNITO_CLIENT_ID,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password,
                    SECRET_HASH: generateSecretHash(email)
                }
            });
            let response = await client.send(command);

            if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
                // Store email in a temporary cookie
                cookies.set('email', email, {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 300
                });

                // Store session in a temporary cookie
                cookies.set('session', response.Session!, {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 300
                });

                return { success: false, id: 'signIn', challenge: 'NEW_PASSWORD_REQUIRED'};
            }

            if (response.AuthenticationResult && response.AuthenticationResult.AccessToken) {
                const AccessToken = response.AuthenticationResult.AccessToken;
    
                cookies.set('AccessToken', AccessToken, {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 3600
                });

                return { success: true, id: 'signIn' };
            }

        } catch (error){
            return fail(400, { error: 'Failed to sign in.' });
        }
    },
    changePassword: async ({ request, cookies }) => {
        const data = await request.formData();
        const newPassword = String(data.get('newPassword'));
        const confirmPassword = String(data.get('confirmPassword'));
        
        // Retrieve email and session from the temporary cookies
        const email = String(cookies.get('email'));
        const session = String(cookies.get('session'));

        if (newPassword !== confirmPassword) {
            return fail(400, { error: 'Passwords must match.' });
        }

        try {
            const command = new RespondToAuthChallengeCommand({
                ClientId: AWS_COGNITO_CLIENT_ID!,
                ChallengeName: 'NEW_PASSWORD_REQUIRED',
                Session: session,
                ChallengeResponses: {
                    USERNAME: email,
                    NEW_PASSWORD: newPassword,
                    SECRET_HASH: generateSecretHash(email)
                }
            });

            await client.send(command);
            return { success: true, id: 'changePassword' };
        } catch (error) {
            return fail(400, { error: 'Failed to change password.'});
        }
    },
    signOut: async ({ cookies }) => {
        const AccessToken = cookies.get('AccessToken');

        try {
            const command = new GlobalSignOutCommand({ AccessToken: AccessToken });
            await client.send(command);

            // Clear the cookie
            cookies.set('AccessToken', '', {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 0
            });

            return { success: true, id: 'signOut'};
        } catch (error) {
            return fail(400, { error: 'Failed to sign out.'});
        }
    }
} satisfies Actions;