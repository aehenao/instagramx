import InstaX from "./index";

const instaX = new InstaX();

let username = '';
let password = '';

(() => {
    instaX.login(username, password)
    .then(status => {
        if(status) {
            let username: string = 'beautypalace_shop';
            instaX.getUserId(username)
            .then(user_id => {
                instaX.getListFollowers(username, user_id, '')
                .then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                })
            }).catch(error => {
                console.log('error al obtener user_id', error);
            })
        }
    })
})();
