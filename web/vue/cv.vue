<script setup>
import { ref, onMounted, defineProps } from "vue"
import { md2json } from "util"
import { useI18n } from "i18n"

const props = defineProps({cv_path: String})
const { t, locale } = useI18n()

const cv_data = ref(null)
const lang = ref(locale.value)
const import_md = async () => {
    // Convert md file to JSON by the marked lib
    const cv_json = await md2json(props.cv_path)

    // Convert the marked JSON to the our format
    const result = []
    let list_name = null
    while (cv_json.length > 0) {
        const item = cv_json.shift()
        if (item.type == 2) {
            result.push({"name": item.name, "lists": []})
        } else if (item.type == 3) {
            list_name = item.name
        } else if (item.type == "list") {
            if (list_name == null) {
                result.slice(-1)[0].lists.push({"items": item.body})
            } else {
                result.slice(-1)[0].lists.push({"name": list_name, "items": item.body})
                list_name = null
            }
        }
    }
    cv_data.value = result
}
onMounted(import_md)
</script>

<template>
    <div id="cv">
        <h1>CV</h1>
        <div v-for="(sect, sect_idx) in cv_data" :id="`sect${sect_idx}`">
            <h2 class="border-bottom">{{ sect.name }}</h2>
            <div class="section">
                <div v-for="(lst, lst_idx) in sect.lists" :id="`lst-${sect_idx}-${lst_idx}`">
                    <h3 v-if="'name' in lst"> {{ lst.name }}</h3>
                    <p>
                        <ul class="list-unstyled">
                            <li class="list_item" v-for="(itm, itm_idx) in lst.items" :id="`lst-${sect_idx}-${lst_idx}-${itm_idx}`">
                                <span v-if="'heading' in itm">{{ itm.heading }}:</span>
                            
                                <a v-if="'href' in itm" :href="itm.href" class="link-primary" target="_blank">
                                    <span>{{ itm.body }}</span>
                                </a>
                                <span v-else>{{ itm.body }}</span>
                            </li>
                        </ul>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>