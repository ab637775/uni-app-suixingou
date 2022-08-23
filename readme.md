# uni-app-suixingou

## 项目概述

 本项目是仿淘宝电商类app ，主要使用到的技术有 uniapp+uView+nodejs+mysql+uniCloud

## 主要功能

（1）本项目主要分为首页、分类、购物车和个人中心四大模块，此外还包括登录页，手机号注册页，用户信息注册页，商品搜索页等子模块。

（2）每个页面都设置了登录路由拦截器，未在白名单中的页面需要登录后才能浏览。如用户未登录状态可随意浏览首页，但未登录进入购物车页面时会要求强制登录。

（3）用户可通过手机验证码注册账号，填写完相关信息点击提交确认后，即可自动登录跳转至用户中心页面。注册账号时若不填写有关信息，点击跳过，则生成默认随机字母加数字组合的用户名、昵称以及固定密码

（4）首页导航栏提供多个版块，如推荐、运动健身等，可左右滑屏切换版块，还能模拟下拉刷新商品分页。

（5）分类页可模拟点击左侧导航切换对应类别的商品，如点击女装，可展示卫衣、衬衫等分类。

（6）购物车页展示登录用户购买的商品，若用户处于未登录，则购物车显示空状态，且强制跳转到登录页面。登录成功后，购物车展示累计加购的商品，用户可以点击勾选按钮选择最终结算的商品，勾选功能具体包括单独商品勾选、同一家店全部商品勾选和全选。点击右上角管理，可以切换至删除功能，勾选列表中的商品后点击删除即可。

（7）商品详情页，未登录时可以正常点击商品进入页面浏览，但是进行加入购物车操作，会强制跳转登录。登录成功后，用户可以在首页点击商品进入商品详情页，选择对应类别商品，进行加入购物车操作。

（8）个人中心页面。在未登录时显示未登录状态，昵称显示'未登录'，头像也为默认头像。登录后即可显示对应用户信息。点击右上角设置图标，可以进入退出登录界面，同时在此界面点击用户信息可以进入信息修改页面，进行用户名、昵称和密码的修改。存在用户名重复报错的判定。

（9）搜索页面。用户可以在首页点击左上角的搜索放大镜进入搜索页面。在搜索页面，用户可以输入相关关键词来模拟搜索存储在 mysql  中相关商品的数据，搜索成功跳转到结果页面，用户可以点击导航栏箭头切换价格升降序排序。

## 本地后端服务器搭建

1.生成服务器
全局安装 npm i express-generator -g
在前端项目所在目录生成服务器  express --view=ejs server
2.调用服务器
在新生成的server目录里使用终端命令npm start启动服务器
注意：每次修改server文件夹中的内容后都必须重新npm start启动服务器，更新修改的内容
修正：可以使用nodemon start来启动，可自动更新服务器

服务器默认运行在<http://localhost:3000>端口
windows系统可以通过在服务器根目录运行ipconfig命令查询ip地址，我查询到自己服务器的ip地址为192.168.x.x (x为对应数字)
注意：本地服务器必须用查询的ip地址来代替网址中的localhost，否则在前端中调用接口时会出现跨域问题，所以我的前端项目应当调用的接口
根路径为<http://192.168.x.x:3000>
3.设置服务器
在服务器的app.js文件中添加解决跨域问题的代码
var app = express();
// 设置允许跨域访问该服务
app.all('*', function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
 res.header("Access-Control-Allow-Headers", "X-Requested-With");
 res.header('Access-Control-Allow-Headers', 'Content-Type');
 res.header('Access-Control-Allow-Headers', 'mytoken');
 next();
});

在/routes/index.js中设置接口
例如：
router.get('/data/1', function(req, res, next) {
 res.json({
  "name": "张三",
  "age": 18
 });
});
4.调用接口
在前端项目的组件中调用接口，打印数据或调用数据
例如在pages/index/index.vue中
  onLoad() {
   uni.request({
    url: 'http://192.168.x.x:3000/data/1',
    success: (res) => {
     console.log(res);
    }
   })
  }
