import React, {Component} from 'react'
import ScreenItems from './ScreenItems'

class DefaultLayout extends Component {
  render() {
    const {layoutSet, hdmi2State} = this.props
    let resultLayout = <div></div>
    if(hdmi2State == '0') {                                 // 一个屏
      resultLayout = (
        <div className="preview-box">
          <ScreenItems set= {layoutSet[0]} />
        </div>
      )
    } else if(hdmi2State == '1') {                          // 两个屏
      resultLayout = (
        <div style={{height: '100%'}}>
          <div className="preview-box semi">
            <ScreenItems set= {layoutSet[0]} />
          </div>
          <div className="preview-box semi">
            <ScreenItems set= {layoutSet[1]} />
          </div>
        </div>
      )
    }


    return resultLayout
  }
}


export default DefaultLayout