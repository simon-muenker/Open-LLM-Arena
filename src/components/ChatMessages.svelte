<script lang="ts">
    import snarkdown from "snarkdown"; 

    import { MODELS } from "@assets/models";
    import { PERSONAS } from "@assets/personas";

    import {messagesStore} from "@stores/messages";
</script>

<div class="flex justify-center gap-16">
    {#each Object.entries($messagesStore) as [model, messages]}
        <div class="w-auto max-w-2xl">
            <h3>Models</h3>
            <div class="my-8 container mx-auto w-sm grid grid-cols-2 gap-4">
                {#each MODELS as item} 
                    <div class="px-4 py-3 bg-gray-100 rounded-3xl shadow-sm">
                        <span class="font-bold">{item.name}</span> 
                        <span class="text-sm font-thin">{item.size} B</span>
                    </div>
                {/each}
            </div>
            <h3>Personas</h3>
            <div class="my-8 container mx-auto w-sm grid grid-cols-2 gap-4">
                {#each PERSONAS as item} 
                    <div class="px-4 py-3 bg-gray-100 rounded-3xl shadow-sm">
                        <span class="pr-1">{item.icon}</span>
                        <span class="font-bold">{item.name}</span> 
                    </div>
                {/each}
            </div>
            <div class="flex flex-col gap-4">
                {#each messages as item}
                    <div class="">
                        <span class="font-bold text-lg">{item.role}</span>
                        <span class="block">{@html snarkdown(item.content)}</span>
                    </div>
                {/each}
            </div>
        </div>  
    {/each}
</div>
