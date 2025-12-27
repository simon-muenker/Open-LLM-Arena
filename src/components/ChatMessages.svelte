<script lang="ts">
    import snarkdown from "snarkdown";

    import IconSparkles from '~icons/heroicons/sparkles';
    import IconExclamationCircle from '~icons/heroicons/exclamation-circle';
    import IconCheckCircle from '~icons/heroicons/check-circle';
    import IconArrowPath from '~icons/heroicons/arrow-path';

    import { MODELS } from "@assets/models";

    import { conversationsStore } from "@stores/messages";
    import { selectionStore } from "@stores/selection";


    function getStatusColor(status: string) {
        switch (status) {
            case 'loading': return 'text-blue-500 animate-spin';
            case 'error': return 'text-red-500';
            case 'idle': return 'text-green-500';
            default: return 'text-gray-500';
        }
    }
</script>

{#if $selectionStore.models.length === 0}
    <div class="w-auto max-w-4xl mx-auto my-12 text-center text-gray-500 italic">
        Please select at least one model to start chatting
    </div>
{:else}
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {#each Object.entries($conversationsStore) as [modelUrl, conversation]}
            {@const model = MODELS.find(m => m.url === modelUrl)}
            {#if model}
                <div class="bg-white rounded-xl shadow-md p-6 flex flex-col h-full">
                    <div class="mb-4 pb-4 border-b border-gray-200 flex justify-between items-start">
                        <div>
                            <h3 class="text-xl font-bold">{model.name}</h3>
                            <p class="text-sm text-gray-500">{model.size}B parameters</p>
                        </div>
                        <div class={`text-2xl ${getStatusColor(conversation.status)}`}>
                            {#if conversation.status == "loading"}
                                <IconArrowPath />
                            {:else if conversation.status == "error"}
                                <IconExclamationCircle />
                            {:else}
                                <IconCheckCircle />
                            {/if}
                        </div>
                    </div>

                    {#if conversation.status === 'error' && conversation.error}
                        <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {conversation.error}
                        </div>
                    {/if}

                    <div class="flex flex-col gap-4 grow overflow-y-auto max-h-[400px]">
                        {#each conversation.messages as message, idx}
                            <div class="pb-3 border-b border-gray-100 last:border-0">
                                <span class="font-bold text-sm uppercase text-gray-600 mb-1 block">
                                    {message.role}
                                </span>
                                
                                <div class="mt-1 text-gray-800 prose prose-sm max-w-none">
                                    {@html snarkdown(message.content)}
                                </div>
                            </div>
                        {/each}

                        {#if conversation.status === 'loading'}
                            <div class="flex items-center gap-2 text-gray-500 animate-pulse">
                                <IconSparkles />
                                <span class="text-sm">Generating response...</span>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
{/if}