let form = layui.form; //先引入form
let layer = layui.layer;
form.verify({
    nickname: function(val) {
        if (val.length > 6) {
            return "昵称长度必须是2~6个字符之间";
        }
    },
});
initUserInfo();
//初始化用户基本信息
function initUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg("获取用户信息失败");
            }
            console.log(res);
            form.val("userFormInfo", {
                username: res.data.username,
                nickname: res.data.nickname,
                email: res.data.email,
            });
        },
    });
}
//resetBtn
$(".resetBtn").on("click", function(e) {
    //阻止默认重置
    e.preventDefault();
    initUserInfo();
});

// 提交修改信息
$(".layui-form").on("submit", function(e) {
    //阻止默认提交行为
    e.preventDefault();
    $.ajax({
        method: "POST",
        url: "/my/userinfo",
        // data: {
        //     id: $('.username').val(),
        //     nickname: $('.nickname').val(),
        //     email: $('.email').val()
        // },
        data: $(this).serialize(),
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg("修改信息失败");
            }
            layer.msg(res.message);
            //
            window.parent.getUserInfor(); //未调用成功???
        },
    });
});