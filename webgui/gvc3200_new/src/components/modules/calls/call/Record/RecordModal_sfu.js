import React, {Component} from 'react'
import Enhance from "../../../../mixins/Enhance";
import * as Actions from '../../../../redux/actions/index';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Modal, Checkbox} from "antd"


class RecordModalSFU extends Component {
  constructor() {
    super()
    this.state = {
      list: [],
      checkedSource: []
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.visible != this.props.visible && prevProps.visible == false) {
      this.props.getsfuvideolayoutlist((list) => {
        this.setState({
          list: list
        })
      })
    }
  }
  handleCheck = (v) => {
    if(v.length > 3) v.shift()
    this.setState({
      checkedSource: v
    })
  }
  handleSubmit = () => {
    let _checkedSource = this.state.checkedSource.join(',')
    this.props.startconfrecording(_checkedSource)
    this.props.onHide()
  }
  render() {
    const { visible, onHide } = this.props
    const { list, checkedSource } = this.state
    return (
      <Modal visible={visible} title="录像" onCancel={onHide} okText="保存" onOk={() => this.handleSubmit()}>
        <p style={{fontSize: 16, marginBottom:20}}>请选择要录制的屏幕,最多3方:</p>
        <Checkbox.Group value={checkedSource} onChange={(v) => this.handleCheck(v)}>
        <p style={{lineHeight: '28px', overflow: 'hidden', width: 300, paddingLeft: 20}}><span>{'演示画面'}</span> <Checkbox style={{float: 'right'}} value="Content"></Checkbox></p>
          {
            list.map(v => {
              if (v.name == 'null') return null
              return <p style={{lineHeight: '28px', overflow: 'hidden', width: 300, paddingLeft: 20}}><span>{ v.name}</span> <Checkbox style={{float: 'right'}} value={v.trackId}></Checkbox></p>
            })
          }
        </Checkbox.Group>
      </Modal>
    )
  }


}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  const actions = {
    getsfuvideolayoutlist: Actions.getsfuvideolayoutlist,
    startconfrecording:Actions.startconfrecording
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(RecordModalSFU))