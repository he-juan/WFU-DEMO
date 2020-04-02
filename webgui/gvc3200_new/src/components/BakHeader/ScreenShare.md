 WFU WebRTC桌面共享脚本（gsRTC.min.js）接口说明：
  1.gsRTC.min.js使用：直接通过script引入页面
  2.接口说明：
（1）call(wsAddr, callback)
        - 接口描述：和wfu建立点对点连接
        - 参数说明：
               wsAddr：ws连接地址，例：ws://192.168.131.172:10200
               callback：回调函数，参数为codeType，codeType为200时表示成功，为其他时表示失败
（2）beginScreen(callback)
         - 接口描述：开启共享桌面
         - 参数说明：
               callback：回调函数，参数为codeType，codeType为200时表示成功，为其他时表示失败
（3）pausePresent(isMuteStream, callback)
         - 接口描述：暂停或恢复共享桌面
         - 参数说明：
               isMuteStream:判断其值，若为true，表示暂停共享桌面演示；若为false，表示恢复共享桌面演示
               callback：回调函数，参数为codeType，codeType为200时表示成功，为其他时表示失败开启桌面共享
（4）stopScreen(callback)
         - 接口描述：停止共享桌面
         - 参数说明：
                callback：回调函数，参数为codeType，codeType为200时表示成功，为其他时表示失败开启桌面共享










目前wfu程序启动需要手动启动。
1. 首先需要先telnet登录到GVC3220上；
2. 然后设置nvram，相关的nvram的设置命令为nvram set WFUHOST=127.0.0.1
3. 然后在终端输入wfu启动wfu程序，看到有相关输出wfu即启动完成，
4. 另起一个终端，输入killall -9 gs_phone，重启gs_phone程序 ，使其完成和WFU的连接，看到wfu所在终端有相关打印即为二者连接成功 



chrome://flags/#enable-webrtc-hide-local-ips-with-mdns  关闭mdns



[3445] [WfuCtrl.cc:249] [wfuCtrlExecute] receive msg type is[5].
[3445] [WfuUpdateTrack.cc:917] [parserVideoTxParamJson] parser error. the json don't have video_tx_param object.
[3445] [WfuUpdateTrack.cc:969] [parserVideoRxParamJson] parser error. the json don't have audio_rx_param object.
[3445] [WfuCtrl.cc:249] [wfuCtrlExecute] receive msg type is[5].
[3445] [WfuUpdateTrack.cc:917] [parserVideoTxParamJson] parser error. the json don't have video_tx_param object.
[3445] [WfuUpdateTrack.cc:969] [parserVideoRxParamJson] parser error. the json don't have audio_rx_param object.
[3445] [WfuCtrl.cc:249] [wfuCtrlExecute] receive msg type is[7].
[3445] [WfuJsonMsgTransaction.cc:547] [sendWfuJsonMessage] msg is:
{
        "req_id":       "255",
        "error":        {
                "code": 0,
                "message":      "success"
        }
}
[3444] [WfuJsonStack.cc:542] [parseMessage] parser begin. buf is:
{
        "contentCtrl":  {
                "chan_id":      "Target0",
                "port_id":      "46",
                "track_id":     "0_slide-video",
                "opt":  "start"
        },
        "req_id":       "256"
}
[3445] [WfuCtrl.cc:249] [wfuCtrlExecute] receive msg type is[7].
[3445] [WfuJsonMsgTransaction.cc:547] [sendWfuJsonMessage] msg is:
{
        "req_id":       "256",
        "error":        {
                "code": 0,
                "message":      "success"
        }
}
