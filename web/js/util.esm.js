import { use, parse } from "marked"

const file2str = async (filepath) => {
	const res = await fetch(filepath)
	return await res.text()
}

const parseAuthors = (author_txt) => {
    let authors = [author_txt]
    if(author_txt.includes(" and ")) {
        authors = author_txt.split(" and ")
    }
    const result = []
    for (let author of authors) {
        if (author.includes(",")) {
            author = author.split(", ")
            result.push(`${author[1]} ${author[0]}`)
        }
        else {
            result.push(author)
        }
    }
    return result

}

const removeTexFromFile = (tex_txt) => tex_txt.replace(/--/g, "-").replace(/~/g, " ")
const removeTexFromItm = (tex_lst_itm) => tex_lst_itm.replace(/{/g, "").replace(/}/g, "")

export const bib2json = async (filepath, asc=ture) => {
    const bib_text = await file2str(filepath)
    // usage & referred: https://marked.js.org/using_pro#renderer  
    const bib_list = bibtexParse.toJSON(removeTexFromFile(bib_text))

    const years = []
    const result = {}
    for(const bib of bib_list) {
        if (bib.entryType == "COMMENT") { continue }

        const content = bib.entryTags
        content.title = removeTexFromItm(content.title)
        content.author = parseAuthors(content.author)

        if (!(content.year in result)) {
            years.push(content.year)
            result[content.year] = []
        }

        const item = {}
        let body = null
        const others = []
        switch (bib.entryType.toLowerCase()) {
            case "incollection":
            case "inproceedings":
                others.push(content.booktitle)
                if ("series" in content && content.series != "") { others.push(content.series) }
                if ("volume" in content && content.volume != "") { others.push(content.volume) }
                if ("number" in content && content.number != "") { others.push(content.number) }
                if ("pages" in content && content.pages != "") { others.push(`pp.${content.pages}`) }
                others.push(`${content.month} ${content.year}`)
                if ("note" in content) { others.push(`(${content.note})`)}
                body = `${content.author.join(", ")}, "${content.title}," ${others.join(", ")}.`
                break;
            case "article":
                body = `${content.author.join(", ")}, "${content.title}," ${content.journal}, Vol.${content.volume}, No.${content.number}, pp.${content.pages}, ${content.month} ${content.year}.`
            case "misc":
                
                if ("howpublished" in content && content.howpublished != "") { others.push(content.howpublished) }
                body = `${content.author.join(", ")}, "${content.title}," ${others.join(", ")}, ${content.month} ${content.year}.`
            default:
                break;
        }
        item["body"] = body

        if ("url" in content) {
            item["url"] = content.url
        } else if ("doi" in content) {
            item["url"] = `https://doi.org/${content.doi}`
        }

        result[content.year].push(item)            
    }

    if (asc) {
        years.sort((a, b) => a - b)
    } else {
        years.sort((a, b) => b - a)
    }
        
    return [years, result]
}

export const md2json = async (filepath) => {
    const md_text = await file2str(filepath)

    // usage & referred: https://marked.js.org/using_pro#renderer  
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

    use({ renderer })

    const parsed = `[${parse(md_text)}]`
    const tremed = parsed.replace(/,]/g, "]").replace(/,}/g, "}")
    const json = JSON.parse(tremed)
    return json
}