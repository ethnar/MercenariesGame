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
            this.$parent.registerTab(this.header, this.setVisibility);
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
                <slot></slot>
            </div>
        `,

        data: () => ({
            tabs: []
        }),

        methods: {
            registerTab (header, setVisibleCallback) {
                this.tabs.push({
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
