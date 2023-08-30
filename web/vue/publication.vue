<template>
    <div id="publication">
        <h1>Publication</h1>
        <h2 class="border-bottom">Peer-Reviewed Papers on Cryptography and Security</h2>
        <div id="cis_papers">
            <div v-for="year in Object.keys(cis).reverse()" :id="`cis_${year}`">
                <h3>{{ year }}</h3>
                <ul :id="`cislist_${year}`">
                    <li class="list_item" v-for="(item, index) in cis[year]" :id="`cis_${year}_${index}`">{{ item }}</li>
                </ul>
            </div>
        </div>
        <h2 class="border-bottom">Papers for the Others</h2>
        <div id="other_papers">
            <div v-for="year in Object.keys(others).reverse()" :id="`others_${year}`">
                <h3>{{ year }}</h3>
                <ul :id="`otherslist_${year}`">
                    <li class="list_item" v-for="(item, index) in others[year]" :id="`others_${year}_${index}`">{{ item }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    props: {
        cisbib_path: String,
        othersbib_path: String
    },
    data: function() {
        return {
            cis: null,
            others: null
        }
    },
    created: async function () {
        this.cis = await this.parseBib(this.cisbib_path)
        this.others = await this.parseBib(this.othersbib_path)
    },
    methods: {
        async parseBib(filepath) {
            const bib_text = await file2str(filepath)
            const bib_list = bibtexParse.toJSON(removeTexFromFile(bib_text))

            const result = {}
            for(const bib of bib_list) {
                if (bib.entryType == "COMMENT") { continue }

                const content = bib.entryTags
                content.title = removeTexFromItm(content.title)
                content.author = parseAuthors(content.author)

                if (!(content.year in result)) {
                    result[content.year] = []
                }

                let item = null
                switch (bib.entryType.toLowerCase()) {
                    case "incollection":
                    case "inproceedings":
                        const others = [content.booktitle]
                        if ("series" in content) { others.push(content.series) }
                        if ("volume" in content) { others.push(content.volume) }
                        if ("number" in content) { others.push(content.number) }
                        if ("pages" in content) { others.push(`pp.${content.pages}`) }
                        others.push(`${content.month} ${content.year}`)
                        if ("note" in content) { others.push(`(${content.note})`)}
                        item = `${content.author.join(", ")}, "${content.title}," ${others.join(", ")}.`
                        break;
                    case "article":
                        item = `${content.author.join(", ")}, "${content.title}," ${content.journal}, Vol.${content.volume}, No.${content.number}, pp.${content.pages}, ${content.month} ${content.year}.`
                    default:
                        break;
                }

                result[content.year].push(item)            
            }
            return result
        }
    }
}
</script>