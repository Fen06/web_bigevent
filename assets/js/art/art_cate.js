$(function () {
  const form = layui.form;
  const initArtCateList = () => {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: (res) => {
        if (res.status !== 0) return layer.msg('获取文章分类列表');

        const htmlStr = template('tpl-table', res);
        $('tbody').empty().html(htmlStr);
      },
    });
  };

  //给类别添加绑定事件
  let indexAdd = null;
  $('#btnAddCate').click(() => {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    });
  });

  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg(res.message);
        //重新渲染数据
        initArtCateList();
        //关闭弹窗
        layer.close(indexAdd);
      },
    });
  });

  // 通过代理方式，为 btn-edit 按钮绑定点击事件
  let indexEdit = null;
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出修改文章分类的弹窗
    const id = $(this).attr('data-id');
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    });

    // 发起请求获取对应分类的数据
    $.ajax({
      type: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message);
        form.val('form-edit', res.data);
      },
    });
  });

  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg(res.message);

        initArtCateList();
        layer.close(indexEdit);
      },
    });
  });

  //删除文章分类
  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).attr('data-id');
    layer.confirm('确定删除该文章吗？', { icon: 3, title: '提示' }, (index) => {
      $.ajax({
        type: 'GET',
        url: '/my/article/deletecate/' + id,
        success: (res) => {
          if (res.status !== 0) return layer.msg(res.message);
          layer.msg(res.message);

          initArtCateList();

          layer.close(index);
        },
      });
    });
  });
  initArtCateList();
});
