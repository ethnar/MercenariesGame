define('components/navbar', [], function () {
    return {
        name: 'navbar',
        template: `
<div>
    <a href="#/news">News</a>
    <a href="#/missions">Missions</a>
    <a href="#/sites">Sites</a>
</div>
`,
        created () {
        }
    };
});
