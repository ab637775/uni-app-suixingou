'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event',event.data);
  try {
		const res = await uniCloud.sendSms({
            //uni-app应用标识，请替换为自己Dcloud appID
			appid: '__UNI__5746A01',            
 
			//请填写自己开通短信中的账号 API 密钥，如开通服务中第二张图上
			smsKey: '0c138065b0d26b776524dcc0240661ab',        
			smsSecret: '882c3b48432a47e87448c821ea51cff2',
 
            // 请替换为自己申请的短信模板id
			templateId: '15412',                 
			//调用接口传入参数
			phone: event.phone,
			data: event.data,

		})
		// 调用成功，请注意这时不代表发送成功
		return res
	} catch(err) {
		// 调用失败
		console.log(err.errCode)
		console.log(err.errMsg)
		return {
			code: err.errCode,
			msg: err.errMsg
		}
	}
};
