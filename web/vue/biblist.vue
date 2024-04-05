<script setup>
import { ref, onMounted, defineProps } from "vue"
import { bib2json } from "util"

const props = defineProps({id: String, bib_path: String})

const id = ref(props.id)
const bib = ref(null)
const years = ref(null)
const import_bib = async () => {
    const [years_list, bib_list] = await bib2json(props.bib_path, false)
    years.value = years_list
    bib.value = bib_list
}
onMounted(import_bib)
</script>
<template>
    <div :id="`${id}_papers`">
        <div v-for="year in years" :id="`${id}_${year}`">
            <h3>{{ year }}</h3>
            <ul :id="`${id}list_${year}`">
                <li class="list_item" v-for="(item, idx) in bib[year]" :id="`${id}_${year}_${idx}`">
                    {{ item.body }}
                    <span v-if="'url' in item">(<a :href="item.url" target="_blank">link</a>)</span>
                </li>
            </ul>
        </div>
    </div>
</template>