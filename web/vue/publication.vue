<script setup>
import { ref, defineProps } from "vue"
import BibList from "./biblist.vue"

import { useI18n } from "i18n"

const props = defineProps({cisbib_path: String, othersbib_path: String})
const { t, locale } = useI18n()

const lang = ref(locale.value)
const cisbib_path = ref(props.cisbib_path)
const othersbib_path = ref(props.othersbib_path)
</script>
<template>
    <div id="publication">
        <h1>Publication</h1>
        <h2 class="border-bottom">Peer-Reviewed Papers on Cryptography and Security</h2>
        <BibList id="cis" :bib_path="cisbib_path" />

        <h2 v-if="lang == 'ja'" class="border-bottom">Papers for the Others</h2>
        <BibList v-if="lang == 'ja'" id="others" :bib_path="othersbib_path" />
    </div>
</template>
