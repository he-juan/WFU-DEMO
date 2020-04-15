/**
 * 通话设置下的词条
 */
export default {
  call_001: '本地RTP端口',
  call_001_tip: '此项填写设备RTP-RTCP监听和传输的本地端口对，它是0通道的基本RTP端口。配置后，语音通道0将会使用Port_Value作为RTP端口值，使用Port_Value+1作为RTCP端口值。语音通道1将会使用Port_Value+10作为RTP的端口值，使用Port_Value+11作为RTCP的值。视频通道0将会使用Port_Value+2作为RTP端口值，使用Port_Value+3作为RTCP端口值。视频通道1将会使用Port_Value+12作为RTP的端口值，使用Port_Value+13作为语音RTCP的值。默认值为5004。',

  call_002: '使用随机端口',
  call_002_tip: '此项若设置为“是”，设备将强制随机生成本地SIP和RTP端口值。当有多部设备处于同一NAT时使用该设置是很有必要的。默认设置为“否”。（注意：当使用IP呼叫时，该项需设置为“否”)',

  call_003: '心跳间隔',
  call_003_tip: '此项设置设备向SIP服务器发送空UDP包的频率，从而保持NAT上的端口为打开状态。默认设置为20秒。',

  call_004: 'STUN/TURN服务器',
  call_004_tip: 'STUN/TURN服务器的IP地址和URL。STUN类型可以在状态-->网络状态页面查看；STUN仅适用于非对称NAT。',

  call_005: 'TURN服务器用户名',
  call_005_tip: '填写用于验证TURN服务器的用户名。',

  call_006: 'TURN服务器密码',
  call_006_tip: '填写用于验证TURN服务器的密码。',

  call_007: '使用NAT IP',
  call_007_tip: '默认为空，用于SIP/SDP消息的NAT IP地址。仅在服务提供商要求必须时使用。',

  call_008: '开启呼叫等待音',
  call_008_tip: '若此项设置为“否”，用户在通话中有另外一路电话接入时，没有呼叫等待音提示，只有LED指示灯闪烁作为提示。默认设置为“是”。',

  call_009: '开启勿扰模式提醒音',
  call_009_tip: '若设置为“否”，电话开启了免打扰后，来电时将不会有铃声进行提醒。默认设置为“是”。',

  call_010: '接通时自动静音',
  call_010_tip: '设置接通电话后是否自动静音。若设置为“禁用”，则不使用自动静音功能；若设置为“来电自动静音”，则接听来电后通话自动静音；若设置为“去电自动静音”则呼出电话建立通话后自动静音；若设置为“来去电静音”，则不论是来电还是去电，通话后自动静音。注：该项仅针对设备从待机状态到通话状态时生效。静音后可点击通话界面上的静音按钮取消当前静音。默认设置为“禁用”。',

  call_011: '将SIP URI中的"#"转义成%23',
  call_011_tip: '默认值为“是”，特殊情况下用“%23”替换“#”。',

  call_012: '允许通话中DTMF显示',
  call_012_tip: '当设置为“否”时，通话中输入的DTMF将不会被显示。默认设置为“是”。',

  call_013: '过滤字符集',
  call_013_tip: '设置呼入呼出号码时需要过滤的字符。可设置多个字符。如设置[()-]，拨打电话(0571)-8800-8888时，将会自动将其中的符号()-过滤掉，拨打057188008888。注：设备本地端呼叫页面过滤字符集功能不生效。',

  call_014: '开启呼叫等待',
  call_014_tip: '默认勾选。当两台设备建立通话时，开启第三方的呼叫等待。',

  call_015: '启用IP拨打模式',
  call_015_tip: '默认勾选。如果不勾选，直接IP呼叫功能叫被禁止使用。',

  call_016: '会场名称',
  call_016_tip: '会场名称叠加在本地主视频上，用于标识本会场。加入会议后，其他参与方将显示本终端的会场名称。',

  call_017: '背景透明度',
  call_017_tip: '会场名称显示的透明度。默认值为“不透明”。',

  call_018: '显示位置',
  call_018_tip: '会场名称在本地主视频上的叠加位置。默认值为“左上角”。',

  call_019: '显示时间',
  call_019_tip: '会场名称在本地主视频上显示的时间长度。默认值为“一直显示”。',

  call_020: '字体颜色',
  call_020_tip: '会场名称在本地主视频上的颜色。默认值为白色。',

  call_021: '字体大小',
  call_021_tip: '会场名称显示的字体尺寸。默认值为“中”。',

  call_022: '是否加粗',
  call_022_tip: '是否将会场名称所用字体加粗。默认为“否”。',

  call_023: '水平偏移',
  call_023_tip: '左右微调会场名在本地主视频上的显示位置。取值范围：0%～100%。默认值为0%。',

  call_024: '垂直偏移',
  call_024_tip: '上下微调会场名在本地主视频的显示位置。取值范围：0%～100%。默认值为0%。',

  call_025: '回声延迟',
  call_025_tip: '调整设备的HDMI音频延时来适配不同电视机的音频延时。',

  call_026: '铃声音量',
  call_026_tip: '设置设备的铃声音量',

  call_027: '媒体音量',
  call_027_tip: '设置设备的媒体音量',

  call_028: '设备铃声',
  call_028_tip: '设置设备的铃声',

  call_029: '通知铃声',
  call_029_tip: '设置设备的通知铃声',

  call_030: '音频设备',
  call_030_tip: '此项用于设置通话/媒体声音的输入/输出设备。',

  call_031: '回铃音',
  call_031_tip: '根据当地电信提供商设置铃音频率。默认使用北美标准频率。详情请阅读用户手册。',

  call_032: '忙音',
  call_032_tip: '根据当地电信提供商设置铃音频率。默认使用北美标准频率。详情请阅读用户手册。',

  call_033: '续订音',
  call_033_tip: '根据当地电信提供商设置铃音频率。默认使用北美标准频率。详情请阅读用户手册。',

  call_034: '确认铃音',
  call_034_tip: '根据当地电信提供商设置铃音频率。默认使用北美标准频率。详情请阅读用户手册。',

  call_035: '默认振铃音',
  call_035_tip: '呼叫方在被叫方接通电话前听到的振铃模式。默认值为c=2000/4000;',

  call_036: '自动开始视频',
  call_036_tip: '配置从联系人以及当有来电时是否自动开启视频。勾选后，则上述场景中的电话将会自动开启视频，设置“否”，则以语音方式拨打或者接听来电。',

  call_037: '视频显示模式',
  call_037_tip: '设置视频显示模式为“原始视频”、“等比例裁剪”或“根据比例补充黑边”。若设置为“原始视频”，则设备显示视频时将根据对方发送来的视频进行显示，若视频显示比例与设备显示比例不同，将会进行适当的拉伸/压缩以显示下完整视频；若设置为“等比例裁剪”，则设备将会根据设备显示比例对发送来的视频进行裁剪；若设置为“根据比例补充黑边”，则设备将会根据发送来的视频比例进行显示，若有多余部分，将使用黑边进行补充。默认设置为“等比例裁剪”。',

  call_038: '触发视频解码跳帧',
  call_038_tip: '在网络丢包情况下，视频解码时将会丢掉视频该帧直接从下一个I帧开始解码。启用该项后在网速较差的环境下，将减少视频花屏的现象。默认设置为“否”。',

  call_039: '音频回声抑制等级',
  call_039_tip: '当音频设备选择了鹅颈麦模式后，可设置音频回声抑制从1到5个等级 ，调节当GVC设备和电视机等设备设置的声音大小、鹅颈麦声源和GVC设备的距离不同时的音频效果， 默认关闭。'
}
