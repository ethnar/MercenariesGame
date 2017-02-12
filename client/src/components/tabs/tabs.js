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
                    <div v-for="tab in tabs" @click="setVisible(tab);">{{tab.header}}</div>
                </div>
                <div class="tab-contents">
                    <slot></slot>
                </div>
            </div>
        `,

        data: () => ({
            tabs: []
        }),

        methods: {
            registerTab (idx, header, setVisibleCallback) {
                this.tabs.splice(idx, 0, {
                    header: header,
                    callback: setVisibleCallback
                });
                if (!this.lastTab)
                {
                    this.lastTab = this.tabs[0];
                    this.lastTab.callback(true);
                }
            },

            setVisible (tab) {
                this.lastTab.callback(false);
                tab.callback(true);
                this.lastTab = tab;
            }
        }
    };
});
