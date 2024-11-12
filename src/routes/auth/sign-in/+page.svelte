<script lang="ts">
	import { goto } from "$app/navigation";
    import type { ActionData } from "../$types";
    import { applyAction, enhance } from '$app/forms';

    let { form }: { form: ActionData } = $props();

    $effect(() => {
        if (form?.success && form?.id === 'signIn' ) {
            // Navigate to protected content if successfully signed in
            goto('/');
        } 
    });

    let showPassword: boolean = $state(false);
    let type = $derived(showPassword ? 'text' : 'password');
</script>

<div class="flex justify-center h-screen lg:h-full">
    <div class="w-full lg:max-w-sm bg-white lg:shadow-md lg:rounded lg:mt-12 p-8">
        <h2 class="text-center text-2xl/9 font-bold text-gray-900">Sign in to your account</h2>
        <div class="mt-10">
        {#if !form?.success && form?.challenge === 'NEW_PASSWORD_REQUIRED'}
            <!-- Password Change Form -->
            <form 
                method="POST"
                use:enhance={()=> {
                    return async ({ result }) => {
                       await applyAction(result);
                    };
                }} 
                action="/auth?/changePassword"
                class="space-y-6"
            >
                <hgroup>
                    <h3 class="mt-10 text-center font-bold text-gray-900">Set New Password</h3>
                </hgroup>
                <div>
                    <label for="newPassword" class="block text-sm/6 font-medium text-gray-900">New Password</label>
                    <div class="mt-2">
                        <input type={type} name="newPassword" id="newPassword" required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                </div>
                <div>
                    <label for="confirmPassword" class="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
                    <div class="mt-2">
                        <input type={type} name="confirmPassword" id="confirmPassword" required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                    <div class="mt-2 text-sm">
                        <input id="showPasswords" type="checkbox" onclick="{ () => showPassword = !showPassword }">
                        <label for="showPasswords">Show Password</label>
                    </div>
                </div>
                <div>
                    <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Set Password</button>
                </div>
            </form>
        {:else}
            <!-- Sign In Form -->
            <form 
                method="POST"
                use:enhance={()=> {
                    return async ({ result }) => {
                       await applyAction(result);
                    };
                }} 
                action="/auth?/signIn"
                class="space-y-6"
            >
                <div>
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                    <div class="mt-2">
                        <input type="email" name="email" id="email" required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                </div>
                <div>
                    <div class="flex items-center justify-between">
                      <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                      <div class="text-sm">
                        <a href="/auth/forgot-password" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                      </div>
                    </div>
                    <div class="mt-2">
                      <input type={type} name="password" id="password" required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
                    </div>
                    <div class="mt-2 text-sm">
                        <input type="checkbox" id="showPassword" onclick="{ () => showPassword = !showPassword }">
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
</div>
