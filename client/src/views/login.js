define('views/login', ['services/server'], function (ServerService) {
    return {
        template: `
<div>
    <input name="user" v-model="user" />
    <input name="password" type="password" v-model="password" />
    <input type="button" @click="logIn()" value="Log in" />
    <div>{{error}}</div>
</div>
`,
        data: () => ({
            user: '',
            password: '',
            error: ''
        }),

        methods: {
            logIn() {
                ServerService
                    .authenticate(this.user, this.password)
                    .then(() => {
                        window.location.hash = '/map';
                    }).catch((error) => {
                        this.error = error;
                    });
            }
        }
    };
});
