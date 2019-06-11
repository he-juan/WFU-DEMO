/**
 * 邀请功能
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import { Button } from "antd"
import InviteMemberModal from './InviteMemberModal'


class InviteMember extends Component {
  constructor() {
    super()
    this.state = { 
      InviteMemberModalVisible: false
    }
  }
  toogleInviteMemberModal = (visible) => {
    if(visible == true && this.props.ispause()) {
        return;
    }
    this.setState({
        InviteMemberModalVisible: visible
    })
  }

  render(){
    const { disabled, linestatus } = this.props

    return (
      <span>
        <Button title={this.tr("a_517")} className={`addmember-btn`} disabled={disabled} onClick={() => {this.toogleInviteMemberModal(true)}} />  <br/>
        {this.tr("a_517")}
        <InviteMemberModal visible={this.state.InviteMemberModalVisible} onHide={() => this.toogleInviteMemberModal(false)}  linestatus={linestatus} />
      </span>
    )
  }
}

export default Enhance(InviteMember)