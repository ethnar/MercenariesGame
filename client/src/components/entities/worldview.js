export default Vue.component('worldview', {
    props: [
        'data',
    ],

    data: () => ({
        labels: {
            SLAVERY: 'Slavery',
            ENVIRONMENTALISM: 'Environmentalism',
            DRUG_USE: 'Drug use',
            CHILD_ABUSE: 'Child abuse'
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
