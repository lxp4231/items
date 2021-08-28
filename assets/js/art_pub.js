$(function () {
  let form = layui.form;
  let layer = layui.layer;
  initCate();
  initEditor();
  // 分类选择框
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) return layer.msg("获取文章分类信息失败");
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render(); //layui重新渲染
      },
    });
  }
  //裁剪
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //点击选择封面
  $(".cover_btn").on("click", function () {
    $("#file").click();
    //监听文件选择框的chang事件
    $("#file").on("change", function (e) {
      //1. 拿到用户选择的文件
      let file = e.target.files;
      //判断是否为空
      if (file.length === 0) return;
      // 2.根据选择的文件，创建一个对应的 URL 地址：
      let newImgURL = URL.createObjectURL(file[0]);
      //3.
      $image
        .cropper("destroy") // 销毁旧的裁剪区域
        .attr("src", newImgURL) // 重新设置图片路径
        .cropper(options); // 重新初始化裁剪区域
    });
  });
  let art_state = "已发布"; //定义文章发布状态(默认为已发布)
  //点击草稿后，将art_state = "草稿"
  $("#btn-draft").on("click", function () {
    art_state = "草稿";
  });
  //监听表单提交事件，将各个值保存到FormData中
  $("#art_pub").on("submit", function (e) {
    e.preventDefault();
    // 基于form表单，创建formData对象///////
    let fd = new FormData($(this)[0]); //$(this)[0]指form这个表单
    //追加值
    fd.append("state", art_state);

    //将文件裁剪的文件输出为文件
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      // 将 Canvas 画布上的内容，转化为文件对象
      .toBlob(function (blob) {
        //blob为文件值
        fd.append("cover_img", blob);
        publishArticle(fd); //在此处调用
      });
  });
  //发布文章
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      contentType: false,
      processData: false,
      // 注：向服务器提交的是FormData格式的数据，必须添加两个配置项：
      // contentType: false, processData: false
      success: function (res) {
        console.log(res);
        if (res.status !== 0) return layer.msg("发表文章失败");
        layer.msg("发表文章成功");
        //发布成功后跳到文章列表页面
        location.href = "../article/art_list.html";
      },
    });
  }
});
