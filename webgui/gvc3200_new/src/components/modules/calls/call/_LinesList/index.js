/**
 * 线路列表 包括本地
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ListSFU from './LineList_sfu'
import ListNormal from './LinesList_normal'


class LinesList extends Component {

    render() {
        const  { msfurole, ...rest } = this.props
        console.log(msfurole)
        if(msfurole == null) return <div style={{height: 550}}></div>
        return msfurole >=1 ? <ListSFU {...rest} /> : <ListNormal {...rest} />
    }
}



const mapStateToProps = (state) => ({
    msfurole: state.msfurole

})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        
    }

    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(LinesList))