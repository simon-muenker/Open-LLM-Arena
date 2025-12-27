<script lang="ts">
    import IconCog from '~icons/heroicons/cog-6-tooth';
    import IconCheckCircle from '~icons/heroicons/check-circle';
    import IconExclamationCircle from '~icons/heroicons/exclamation-circle';

    import { settingsStore } from "@stores/settings";
    import { updateInferenceToken } from "@services/inference";

    let accessToken = $state(settingsStore.get().accessToken);
    let showSettings = $state(false);
    let tokenStatus: 'idle' | 'valid' | 'invalid' = $state('idle');

    function validateToken(token: string): boolean {
        return token.trim().startsWith('hf_') && token.length > 20;
    }

    function handleTokenChange() {
        const isValid = validateToken(accessToken);
        tokenStatus = isValid ? 'valid' : 'invalid';
        
        if (isValid) {
            settingsStore.setKey("accessToken", accessToken);
            updateInferenceToken(accessToken);
        }
    }

    function handleTokenInput() {
        if (accessToken.trim() === '') {
            tokenStatus = 'idle';
        }
    }

    $effect(() => {
        const stored = settingsStore.get().accessToken;
        if (stored && stored !== accessToken) {
            accessToken = stored;
            tokenStatus = validateToken(stored) ? 'valid' : 'idle';
        }
    });
</script>

<div class="mt-12 w-auto max-w-4xl mx-auto">
    <button 
        class="w-full flex items-center justify-between p-4 bg-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all"
        onclick={() => showSettings = !showSettings}
    >
        <div class="flex items-center gap-2">
            <IconCog class="text-2xl text-gray-600" />
            <h3 class="text-xl font-bold">Settings</h3>
        </div>
        <span class="text-gray-600">{showSettings ? '▼' : '▶'}</span>
    </button>

    {#if showSettings}
        <div class="mt-4 bg-white rounded-xl shadow-sm p-6 space-y-6">
            <!-- API Token -->
            <div>
                <label class="block text-sm font-medium mb-2" for="api-token">
                    Hugging Face API Token
                    <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <input 
                        id="api-token"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10
                            {tokenStatus === 'valid' ? 'border-green-500 bg-green-50' : ''}
                            {tokenStatus === 'invalid' ? 'border-red-500 bg-red-50' : ''}" 
                        type="password" 
                        placeholder="hf_..." 
                        bind:value={accessToken}
                        oninput={handleTokenInput}
                        onchange={handleTokenChange}
                    />
                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                        {#if tokenStatus === 'valid'}
                            <IconCheckCircle class="text-green-500 text-xl" />
                        {:else if tokenStatus === 'invalid'}
                            <IconExclamationCircle class="text-red-500 text-xl" />
                        {/if}
                    </div>
                </div>
                <div class="mt-2 space-y-1">
                    <p class="text-xs text-gray-600">
                        Get your token from 
                        <a 
                            href="https://huggingface.co/settings/tokens" 
                            target="_blank" 
                            class="text-emerald-600 hover:underline"
                        >
                            Hugging Face Settings
                        </a>
                    </p>
                    {#if tokenStatus === 'invalid'}
                        <p class="text-xs text-red-600">
                            Invalid token format. Token should start with 'hf_'
                        </p>
                    {:else if tokenStatus === 'valid'}
                        <p class="text-xs text-green-600">
                            ✓ Token format is valid
                        </p>
                    {/if}
                </div>
            </div>

            <!-- Info Section -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="font-bold text-blue-900 mb-2">About API Access</h4>
                <ul class="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Free tier allows limited requests per hour</li>
                    <li>Some models may require PRO subscription</li>
                    <li>Your token is stored locally in your browser</li>
                    <li>Token is never sent to any server except Hugging Face</li>
                </ul>
            </div>

            <!-- Privacy Notice -->
            <div class="text-xs text-gray-500 italic">
                Note: All conversations and settings are stored locally in your browser. 
                No data is sent to external servers except API requests to Hugging Face.
            </div>
        </div>
    {/if}
</div>