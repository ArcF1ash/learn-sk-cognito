<script lang="ts">
    import { goto } from "$app/navigation";

    async function handleSignOut() {
        try {
            const response = await fetch('/api/auth/signout', { method: 'POST' });
            if (response.ok) {
                goto('/signin');
            }
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    }
</script>

<h1>This is protected content. You are seeing this because you are signed in.</h1>

<button on:click={handleSignOut}>Sign Out</button>