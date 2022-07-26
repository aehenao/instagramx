import fs from 'fs';
import * as puppeteer from 'puppeteer';
const importDynamic = new Function('modulePath', 'return import(modulePath)');
const fetch = async (...args:any[]) => {
  const module = await importDynamic('node-fetch');
  return module.default(...args);
};
import { Variables, QueryHash } from 'interface';

export default class InstaX {
    puppeteer_options: object;
    dir_session      : any;
    status_session   : boolean;
    app_id           : string;
    ig_url           : string;
    ig_api_url       : string;
    headers          : HeadersInit;
    browser          : any;
    page             : any;
    csrf_token       : string;
    user_agent       : string;
    ig_grap_url      : string;
    query_hash       : QueryHash;
    old_username     : string;

    /**
     * 
     * @param puppeteer_options  puppeteer native options
     * @param dir_session   directory for chromium session file folder
     * @param user_agent  text for the browser agent to use in the request header.
     */
    constructor(
        puppeteer_options: Object = { headless: true, userDataDir: __dirname + '/session' },
        dir_session: any = __dirname + '/session',
        user_agent:string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
    ) {
        this.puppeteer_options = puppeteer_options;
        this.dir_session       = dir_session;
        this.status_session    = false;
        this.app_id            = '';
        this.csrf_token        = '';
        this.ig_url            = 'https://www.instagram.com';
        this.ig_api_url        = 'https://i.instagram.com/api/v1/';
        this.ig_grap_url       = 'https://www.instagram.com/graphql/query/';
        this.headers           = {};
        this.browser           = null;
        this.page              = null;
        this.user_agent        = user_agent;
        this.query_hash        = {
            followers: '37479f2b8209594dde7facb0d904896a',
            following: '58712303d941c6855d4e888c5f0cd22f'
        };
        this.old_username      = '';
    }

