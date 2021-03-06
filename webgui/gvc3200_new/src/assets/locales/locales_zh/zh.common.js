/* eslint-disable no-multiple-empty-lines */
/**
 * 通用词条
 * btns 按钮类
 * msgs 规则，提示类
 * routes 路由相关tab类
 * commons 通用类
 */
const routes = {
  r_001: '通话',
  r_002: '帐号',
  r_003: '通话设置',
  r_004: '网络设置',
  r_005: '系统设置',
  r_006: '设备控制',
  r_007: '应用',
  r_008: '维护',
  r_009: '状态',
  r_010: '拨打',
  r_011: '通讯录',
  r_012: '会议预约',
  r_013: '通话记录',
  r_014: '基本设置',
  r_015: '通话设置', // 与 r_003 不同
  r_016: '会场名',
  r_017: '音频控制',
  r_018: '视频设置',
  r_019: '以太网设置',
  r_020: 'WI-FI设置',
  r_021: 'OpenVPN®设置',
  r_022: '高级设置',
  r_023: '电源管理',
  r_024: '时间和语言',
  r_025: '网管设置',
  r_026: '安全设置',
  r_027: '摄像头控制',
  r_028: '预置位设置',
  r_029: '外围设备',
  r_030: '遥控器',
  r_031: 'LDAP联系人',
  r_032: '录制管理',
  r_033: '升级',
  r_034: '故障排除',
  r_035: '帐号状态',
  r_036: '接口状态',
  r_037: '网络状态',
  r_038: '系统信息',
  r_039: '遥控器状态',
  r_040: '联系人列表',
  r_041: '群组',
  r_042: '本地预约',
  r_043: '受邀请',
  r_044: 'SIP设置',
  r_045: '编码设置',
  r_046: '通话设置',
  r_047: 'WI-FI基本',
  r_048: '添加网络',
  r_049: '区域时间设置',
  r_050: '语言设置',
  r_051: '页面/远程访问',
  r_052: '用户信息管理',
  r_053: '锁屏密码',
  r_054: '证书管理',
  r_055: '固件',
  r_056: '配置文件',
  r_057: '部署',
  r_058: '系统日志',
  r_059: '信息日志',
  r_060: '调试',
  r_061: '路由跟踪',
  r_062: '开发者模式',
  r_063: '域名查询',
  r_064: 'SIP',
  r_065: 'IPVideoTalk',
  r_066: 'Bluejeans',
  r_067: 'H.323',
  r_068: 'SIP TLS',
  r_069: '网络连通性测试',
  r_070: '第三方应用',
  r_071: '远程诊断',
  r_072: '视频会议服务平台',
  r_073: 'Zoom',
  r_074: 'HDMI',
  r_075: '摄像头',
  r_076: '无线麦',
  r_077: 'Media',
  r_078: '高级网络设置',
  r_079: '录制设置',
  r_080: '录像列表',
  r_081: '录音列表',
  r_083: 'BroadSoft联系人',
  r_085: 'XSI服务设置',
  r_086: '网络目录',
  r_089: '开源许可证',

  r_999: ''
}

