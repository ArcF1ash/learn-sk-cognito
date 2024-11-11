<script lang="ts">
    import { goto } from "$app/navigation";

    let { data } = $props();

    async function handleSignOut() {
        try {
            const response = await fetch('/api/auth/signout', { method: 'POST' });
            if (response.ok) {
                goto('/auth/sign-in');
            }
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    }
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="space-y-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <div>
            <h2 class="mt-10 text-center text-2xl/9 font-bold text-gray-900">Hello, { data.user.attributes.given_name } { data.user.attributes.family_name }!</h2>
        </div>
        <div>
            <p class="text-center  text-gray-900">This is protected content. You are seeing this because you are signed in.</p>
        </div>
        <div>
            <button onclick={handleSignOut} class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign Out</button>
        </div>
    </div>
</div>