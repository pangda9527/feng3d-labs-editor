
export var giteeOauth: GiteeOauth;

/**
 * gitee API Https
 */
var giteeAPIHttps = {
    authorize: "https://gitee.com/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code",
    token: "https://gitee.com/oauth/token?grant_type=authorization_code&code={code}&client_id={client_id}&redirect_uri={redirect_uri}&client_secret={client_secret}",
};

interface APP
{
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    code?: string;
    access_token?: string;
}

var apps: APP[] = [{
    client_id: "0e3da311c2d436a79839b7f1dcb88ae497e8922c477e31646067f915b47605dc",
    client_secret: "a5b4140fdc117780dd7cbe4360d1630adbbb5c87653ce03cf601f31905697f0a",
    redirect_uri: "http://feng3d.com/editor/index.html",
},
{
    client_id: "6480af098768d099a0922b938e500801e7f06b7632f4c97606c296cf9125237b",
    client_secret: "d55fc4fa66bde168ba91279cef814d3d059d5b4f6929ef3bc4f44ccc4f28fb4e",
    redirect_uri: "http://127.0.0.1:8080",
}];

/**
 * 当前 APP
 */
var currentAPP: APP;

/**
 * 获取url路径
 * 
 * @param template url模板
 * @param param 参数
 */
function getHttpUrl(template: string, param: Object)
{
    for (const key in param)
    {
        if (param.hasOwnProperty(key))
        {
            template = template.replace(`{${key}}`, param[key]);
        }
    }
    return template;
}

/**
 * gitee 认证授权
 */
export class GiteeOauth
{
    /**
     * 认证授权
     * 
     * @param callback 完成回调
     */
    oauth(callback?: () => void)
    {
        var app = apps.filter(v => document.URL.indexOf(v.redirect_uri) == 0)[0];
        if (app)
        {
            if (document.URL.indexOf("code=") != -1)
            {
                app.code = document.URL.substring(document.URL.indexOf("code=") + "code=".length);
                currentAPP = app;

                alert(`已认证授权`);

                this.getAccessToken();
                // this.getUser();
                return;
            } else
            {
                var url = getHttpUrl(giteeAPIHttps.authorize, app);
                document.location = <any>url;
            }
        } else
        {
            alert(`gitee认证只支持 ${apps.map(v => v.redirect_uri).toString()}`);
        }
    }

    getAccessToken()
    {
        var urls = getHttpUrl(giteeAPIHttps.token, currentAPP).split("?");
        var url = urls[0];
        var body = urls[1];

        var xhr = new XMLHttpRequest();

        //Send the proper header information along with the request
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = (ev) =>
        {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
            {
                // Request finished. Do processing here.
            }
        }
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.send(body);
    }

    getUser()
    {
        var request = new XMLHttpRequest();
        request.onreadystatechange = (ev) =>
        {
            var result: string = ev.type;
            if (request.readyState == 4)
            {// 4 = "loaded"

                request.onreadystatechange = <any>null;

                // handle retries in case of load failure
                if (request.status < 200 || request.status > 300)
                {
                    // // increment counter
                    // numTries = ~~numTries + 1;

                    // // exit function and try again
                    // args.numRetries = args.numRetries || 0;
                    // if (numTries < ~~args.numRetries + 1)
                    // {
                    //     return loadTxt(path, callbackFn, args, numTries);
                    // }
                }
                // execute callback
                // callbackFn(path, result, ev.defaultPrevented, request.responseText);
            }
        };
        request.open('Get', `https://gitee.com/api/v5/user?access_token=${currentAPP.access_token}`, true);
        request.send();
    }

}

giteeOauth = new GiteeOauth();
