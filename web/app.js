const pub_path = "./web/vue/publication.vue"
const cv_path = "./web/vue/cv.vue"

const router = new VueRouter({
    routes: [
        {
            path: "/cv",
            component: httpVueLoader(cv_path),
            props: {
                cv_path: "./list/cv.md"
            }
        },
        {
                path: "/publication",
                component: httpVueLoader(pub_path),
                props: {
                    cisbib_path: "./list/paper_cis.bib", othersbib_path: "./list/paper_others.bib"
                }
        },
        {
                path: "/*",
                component: httpVueLoader(pub_path),
                props: {
                    cisbib_path: "./list/paper_cis.bib", othersbib_path: "./list/paper_others.bib"
                }
        }
    ]
})

const app = new Vue({
    el: "#app",
    router,
})