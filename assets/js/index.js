// $(function() {

//     })
//发起请求
function getUserInfor() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('Token') || ''
        // },

        //complete请求成功或失败都会执行complete
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                layui.layer.msg('获取用户信息失败');
                $('.layui-nav-img').hide()
                return
            }
            //成功后进行渲染头像
            readAvatar(res.data)
        }
    })
}
getUserInfor()

//渲染用户头像
function readAvatar(user) {
    let name = user.nickname || user.username //
    $('#welcome').html('欢迎您&nbsp' + name)
        //判断原来是否有头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
//退出登录
let layer = layui.layer
$('.log-off').on('click', function() {
    layer.confirm('确定退出吗?', { title: '提示' }, function(index) {
        //do something  点击确定后执行
        //清除token的值
        localStorage.removeItem('token')
            //跳转到登录页面
        location.assign('./login.html')
        layer.close(index);
    });
})