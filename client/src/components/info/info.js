define('components/info/info', [], function () {
    return {
        components: {
        },

        template: `
            <div>
                <a v-for="piece in pieces" :href="piece.href">{{piece.label}}</a>
            </div>
        `,
        props: [
            'message'
        ],

        computed: {
            pieces () {
                return this.message.match(/\{[^}]+\}|[^{}]+/g).map(item => {
                    console.log(JSON.stringify(item));
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
        }
    };
});
