/**
 * 举手功能
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button } from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


class Handsup extends Component {
  handleHandsup = () => {
    if(!this.props.countClickedTimes()) {
        return false;
    }
    this.props.upordownhand();
  }


  render() {
    const { ipvrole, hasipvtline, handsupStatus } = this.props;

    if(!(hasipvtline && (ipvrole == "1" || ipvrole == "3"))) return null

    return (
      <div onClick={()=>this.handleHandsup()}>
          {handsupStatus == '1' ? this.tr('a_10221') : this.tr("a_10220")}
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  ipvrole: state.ipvrole,
  handsupStatus: state.handsupStatus
  
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
    upordownhand: Actions.upordownhand,
     
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Handsup))