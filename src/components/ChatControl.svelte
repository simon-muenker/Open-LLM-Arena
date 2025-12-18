<script lang="ts">
    import IconPaperAirPlane from '~icons/heroicons/paper-airplane';
    import IconArrowPath from '~icons/heroicons/arrow-path';

    import { addMessage, clearMessages } from '@stores/messages';

    let message = $state("");
</script>

<div class="mt-12 w-auto max-w-2xl mx-auto shadow-lg p-4 bg-gray-100 rounded-xl">
    <div class="flex content-center gap-4">
        <textarea 
            name="" 
            id="" 
            placeholder="How can I help you?"
            rows="4"
            class="grow focus:outline-0"
            bind:value={message}
        ></textarea>
        <button 
            class="text-4xl cursor-pointer text-emerald-500"
            on:click={() => addMessage(message)}
        >
            <IconPaperAirPlane />
        </button>
    </div>
    <div class="flex gap-4 justify-between">
        <span class="text-sm italic text-gray-500">Generated content may be inaccurate or false.</span>
        <button 
            class="text-sm cursor-pointer text-red-500"
            on:click={clearMessages}
        >
            <IconArrowPath />
        </button>
    </div>
</div>