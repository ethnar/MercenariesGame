const TYPES = STATICS.WORLDVIEW.TYPES;

export default Vue.component('worldview', {
    props: [
        'data',
    ],

    data: () => ({
        labels: {
            [TYPES.SLAVERY]: 'Slavery',
            [TYPES.ENVIRONMENTALISM]: 'Environmentalism',
            [TYPES.DRUG_USE]: 'Drug use',
            [TYPES.CHILD_PROTECTION]: 'Child protection',
        },
    }),

    template: `
<div>
    <div v-for="aspect in Object.keys(data)" v-if="data[aspect]">
        {{labels[aspect]}}: {{data[aspect] > 0 ? 'Supporting' : 'Opposed'}}
    </div>
</div>
`,
});
