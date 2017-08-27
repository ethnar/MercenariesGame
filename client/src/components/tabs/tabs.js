define('components/tabs/tabs', [], function () {
    Vue.component('tab', {
        template: `
            <div class="tab" v-if="visible">
                <slot></slot>
            </div>
        `,

        props: [
            'header'
        ],

        data: () => ({
            visible: false
        }),

        mounted () {
            const nodes = [].slice.call(this.$el.parentNode.childNodes)
                .filter(node => node.nodeType !== node.TEXT_NODE);
            const idx = nodes.indexOf(this.$el);

            this.$parent.registerTab(idx, this.header, this.setVisibility);
        },

        methods: {
            setVisibility (visible) {
                this.visible = visible;
            }
        }
    });

    return {
        name: 'tabs',
        template: `
            <div class="tabs">
                <div class="tab-headers">
                    <div v-for="tab in tabs" :class="{ active: tab === lastTab}" @click="setActive(tab);">{{tab.header}}</div>
                </div>
                <div class="tab-contents">
                    <slot></slot>
                </div>
            </div>
        `,

        data: () => ({
            tabs: [],
            lastTab: null,
        }),

        mounted () {
            const startingTab = this.$router.currentRoute.query.tab;
            if (startingTab) {
                this.setActive(this.tabs.find(tab => tab.header === startingTab));
            }
        },

        methods: {
            registerTab (idx, header, setActiveCallback) {
                this.tabs.splice(idx, 0, {
                    header: header,
                    callback: setActiveCallback
                });
                if (!this.lastTab)
                {
                    this.lastTab = this.tabs[0];
                    this.lastTab.callback(true);
                }
            },

            setActive (tab) {
                this.lastTab.callback(false);
                tab.callback(true);
                this.lastTab = tab;
                this.$router.push({ query: {  tab: tab.header }});
            }
        }
    };
});
