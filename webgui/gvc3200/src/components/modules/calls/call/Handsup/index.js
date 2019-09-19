/**
 * 举手功能  GVC3220 暂废弃
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
    const { ctrlbtnvisible, ipvrole, hasipvtline, handsupStatus } = this.props;

    if(ctrlbtnvisible == 'display-hidden') return null

    let handsupclass = "unhandsup";
    let handsupdisplay = "none";
    if(hasipvtline && (ipvrole == "1" || ipvrole == "3") ){
        handsupdisplay = "block";
    }
    if(handsupStatus == "1"){
        handsupclass = "handsup"
    }
    return (
      <span>
        <Button title={this.tr("a_10220")} className={`${ctrlbtnvisible} ${handsupclass}`} style={{display: handsupdisplay}}  onClick={()=>this.handleHandsup()} />
      </span>
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