import React, {Component} from 'react'
import Enhance from "../../../mixins/Enhance";
import * as Actions from '../../../redux/actions/index';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Modal} from "antd"

class RecordModal extends Component {

    constructor(props) {
        super(props);
    }

    handlelocalrcd = () =>{
        let recordstatus = this.props.recordStatus;
        /* 0-not recording  1- in recording */
        this.props.handlerecord(recordstatus);
    }
    handleipvtrcd = () =>{
        let recordstatus = this.props.ipvtRecordStatus;
        /* 0-not recording  1- in recording */
        this.props.handleipvtrecord(recordstatus);
    }

    render() {
        let {visible, onHide, recordStatus, ipvtRecordStatus} = this.props;
        let localrcdstatusclass = "rcdstart", ipvtrcdstatusclass = "rcdstart";
        if(recordStatus == "1"){
            localrcdstatusclass = "rcdstop";
        }
        if(ipvtRecordStatus == "1"){
            ipvtrcdstatusclass = "rcdstop";
        }
        return (
            <Modal className="record-modal" title={this.tr("a_19252")} width="400px" footer={null} visible={visible} onCancel={onHide}>
                <div style={{height: "100px"}}>
                    <div>
                        <div className="localrcd recordline">
                            <div className="rcdicon"></div>
                            <div className="rcdlinename">{this.tr("a_19249")}</div>
                            <div className={localrcdstatusclass} onClick={()=>this.handlelocalrcd()}></div>
                        </div>
                        <div className="ipvtrcd recordline">
                            <div className="rcdicon"></div>
                            <div className="rcdlinename">{this.tr("a_19250")}</div>
                            <div className={ipvtrcdstatusclass} onClick={()=>this.handleipvtrcd()}></div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    recordStatus: state.recordStatus,
    ipvtRecordStatus: state.ipvtRecordStatus
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        handlerecord: Actions.handlerecord,
        handleipvtrecord: Actions.handleipvtrecord
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(RecordModal))