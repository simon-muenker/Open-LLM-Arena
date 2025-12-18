<script lang="ts">
    import snarkdown from "snarkdown"; 

    import {messagesStore} from "@stores/messages";
</script>

<div class="flex justify-center gap-8">
    {#each Object.entries($messagesStore) as [model, messages]}
        <div class="w-auto max-w-2xl">
            <h2 class="text-xl mb-4">Model: {model}</h2>
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