const btns = {
  b_001: '保存',
  b_002: '确定',
  b_003: '删除',
  b_004: '上传',
  b_005: '取消',
  b_006: '重启设备',
  b_007: '睡眠',
  b_008: '关机',
  b_009: '重启',
  b_010: '立即关机',
  b_011: '空闲时重启',
  b_012: '空闲时休眠',
  b_013: '空闲时关机',
  b_014: '登录',
  b_015: '更新',
  b_016: '浏览',
  b_017: '设置',
  b_018: '编辑',
  b_019: '锁定',
  b_020: '解锁',
  b_021: '下载',
  b_022: '复位键',
  b_023: '清除',
  b_024: '获取日志',
  b_025: '开始',
  b_026: '停止',
  b_027: '暂停',
  b_028: '抓取',
  b_029: '请上传zip格式文件',
  b_030: '扫描',
  b_031: '详细信息',
  b_032: '连接',
  b_033: '取消保存',
  b_034: '断开',
  b_035: '遥控器',
  b_036: '登出',
  b_037: '清空',
  b_038: '新建联系人',
  b_039: '导入联系人',
  b_040: '导出联系人',
  b_041: '下载联系人',
  b_042: '更多',
  b_043: '呼叫',
  b_044: '添加号码',
  b_045: '导入',
  b_046: '导出',
  b_047: '新建群组',
  b_048: '新增会议',
  b_049: '重新预约',
  b_050: '删除记录',
  b_051: '立即启会',
  b_052: '编辑会议',
  b_053: '取消会议',
  b_054: '取消本次会议',
  b_055: '取消整个会议',
  b_056: '添加',
  b_057: '应用',
  b_058: '设为默认帐号',
  b_059: '继续提交',
  b_060: '返回编辑',
  b_061: '视频邀请',
  b_062: '音频邀请',
  b_063: '上移',
  b_064: '下移',
  b_065: '唤醒',
  b_066: '接受',
  b_067: '拒接',
  b_068: '知道了',
  b_069: '去设置',

  b_100: '上传并安装',
  b_101: '选择',

  b_999: ''
}

