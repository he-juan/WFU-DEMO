/**
 * 保持功能
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button } from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

let mTipTimeout;
class Hold extends Component {
  handleHoldall = () =>{
    if(!this.props.countClickedTimes()) {
        return false;
    }
    let linestatus = this.props.linestatus;
    for(let i = 0 ; i < linestatus.length; i++) {
        let lineitem = linestatus[i];
        let state = lineitem.state;
        if(state == "3" || state == "8" || state == "12")
        {
            // conference can not be held
            this.props.promptMsg('WARNING', "a_548");
            return false;
        }
    }
    //当在web端的会控界面上请求开启远端视频时，保持功能被禁用，直到远端设备弹窗消失
    if(this.props.videoonlines){
        this.props.promptMsg('WARNING', "a_10129");
        return false;
    }
    clearTimeout(mTipTimeout);
    mTipTimeout = setTimeout(()=>{
        this.props.promptMsg('WARNING', "a_7355");
    },500);
    let ishold = "1";
    if(linestatus[0].state == "5" ){
        ishold = "0"
    }
    this.props.confholdstate(ishold);
  }


  render() {
    const { ctrlbtnvisible, heldStatus } = this.props;
    if(ctrlbtnvisible == 'display-hidden') return null;
    // 保持按钮状态
    let heldclass = heldStatus == '0' ? "unhold-icon" : 'hold-icon';
   
    return (
      <span>
        <Button title={this.tr("a_11")} className={`${ctrlbtnvisible} ${heldclass}`} onClick={this.handleHoldall} />
      </span>
    )
  }
}


const mapStateToProps = (state) => ({
  videoonlines: state.videoonlines,
  heldStatus: state.heldStatus

})

const mapDispatchToProps = (dispatch) => {
  const actions = {
    promptMsg: Actions.promptMsg,
    confholdstate: Actions.confholdstate
     
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Hold))