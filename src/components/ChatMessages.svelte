<script lang="ts">
    import snarkdown from "snarkdown"; 

    import { MODELS } from "@assets/models";
    import { PERSONAS } from "@assets/personas";

    import { messagesStore } from "@stores/messages";
    import { selectionStore, toggleModel, setPersona } from "@stores/selection";
</script>

<div class="mb-8">
    <div class="w-auto max-w-4xl mx-auto">
        <h3 class="text-2xl font-bold mb-4">Select Models</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            {#each MODELS as model} 
                <label class="cursor-pointer">
                    <div class="px-4 py-3 bg-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all
                        {$selectionStore.models.includes(model.url) ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}">
                        <input 
                            type="checkbox" 
                            class="mr-2"
                            checked={$selectionStore.models.includes(model.url)}
                            onchange={() => toggleModel(model.url)}
                        />
                        <span class="font-bold">{model.name}</span> 
                        <span class="text-sm font-thin">({model.size}B)</span>
                    </div>
                </label>
            {/each}
        </div>
    </div>

    <div class="w-auto max-w-4xl mx-auto mt-8">
        <h3 class="text-2xl font-bold mb-4">Select Persona</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {#each PERSONAS as persona} 
                <label class="cursor-pointer">
                    <div class="px-4 py-3 bg-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all
                        {$selectionStore.persona === persona.name ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}">
                        <input 
                            type="radio" 
                            name="persona"
                            class="mr-2"
                            checked={$selectionStore.persona === persona.name}
                            onchange={() => setPersona(persona.name)}
                        />
                        <span class="pr-1">{persona.icon}</span>
                        <span class="font-bold">{persona.name}</span> 
                    </div>
                </label>
            {/each}
        </div>
    </div>
</div>

{#if $selectionStore.models.length === 0}
    <div class="w-auto max-w-4xl mx-auto my-12 text-center text-gray-500 italic">
        Please select at least one model to start chatting
    </div>
{:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {#each Object.entries($messagesStore) as [modelUrl, messages]}
            {@const model = MODELS.find(m => m.url === modelUrl)}
            {#if model}
                <div class="bg-white rounded-xl shadow-md p-6">
                    <div class="mb-4 pb-4 border-b border-gray-200">
                        <h3 class="text-xl font-bold">{model.name}</h3>
                        <p class="text-sm text-gray-500">{model.size}B parameters</p>
                    </div>
                    <div class="flex flex-col gap-4 max-h-96 overflow-y-auto">
                        {#each messages as item}
                            <div class="pb-3 border-b border-gray-100 last:border-0">
                                <span class="font-bold text-sm uppercase text-gray-600">{item.role}</span>
                                <div class="mt-1 text-gray-800">{@html snarkdown(item.content)}</div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
{/if}