const msgs = {
  m_001: '保存成功!',
  m_002: '保存失败!',
  m_003: '必填项',
  m_004: '修改连接方式或端口,页面将登出并跳转到新地址:',
  m_005: '当前管理员密码错误! 请重新输入!',
  m_006: '含有不合法字符!',
  m_007: '两次输入密码不一致.',
  m_008: '请输入至少6个字符.',
  m_009: '字母数字密码必须包含数字以及至少一个小写字母，一个大写字母或特殊字符.',
  m_010: '请输入管理员/用户新密码',
  m_011: '请输入用户新密码',
  m_012: '锁屏密码为六位数数字',
  m_013: '删除成功!',
  m_014: '删除失败!',
  m_015: '正在删除...',
  m_016: '是否确定删除?',
  m_017: '数量已达上限!',
  m_018: '上传成功!',
  m_019: '上传失败!',
  m_020: '该证书不是CA证书!',
  m_021: '该证书已存在!',
  m_022: '该证书不合法!',
  m_023: '是否确定重新启动设备?',
  m_024: '是否确定进入睡眠模式?',
  m_025: '是否确定关机?',
  m_026: '设备正在升级，请勿操作!',
  m_027: '操作成功!',
  m_028: '操作失败!',
  m_029: '设备正在通话...',
  m_030: '设备重启中......',
  m_031: '设备关机中......',
  m_032: '设备睡眠中......',
  m_033: '若设备正在通话，待通话结束后会自动重启<br>您可以在重启后2分钟左右点击下面的链接, 重新登录页面',
  m_034: '您可以在重新启动后点击下面的链接, 重新登录页面',
  m_035: '您可以在唤醒设备后点击下面的链接, 重新登录页面',
  m_036: '确定要删除自定义语言吗?',
  m_037: '需要重启生效',
  m_038: '正在保存...',
  m_039: '重命名失败.',
  // m_040: '上锁录像无法编辑',
  // m_041: '上锁录像无法删除',
  m_042: '文件名已存在，请重新输入!',
  m_043: '重命名失败, 存在无效字符!',
  m_044: '文件已加锁，无法重命名!',
  // m_045: '确定删除该录像?',
  // m_046: '确定删除所选录像?',
  m_047: '没有可存储的设备',
  // m_048: '录像名称不能为空',
  // m_049: '请输入录像名称',
  m_050: '长度不能超过',
  m_051: '版本一样, 不需要更新!',
  m_052: '读取固件出错!',
  m_053: '固件签名出错!',
  m_054: '读取当前系统版本出错!',
  m_055: '固件不适用于此硬件!',
  m_056: '固件中image ID不匹配!',
  m_057: '固件不兼容!',
  m_058: '内存不足!',
  m_059: '固件已损坏!',
  m_060: '磁盘空间不足!',
  m_061: '未知错误!',
  m_062: '正在上传中',
  m_063: '请稍等...',
  m_064: '升级初始化失败!',
  m_065: '请填写正确的自定义文件服务器路径!',
  m_066: '恢复出厂设置将清除所有配置, 你是否确定执行该项操作?',
  m_067: '清除成功!',
  m_068: '空间不足, 操作失败!',
  m_069: '网络错误!',
  m_070: '操作成功, 请稍候...',
  m_071: '获取失败!',
  m_072: '请输入正确格式的网址!',
  m_073: '请输入一個有效的IPV6地址!',
  m_074: 'IP地址格式错误!',
  m_075: '有效值：整数!',
  m_076: '不能包含中文!',
  m_077: '只能输入数字!',
  m_078: '有效值：{min}-{max}',
  m_079: '正确的格式hh:mm!',
  m_080: '请输入不超过{n}位字符', // n length
  m_081: '会话超时时间值不能小于最小超时时间',
  m_082: '音频有效载荷类型值不能为98或99!',
  m_083: '各有效荷载类型值不能相同!',
  m_084: '请至少保留一个选项!',
  m_085: '上传成功, 请检查设备!',
  m_086: '请上传正确格式的文件(.wav/.mp3)',
  m_087: '请输入一个偶数',
  m_088: 'PPPoE帐号和密码不能为空',
  m_089: '子网掩码格式不正确!',
  m_090: '主机名格式错误',
  m_091: '主机名和端口不能为空!',
  m_092: '密码不能少于8位字符!',
  m_093: 'WEP类型Wi-Fi密码只能为5/10/13/26/16/32位字符!',
  m_094: '操作成功。若IP地址变更请使用新的网络地址登录。',
  m_095: '请输入配置项名称.',
  m_096: '对不起,没有匹配结果.',
  m_097: '是否确定删除所选联系人?',
  m_098: '确定清空所有联系人?',
  m_099: '清空成功!',
  m_100: '清空失败!',
  m_101: '号码不能为空!',
  m_102: '姓名不能为空!',
  m_103: '该名字已存在，确定要继续创建相同名字的联系人吗?',
  m_104: '正在导入, 请稍候.',
  m_105: '导入成功!',
  m_106: '导入失败!',
  m_107: '设备已没有多余存储空间，导入(下载)失败!',
  m_108: '联系人已满!',
  m_109: '未进行该导入操作,该操作将致使总联系人数超过',
  m_110: '联系人导入/导出/下载操作已在进行中，请勿再次操作!',
  m_111: '正在导出, 请稍候.',
  m_112: '导出成功!',
  m_113: '导出失败!',
  m_114: '无联系人可以导出.',
  m_115: '认证失败，无法下载联系人资源文件，请检查您的用户名和密码。',
  m_116: '下载服务器不能为空!',
  m_117: '下载成功!',
  m_118: '下载失败!',
  m_119: '是否确认清空该群组?',
  m_120: '是否确认删除该群组?',
  m_121: '无可呼叫的号码',
  m_122: '群组名不能为空!',
  m_123: '组名已存在, 请重新输入!',
  m_124: '确定要删除该会议记录?',
  m_125: '确定要取消该会议?',
  m_126: '通话中，无法开启新的会议!',
  m_127: '开始时间应该比当前时间+5min晚!',
  m_128: '请至少选择一个成员!',
  m_129: '最大TLS版本必须大于或者等于最小TLS版本',
  m_130: '格式不正确!',
  m_131: '配置文件部署不能为空',
  m_132: '自动升级开始时间不能超过结束时间!',
  m_133: '开始时间与结束时间不能为空.',
  // m_133: '错误:开始时间与结束时间需同时为空或不为空.', 旧
  m_134: '您帐号中存在本地SIP端口为5060,保存该操作会将其改为随机端口，是否更改?',
  m_135: '开始时间不能为空',
  m_136: '正在应用，请稍候....',
  m_137: '成员数量已达上限({max})',
  m_138: '安装失败',
  m_139: '未知错误',
  m_140: '版本一样，不需要更新',
  m_141: '读取固件出错',
  m_142: '固件签名出错',
  m_143: '固件不适用于此硬件',
  m_144: '固件中image ID不匹配',
  m_145: '固件不兼容',
  m_146: '内存不足',
  m_147: '固件已损坏',
  m_148: '磁盘空间不足',
  m_149: '固件中OEM ID不匹配',
  m_150: '固件服务器路径已修改',
  m_151: '升级成功，请检查设备',
  m_152: '是否确定删除所选通话记录?',
  m_153: '是否确定要清空通话记录?',
  m_154: '请输入用户名',
  m_155: '请输入密码',
  m_156: '直到下次重启前该用户已被锁定。',
  m_157: '该用户已被锁定。',
  m_158: '该用户不存在。',
  m_159: '用户名或密码错误, 剩余尝试次数:{n}',
  m_160: '密码输入错误太多次，请5分钟后再访问页面。',
  m_161: '验证失败',
  m_162: '请输入新密码',
  m_163: '请输入确认密码',
  m_164: '密码不匹配',
  m_165: '请输入至少6个字符。',
  m_166: '密码格式错误',
  m_167: '修改失败',
  m_168: '管理员密码不能为空',
  m_169: '管理员新密码不能和默认密码相同',
  m_170: '用户密码不能为空',
  m_171: '用户新密码不能和默认密码相同',
  m_172: '网关格式不正确',
  m_173: '帐号不可用',
  m_174: '匿名号码不可呼叫',
  m_175: '号码为呼叫功能码',
  m_176: '启用SRTP呼叫功能',
  m_177: '禁用SRTP功能',
  m_178: '匿名呼叫功能已激活',
  m_179: '匿名呼叫功能已禁用',
  m_180: '呼叫等待功能已激活',
  m_181: '呼叫等待功能已禁用',
  m_182: '无条件转移功能已激活',
  m_183: '无条件转移功能已禁用',
  m_184: '遇忙转移功能已激活',
  m_185: '遇忙转移功能已禁用',
  m_186: '无应答转移功能已激活',
  m_187: '无应答转移功能已禁用',
  m_188: '禁止IP呼叫',
  m_189: 'IP格式错误',
  m_190: '不符合拨号规则',
  m_191: '符合部分拨号规则',
  m_192: '会议被禁用',
  m_193: '成员数量已达上限',
  m_194: '会议坐席已满',
  m_195: '线路已满',
  m_196: '蓝牙线路已满',
  m_197: '拨打的号码已存在一条呼叫中的线路',
  m_198: '拨打的号码已存在一条振铃中的线路',
  m_199: '拨打的号码已存在一条通话中的线路',
  m_200: '拨打的号码已存在一条会议中的线路',
  m_201: '锁屏中，拨打的号码不是紧急号码',
  m_202: '话机恢复数据中，不能呼叫',
  m_203: '视频线路已满，不能进行视频呼叫',
  m_204: 'H.323帐号不支持会议',
  m_205: '启用勿扰模式?',
  m_206: '禁用勿扰模式?',
  m_207: '请填写正确的固件服务器路径',
  m_208: '请填写正确的配置文件服务器路径',
  m_209: '设备正在恢复出厂中......',
  m_210: '若设备正在通话，待通话结束后会自动恢复出厂<br>您可以在重启后2分钟左右点击下面的链接, 重新登录页面',
  m_211: '远程诊断已开启,不能禁止ssh访问',
  m_212: '远程诊断已开启,禁止修改访问方法和端口',
  m_213: '此设备将允许后台远程搜集日志信息并远程访问网页,48h后自动关闭,请确认开启',
  m_214: 'URL格式错误',
  m_215: '用户名格式错误',
  m_216: '已保存，请点击应用按钮以使修改生效',
  m_217: 'IP不能为D类地址',
  m_218: '主机名不能为空!',
  m_219: '端口不能为空!',
  m_220: 'PPPoE帐号ID不能为空',
  m_221: 'PPPoE密码不能为空',
  m_222: '已超出最大输入长度',
  m_223: '正在下载中...',
  m_224: '此号码不符合拨号规则!',
  m_225: '通话线路已达上限，当前只能选择IPVideoTalk号码.',
  m_226: '成员数量已达上限.',
  m_227: 'IPVideoTalk成员数量已达上限.',
  m_228: 'LDAP名字、号码属性不能同时为空',
  m_229: '若设备IP地址已变更，请用新地址重新登录, 部分配置项修改需要重启生效',
  m_230: '该时间段内已有其他预约会议，建议调整本次会议时间！',
  m_231: '通话线路已达上限，当前只能添加ipvt联系人.',
  m_232: '设置成功',
  m_233: '{acct}帐号未注册成功，呼叫失败',
  m_234: '号码不能为空',
  m_235: '此联系人已存在',
  m_236: '成员数量已达上限',
  m_237: '访问方式为HTTP时，端口号不能为443!',
  m_238: '访问方式为HTTPS时，端口号不能为80!',
  m_239: '最多支持5个关键词',
  m_240: '每个关键词最多50字节',
  m_241: '密码最多为应32位',
  m_242: '确定删除该录像?',
  m_243: '确定删除该录音?',
  m_244: '通话线路已达上限，当前只能选择IPVideoTalk号码',
  m_245: '通话hold中，不能呼出电话.',
  m_246: '请输入录像名称',
  m_247: '请输入录音名称',
  m_248: '录像名称不能为空',
  m_249: '录音名称不能为空',
  m_250: '确定删除所选录像?',
  m_251: '确定删除所选录音?',
  m_252: '上锁录像无法编辑',
  m_253: '上锁录音无法编辑',
  m_254: '上锁录像无法删除',
  m_255: '上锁录音无法删除',
  m_256: '结束时间不能为空',
  m_257: '每周的星期几不能为空',
  m_258: '{s}已经被使用',
  m_259: '当前无激活账号',
  m_260: '文件格式无效!',
  m_261: 'WiFi列表每隔一段时间会进行自动刷新，您也可以通过点击“扫描”按钮进行刷新。',
  m_262: '共享屏幕功能需要Web开启HTTPS访问方式。请前往 “系统设置-安全设置-页面/远程访问” 设置访问方式。',
  m_263: '确定开始屏幕共享？',
  m_264: '确定关闭屏幕共享？',
  m_265: '确定结束通话吗？',
  m_266: 'IPVT显示名称不允许以\\结尾',
  m_267: '共享屏幕失败({n}).',
  m_268: '当前版本浏览器不支持屏幕共享功能，支持的浏览器： Chrome (72及以上) ; Firefox (60及以上) ; Opera (60及以上); Edge(79及以上); Safari(13.1.1及以上)。',
  m_269: '屏幕共享功能仅支持在Chrome浏览器上生效，请切换浏览器使用。',
  m_270: '浏览器当前版本太低，请更新Chrome至72版本及以上。',
  m_271: '开启信令超时。',
  m_272: '当前处于4K通话状态，不能开启屏幕共享功能。',
  m_273: '请开启共享屏幕权限。',
  m_274: '您禁止了共享屏幕的权限',
  m_275: '请点击浏览器上的设置图标并在设置项中选择允许共享屏幕选项',
  m_276: '设备正忙，请稍后…',

  m_304: '安装失败！',
  m_305: '操作成功！请务必上传正确的证书文件，否则将无法应用生效。',
  m_306: 'CA证书将不会被显示在用户证书列表中。',

  m_999: ''
}

