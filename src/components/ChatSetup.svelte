<script lang="ts">
    import IconInformationCircle from '~icons/heroicons/information-circle';

    import { MODELS } from "@assets/models";
    import { PERSONAS } from "@assets/personas";

    import { selectionStore, toggleModel, setPersona } from "@stores/selection";
</script>

<div class="mb-8">
    <div class="w-auto max-w-4xl mx-auto">
        <h3 class="text-2xl font-bold mb-4">Select Models</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
            {#each MODELS as model} 
                <label class="cursor-pointer">
                    <div class="px-4 py-3 bg-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all
                        {$selectionStore.models.includes(model.url) ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}">
                        <div class="flex justify-between">
                            <div>
                                <input 
                                    type="checkbox" 
                                    class="mr-2"
                                    checked={$selectionStore.models.includes(model.url)}
                                    onchange={() => toggleModel(model.url)}
                                />
                                <span class="font-bold">{model.name}</span> 
                                <span class="text-sm font-thin">({model.size}B)</span>
                            </div>
                            <a 
                                href="https://huggingface.co/{model.url}"
                                target="_blank"
                            >
                                <IconInformationCircle />
                            </a>
                        </div>
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
