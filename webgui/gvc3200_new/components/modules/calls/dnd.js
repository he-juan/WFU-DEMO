import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance"
import { Layout } from "antd"
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout

class Dnd extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Content className="content-container">
                <div className="subpagetitle">{this.tr("a_dndset")}</div>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
})

function mapDispatchToProps(dispatch) {
  var actions = {
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Dnd));
