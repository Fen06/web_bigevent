$(function () {
  const form = layui.form;
  //自定义校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: (value) => {
      if (value === $('[name=oldPwd]').val()) return '新旧密码不能相同！';
    },
    rePwd: (value) => {
      if (value !== $('[name=newPwd]').val()) return '两次密码不一致！';
    },
  });

  //更新密码
  $('.layui-form').submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg(res.message);

        // 强制清空
        localStorage.removeItem('token');
        // 跳转页面
        window.parent.location.href = '/login.html';
      },
    });
  });
});
