<script lang="ts">
    import { goto } from "$app/navigation";
    import type { ActionData } from "../auth/$types.js";
    import type { PageData } from "./$types.js";
    import { applyAction, enhance } from '$app/forms';

    let { data, form }: { data: PageData, form: ActionData } = $props();

    $effect(() => {
        if (form?.success && form?.id === 'signOut' ) {
            // Navigate to sign-in if successfully signed out
            goto('/auth/sign-in');
        } 
    });
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="space-y-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <div>
            <h2 class="mt-10 text-center text-2xl/9 font-bold text-gray-900">Hello, { data.user.attributes.given_name } { data.user.attributes.family_name }!</h2>
        </div>
        <div>
            <p class="text-center  text-gray-900">This is protected content. You are seeing this because you are signed in.</p>
        </div>
        <!-- Sign Out Form -->
        <form
            method="POST"
            use:enhance={()=> {
                return async ({ result }) => {
                   await applyAction(result);
                };
            }} 
            action="/auth?/signOut"
        >
            <div>
                <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign Out</button>
            </div>
        </form>
    </div>
</div>