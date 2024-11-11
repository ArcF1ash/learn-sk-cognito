<script lang="ts">
    import { goto } from "$app/navigation";
    import type { ActionData } from "../$types";
    import { enhance } from '$app/forms';

    let { form }: { form: ActionData } = $props();

    $effect(() => {
        if (form?.success && form?.id === 'confirm' ) {
            // Navigate back to sign-in if password is successfully reset
            setTimeout(() =>  goto('/auth/sign-in'), 2000);
        } 
    });

    let showPassword: boolean = $state(false);
    let type = $derived(showPassword ? 'text' : 'password');
</script>

<div class="flex justify-center h-screen lg:h-full">
    <div class="w-full lg:max-w-sm bg-white lg:shadow-md lg:rounded lg:mt-12 p-8">
        <h2 class="text-center text-2xl/9 font-bold text-gray-900">Reset your password</h2>
        <div class="mt-10">
            {#if form?.success}
            <!-- Password Reset Confirmation Form -->
            <form method="POST" use:enhance action="?/confirmResetPassword" class="space-y-6">
                {#if form?.success && form?.id === 'confirm'}<p class="text-center text-green-500 mb-6">Password successfully reset!. Redirecting to sign-in...</p>{/if}
                <div>
                    <label for="code" class="block text-sm/6 font-medium text-gray-900">Confirmation Code</label>
                    <div class="mt-2">
                        <input type="text" name="code" id="code"  required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                </div>
                <div>
                    <label for="newPassword" class="block text-sm/6 font-medium text-gray-900">New Password</label>
                    <div class="mt-2">
                        <input type={type} name="newPassword" id="newPassword"  required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                </div>
                <div>
                    <label for="confirmPassword" class="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
                    <div class="mt-2">
                        <input type={type} name="confirmPassword" id="confirmPassword"   required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                    <div class="mt-2 text-sm">
                        <input id="showPassword" type="checkbox" onclick="{ () => showPassword = !showPassword }">
                        <label for="showPassword">Show Password</label>
                    </div>
                </div>
                <div>
                    <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Change Password</button>
                </div>
            </form>
            {:else}
            <!-- Password Reset Request Form -->
            <form method="POST" use:enhance action="?/requestResetPassword" class="space-y-6">
                <div>
                    <p class="text-center">To reset your password, enter your email address below and a confirmation code will be emailed to you shortly.</p>
                </div>
                <div>
                    {#if form?.incorrect}<p class="text-center text-red-500 mb-6">User does not exist.</p>{/if}
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                    <div class="mt-2">
                        <input id="email" name="email" type="email" required class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                    
                </div>
                <div>
                    <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Reset Password</button>
                </div>
            </form>
            <div class="mt-6">
                <button onclick="{ () => goto('/auth/sign-in') }" class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold  text-indigo-600 shadow-sm hover:bg-indigo-100 ring-1 ring-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Cancel</button>
            </div>
            {/if}
        </div>
    </div>
</div>