// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter((options) => {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = `http://big-event-api-t.itheima.net` + options.url;

  if (options.url.includes('/my/')) {
    options.headers = {
      Authorization: localStorage.getItem('token'),
    };
  }

  //权限校验
  options.complete = (res) => {
    // console.log(res);
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === '身份认证失败！'
    ) {
      // 1.清楚本地存储的token
      localStorage.removeItem('token');
      // 2.跳转到登录页面
      location.href = '/login.html';
    }
  };
});