const commons = {
  c_001: '序号',
  c_002: '持有者',
  c_003: '颁发者',
  c_004: '有效期',
  c_005: '操作',
  c_006: '进入睡眠模式',
  c_007: '关机',
  c_008: '从不',
  c_009: '全部',
  c_010: '1分钟后',
  c_011: '5分钟后',
  c_012: '10分钟后',
  c_013: '15分钟后',
  c_014: '30分钟后',
  c_015: '60分钟后',
  c_016: '所在区域 (年/月/日)',
  c_017: '年/月/日',
  c_018: '月/日/年',
  c_019: '日/月/年',
  c_020: '推荐',
  c_021: '未连接',
  c_022: '系统默认位置',
  c_023: '关机时的位置',
  c_024: '摄像头',
  c_025: '帐号',
  c_026: '默认',
  c_027: '文件名',
  c_028: '大小',
  c_029: '时间',
  c_030: 'U盘',
  c_031: '外置SD卡',
  c_032: '保存路径',
  c_033: '录像名称',
  c_034: '点击应用该预置位',
  c_035: '点击编辑该预置位',
  c_036: '已应用',
  c_037: '设置名称',
  c_038: '设置视角',
  c_039: '无数据',
  c_040: '配置文件',
  c_041: '自定义文件',
  c_042: '提示',
  c_043: '自动升级',
  c_044: '配置文件部署',
  c_045: '是',
  c_046: '否',
  c_047: '每隔一段时间检查',
  c_048: '每天检查',
  c_049: '每周检查',
  c_050: '启动时总是检查',
  c_051: '当固件/配置文件的前缀/后缀改变时',
  c_052: '跳过固件检查',
  c_053: '未选择',
  c_054: '已选择',
  c_055: '全部选中',
  c_056: '全部取消',
  c_057: '全部反选',
  c_058: '星期天',
  c_059: '星期一',
  c_060: '星期二',
  c_061: '星期三',
  c_062: '星期四',
  c_063: '星期五',
  c_064: '星期六',
  c_065: '无',
  c_066: '禁用',
  c_067: '使用类型A',
  c_068: '使用类型SRV',
  c_069: '开',
  c_070: '关',
  c_071: '一键调试',
  c_072: '列表模式',
  c_073: '核心转储',
  c_074: '系统日志',
  c_075: '信息日志',
  c_076: '抓包',
  c_077: '录音',
  c_078: '帐号',
  c_079: '号码',
  c_080: 'SIP 服务器',
  c_081: '状态',
  c_082: '已注册',
  c_083: '未注册',
  c_084: '自动获取',
  c_085: '静态IP',
  c_086: '数据使用的网络配置',
  c_087: 'VoIP通话使用的网络配置',
  c_088: '天',
  c_089: '小时',
  c_090: '分钟',
  c_091: '秒',
  c_092: '未知',
  c_093: '用户ID=号码',
  c_094: '启用',
  c_095: '发送保活报文',
  c_096: '自动',
  c_097: 'From头域',
  c_098: '关闭',
  c_099: '仅IP',
  c_100: 'IP和端口',
  c_101: '音频',
  c_102: '主叫',
  c_103: '被叫',
  c_104: '编码率',
  c_105: '视频',
  c_106: '标准',
  c_107: '媒体流级',
  c_108: '帧/秒',
  c_109: '可变帧率',
  c_110: '自动',
  c_111: '基本档次',
  c_112: '主要档次',
  c_113: '高级档次',
  c_114: '演示设置',
  c_115: 'RTP 设置',
  c_116: '允许但不强制',
  c_117: '允许且强制',
  c_118: '接受',
  c_119: '拒绝',
  c_120: '远端',
  c_121: '等分',
  c_122: '子母',
  c_123: '画中画',
  c_124: '拨号界面',
  c_125: '电话本',
  c_126: '来电通话记录',
  c_127: '去电通话记录',
  c_128: '记录所有呼叫',
  c_129: '仅限于呼入/呼出的记录 (未接来电不记录)',
  c_130: '关闭呼叫日志',
  c_131: '中国移动',
  c_132: '华为IMS',
  c_133: '呼叫转移',
  c_134: '无条件',
  c_135: '根据时间',
  c_136: '其它',
  c_137: '铃声',
  c_138: '使用系统铃声',
  c_139: '手动',
  c_140: '来电自动静音',
  c_141: '去电自动静音',
  c_142: '来去电静音',
  c_143: '规则',
  c_144: '不透明',
  c_145: '左上角',
  c_146: '右上角',
  c_147: '左下角',
  c_148: '右下角',
  c_149: '不显示',
  c_150: '一直显示',
  c_151: '最小',
  c_152: '较小',
  c_153: '小',
  c_154: '中',
  c_155: '大',
  c_156: '较大',
  c_157: '最大',
  c_158: '静音',
  c_159: '蓝牙',
  c_160: '内置扬声器',
  c_161: '鹅颈麦',
  c_162: '原始视频',
  c_163: '等比例裁剪',
  c_164: '根据比例补充黑边',
  c_165: '首选IPv4',
  c_166: '首选IPv6',
  c_167: '仅限IPv4',
  c_168: '仅限IPv6',
  c_170: 'DHCP选项132和DHCP选项133',
  c_171: '封装于DHCP选项43',
  c_172: '自动配置',
  c_173: '静态IP配置',
  c_174: '802.1X模式',
  c_175: '高级网络设置',
  c_176: '代理',
  c_177: '简约模式',
  c_178: '专业模式',
  c_179: '已连接',
  c_180: '可用wifi',
  c_181: '已保存',
  c_182: '网络前缀长度',
  c_183: '网关',
  c_184: 'IP地址',
  c_185: 'IP地址类型',
  c_186: '显示高级选项',
  c_187: '密码',
  c_188: '匿名身份',
  c_189: '身份',
  c_190: '未指定',
  c_191: '用户证书',
  c_192: 'CA证书',
  c_193: '阶段2身份验证',
  c_194: 'EAP方法',
  c_195: '安全性',
  c_196: '频率',
  c_197: '信号强度',
  c_198: '状态',
  c_199: 'IPv6地址',
  c_200: 'IPv4地址',
  c_201: 'IP地址',
  c_202: '连接速度',
  c_203: '弱',
  c_204: '一般',
  c_205: '较强',
  c_206: '强',
  c_207: 'DNS 1',
  c_208: 'DNS 2',
  c_209: '搜索',
  c_210: '无搜索结果',
  c_211: '没有联系人，试试',
  c_212: '或',
  c_213: '姓名',
  c_214: '号码',
  c_215: '群组',
  c_216: '新建联系人',
  c_217: '编辑联系人',
  c_218: '显示名称',
  c_219: '动态账号',
  c_220: '电子邮件',
  c_221: '通信地址',
  c_222: '备注',
  c_223: '网址',
  c_224: '导入联系人',
  c_225: '清除所有',
  c_226: '保留本地联系人',
  c_227: '根据名字替换',
  c_228: '根据号码替换',
  c_229: '导出联系人',
  c_230: '下载',
  c_231: '没有群组，试试',
  c_233: '组成员',
  c_234: '个成员', // 一个
  c_235: '个成员', // 多个
  c_236: '添加群组',
  c_237: '编辑群组',
  c_238: '群组名称',
  c_239: '联系人',
  c_240: '已选联系人',
  c_241: '请勾选需要添加的联系人',
  c_243: '部分项需要重启才能生效, 是否需要立即重启?',
  c_244: '没有会议，试试',
  c_245: '进行中',
  c_246: '待主持',
  c_247: '未开始',
  c_248: '已结束',
  c_249: '组织者',
  c_250: '取消会议',
  c_251: '我',
  c_253: '时间',
  c_254: '发出邀请',
  c_255: '接受',
  c_256: '未确定',
  c_257: '不重复',
  c_258: '周一至周五',
  c_259: '每周（每周{n}）',
  c_260: '每月（每月{n}号）',
  c_261: '自定义',
  c_263: '每天',
  c_264: '每周',
  c_265: '每月 (按星期)',
  c_266: '每月 (按日期)',
  c_267: '每年',
  c_268: '第一个',
  c_269: '第二个',
  c_270: '第三个',
  c_271: '第四个',
  c_273: '最后一个',
  c_274: '预置位',
  c_275: '会议详情',
  c_276: '每固定天数',
  c_277: '每固定周数',
  c_278: '每固定月数',
  c_279: '每固定年数',
  c_280: '会议状态',
  c_281: '关联帐号',
  c_283: '主题',
  c_284: '开始时间',
  c_285: '会议时长',
  c_286: '重复',
  c_287: '自定义重复',
  c_288: '每周的星期几',
  c_289: '重复日期',
  c_290: '请选择',
  c_291: '循环周期',
  c_292: '会议密码',
  c_293: '为空则无结束日期',
  c_294: '0-10位数字',
  c_295: '预约成员入会无需会议密码',
  c_296: '成员',
  c_297: '不限制',
  c_298: '仅REGISTER',
  c_299: '全部',
  c_300: '除REGISTER',
  c_301: '默认帐号',
  c_302: '昨天',
  c_303: '今天',
  c_304: '明天',
  c_305: '呼叫',
  c_306: '取消激活默认帐号, 重新设置默认帐号为:',
  c_307: '固件更新',
  c_308: '未接来电',
  c_309: '呼叫失败',
  c_310: '小时',
  c_311: '分',
  c_312: '秒',
  c_313: '保存至已有联系人',
  c_314: '添加联系人',
  c_315: '日期',
  c_316: '重新预约',
  c_317: '选择联系人',
  c_318: '欢迎登录',
  c_319: '用户名',
  c_320: '修改密码',
  c_321: '正在使用默认密码，为了安全，请修改密码',
  c_322: '新密码',
  c_323: '6-32位,数字+字母/特殊字符组合',
  c_324: '确认密码',
  c_325: '标有数字“1”的HDMI接口作为主输出口使用，输出主视频，请按标号顺序先后插入HDMI OUT，避免影响正常使用.',
  c_326: '勿扰模式',
  c_327: '返回顶部',
  c_328: '禁止',
  c_329: '最近通话',
  c_330: '输入号码或IP地址，多个号码可以\'Enter\'分隔.',
  c_331: '(如果为空，一键开启IPVT会议)',
  c_332: '无激活帐号',
  c_333: '本地通讯录',
  c_334: '通话记录',
  c_335: '企业通讯录',
  c_336: '添加成员',
  c_337: '会议室ID',
  c_338: '密码（可选）',
  c_339: '本地',
  c_340: '本地+远端',
  c_341: '演示+远端',
  c_342: '本地+演示+远端',
  c_343: '没有通话记录',
  c_345: '次日',
  c_346: '人', // 单数
  c_347: '人', // 复数
  c_348: '录像名称',
  c_349: '录音名称',
  c_350: '多个号码可以\'Enter\'分隔.',
  c_351: '全选',
  c_352: '无',
  c_353: 'GMD无线麦克风',
  c_354: 'Media',
  c_355: '蓝牙',
  c_356: 'USB',
  c_357: 'Line In',
  c_358: 'HDMI',
  c_359: 'Line Out',
  c_360: '共享屏幕',
  c_361: '停止共享',
  c_362: '暂停共享',
  c_363: '恢复共享',
  c_364: '没有受邀请的预约会议',
  c_365: '已接受',
  c_366: '已拒绝',
  c_367: '建立通话',
  c_368: 'NAS 扩展存储',
  c_369: '蓝牙麦克风',

  c_391: '不使用',
  c_399: '使用',
  c_405: '帐号',
  c_450: '登录认证',
  c_451: 'SIP认证',
  c_452: '个人目录',
  c_453: '群组常用',
  c_454: '群组目录',
  c_455: '企业常用',
  c_456: '企业目录',
  c_457: 'Polycom电话簿',
  c_458: '类型',
  c_459: '名称',
  c_460: '未接来电记录',
  c_461: '拨打记录',
  c_462: '接听记录',
  c_463: '级别',
  c_464: '最低',
  c_465: '最高',
  c_466: '基本设置',
  c_467: 'PTT与组播',
  c_468: '多播对讲模式',
  c_469: '多播对讲配置',
  c_470: '未设置',
  c_471: '频道',
  c_472: '多播地址',
  c_473: 'PTT对讲配置',
  c_474: '组播对讲配置',
  c_475: '频道配置',
  c_476: '紧急呼叫',
  c_477: '优先呼叫',
  c_478: '可使用',
  c_479: '可传输',
  c_480: '可接收',
  c_481: '加入频道',
  c_482: '加入群组',
  c_483: '设置频道名称',
  c_484: '群组配置',
  c_485: '设置群组名称',
  c_486: 'IPV4 地址类型',
  c_487: '墓碑日志',
  c_488: 'ANR日志',
  c_489: '{s}发起的会议',


  c_515: '证书名称',
  c_516: '证书用途',
  c_517: '添加用户证书',
  c_518: '其他应用',
  c_519: '密码',
  c_520: '选择证书',

  c_999: ''
}

export default {
  ...btns,
  ...msgs,
  ...routes,
  ...commons
}
