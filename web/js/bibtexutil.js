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