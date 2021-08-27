$(function() {
    //
    $("#link-reg").on("click", function() {
        $(".login-box").hide();
        $(".reg-box").show();
    });
    $("#link-login").on("click", function() {
        $(".reg-box").hide();
        $(".login-box").show();
    });

    //从layui中获取form对象
    $();
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        repwd: function(value, item) {
            //value：表单的值、item：表单的DOM对象
            let psw = $(".reg-box [name=password]").val();
            if (value !== psw) return "密码不一致";
        },
    });

    //根URL
    axios.defaults.baseURL = "http://api-breakingnews-web.itheima.net";

    //注册
    $("#form-reg").on("submit", function(e) {
        e.preventDefault();
        //发送请求
        // axios({
        //         method: 'POST',
        //         url: '/api/reguser',
        //         //请求体
        //         data: {
        //             username: $("#form-reg [name=username]").val(),
        //             password: $("#form-reg [name=password]").val()
        //         }
        //     }).then(res => {
        //         console.log(res);
        //         if (res.data.status !== 0) return layer.msg(res.data.message);
        //         layer.msg('注册成功');
        //     }) //???
        $.post(
            "/api/reguser", {
                username: $("#form-reg [name=username]").val(),
                password: $("#form-reg [name=password]").val(),
            },
            function(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg("注册成功");
            }
        );
        $("#link-login").click();
    });

    //登录
    $("#form-login").on("submit", function(e) {
        e.preventDefault();
        $.post(
            "/api/login", {
                username: $("#form-login [name=username]").val(),
                password: $("#form-login [name=password]").val(),
            },
            function(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg("登录成功");
                // 登录成功后把Token值存到本地
                localStorage.setItem("token", res.token);
                location.href = "./index.html";
            }
        );
    });
});