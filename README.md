
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
* etc..

## Installation

Install my-project with npm

```bash
 npm i instagram-x
```


## Methods

#### constructor()

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `puppeteer_options` | `object` | Puppeteer native options |
| `dir_session` | `any` | Path where chrome session data is stored |
| `user_agent` | `string` | String containing navigation agent data. |

#### login()
Return promise True or False
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. User with which to log in. |
| `password` | `string` | **Required**. User password with which to log in. |

#### getUserId()

Return promise user id
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. User to whom you want to obtain the Instagram ID. |

#### profileInfo()

Return promise object
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Return promise object which contains all account information. |

#### getListFollowers()

Return promise array of object
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Return promise object which contains all account information. |
| `user_id` | `number` | **Required**. |
| `after` | `string` | Hash of the following query. |

#### getListFollowings()

Return promise array of object
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Return promise object which contains all account information. |
| `user_id` | `number` | **Required**. |
| `after` | `string` | Hash of the following query. |

#### getSessionStatus()
Return promise boolean.

Validates if the .session folder exists which stores the chromiun profile information

#### removeSession()
Delete the folder that saves the session files 
## Usage/Examples

```javascript
import InstaX from "instagram-x";

const instaX = new InstaX();

let username: string = 'user';
let password: string = 'pass';

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

