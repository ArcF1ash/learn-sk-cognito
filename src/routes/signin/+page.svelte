<script lang="ts">
	import { goto } from '$app/navigation';

    let email: string = '';
    let password: string = '';
    let newPassword: string = '';
    let confirmPassword: string = '';
    let authChallenge: string | null = null;

    let showPassword: boolean = false;
    $: type = showPassword ? 'text' : 'password';

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

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl/9 font-bold text-gray-900">Sign in to your account</h2>
    </div>
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {#if authChallenge === 'NEW_PASSWORD_REQUIRED'}
            <form class="space-y-6" on:submit|preventDefault={handleNewPasswordSubmit}>
                <hgroup>
                    <h3 class="mt-10 text-center font-bold text-gray-900">Set New Password</h3>
                </hgroup>
                <div>
                    <label for="newPassword" class="block text-sm/6 font-medium text-gray-900">New Password</label>
                    <div class="mt-2">
                        <input id="newPassword" type={ type } bind:value={newPassword} required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                </div>
                <div>
                    <label for="confirmPassword" class="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
                    <div class="mt-2">
                        <input id="confirmPassword" type={ type } bind:value={confirmPassword} required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                    <div class="mt-2 text-sm">
                        <input id="showPasswords" type="checkbox" on:click="{ () => showPassword = !showPassword }">
                        <label for="showPasswords">Show Password</label>
                    </div>
                </div>
                <div>
                    <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Set Password</button>
                </div>
            </form>
        {:else}
            <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
                <div>
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                    <div class="mt-2">
                        <input id="email" type="email" bind:value={email} required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                </div>
                <div>
                    <div class="flex items-center justify-between">
                      <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                      <div class="text-sm">
                        <a href="/" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                      </div>
                    </div>
                    <div class="mt-2">
                      <input id="password" type={ type } bind:value={password} required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
                    </div>
                    <div class="mt-2 text-sm">
                        <input id="showPassword" type="checkbox" on:click="{ () => showPassword = !showPassword }">
                        <label for="showPassword">Show Password</label>
                    </div>
                </div>
                <div>
                    <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                </div>
            </form>
        {/if}
    </div>
</div>
