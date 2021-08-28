$(function () {
  let form = layui.form;
  var laypage = layui.laypage;

  //加0操作
  function addZero(n) {
    n = n > 10 ? n : "0" + n;
    return n;
  }
  //定义时间过滤器
  template.defaults.imports.dateForm = function (date) {
    let dt = new Date(date);
    let y = dt.getFullYear();
    let m = addZero(dt.getMonth());
    let d = addZero(dt.getDate());
    let h = addZero(dt.getHours());
    let mt = addZero(dt.getMinutes());
    return `${y}-${m}-${d} ${h}:${mt}:${"00"}`;
  };
  //定义一个参数对象
  let layer = layui.layer;
  let q = {
    pagenum: 1, //页码值，默认请求第一页数据(等于几就是第几页数据)
    pagesize: 3, //每页显示多少条数据
    cate_id: "", //文章分类的Id
    state: "", //文章的状态，可选值有：已发布、草稿
  };
  //发送请求
  initTable();
  initCate();
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) return layer.msg("获取文章列表失败");
        //模板引擎渲染页面
        console.log(res);
        let htmlStr = template("tpl-table", res); //??
        $("tbody").html(htmlStr);
        //页面渲染完成后调用renderPage
        renderPage(res.total);
      },
    });
  }
  //初始化文章分类
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) return layer.msg("获取文章分类信息失败");
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }
  //筛选按钮绑定submit事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    let cate_id = $("[name=cate_id]").val();
    let state = $("[name=state]").val();
    // 为查询对象q赋值
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  //定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: "pageBox", //分页ID
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //
      limits: [5, 10, 15, 20, 30, 50],
      curr: q.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      //jump两个触发方式：1.点击分页触发，2.调用laypage.render方法触发
      jump: function (obj, first) {
        //点击页码拿到的obj.curr，页码值赋值给q.pagenum，重新渲染页面
        q.pagenum = obj.curr;
        //分页数
        q.pagesize = obj.limit;
        //通过第1种方式调用jump
        if (!first) {
          //do something
          initTable();
        }
      },
    });
  }
});
