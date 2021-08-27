$(function() {
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        //两次密码保证不一致
        samepsw: function(value) {
            let oldPsw = $(".oldPsw").val();
            if (oldPsw === value) {
                return "新旧密码不能相同";
            }
        },
        //确认密码要一致
        repass: function(value, item) {
            let newPsw = $(".newPsw").val();
            if (newPsw !== value) {
                return "两次密码不一致";
            }
        },
    });
    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(), //需要设置name
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg("修改密码失败");
                layer.msg("修改密码成功");
                //重置表单
                $(".layui-form")[0].reset();
            },
        });
    });
});