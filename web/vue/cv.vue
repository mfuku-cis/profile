<template>
    <div id="cv">
        <h1>CV</h1>
        <!-- <div class="image-frame">
            <img class="img-fluid rounded" src="./web/img/fuku.jpg">
        </div> -->
        <div v-for="(sect, i) in cv_data" :id="`sect${i}`">
            <h2 class="border-bottom">{{ sect.name }}</h2>
            <div class="section">
                <div v-for="(list, j) in sect.lists" :id="`list-${i}-${j}`">
                    <h3 v-if="'name' in list"> {{ list.name }}</h3>
                    <p>
                        <ul class="list-unstyled">
                            <li class="list_item" v-for="(litem, k) in list.items" :id="`list-${i}-${j}-${k}`">
                                <span v-if="'heading' in litem">{{ litem.heading }}:</span>
                            
                                <a v-if="'href' in litem" :href="litem.href" class="link-primary" target="_blank">
                                    <span>{{ litem.body }}</span>
                                </a>
                                <span v-else>{{ litem.body }}</span>
                            </li>
                        </ul>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    props: {
        cv_path: String
    },
    data: function() {
        return {
            cv_data: null
        }
    },
    created: async function () {
        const cv_md = await file2str(this.cv_path)

        // usage: https://marked.js.org/using_pro#renderer  
        const renderer = {
            heading(text, level) {
                if (level == 1) { return "" }
                return `{"type": ${level}, "name": "${text}"},`
            },
            list(body, ordered) {
                return `{"type": "list", "body": [${body}]},`
            },
            listitem(text) {
                if (text.match(/"href":/)){
                    return text
                }
                const listed = text.split(": ")

                if (listed.length == 1) {
                    return `{"body": "${text}"},`
                } else {
                    return `{"heading": "${listed[0]}", "body": "${listed[1]}"},`
                }
            },
            link(href, title, text) {
                return `{"href": "${href}", "body": "${text}"},`
            }
        }
        marked.use({ renderer })

        const parsed = `[${marked.parse(cv_md)}]`
        const tremed = parsed.replace(/,]/g, "]").replace(/,}/g, "}")

        // console.log(tremed)

        const cv_json = JSON.parse(tremed)
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
        // console.log(JSON.stringify(result))

        this.cv_data = result
    }
}
</script>