    /**
     * 
     * @param username Username of some account to login to instagram.
     * @param password Password of some account to login to instagram.
     * @returns True or False
     */
    async login(username: string, password: string): Promise<boolean> {
        try {
            if(username.length === 0 && password.length === 0) return false;
            if (fs.existsSync(this.dir_session)) this.status_session = true;

            this.browser = await puppeteer.launch(this.puppeteer_options);
            this.page = await this.browser.newPage();


            // Access the page
            await this.page.goto(this.ig_url);
            await this.page.setDefaultTimeout(0);

            if (!this.status_session) {
                await this.page.waitForSelector("input[name='username']");
                await this.page.waitForTimeout(2500);

                // Get the inputs on the page
                let usernameInput = await this.page.$("input[name='username']");
                let passwordInput = await this.page.$("input[name='password']");

                // Type the username in the username input
                await usernameInput.click();
                await this.page.keyboard.type(username, { delay: 100 });

                // Type the password in the password input
                await passwordInput.click();
                await this.page.keyboard.type(password, { delay: 100 });
                await this.page.waitForTimeout(800);

                // Click the login button
                await this.page.click('#loginForm button[type="submit"]');
                await this.page.waitForTimeout(1000);
                let error_login = await this.page.evaluate(() => ((<HTMLInputElement>document.querySelector('p[data-testid="login-error-message"]'))?.innerText));

                if (error_login != undefined) {
                    console.log('Error:', error_login);
                    await this.browser.close();
                    process.exit(500);
                }
                await this.page.waitForNavigation();
                this.status_session = true;
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param username Username to search for to return the instagram ID.
     * @returns instagram user id
     */
    async getUserId(username: string): Promise<number> { 
        try {
           let data_user: object = await this.profileInfo(username);  
           return (<any>data_user).data?.user.id;
        } catch (error) {
           throw error; 
        }
     }

    /**
     * 
     * @param username Username to search
     * @returns Object with user account information.
     */
    async profileInfo(username: string): Promise<any> { 
        if(!await this.__getHeaders(username)) throw 'Error al crear el encabezado';
        try {
            let response = await fetch(this.ig_api_url + 'users/web_profile_info/?username=' + username,{
                method: 'GET',
                headers: this.headers,
                redirect: 'follow',
            })
            if(!await response.ok) return {};
            let data = await response.json();
            return (<any>data); 
        } catch (error) {
           throw error; 
        }
     }

    async __getHeaders(username: string): Promise<boolean> { 
        if(this.status_session && (Object.keys(this.headers).length > 0) && this.old_username === username) return true;
        try {
            username = username.trim();
            await this.page.goto(this.ig_url + '/' + username);
            await this.page.waitForSelector(`a[href='/${username}/followers/'`);
            await this.page.waitForTimeout(800);

            let cookies = await this.page.cookies();

            this.csrf_token = cookies.filter((el: any) => (el.name === 'csrftoken') )[0].value;
            let mid        = cookies.filter((el: any) => (el.name === 'mid') );
            let ig_did     = cookies.filter((el: any) => (el.name === 'ig_did') );
            let ig_nrcb    = cookies.filter((el: any) => (el.name === 'ig_nrcb') );
            let rur        = cookies.filter((el: any) => (el.name === 'rur') );
            let datr       = cookies.filter((el: any) => (el.name === 'datr') );
            let sessionid  = cookies.filter((el: any) => (el.name === 'sessionid') );
            let ds_user_id = cookies.filter((el: any) => (el.name === 'ds_user_id') );

            let script_appId = await this.page.evaluate(() => {
                let scripts = Array.from(document.querySelectorAll('script'));
                let text = '';

                scripts.forEach(script => {
                    if(script.innerText.includes('appId')) text = script.innerText;
                });

                return text;
            });

            let regx = /("appId"."\d*")/gm;
            let matchs = regx.exec(script_appId);
            
            if(matchs !== null) {

                this.app_id = matchs[0].split(':')[1].replace('"', '').replace('"', '');
                
                this.headers = {
                'User-Agent': this.user_agent,
                'x-ig-app-id': this.app_id,
                'x-csrftoken': this.csrf_token,
                'Cookie': `mid=${mid[0].value}; ig_did=${ig_did[0].value}; ig_nrcb=${ig_nrcb[0].value}; csrftoken=${this.csrf_token}; ds_user_id=${ds_user_id[0].value}; sessionid=${sessionid[0].value}; rur=${rur[0].value}`
                }
            }
            this.old_username = username;
            return true;
        } catch (error) {
           throw error; 
        }
     }

    /**
     * 
     * @param username Username to get followers
     * @param user_id ID of the user to get followers (getUserId)
     * @param after Hash of the next query.
     * @returns array with object
     */
    async getListFollowers(username: string, user_id: number, after: string): Promise<Array<object>> { 
        try {
            if(!await this.__getHeaders(username)) throw 'Error al crear el encabezado';
            let data: Array<object>  = [];
            let variables: Variables = {
                id: user_id,
                after: after,
                first: 50
            };

            let urlEncode: string = encodeURI(JSON.stringify(variables));
            let response = await fetch(this.ig_grap_url + `?query_hash=${this.query_hash.followers}&variables=${urlEncode}`,{
                method: 'GET',
                headers: this.headers,
                redirect: 'follow',
            })

            if(await response.ok) {
                response = await response.json();
                let followers = response.data?.user.edge_followed_by.edges;
                let { has_next_page, end_cursor } = response.data?.user.edge_followed_by.page_info;
                data.push({
                    users: followers,
                    next_page: has_next_page,
                    after: end_cursor
                });
            }
            return data; 

        }catch(error) {
            throw error;
        }
        
    }

    /**
     * 
     * @param username Username to get followers
     * @param user_id ID of the user to get followers (getUserId)
     * @param after Hash of the next query.
     * @returns array with object
     */
    async getListFollowings(username: string, user_id: number, after: string): Promise<object> {
        try {
            if(!await this.__getHeaders(username)) throw 'Error al crear el encabezado';
            let data: Array<object>  = [];
            let variables: Variables = {
                id: user_id,
                after: after,
                first: 50
            };

            let urlEncode: string = encodeURI(JSON.stringify(variables));
            let response = await fetch(this.ig_grap_url + `?query_hash=${this.query_hash.following}&variables=${urlEncode}`,{
                method: 'GET',
                headers: this.headers,
                redirect: 'follow',
            })

            if(await response.ok) {
                response = await response.json();
                let followings = response.data?.user.edge_follow.edges;
                let { has_next_page, end_cursor } = response.data?.user.edge_follow.page_info;
                data.push({
                    users: followings,
                    next_page: has_next_page,
                    after: end_cursor
                });
            }
            return data; 

        }catch(error) {
            throw error;
        }
    }

    /**
     * 
     * @returns puppeteer session status
     */
    async getSessionStatus(): Promise<boolean> {
        if (fs.existsSync(this.dir_session)) return true;
        return false;
    }

    async removeSession(): Promise<boolean> {
       if(!await this.getSessionStatus()) return false; 
        try {
           fs.rmdirSync(this.dir_session, { recursive: true });
           return true;
        } catch (error) {
           return false; 
        }
    }

    async browserClose() {
        try {
            await this.browser.close();        
        } catch (error) {
           throw error; 
        }
    }

}
