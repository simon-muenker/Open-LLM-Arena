<script lang="ts">
    import {settingsStore} from "@stores/settings";

    let accessToken = $state(settingsStore.get().accessToken);
</script>

<div class="mt-12 w-auto max-w-2xl mx-auto shadow-sm p-4 bg-gray-100 rounded-xl">
    <label for="">Hugging Face API Key</label>
    <input type="text" bind:value={accessToken} onchange={() => settingsStore.setKey("accessToken", accessToken)}>
</div>