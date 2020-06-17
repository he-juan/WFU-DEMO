import React, { Component } from 'react'
import styled from './RemoteControl.module.less'
import { setKeyCode as ApiSetKeyCode } from '@/api/api.common'
import { $t } from '@/Intl'

export default class RemoteControl extends Component {
  // constructor
  constructor (props) {
    super(props)

    this.state = {
      showModal: false
    }
    this.mInterval = null
  }

  // 设置Modal show
  setShowModal = (bool = true) => {
    this.setState(
      {
        showModal: bool
      }
    )
  }

  // 设置键值
  setKey = (keycode) => {
    if (keycode) {
      let repeattimes = 0
      ApiSetKeyCode(0, keycode, 0)
      this.mInterval = setInterval(() => ApiSetKeyCode(0, keycode, ++repeattimes), 200)

      let remoteMouseUp = () => {
        clearInterval(this.mInterval)
        this.mInterval = null
        document.removeEventListener('mouseup', remoteMouseUp, false)
        ApiSetKeyCode(1, keycode, 0)
        remoteMouseUp = null
      }
      document.addEventListener('mouseup', remoteMouseUp, false)
    } else {
      if (this.mInterval !== null) {
        clearInterval(this.mInterval)
        this.mInterval = null
      }
    }
  }

  // render
  render () {
    let { showModal } = this.state
    // const { productInfo: { Product } } = this.props

    return (
      <div id='remoteControl' className={styled['container']}>
        <span onClick={() => this.setShowModal()}>{$t('b_035')}</span>

        {/* 遥控器弹窗 */}
        {
          showModal && <div className={styled['modal']}>
            <div className={styled['modal-content']}>
              <span className={styled['modal-close']} onClick={() => this.setShowModal(false)}></span>
              <div className={styled['tophomebtn']}>
                <button className={styled['powerbtn']} onMouseDown={() => this.setKey(26)}><span/></button>
              </div>
              <div className={styled['touchpad']}></div>
              <div className={styled['btnarea']}>
                <button className={styled['returnkey']} onMouseDown={() => this.setKey(4)}><span/></button>
                <button className={styled['homekey']} onMouseDown={() => this.setKey(3)}><span/></button>
                <button className={styled['menukey']} onMouseDown={() => this.setKey(82)}><span/></button>
              </div>
              <div className={styled['btnarea']}>
                <button className={styled['customkey']} onMouseDown={() => this.setKey(300)}><span/></button>
              </div>
              {/* 根据 Product 判断执行不同的 P值 */}
              <div className={styled['btnarea']}>
                <button className={styled['reddigit']} onMouseDown={() => this.setKey(296)}><span/></button>
                <button className={styled['yellowdigit']} onMouseDown={() => this.setKey(297)}><span/></button>
                <button className={styled['bluedigit']} onMouseDown={() => this.setKey(298)}><span/></button>
              </div>
              <div className={styled['radiusarea']}>
                <button className={styled['volumedownbtn']} onMouseDown={() => this.setKey(25)}><span/></button>
                <button className={styled['volumeupbtn']} onMouseDown={() => this.setKey(24)}><span/></button>
              </div>
              <div className={styled['centerarrow']}>
                <button className={styled['topbtn']} onMouseDown={() => this.setKey(19)}><span/></button>
                <button className={styled['leftbtn']} onMouseDown={() => this.setKey(21)}><span/></button>
                <button className={styled['centerbtn']} onMouseDown={() => this.setKey(23)}><span/></button>
                <button className={styled['rightbtn']} onMouseDown={() => this.setKey(22)}><span/></button>
                <button className={styled['bottombtn']} onMouseDown={() => this.setKey(20)}><span/></button>
              </div>
              <div className={styled['radiusarea']}>
                <button className={styled['zoomoutbtn']} onMouseDown={() => this.setKey(169)}><span/></button>
                <button className={styled['zoominbtn']} onMouseDown={() => this.setKey(168)}><span/></button>
              </div>
              <div className={styled['downbtnarea']}>
                <button className={styled['layoutbtn']} onMouseDown={() => this.setKey(292)}><span/></button>
                <button className={styled['ptzbtn']} onMouseDown={() => this.setKey(291)}><span/></button>
                <button className={styled['presentationbtn']} onMouseDown={() => this.setKey(293)}><span/></button>
              </div>
              <div className={styled['downbtnarea']}>
                <button className={styled['digitcall']} onMouseDown={() => this.setKey(5)}><span/></button>
                <button className={styled['digitback']} onMouseDown={() => this.setKey(67)}><span/></button>
                <button className={styled['digitendcall']} onMouseDown={() => this.setKey(6)}><span/></button>
              </div>
              <div className={styled['downbtnarea']}>
                <button className={styled['digitnum1']} onMouseDown={() => this.setKey(8)}><span/></button>
                <button className={styled['digitnum2']} onMouseDown={() => this.setKey(9)}><span/></button>
                <button className={styled['digitnum3']} onMouseDown={() => this.setKey(10)}><span/></button>
              </div>
              <div className={styled['downbtnarea']}>
                <button className={styled['digitnum4']} onMouseDown={() => this.setKey(11)}><span/></button>
                <button className={styled['digitnum5']} onMouseDown={() => this.setKey(12)}><span/></button>
                <button className={styled['digitnum6']} onMouseDown={() => this.setKey(13)}><span/></button>
              </div>
              <div className={styled['downbtnarea']}>
                <button className={styled['digitnum7']} onMouseDown={() => this.setKey(14)}><span/></button>
                <button className={styled['digitnum8']} onMouseDown={() => this.setKey(15)}><span/></button>
                <button className={styled['digitnum9']} onMouseDown={() => this.setKey(16)}><span/></button>
              </div>
              <div className={styled['downbtnarea']}>
                <button className={styled['digitasterisk']} onMouseDown={() => this.setKey(17)}><span/></button>
                <button className={styled['digit0']} onMouseDown={() => this.setKey(7)}><span/></button>
                <button className={styled['digithash']} onMouseDown={() => this.setKey(18)}><span/></button>
              </div>
              <div className={styled['bottommutebtn']}>
                <button className={styled['mutebtn']} onMouseDown={() => this.setKey(91)}><span/></button>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
