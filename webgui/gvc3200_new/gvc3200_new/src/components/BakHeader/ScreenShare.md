## Browser compatibility

| Browser |  Edge | Chrome | Opera |  Firefox  |  Safari   |
|:-------:|:-----:|:------:|:-----:|:---------:|:---------:|
| Version |  79+  |  72+   | 60+   |  60+      | 暂未支持  |

注： 强制要求 `Https`。因为 webRTC 取流接口在非安全环境下无法访问，无法取流。

---

## 对外接口说明

1、preInit()

- 初始化 GsRTC 参数

----

2、建立通话

- call(wsAddr, callback)
- 和gs_phone 建立呼叫
- 参数
    + wsAddr： ws连接地址，例：ws://192.168.131.172:10200
    + callback(codeType)： 回调函数。codeType=200时表示成功，其他表示失败

---

3、开启屏幕共享

- beginScreen(callback)
- 开启屏幕共享
- 参数
    - callback：回调函数。参数codeType=200 表示开演示成功，其他表示失败

---

4、暂停演示

- pausePresent(isMute, callback)
- 共享过程中暂停演示或恢复演示
- 参数
    + isMute: true 表示暂停，false 表示回复演示。
    + callback：回调函数，参数为codeType=200时表示成功，其他表示失败。

---

5、停止桌面共享

- stopScreen(callback)
- 停止桌面共享。
- 参数说明：
    + callback：回调函数，参数codeType=200时表示成功，其他表示失败。

---

6、结束通话

- hangUP(callback)
- 结束通话
- 参数
    + callback：回调函数


## 注册事件说明

1、web开演示的回调
```
window.gsRTC.on('shareScreen', (res) => {
    console.log('BEGIN_SCREEN ************************')
})
```

2、web关闭演示的回调
```
window.gsRTC.on('stopShareScreen', (res) => {
  console.log('STOP_SCREEN ************************')
})
```

3、web暂停演示
```
window.gsRTC.on('pauseShareScreen', (res) => {
  console.log('pauseShareScreen ************************')
})
```

4、web结束通话
```
window.gsRTC.on('hangup', (res) => {
  console.log('hangup ************************')
})
```

5、gs_phone请求开启演示
```
window.gsRTC.on('shareScreenRequest', (res) => {
  console.log('shareScreenRequest ************************')
})
```

6、gs_phone请求关闭演示
```
window.gsRTC.on('stopShareScreenRequest', (res) => {
  console.log('stopShareScreenRequest ************************')
})
```

7、gs_phone请求结束通话
```
window.gsRTC.on('hangupRequest', (res) => {
  console.log('hangupRequest ************************')
})
```


## 错误码说明

| Code      | Description                                                                                       |
|:----------|:--------------------------------------------------------------------------------------------------|
|  200      |  operate success                                                                                  |
|  301      |  The current browser version does not support Screen share                                        |
|  403      |  refuse to shareScreen                                                                            |
|  408      |  open shareScreen timeout                                                                         |
|  101      |  failed to video on                                                                               |
|  102      |  failed to refresh audio                                                                          |
|  103      |  failed to present on                                                                             |
|  100      |  webSocket address is not a valid address                                                         |
|  201      |  Present turn On Request denied                                                                   |
|  202      |  Present turn Off Request denied                                                                  |





