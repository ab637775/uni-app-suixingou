#本地后端服务器搭建
```
1.生成服务器
全局安装 npm i express-generator -g
在前端项目所在目录生成服务器  express --view=ejs server
2.调用服务器
在新生成的server目录里使用终端命令npm start启动服务器 
注意：每次修改server文件夹中的内容后都必须重新npm start启动服务器，更新修改的内容
修正：可以使用nodemon start来启动，可自动更新服务器
服务器默认运行在http://localhost:3000端口
windows系统可以通过在服务器根目录运行ipconfig命令查询ip地址，我查询到自己服务器的ip地址为192.168.x.x (x为对应数字)
注意：本地服务器必须用查询的ip地址来代替网址中的localhost，否则在前端中调用接口时会出现跨域问题，所以我的前端项目应当调用的接口
根路径为http://192.168.x.x:3000
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
```
