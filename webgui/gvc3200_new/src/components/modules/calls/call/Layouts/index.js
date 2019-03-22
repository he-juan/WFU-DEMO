/**
 * 布局功能
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button } from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LayoutModal from './LayoutModal'
import LayoutModel_SFU from './LayoutModal_SFU'

class Layouts extends Component {
  constructor() {
    super()
    this.state = {
      LayoutModalVisible: false
    }
  }
  toogleLayoutModal = (visible) => {
    if(this.props.isvideo == '0') {
        this.props.promptMsg('WARNING', "a_10109");
        return;
    }
    if(visible == true && this.props.ispause()) {
        return;
    }
    this.setState({
        LayoutModalVisible: visible
    })
  } 
  componentWillUpdate = (nextProps) => {
    if (this.props.presentation != nextProps.presentation || this.props.presentSource != nextProps.presentSource || this.props.presentLineMsg != nextProps.presentLineMsg) {
        this.setState({
            LayoutModalVisible:false,
        })
    }
  }
  render () {
    const { ctrlbtnvisible, is4kon, acctstatus, msfurole, linestatus } = this.props
    return (
      <span>
        <Button title={this.tr("a_16703")} className={`${ctrlbtnvisible} layout-btn`} style={{display: is4kon ? 'none': 'block'}} onClick={() => this.toogleLayoutModal(true)}/>
        {
            (this.props.isvideo == 1 && acctstatus[0]) ? 
            msfurole == -1 ?
            <LayoutModal visible={this.state.LayoutModalVisible} onHide={() => this.toogleLayoutModal(false)} confname={linestatus[0].name || linestatus[0].num} conftype={acctstatus[0].name}/> 
            : 
            <LayoutModel_SFU visible={this.state.LayoutModalVisible} onHide={() => this.toogleLayoutModal(false)} />
            : null
        }
      </span>
    )
  }
}


const mapStateToProps = (state) => ({
  isvideo: state.isvideo,
  presentation: state.presentation,
  presentSource: state.presentSource,
  presentLineMsg: state.presentLineMsg,
  msfurole: state.msfurole
  
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
    promptMsg: Actions.promptMsg
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Layouts))