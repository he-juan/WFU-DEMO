import React, {Component} from 'react'
import Enhance from "../../../mixins/Enhance";
import * as Actions from '../../../redux/actions/index';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Modal} from "antd"

class DTMFModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            DTMFString: ""
        };
    }

    componentDidMount = () => {
        this.setState({DTMFString: this.props.DTMFString});

    }

    componentWillReceiveProps = (nextProps) => {
        if ( this.props.DTMFString != nextProps.DTMFString ) {
            this.setState({DTMFString: nextProps.DTMFString});
        }
    }

    clickKeypad = (content) => {
        this.setState({DTMFString: this.state.DTMFString + content});
        this.props.sendDTMFchar(content);
    }

    handleDTMFString = (DTMFString) => {
        if(!DTMFString){
            return "";
        }
        let dtmfstr = DTMFString;
        let maxlength = 12;
        let hide_content, new_content;
        if (this.props.textdisplay) {
            if (dtmfstr.length > maxlength) {
                hide_content = dtmfstr.substr(0, dtmfstr.length - maxlength);
                dtmfstr = dtmfstr.substr(dtmfstr.length - maxlength, dtmfstr.length);
            }
            return dtmfstr;
        } else {
            let pswstr = "";
            let pswlength = 0;
            if(dtmfstr.length > maxlength)
            {
                pswlength = maxlength - 1;
            }
            else
            {
                pswlength = dtmfstr.length;
            }
            for(let n=0; n < pswlength ; n++)
            {
                pswstr += unescape('%u25CF');
            }
            return pswstr;
        }
    }

    render(){
        let tr = this.tr;
        let {visible, onHide,textdisplay} = this.props;
        let {DTMFString} = this.state;
        let showstr = this.handleDTMFString(DTMFString);
        var keyboardArray = (new Array(12)).fill(0);
        return(
            <Modal className="dtmf-modal" keyboard="false" maskClosable="false" footer={null} visible={visible} onCancel={onHide}>
                <div className="dtmfinput"><p style={{textAlign: 'right'}}>{showstr}</p></div>
                <div className="dtmfdial">
                    {
                        keyboardArray.map((item, index) => {
                            let content = index + 1;
                            if(index == 9){
                                content = "*";
                            }else if(index == 10){
                                content = "0";
                            }else if(index == 11){
                                content = "#";
                            }
                            let middleclass = ""
                            if(index % 3 == 1 ){
                                middleclass = " midkeypad";
                            }
                            return <div className={"dtmfkeypad" + middleclass} onClick={this.clickKeypad.bind(this,content + "")} >
                                <span>{ content + "" }</span></div>
                        })
                    }
                </div>
            </Modal>
        )
    }

}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        sendDTMFchar: Actions.sendDTMFchar
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DTMFModal))