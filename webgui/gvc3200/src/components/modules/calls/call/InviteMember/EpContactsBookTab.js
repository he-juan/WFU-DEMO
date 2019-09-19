import React, { Component } from 'react'
import Enhance from "components/mixins/Enhance"
import * as Actions from 'components/redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class EpContactsBookTab extends Component {

  render() {
    return (
      <div>
        企业通讯录
      </div>
    )
  }
}


const mapState = (state) => {
  return {
  }
}
const mapDispatch = (dispatch) => {
  let actions = {
  }
  return bindActionCreators(actions, dispatch)
}
export default connect(mapState, mapDispatch)(Enhance(EpContactsBookTab))