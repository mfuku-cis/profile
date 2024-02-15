import { use, parse } from "marked"

export const file2str = async (filepath) => {
	const res = await fetch(filepath)
	return await res.text()
}

export const parseAuthors = (author_txt) => {
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

export const removeTexFromFile = (tex_txt) => tex_txt.replace(/--/g, "-").replace(/~/g, " ")
export const removeTexFromItm = (tex_lst_itm) => tex_lst_itm.replace(/{/g, "").replace(/}/g, "")

export const md2json = async (md_text) => {
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

    use({ renderer })

    const parsed = `[${parse(md_text)}]`
    const tremed = parsed.replace(/,]/g, "]").replace(/,}/g, "}")
    const json = JSON.parse(tremed)
    return json
}