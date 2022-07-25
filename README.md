
# Instragram-X

Unofficial library for Instagram with which you can obtain user account information such as the list of followers you have, number of posts, etc.

**In continuous development 😄**
## Functions

Obtain profile information
*  number of followers and followed.
* publications.
* biography.
* profile photos.
* verified account.
* Publications
* etc..

## Installation

Install my-project with npm

```bash
 npm i instagram-x
```
    
## Usage/Examples

```javascript
import InstaX from "instagram-x";

const instaX = new InstaX();

let username = 'user';
let password = 'pass';

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
```


## Supporting the project

You can support the maintainer of this project through the links below

[Support via Paypal](https://paypal.me/aehenao?country.x=CO&locale.x=es_XC)

## Authors

- [@aehenao](https://www.github.com/aehenao)


## License

[MIT](https://choosealicense.com/licenses/mit/)

