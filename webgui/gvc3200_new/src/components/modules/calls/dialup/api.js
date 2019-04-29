
// 拨打接口
const makeCall = function(memToCall) {
  $.get('/manager?action=makecall&members='+ JSON.stringify(memToCall)).then(
    function(msg){
    },
    function(msg) {
      
    }
  )
}


// 快速会议
const quickStartIPVConf = function() {
  $.get('/manager?action=quickStartIPVConf').then(
    function(msg) {

    },
    function(){}
  )
}


export default {
  makeCall,
  quickStartIPVConf
}