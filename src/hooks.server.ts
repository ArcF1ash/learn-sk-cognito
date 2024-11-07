import { CognitoIdentityProviderClient, GetUserCommand, type GetUserCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import type { Handle } from '@sveltejs/kit';
import { AWS_REGION } from "$env/static/private";

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('AccessToken');

    if (token) {
        try {
            const command = new GetUserCommand({ AccessToken: token });
            const user: GetUserCommandOutput = await client.send(command);

            event.locals.user = {
                username: user.Username ?? "",
                attributes: user.UserAttributes!.reduce((acc, attr) => {
                    acc[attr.Name!] = attr.Value!;
                    return acc;
                }, {} as Record<string, string>),
                isAuthenticated: true
            };
        } catch (error) {
            console.error('Token validation failed:', error);
            event.locals.user = { 
                username: "",
                attributes: {} as Record<string, string>,
                isAuthenticated: false 
            };
        }
    } else {
        event.locals.user = { 
            username: "",
            attributes: {} as Record<string, string>,
            isAuthenticated: false 
        };
    }

    return resolve(event);
}