<script lang="ts">
	import { goto } from '$app/navigation';

    let email: string = '';
    let password: string = '';
    let newPassword: string = '';
    let confirmPassword: string = '';
    let authChallenge: string | null = null;

    async function handleSubmit() {
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.challenge === 'NEW_PASSWORD_REQUIRED') {
                authChallenge = 'NEW_PASSWORD_REQUIRED'
            } else if (data.authenticated) {
                goto('/');
            }
            else {
                throw new Error('Unexpected response from server');
            }
        } catch (error) {
            console.error('Sign-in error:', error);
            alert('Sign-in failed. Please check your credentials');
        }
    }

    async function handleNewPasswordSubmit() {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, newPassword })
            });

            const data = await response.json();

            if (data.authenticated) {
                goto('/');
            } else {
                throw new Error('Failed to set new password');
            }
        } catch (error) {
            console.error('New password error:', error);
            alert('Failed to set new password');
        }
    }
</script>

{#if authChallenge === 'NEW_PASSWORD_REQUIRED'}
    <form on:submit|preventDefault={handleNewPasswordSubmit}>
        <hgroup>
            <h2>Set New Password</h2>
        </hgroup>
        <label for="username">New Password</label>
        <input type="password" bind:value={newPassword} placeholder="New Password" required />

        <label for="password">Confirm Password</label>
        <input type="password" bind:value={confirmPassword} placeholder="Confirm New Password" required />

        <button type="submit">Set Password</button>
    </form>
{:else}
    <form on:submit|preventDefault={handleSubmit}>
        <hgroup>
            <h2>Sign In</h2>
        </hgroup>
        <label for="username">Email</label>
        <input type="email" bind:value={email} placeholder="Email" required />

        <label for="password">Password</label>
        <input type="password" bind:value={password} placeholder="Password" required />

        <button type="submit">Sign In</button>
    </form>
{/if}
