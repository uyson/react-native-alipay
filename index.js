import { NativeAppEventEmitter, NativeModules } from 'react-native';
import promisify from 'es6-promisify';

const Alipay = NativeModules.Alipay;

function translateError(err, result) {
	console.log(err, result);
  if (!err) {
    return this.resolve(result);
  }
  if (typeof err === 'object') {
    if (err instanceof Error) {
      return this.reject(ret);
    }
    return this.reject(Object.assign(new Error(err.message), { errCode: err.errCode }));
  } else if (typeof err === 'string') {
    return this.reject(new Error(err));
  }
  this.reject(Object.assign(new Error(), { origin: err }));
}

// Save callback and wait for future event.
let savedCallback = undefined;
function waitForPayResponse(type) {
  return new Promise((resolve, reject) => {
    if (savedCallback) {
      savedCallback('User canceled.');
    }
    savedCallback = result => {
    //   if (result.type !== type) {
    //     //
    //     //if (__DEV__) {
    //     //  throw new Error('Unsupported response type: ' + resp.type);
    //     //}
    //     return;
    //   }
      savedCallback = undefined;
      if (result.resultStatus !== '9000') {
        // const err = new Error(result.errMsg);
        // err.errCode = result.errCode;
        reject(result);
      } else {
        resolve(result);
      }
    };
  });
}

NativeAppEventEmitter.addListener('Alipay_Resp', resp => {
  const callback = savedCallback;
  savedCallback = undefined;
  callback && callback(resp);
});


function wrapCheckApi(nativeFunc) {
  if (!nativeFunc) {
    return undefined;
  }

  const promisified = promisify(nativeFunc, translateError);
  return (...args) => {
    return promisified(...args);
  };
}

export const isLogined = wrapCheckApi(Alipay.isLogined);

function wrapApi(nativeFunc) {
  if (!nativeFunc) {
    return undefined;
  }

  const promisified = promisify(nativeFunc, translateError);
  return async function (...args) {
    return await promisified(...args);
  };
}
const nativePayRequest = wrapApi(Alipay.payOrder);

export function payOrder(orderStr, scheme) {
  return nativePayRequest(orderStr, scheme)
      .then(() => waitForPayResponse("Pay.Resp"));
}
