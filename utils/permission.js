import store from "../store";
const whiteList = [
    "/pages/index/index",
    "/pages/list/list",
    "/pages/search/search",
    "/pages/login/login",
    "/pages/login-register/login-register",
    "/pages/login-tel/login-tel",
	"/pages/personal/personal",
	"/pages/detail/detail",
	"/pages/logout/logout"
];
//白名单 不需要登录的页面路径组成的数组

function hasPermission(url) {
  // 在白名单中或有token，直接跳转
   url = url.split('?')[0]
    console.log('改造后的url', url)
  if (whiteList.indexOf(url) !== -1 || store.state.token) {
    return true;
  }
  return false;
}

export default function() {
uni.addInterceptor("navigateTo", {
  // 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
  invoke(e) {
	console.log('e.url',e.url)
    if (!hasPermission(e.url)) {
      // uni.reLaunch({
      //   url: "/pages/login/login",
      // });
	  	uni.showToast({
	  		title:'您还没有登录，正在跳转到登录界面',
	  		icon:'none',
	  		duration:2000,
			success: () => {
				setTimeout(()=>{		
 			// 不要用navigateTo和switchTab 否则会进入死循环
					uni.reLaunch({
						url:'/pages/login/login'
					})
				},2100)	
			}
	  	})
      return false;
    }
    return true;
  },
  success(e) {
    console.log(e)	
	
  },
});

uni.addInterceptor("switchTab", {
  // tabbar页面跳转前进行拦截
  invoke(e) {
    if (!hasPermission(e.url)) {
     uni.showToast({
     	title:'您还没有登录，正在为您跳转到登录界面',
     	icon:'loading',
     	duration:2000,
     	success: () => {
     		setTimeout(()=>{		
     			// 不要用navigateTo和switchTab 否则会进入死循环
     			uni.reLaunch({
     				url:'/pages/login/login'
     			})
     		},2100)	
     	}
     })
      return false;
    }
    return true;
  },
  success(e) {
    // console.log(e)
  },
});
}