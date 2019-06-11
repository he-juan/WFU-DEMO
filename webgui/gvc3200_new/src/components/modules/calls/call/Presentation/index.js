/**
 * 演示功能
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button } from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import PresentationModal from './PresentationModal'


class Presentation extends Component {
  constructor () {
    super()
    this.state = {
      PresentModalVisible: false
    }
  }
  tooglePresentModal = (visible) => {
    if(visible == true && this.props.ispause()) {
        return;
    }
    this.setState({
        PresentModalVisible: visible
    })
  }

  componentWillUpdate = (nextProps) => {
    if (this.props.presentation != nextProps.presentation || this.props.presentSource != nextProps.presentSource || this.props.presentLineMsg != nextProps.presentLineMsg) {
        this.setState({
            PresentModalVisible: false,
        })
    }
  }
  render() {
    const {presentation} = this.props
    return (
      <span>
        <Button title={this.tr("a_10004")} className={`present-btn unpresen-icon ${presentation ? 'active': ''}`} onClick={() => this.tooglePresentModal(true)}/> <br />
        {this.tr("a_10004")}
        <PresentationModal visible={this.state.PresentModalVisible} onHide={() => this.tooglePresentModal(false)} />
      </span>
    )
  }
}

const mapStateToProps = (state) => ({
  presentation: state.presentation,
  presentSource: state.presentSource,
  presentLineMsg: state.presentLineMsg
  
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
      
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Presentation))