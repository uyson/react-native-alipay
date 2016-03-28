React Native Bridge for Alipay
React Native 支付宝接口

## 安装
```sh
npm install react-native-alipay

```
## IOS 配置
###1. 项目的Linked Framworks and Libraries 中添加 AlipaySDK.framework、SystemConfiguration.framework
###2. 项目中添加 node_modules/react-native-alipay/ios/RCTAlipay/RCTAlipay.xcodeproj
###3. RCTAlipay的searchPath 添加项目目录
###4. 在js 中使用就可以
```js
import * as Alipay from 'react-native-alipay'

Alipay.isLogined()
.then(res=>{
	console.log(res, 'alipay');
})
.catch(err=>{
	console.log(err, 'alipay');
})

//支付调用
/**
* orderStr 主要包含商户的订单信息，key=“value”形式，以&连接。
* scheme 商户程序注册的URL protocol，供支付完成后回调商户程序使用。
*
*/
Alipay.payOrder(orderStr, scheme)
.then(res=>{
	console.log(res, 'pay width alipay result');
})
.catch(err=>{
	console.log(err, 'pay width alipay failed');
})
```

### Android 开发中
