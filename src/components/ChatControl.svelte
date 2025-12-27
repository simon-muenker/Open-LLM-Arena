<script lang="ts">
    import IconPaperAirPlane from '~icons/heroicons/paper-airplane';
    import IconArrowPath from '~icons/heroicons/arrow-path';

    import { addMessage, clearMessages } from '@stores/messages';
    import { getExampleMessages } from '@assets/examples';

    let message = $state("");
    const examples = getExampleMessages();

    function sendMessage() {
        if (message.trim()) {
            addMessage(message);
            message = "";
        }
    }

    function useExample(exampleMessage: string) {
        message = exampleMessage;
    }
</script>

<div class="mt-12 w-auto max-w-4xl mx-auto">
    <!-- Example Messages -->
    <div class="mb-4">
        <p class="text-sm text-gray-600 mb-2">Try an example:</p>
        <div class="flex flex-wrap gap-2">
            {#each examples as example}
                <button 
                    class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    onclick={() => useExample(example.message)}
                >
                    {example.label}
                </button>
            {/each}
        </div>
    </div>

    <!-- Message Input -->
    <div class="shadow-lg p-4 bg-gray-100 rounded-xl">
        <div class="flex content-center gap-4">
            <textarea 
                name="" 
                id="" 
                placeholder="How can I help you?"
                rows="4"
                class="grow focus:outline-0 rounded-lg p-2"
                bind:value={message}
                onkeydown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                }}
            ></textarea>
            <button 
                class="text-4xl cursor-pointer text-emerald-500 hover:text-emerald-600 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                onclick={sendMessage}
                disabled={!message.trim()}
            >
                <IconPaperAirPlane />
            </button>
        </div>
        <div class="flex gap-4 justify-between mt-2">
            <span class="text-sm italic text-gray-500">Generated content may be inaccurate or false.</span>
            <button 
                class="flex items-center gap-1 text-sm cursor-pointer text-red-500 hover:text-red-600 transition-colors"
                onclick={clearMessages}
            >
                <IconArrowPath />
                <span>Clear</span>
            </button>
        </div>
    </div>
</div>