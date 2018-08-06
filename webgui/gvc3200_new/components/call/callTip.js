import React, { Component, PropTypes } from 'react'
import Enhance from "../mixins/Enhance"
import { Layout } from "antd"
import * as Actions from '../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout

class CallTip extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            tipwidth: 0
        }
    }
	
    componentDidMount = () =>{
        let width = document.body.offsetWidth - 230
        this.setState({
            tipwidth: width
        })
    }
    
	handleCallDialog = () => {
		this.props.showCallDialog(9);
	}

    render(){
        return (
            <div className="on-call-tip" onClick={this.handleCallDialog} style={{width: this.state.tipwidth}}>{this.tr("return_call")}</div>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
})

function mapDispatchToProps(dispatch) {
  var actions = {
	  showCallDialog: Actions.showCallDialog
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(CallTip));
