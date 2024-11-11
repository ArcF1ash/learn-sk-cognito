import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand, ForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';
import { AWS_REGION, AWS_COGNITO_CLIENT_ID, AWS_COGNITO_CLIENT_SECRET } from '$env/static/private';

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

function generateSecretHash(username: string) {
    return createHmac("sha256", AWS_COGNITO_CLIENT_SECRET)
    .update(username + AWS_COGNITO_CLIENT_ID)
    .digest("base64");
}

export const actions = {
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
            cookies.set('emailForReset', email, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 300
            })
            
            return { success: true, id: 'request' };
        }
        catch (error) {
            console.error('Error:', error);
            return fail(400, { email, incorrect: true });
        }
    },
    confirmResetPassword: async ({ request, cookies }) => {
        const data = await request.formData();
        const code = String(data.get('code'));
        const newPassword = String(data.get('newPassword'));
        
        // Retrieve the email from the temporary cookie
        const email = String(cookies.get('emailForReset'));
        
        try {
            const command = new ConfirmForgotPasswordCommand({
                ClientId: AWS_COGNITO_CLIENT_ID,
                ConfirmationCode: code,
                Password: newPassword,
                Username: email,
                SecretHash: generateSecretHash(email)
            });
            await client.send(command);
            
            cookies.delete('emailForReset', { path: '/'});

            return { success: true, id: 'confirm' };
        } catch (error) {
            console.error('Error:', error);
            return fail(400);
        }
    }
} satisfies Actions;