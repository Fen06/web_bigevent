$(function () {
  const form = layui.form;
  const laypage = layui.laypage;
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '', // 文章的发布状态
  };

  // 获取文章列表数据
  const initTable = () => {
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: q,
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        renderPage(res.total);
      },
    });
  };

  //   初始化文章分类数据

  const initCate = () => {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render('select');
      },
    });
  };

  //   筛选功能
  $('#form-search').submit((e) => {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable();
  });

  const renderPage = (total) => {
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10], // 每页展示多少条

      // 分页发生切换的时候，触发 jump 回调
      jump: (obj, first) => {
        console.log(obj);
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;

        if (!first) {
          initTable();
        }
      },
    });
  };

  $('tbody').on('click', '.btn-delete', function () {
    const btnNum = $('.btn-delete').length;
    const id = $(this).attr('data-id');
    layer.confirm('是否删除？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: 'GET',
        url: '/my/article/delete/' + id,
        success: (res) => {
          if (res.status !== 0) return layer.msg(res.message);
          layer.msg(res.message);
          if (btnNum === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
          layer.close(index);
        },
      });
    });
  });

  initTable();
  initCate();
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }
});
