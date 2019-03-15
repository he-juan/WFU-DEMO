/**
 * 结束通话功能
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button, Modal, Radio} from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


class EndCall extends Component {
  constructor() {
    super()
    this.state = {
      endallConfirm1Visible: false,
      endallConfirm2Visible: false,
      endallConfirm2Title: "",
      endallConfirm3Visible: false,
      transferableHostList: [],
      checkedHostNumber: ''
    }
  }

  handleEndAll = () => {
    let linestatus = this.props.linestatus;
    let ipvtline;
    for(let i = 0 ; i < linestatus.length; i++) {
        let lineitem = linestatus[i];
        if (lineitem.acct == 1) {
            ipvtline = lineitem.line; 
            break;
        }
    }
    // 如果是ipvt会议
    if(ipvtline){
        this.props.getipvrole(ipvtline, "closeprompt", (result)=>{
            if(result == "2"){
                this.setState({
                    endallConfirm1Visible: true
                })
            }else{
                let endall2title = this.tr("a_10103");  // a_10103: 您确定要结束会议吗?
                if(result == "1" || result == "3"){
                    endall2title = this.tr("a_19357");  // a_19357: 您确定要离开IPVT会议吗
                    for(let i = 0 ; i < linestatus.length; i++) {
                        let lineitem = linestatus[i];
                        if (lineitem.acct == 0) {
                            endall2title = this.tr("a_19354"); //a_19354: 您确定要离开IPVT会议并且结束本地会议吗?
                            break;
                        }
                    }
                }
                this.setState({
                    endallConfirm2Visible: true,
                    endallConfirm2Title: endall2title
                });
            }
        });
    } else if(this.props.msfurole == '2'){
        let memeberList = this.props.sfu_meetinginfo.memberInfoList
        this.props.getsfutransferablelist((list) => {
            let _list = memeberList.filter(v => {
                if(v.role == '2') return false
                if(list.indexOf(v.number) < 0) return false
                return true
            })
            this.setState({
                endallConfirm3Visible: true,
                transferableHostList: _list,
                checkedHostNumber: _list[0] ? _list[0].number : null
            })
        })
    } else {
        this.setState({
            endallConfirm2Visible: true,
            endallConfirm2Title: this.tr("a_10103")
        });
    }
  }
  endConf =()=>{
    this.props.endconf("0");
    this.setState({
        endallConfirm1Visible: false
    })
  }
  exitConf =() => {
    this.props.endconf("1");
    this.setState({
        endallConfirm1Visible: false
    })
  }
  endAllCall =() =>{
    this.props.endconf("1");
    this.setState({
        endallConfirm2Visible: false
    })
  }
  
  handleEndall1Cancel = () =>{
    this.setState({
        endallConfirm1Visible: false
    })
  }    
  handleEndall2Cancel = () => {
    this.setState({
        endallConfirm2Visible: false
    })
  }
  handleEndall3Cancel = () => {
    this.setState({
        endallConfirm3Visible: false
    })
  }
  checkHostRadio = (e) => {
      this.setState({
          checkedHostNumber: e.target.value
      })
  }
//  转移主持人
  tranHost = () =>　{
    this.props.transfersfuhost(this.state.checkedHostNumber)
    this.props.endconf("1");
  }
  render() {
    const {transferableHostList, checkedHostNumber} = this.state
    return (
      <span>
        <Button title={this.tr("a_1")}  className="end-btn" onClick={this.handleEndAll}/>
        {/* 结束会议确认框 1 */}
        <Modal visible={this.state.endallConfirm1Visible} className="endall-confirm" footer={null} onCancel={this.handleEndall1Cancel}>
          <p className="confirm-content">{this.tr("a_10224")}</p>
          <div className="modal-footer">
            <Button type="primary" onClick={this.endConf}>{this.tr("a_10067")}</Button>
            <Button type="primary" onClick={this.exitConf}>{this.tr("a_10225")}</Button>
            <Button onClick={this.handleEndall1Cancel}>{this.tr("a_3")}</Button>
          </div>
        </Modal>
        {/* 结束会议确认框 2*/}
        <Modal visible={this.state.endallConfirm2Visible} className="endall-confirm" footer={null} onCancel={this.handleEndall2Cancel}>
            <p className="confirm-content">{this.state.endallConfirm2Title}</p>
            <div className="modal-footer">
                <Button type="primary" onClick={this.endAllCall}>{this.tr("a_2")}</Button>
                <Button onClick={this.handleEndall2Cancel}>{this.tr("a_3")}</Button>
            </div>
        </Modal>

        {/* 结束会议确认框 3, sfu会议退出 主持人可转移主持权限*/}
        <Modal visible={this.state.endallConfirm3Visible} className="endall-confirm" footer={null} onCancel={this.handleEndall3Cancel}>
            <p className="confirm-content" style={{margin:'25px 0 10px'}}>{ transferableHostList.length ? this.tr('a_10364') : this.tr("a_10363")}</p>
            {
                transferableHostList.length > 0 ? 
                <Radio.Group value={checkedHostNumber} onChange={this.checkHostRadio.bind(this)} style={{display:'block', margin:'15px 25px 30px', overflow: 'auto', maxHeight: '200px'}} >
                    {
                        transferableHostList.map((v) => (
                            <Radio value={v.number} style={{display: 'inline-block',width:'50%',height: '30px',lineHeight: '30px',marginRight: '0', fontSize:'0.875rem'}}>{v.name}</Radio>
                        ))
                    }
                </Radio.Group> : null
            }
            <div className="modal-footer">
                <Button type="primary" onClick={this.endAllCall}>{this.tr("a_10362")}</Button>
                {
                    transferableHostList.length > 0 ? <Button type="primary" onClick={this.tranHost.bind(this)}>{this.tr("a_637")}</Button> : null
                }
                <Button onClick={this.handleEndall3Cancel}>{this.tr("a_3")}</Button>
            </div>
        </Modal>
      </span>
    )
  }
}


const mapStateToProps = (state) => ({
  msfurole: state.msfurole,
  sfu_meetinginfo: state.sfu_meetinginfo,
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
    endconf: Actions.endconf,
    getipvrole: Actions.getipvrole,
    getsfutransferablelist: Actions.getsfutransferablelist,
    transfersfuhost: Actions.transfersfuhost
     
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(EndCall))