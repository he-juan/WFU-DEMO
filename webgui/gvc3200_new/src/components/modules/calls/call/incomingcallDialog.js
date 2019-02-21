import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance"
import { Layout,Checkbox, Button } from "antd"
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout

class IncomingcallDialog extends Component {
    constructor(props) {
        super(props);
        let checkedinfo = [];
        checkedinfo[0] = true;
        this.state = {
            checkedstate: checkedinfo
        }
    }

    componentDidMount = () => {

    }

    handleCallDialog = () => {
    }

    onchange = () => {

    }

    handleAccept = (isvideo) => {
        let incominglinestatus = this.props.incomingcalls.incomingcallsinfo;
        // GVC3210 only support one line
        if(incominglinestatus.length == 1){
            let line = incominglinestatus[0].line;
            this.props.acceptringline(line, 1 , isvideo);
        }else{

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
            <div className={"incomingcalldiv " + style} onClick={this.handleCallDialog} >
                <div className="title">{this.tr("a_670")}</div>
                <div className="incominglist">
                    {
                        incominglines.map((item, i) => {
                            return <div className="itemdiv">
                                <div className="itemcheck">
                                    <Checkbox className={checkboxvisible} onChange={this.onchange}></Checkbox></div>
                                <div className="itemname"><span title={item.name}>{item.name}</span></div>
                                <div className="itemnum"><span title={item.num}>{item.num}</span></div>
                            </div>
                        })
                    }
                </div>
                <div className="incomingbtn">
                    <Button type="primary" className={h323acceptvisible + " callaccept"}
                            onClick={this.handleAccept.bind(this, 1)}>{this.tr('a_522')}</Button>
                    <Button type="primary" className={videoacceptvisible + " callaccept"}
                            onClick={this.handleAccept.bind(this, 1)}>{this.tr('a_626')}</Button>
                    <Button type="primary" className={audioacceptvisible + " callaccept"}
                            onClick={this.handleAccept.bind(this, 0)}>{this.tr('a_625')}</Button>
                    <Button type="primary" className="reject" onClick={this.handelReject}>{this.tr('a_523')}</Button>
                </div>
            </div>
        );
    }}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    incomingcalls: state.incomingcalls
})

function mapDispatchToProps(dispatch) {
    var actions = {
        showCallDialog: Actions.showCallDialog,
        acceptringline: Actions.acceptringline
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(IncomingcallDialog));
