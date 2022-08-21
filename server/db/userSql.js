const user = {
	// 匹配用户名或手机号是否存在
	queryUserNameOrPhone(param){
		return "select * from user_info where userName = '"+param.userName+"' or phone = '"+param.userName+"'"
	},
	// 匹配用户名或手机号以及密码是否正确
	queryUserPwd(param){
		return "select * from user_info where password = '"+param.password+"' and (userName = '"+param.userName+"' or phone = '"+param.userName+"') "
	},
	// 查询用户名是否存在
	queryUserName(param){
			return "select * from user_info where userName = '"+param+"'"
	},
	// 查询用户手机号是否已存在
	queryUserPhone(param){
		return "select * from user_info where phone = '"+param+"'"
	},
	// 注册用户手机号
	insertPhone(param){
		return 'insert into user_info (phone) values ("'+param+'")'
	}
	,
	// 增加默认用户数据
	insertData(param){
		let token = null
		// 生成默认用户的昵称
		let defaultNickName = "用户"
		let defaultUserName = ""
		let range = 6
		let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	    for(let i = 0; i < range; i++){
	            pos1 = Math.round(Math.random() * (arr.length-1));
				pos2 = Math.round(Math.random() * (arr.length-1));
	            defaultNickName += arr[pos1];
				defaultUserName += arr[pos2];
	    }		
		return 'insert into user_info (userName,password,phone,avatarImg,nickName,token) values ("'+defaultUserName+'","aaa123456","'+param+'","../../static/img/user/defaultUser.png","'+defaultNickName+'","'+token+'")'
	},
	// 登陆成功后生成token数据
	generateToken(param){
		// 生成默认token
		const jwt = require('jsonwebtoken')
		const payload = {name:param.userName}
		const secret = 'suixingou'
		let token = jwt.sign(payload,secret)
		return 'UPDATE user_info SET token = "'+token+'" where( userName = "'+param.userName+'" or phone = "'+param.userName+'")'
	},
	// 修改用户头像
	updateAvatar(param){
		return 'UPDATE user_info SET avatarImg = "'+param.avatarImg+'" where phone = "'+param.phone+'"'
	},
	// 更新用户数据
	updateUserInfo(param){
		return 'UPDATE user_info SET userName = "'+param.userName+'",password = "'+param.password+'",nickName="'+param.nickName+'" where( phone = "'+param.phone+'")'
	}
}
exports = module.exports = user;