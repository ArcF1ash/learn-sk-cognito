import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CognitoIdentityProviderClient, InitiateAuthCommand, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';
import { AWS_REGION, AWS_COGNITO_CLIENT_ID, AWS_COGNITO_CLIENT_SECRET } from '$env/static/private';

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

function generateSecretHash(username: string) {
    return createHmac("sha256", AWS_COGNITO_CLIENT_SECRET)
    .update(username + AWS_COGNITO_CLIENT_ID)
    .digest("base64");
}

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { email, password, newPassword } = await request.json();
    try {
        const authCommand = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: AWS_COGNITO_CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: generateSecretHash(email)
            }
        });
        let response = await client.send(authCommand);

        if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED' && newPassword) {
            const challengeCommand = new RespondToAuthChallengeCommand({
                ClientId: AWS_COGNITO_CLIENT_ID!,
                ChallengeName: 'NEW_PASSWORD_REQUIRED',
                Session: response.Session!,
                ChallengeResponses: {
                    USERNAME: email,
                    NEW_PASSWORD: newPassword,
                    SECRET_HASH: generateSecretHash(email)
                }
            });
            response = await client.send(challengeCommand);
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
            return json({ message: 'Authentication successful', authenticated: true });
        } else if (response.ChallengeName) {
            return json({ message: 'Challenge required ', challenge: response.ChallengeName });
        } else {
            return json({ error: 'Authentication failed' }, { status: 401 });
        }

    } catch (error) {
        console.error('Cognito sign-in error:', error);
        return json({ error: 'Authentication failed' }, { status: 500 });
    }
}