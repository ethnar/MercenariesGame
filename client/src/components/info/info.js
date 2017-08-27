define('components/info/info', [], () => Vue.component('info', {
    props: [
        'message'
    ],

    computed: {
        pieces () {
            return this.message.match(/\{[^}]+\}|[^{}]+/g).map(item => {
                if (item.substr(0, 1) === '{') {
                    let [type, id, label] = item.match(/[^:{}]+/g);
                    return {
                        href: '#/' + type.toLowerCase() + '/' + id,
                        label: label
                    }
                } else {
                    return {
                        label: item
                    };
                }
            });
        }
    },

    template: `
<div>
    <a v-for="piece in pieces" :href="piece.href">{{piece.label}}</a>
</div>
    `,
}));
