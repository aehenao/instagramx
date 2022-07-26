import InstaX from "./index";

const instaX = new InstaX();

let username = 'andyprueba12';
let password = 'Patito123';

(() => {
    instaX.login(username, password)
    .then(status => {
        if(status) {
            let username: string = 'beautypalace_shop';
            instaX.profileInfo(username)
            .then(info => {
                instaX.getListFollowings(username, info.data.user.id, '')
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
