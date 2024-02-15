<script setup>
import { ref, defineProps } from "vue"
import BibList from "./biblist.vue"

const props = defineProps({cisbib_path: String, othersbib_path: String})
const cisbib_path = ref(props.cisbib_path)
const othersbib_path = ref(props.othersbib_path)
</script>
<template>
    <div id="publication">
        <h1>Publication</h1>
        <h2 class="border-bottom">Peer-Reviewed Papers on Cryptography and Security</h2>
        <BibList id="cis" :bib_path="cisbib_path" />

        <h2 class="border-bottom">Papers for the Others</h2>
        <BibList id="others" :bib_path="othersbib_path" />
    </div>
</template>
