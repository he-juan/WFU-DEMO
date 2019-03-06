import { promptMsg} from '../../../../../redux/actions'

const API = (function(){
  function SFU_request(uri) {
    let returninfo;
    uri += '&time=' + new Date().getTime();
    $.ajax({
      type: 'get',
      url: uri,
      async: false,
      dataType: 'json',
      success: function(data) {
        if (data.res == 'success') {
          returninfo = data
        } else {
          promptMsg("ERROR", "a_16418");
        }
      },
      error: function(err) {
        promptMsg("ERROR", "a_16418");
      }
    })
    return returninfo
  }  
  return {
    // 是否接入hdmi1
    SFU_gethdmi1state: function(){
      return SFU_request('/manager?action=gethdmi1state&region=status')
    },
    // 是否接入hdmi2
    SFU_gethdmi2state: function(){
      return SFU_request('/manager?action=gethdmi2state&region=status')
    },
    // 是否系统推荐模式
    SFU_issysrcmode: function() {
      return SFU_request('/manager?action=issysrcmdmode&region=confctrl')
    },
    // hdmi1模式
    SFU_gethdmi1mode: function() {
      return SFU_request('/manager?action=gethdmi1displaymode&region=confctrl')
    },
    // SFU新增 获取布局内容
    SFU_getsfuvideolayout: function(){
      return SFU_request('/manager?action=getsfuvideolayout&region=webservice')
    },
    // 获取所有成员
    // SFU_getsfuconfinfo: function(){
    //   return SFU_request('/manager?action=getsfuconfinfo&region=webservice')
    // },
    // 获取所有成员2
    SFU_getsfuvideolayoutlist: function(){
      return SFU_request('/manager?action=getsfuvideolayoutlist&region=webservice')
    },
    // 设置系统推荐
    SFU_setsysrcmdmode: function(){
      return SFU_request('/manager?action=setsysrcmdmode&region=confctrl')
    },
    // 设置远端
    SFU_setremotemode: function(){
      return SFU_request('/manager?action=setdisplaydefaultremote&region=confctrl')
    },
    // 设置等分
    SFU_setdefaultaverage: function(){
      return SFU_request('/manager?action=setdefaultaverage&region=confctrl')
    },
    // 设置字母模式
    SFU_setdefaultpop: function(){
      return SFU_request('/manager?action=setdefaultpop&region=confctrl')
    },
    // 设置画中画
    SFU_setdefaultpip: function(){
      return SFU_request('/manager?action=setdefaultpip&region=confctrl')
    },
    // 设置自定义
    SFU_setcustommode: function(hdmi1mode, hdmi1Content, hdmi2mode, hdmi2Content) {
      return SFU_request('/manager?action=setcustommode&region=confctrl&hdmi1mode=' + hdmi1mode + '&hdmi1content=' + hdmi1Content + '&hdmi2mode=' + hdmi2mode + '&hdmi2content=' +hdmi2Content)
    }
  }
})()

export default API