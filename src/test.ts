import InstaX from "./index";
import 'dotenv/config'

const instaX = new InstaX();

let username: string = process.env.USERNAME;
let password: string = process.env.PASSWORD;

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
