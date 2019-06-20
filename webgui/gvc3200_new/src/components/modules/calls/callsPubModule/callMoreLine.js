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
            alldisabled: false,
            changeStatus:false
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
        // console.log('checked', checked,value);
        let data = this.state.selCallData
        let limitNum = 8
        if(checked) {
            data.push(value)
            if(data.length==limitNum) {
                this.setState({alldisabled:true})
            }
        } else if(data.length>0) {
        // if(data.length>0) {
            if(!(selectNum >limitNum)) {
                this.setState({alldisabled:false})
            }
            for(let i =0;i<data.length;i++) {
                console.log(data[i])
                if(data[i].numbers==value.numbers && data[i].names==value.names && data[i].acct==value.acct){
                    data.splice(i,1)
                }
            }
        // }
        }
        this.setState({selCallData:data})
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
        let arr = []
        arr.fill('',10)
        arr[0] = 'Active account'
        arr[1] = 'SIP'
        arr[2] = 'IPVideoTalk'
        arr[9] = 'H.323'
        data = this.checkChecked(data)
        return(
            <div>
                <Modal className={modalclass} visible={this.props.displayCallModal}
                       title={callTr('a_504')} onOk={this.handleOk} onCancel={this.handleCancel} okText={callTr("a_504")} cancelText={callTr("a_3")} >
                      {/* <Checkbox.Group onChange={this.onChange}> */}
                        {
                            (data != "" || data.length > 0) && data.length && data.map((item) => {
                                return(
                                    <Row className="callNumerLine">
                                        <Col span={8} className="ellips">{item.names}</Col>
                                        <Col span={8}>{arr[item.acct]}</Col>
                                        <Col span={8}>
                                        <span className="callNumerSpan">{item.numbers}</span>
                                        <Checkbox disabled={this.state.alldisabled && !item.isSelected} value={item} onChange={this.onChange}></Checkbox>
                                        </Col>
                                    </Row>
                                )
                            })
                        }

                        {/* <Row>

                            <Col span={8}><Checkbox value="A">A</Checkbox></Col>
                            <Col span={8}><Checkbox value="B">B</Checkbox></Col>
                            <Col span={8}><Checkbox value="C">C</Checkbox></Col>
                            <Col span={8}><Checkbox value="D">D</Checkbox></Col>
                            <Col span={8}><Checkbox value="E">E</Checkbox></Col>
                        </Row> */}
                    {/* </Checkbox.Group> */}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
    var actions = {
        makeCall: Actions.makeCall
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps ,mapDispatchToProps)(Enhance(callMoreLine));
