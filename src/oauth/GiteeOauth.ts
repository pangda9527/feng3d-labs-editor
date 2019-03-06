namespace editor
{
    export var giteeOauth: GiteeOauth;

    /**
     * 授权路径 
     * 
     * @see https://gitee.com/api/v5/oauth_doc
     */
    var giteeOauthPath = "https://gitee.com/oauth/authorize?client_id=0e3da311c2d436a79839b7f1dcb88ae497e8922c477e31646067f915b47605dc&redirect_uri=http://feng3d.com/editor/index.html&response_type=code"

    /**
     * 授权测试路径 
     * 
     * @see https://gitee.com/api/v5/oauth_doc
     */
    var giteeOauthTestPath = "https://gitee.com/oauth/authorize?client_id=6480af098768d099a0922b938e500801e7f06b7632f4c97606c296cf9125237b&redirect_uri=http://127.0.0.1:8080&response_type=code"

    var oauthCode: string;

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
            if (document.URL.indexOf("code=") != -1)
            {
                oauthCode = document.URL.substring(document.URL.indexOf("code=") + "code=".length);

                this.getUser();
                alert(`已认证授权`);
                return;
            }

            if (document.URL.indexOf("http://feng3d.com/editor/index.html") == 0)
            {
                document.location = <any>giteeOauthPath;
            } else if (document.URL.indexOf("http://127.0.0.1:8080") == 0)
            {
                document.location = <any>giteeOauthTestPath;
            } else
            {
                alert(`gitee认证只支持 http://feng3d.com/editor/index.html 或者 http://127.0.0.1:8080`);
            }
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
            request.open('Get', `https://gitee.com/api/v5/user?access_token=${oauthCode}`, true);
            request.send();
        }

    }

    giteeOauth = new GiteeOauth();
}