<script lang="ts">
    import IconPaperAirPlane from '~icons/heroicons/paper-airplane';
    import IconArrowPath from '~icons/heroicons/arrow-path';
    import IconStop from '~icons/heroicons/stop';
    import IconArrowDownTray from '~icons/heroicons/arrow-down-tray';

    import { EXAMPLES } from '@assets/examples';

    import { 
        sendMessage, 
        clearMessages, 
        stopGeneration,
        exportConversation,
        isGeneratingStore,
        anyModelLoadingStore,
        hasActiveConversationsStore 
    } from '@stores/messages';

    let message = $state("");

    async function handleSend() {
        if (message.trim() && !$isGeneratingStore) {
            await sendMessage(message);
            message = "";
        }
    }

    function handleClear() {
        if (confirm('Are you sure you want to clear all conversations?')) {
            clearMessages();
        }
    }

    function useExample(exampleMessage: string) {
        message = exampleMessage;
    }

    function handleExport() {
        const content = exportConversation();
        const blob = new Blob([content], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `llm-arena-conversation-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
</script>

<div class="mt-12 w-auto max-w-4xl mx-auto">
    <div class="mb-4">
        <div class="flex flex-wrap align-middle gap-2">
            <p class="text-sm py-1.5 text-gray-600">Try an example:</p>
            {#each EXAMPLES as example}
                <button 
                    class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    onclick={() => useExample(example.message)}
                    disabled={$isGeneratingStore}
                >
                    {example.label}
                </button>
            {/each}
        </div>
    </div>

    <div class="shadow-lg p-4 bg-gray-100 rounded-xl">
        <div class="flex content-center gap-4">
            <textarea 
                name="" 
                id="" 
                placeholder="How can I help you?"
                rows="4"
                class="grow focus:outline-0 rounded-lg p-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
                bind:value={message}
                disabled={$isGeneratingStore}
                onkeydown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
            ></textarea>
            
            {#if $anyModelLoadingStore}
                <button 
                    class="text-4xl cursor-pointer text-red-500 hover:text-red-600 transition-colors"
                    onclick={stopGeneration}
                    title="Stop generation"
                >
                    <IconStop />
                </button>
            {:else}
                <button 
                    class="text-4xl cursor-pointer text-emerald-500 hover:text-emerald-600 transition-colors 
                        disabled:text-gray-400 disabled:cursor-not-allowed"
                    onclick={handleSend}
                    disabled={!message.trim() || $isGeneratingStore}
                    title="Send message"
                >
                    <IconPaperAirPlane />
                </button>
            {/if}
        </div>
        
        <div class="flex gap-4 justify-between mt-2 flex-wrap">
            <span class="text-sm italic text-gray-500">
                Generated content may be inaccurate or false.
            </span>
            
            <div class="flex gap-4">
                {#if $hasActiveConversationsStore}
                    <button 
                        class="flex items-center gap-1 text-sm cursor-pointer text-blue-500 hover:text-blue-600 transition-colors"
                        onclick={() => handleExport()}
                        title="Export as JSON"
                    >
                        <IconArrowDownTray />
                        <span>JSON</span>
                    </button>
                
                {/if}

                <button 
                    class="flex items-center gap-1 text-sm cursor-pointer text-red-500 hover:text-red-600 transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    onclick={handleClear}
                    disabled={$isGeneratingStore}
                >
                    <IconArrowPath />
                    <span>Clear</span>
                </button>
            </div>
        </div>
    </div>
</div>