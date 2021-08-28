$(function() {
    let form = layui.form;
    let layer = layui.layer;
    initArtcaleList();
    //初始化文章列表
    function initArtcaleList() {
        //发送请求
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                let tel = template("tpl-table", res);
                $("tbody").html(tel);
            },
        });
    }
    //
    let indexAdd = null;
    $("#btnAddCate").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            title: "添加文章分类",
            content: $("#add").html(),
            area: ["500px", "300px"],
        });
        // $("#form-add").on("submit", function() {
        //     console.log($(".name").val());
        // });
    });
    //添加分类
    //代理的方式绑定表单，因为绑定时，还未加载表单
    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault(); //阻止默认提价事件
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg("添加失败");
                $(".reset-btn").click();
                initArtcaleList();
                layer.msg("添加文章分类成功");
                layer.close(indexAdd);
            },
        });
    });
    //编辑分类
    //代理的方式绑定编辑按钮
    let indexEdit = null;
    // let id = null;
    $("tbody").on("click", ".btn-edit", function() {
        //弹出编辑框
        indexEdit = layer.open({
            type: 1,
            title: "编辑文章分类",
            content: $("#edit").html(),
            area: ["500px", "300px"],
        });

        //根据自定义属性修改值
        let id = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: `/my/article/cates/${id}`,
            success: function(res) {
                if (res.status !== 0) return layer.msg("获取文章分类数据失败");
                //表单填充
                form.val("formTest", res.data);
            },
        });
    });
    //代理的方式绑定编辑确认按钮
    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg("更新分类信息失败");
                layer.msg("更新分类信息成功");
                initArtcaleList();
                layer.close(indexEdit);
            },
        });
    });

    // //代理的方式绑定删除按钮
    $("tbody").on("click", ".btn-delete", function() {
        let id = $(this).attr("data-id");
        //提示框、、、、、
        layer.confirm("确定删除吗?", { icon: 3, title: "提示" }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: `/my/article/deletecate/${id}`,
                success: function(res) {
                    if (res.status !== 0) return layer.msg("删除分类失败");
                    layer.msg("删除分类成功");
                    initArtcaleList();
                },
            });
            layer.close(index);
        });
    });
});
//submit表单提交事件