$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    if (options.url.includes('/my/')) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //complete请求成功或失败都会执行complete
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            console.log(res);
            localStorage.removeItem('token')
            location.assign('./login.html')
        }
    }
})