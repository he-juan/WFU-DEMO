import React, { Component } from 'react'
import Enhance from '../../../mixins/Enhance'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Checkbox, Modal, Row, Col} from "antd"
import selectNum from '../contact/selectNum';
class callMoreLine extends Component {
    constructor(props){
        super(props);
        this.state = {
            selCallData: [],
            disabledIPVT: false,
            changeStatus:false,
            disabledOtherType:false
        }
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {

    }

    handleOk = () => {
        console.log(this.state.selCallData)
        let data = this.state.selCallData
        let memToCall =[]
        data.forEach(item =>{
            memToCall.push({
                num: item.numbers,
                acct: item.acct,
                isvideo: item.isvideo || 0,
                source: item.source || 0,
                isconf: '1',
            })
        })
        this.props.makeCall(memToCall)
        this.props.handleHideCallMoreModal();
    }

    handleCancel = () => {
        this.props.handleHideCallMoreModal();
        // this.checkoutCyclemode(0);
        var containermask = document.getElementsByClassName("containermask")[0];
        if (containermask){
            containermask.style.display = "block";
        }
        this.props.form.resetFields()
        this.setState({selCallData:[]});
    }

    onChange = (e) => {
        let checked = e.target.checked
        let value = e.target.value
        let data = this.state.selCallData
        let member = []
        if(checked) {
            // let tempData = data.concat(value)
            member = this.limitMaxMembers(data.concat(value))
        } else if(data.length> 0) {
            for(let i =0;i<data.length;i++) {
                // console.log(data[i])
                if(data[i].numbers==value.numbers && data[i].names==value.names && data[i].acct==value.acct){
                    data.splice(i,1)
                }
            }
            member = data
        }

        this.setState({selCallData:member})
    }

    limitMaxMembers(_memToCall) {
        if (_memToCall.length == 0) return _memToCall
        const { maxlinecount, linesInfo } = this.props
        let lastMem = _memToCall.pop()  // // 最后一个是待添加的, 暂移除
        let temp = _memToCall.concat(linesInfo) // 并且与已在通话线路中的成员合并
        let nonIPVTlen = temp.filter(v => v.acct != '1').length // 非IPVT线路数量
        let IPVTlen = temp.length - nonIPVTlen

        // 存在ipvt线路且ipvt线路成员不超过100
        let curLinesLen = IPVTlen > 0  ? nonIPVTlen + 1 : nonIPVTlen  // 线路总数量
        let maxNum = 200
        if(IPVTlen >= maxNum && lastMem.acct == '1') {
          this.props.promptMsg('ERROR', 'a_23577')
          return _memToCall
        }

        if(curLinesLen >= maxlinecount ) {   // 如果当前输入框内成员数加已有线路数 大于限制 且 当前待添加的不是IPVT
          if(IPVTlen == 0 ) {
            this.props.promptMsg('ERROR', 'a_23550')
          } else if(IPVTlen > 0 && lastMem.acct != '1') {
            this.props.promptMsg('ERROR','a_23551')
          } else if(IPVTlen > 0 && IPVTlen < maxNum && lastMem.acct == '1') {
            _memToCall.push(lastMem)
          }
        } else {
          _memToCall.push(lastMem)
        }
        return _memToCall
    }

    checkChecked = (data) => {
        let selCallData = this.state.selCallData
        for(let i =0;i<data.length;i++) {
            data[i].isSelected = false
            if (selCallData.length>0) {
                for(let j=0;j<selCallData.length;j++) {
                    let value = selCallData[j]
                    if(data[i].numbers==value.numbers && data[i].names==value.names && data[i].acct==value.acct){
                        data[i].isSelected = true
                    }
                }
            }
        }
        return data
    }

    render() {
        let modalclass = 'importModal confModal callMoreModal'
        const {callTr,itemValues} = this.props;
        let data = this.props.curCallData
        // console.log('curCallData',this.props.curCallData)
        let accountObj = {
            '-1': 'Active account',
            '0': 'SIP',
            '1': 'IPVideoTalk',
            '8': 'H.323'
        }
        data = this.checkChecked(data)
        return(
            <div>
                <Modal className={modalclass} visible={this.props.displayCallModal}
                       title={callTr('a_504')} onOk={this.handleOk} onCancel={this.handleCancel} okText={callTr("a_504")} cancelText={callTr("a_3")} >
                        {
                            (data != "" || data.length > 0) && data.length && data.map((item,i) => {
                                return(
                                    <Row className="callNumerLine" key={"r"+i}>
                                        <Col span={10} className="ellips callNameCol" >
                                            {item.acct == '1' ?
                                                <Checkbox disabled={this.state.disabledIPVT && !item.isSelected} value={item} checked={item.isSelected} onChange={this.onChange}></Checkbox>
                                                :
                                                <Checkbox disabled={this.state.disabledOtherType && !item.isSelected} value={item} checked={item.isSelected} onChange={this.onChange}></Checkbox>
                                            }
                                            <span className="callNameSpan">{item.names}</span>
                                        </Col>
                                        <Col span={8}>{accountObj[item.acct]}</Col>
                                        <Col span={6} className="callNumCol">{item.numbers}</Col>
                                    </Row>
                                )
                            })
                        }
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    maxlinecount: state.maxlinecount,
    linesInfo:state.linesInfo
});

function mapDispatchToProps(dispatch) {
    var actions = {
        makeCall: Actions.makeCall
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps ,mapDispatchToProps)(Enhance(callMoreLine));
