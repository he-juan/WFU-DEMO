import React, {Component} from 'react'
import Enhance from "../../../../mixins/Enhance";
import * as Actions from '../../../../redux/actions/index';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'




class DNDBtn extends Component {
    constructor() {
      super()
    }
    handlednd = () =>{
      if(this.props.hasipvtline){
          if(this.props.dndstatus == "0"){
              this.props.promptMsg("WARNING", this.tr("a_16710"));
          }else{
              this.props.promptMsg("WARNING", this.tr("a_16716"));
          }
          return false;
      }
      if(this.props.dndstatus == "0"){
          this.props.setDndMode("1");
      }else{
          this.props.setDndMode("0");
      }
    }
    render() {
      if(this.props.hasipvtline) return null
      return (
        <div onClick={this.handlednd}>{this.props.dndstatus == "1" ? this.tr("a_10254") : this.tr("a_10253")}</div>
      )
    }
}


const mapStateToProps = (state) => ({
  dndstatus: state.dndstatus,
  curLocale: state.curLocale,

})

const mapDispatchToProps = (dispatch) => {
    const actions = {
      setDndMode: Actions.setDndMode,
      promptMsg: Actions.promptMsg
    }
    return bindActionCreators(actions, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DNDBtn))