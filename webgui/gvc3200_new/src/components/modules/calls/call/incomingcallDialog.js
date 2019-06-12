import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance"
import { Layout,Checkbox, Button, Modal } from "antd"
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout

class IncomingcallDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedLine: []
        }
    }

    componentDidMount = () => {

    }

    handleCallDialog = () => {
    }

    onchange = (e) => {
        let targetChecked = e.target.checked
        let targetValue = e.target.value
        let checkedLine = this.state.checkedLine.slice()
        if(targetChecked) {
            checkedLine.push(targetValue)
        } else {
            checkedLine.splice(checkedLine.indexOf(targetValue), 1)
        }
        this.setState({
            checkedLine
        })
    }

    handleAccept = (isvideo) => {
        let incominglinestatus = JSON.parse(JSON.stringify(this.props.incomingcalls.incomingcallsinfo));
        // GVC3210 only support one line
        if(incominglinestatus.length == 1){
            let line = incominglinestatus[0].line;
            this.props.acceptringline(line, 1 , isvideo);
        }else{
            let checkedLine = this.state.checkedLine
            if (checkedLine.length == 0) return false
            checkedLine.forEach(i => {
                this.props.acceptringline(incominglinestatus[i].line, 1 , incominglinestatus[i].isvideo);
                incominglinestatus.splice(i, 1)
            })
            // 剩余的全部reject
            incominglinestatus.forEach(line => {
                this.props.acceptringline(line.line, 0 , line.isvideo);
            })
        }
    }

    handelReject = () => {
        let incominglinestatus = this.props.incomingcalls.incomingcallsinfo
        // GVC3210 only support one line
        if(incominglinestatus.length == 1){
            let line = incominglinestatus[0].line;
            let isvideo = incominglinestatus[0].isvideo || incominglinestatus[0].msg ? 1 : 0;
            this.props.acceptringline(line, 0 , isvideo);
        }else{
            let checkedLine = this.state.checkedLine
            if (checkedLine.length == 0) {
                incominglinestatus.forEach(line => {
                    this.props.acceptringline(line.line, 0 , line.isvideo);
                })
            }
            checkedLine.forEach(i => {
                this.props.acceptringline(incominglinestatus[i].line, 0 , incominglinestatus[i].isvideo);
            })
        }
    }

    render() {
        let style = this.props.incomingcalls.style;
        let incominglines = this.props.incomingcalls.incomingcallsinfo;
        let length = incominglines.length;
        let checkboxvisible = "display-hidden";
        let h323acceptvisible = "display-hidden";
        let audioacceptvisible = "display-hidden";
        let videoacceptvisible = "display-hidden";
        if (length > 1) {
            checkboxvisible = "display-block";
            if(incominglines.some(line => line.isvideo == '1')) {
                videoacceptvisible = "display-inline";
                audioacceptvisible = "display-inline";
            }
            if(incominglines.some(line => line.isvideo == '0')) {
                audioacceptvisible = "display-inline";
            }

        } else if(length == 1){
            if (incominglines[0].acct == "1") {
                audioacceptvisible = "display-hidden";
                videoacceptvisible = "display-inline";
            } else {
                if (incominglines[0].msg == "1" || incominglines[0].isvideo == "1") {
                    audioacceptvisible = "display-inline";
                    videoacceptvisible = "display-inline";
                } else {
                    audioacceptvisible = "display-inline";
                    videoacceptvisible = "display-hidden";
                }
            }
            if(incominglines[0].acct == "8"){
                h323acceptvisible = "display-inline";
                audioacceptvisible = "display-inline";
                videoacceptvisible = "display-hidden";
            }
        }
        return (
            <Modal 
                title={this.tr("a_670")} 
                transitionName=""
                visible={style == 'display-block'}
                className="incomingcalldiv"
                closable={false}
                footer = {
                    <div className="incomingbtn">
                    <Button className="reject" onClick={this.handelReject}>{this.tr('a_523')}</Button>
                    <Button type="primary" className={h323acceptvisible + " callaccept"}
                            onClick={this.handleAccept.bind(this, 1)}>{this.tr('a_522')}</Button>
                    <Button type="primary" className={videoacceptvisible + " callaccept"}
                            onClick={this.handleAccept.bind(this, 1)}>{this.tr('a_626')}</Button>
                    <Button type="primary" className={audioacceptvisible + " callaccept"}
                            onClick={this.handleAccept.bind(this, 0)}>{this.tr('a_625')}</Button>
                    </div>
                }
             >
                <ul className="incominglist">
                    {
                        incominglines.map((item, i) => {
                            return <li className="itemdiv">
                                <span className="itemcheck">
                                    <Checkbox className={checkboxvisible} onChange={this.onchange} value={i}></Checkbox>
                                </span>
                                <span className="itemname">{item.name}</span>
                                <span className="itemnum">{item.num}</span>
                            </li>
                        })
                    }
                </ul>
                
            </Modal>
        );
    }}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    incomingcalls: state.incomingcalls
})

function mapDispatchToProps(dispatch) {
    var actions = {
        acceptringline: Actions.acceptringline
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(IncomingcallDialog));
