/* eslint-disable no-multiple-empty-lines */
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */



import React, { Component, createRef } from 'react'


class ScreenShare extends Component {
  state = {
    isCapturing: false
  }

  videoRef = createRef()

  /*
    录屏功能相关代码在 /public/screen_capture下，
    需要结合chrome插件使用，chrome插件源码 /_screen_capture_extensions
    录屏功能需要https环境

  */

  handleGetScreenId = () => {
    const _this = this
    if (this.state.isCapturing) return false
    import(/* webpackChunkName: "screenCapture" */'@/utils/screenCapture/getScreenId').then(m => {
      let getScreenId = m.default
      getScreenId((error, sourceId, screen_constraints) => {
        // error    == null || 'permission-denied' || 'not-installed' || 'installed-disabled' || 'not-chrome'
        // sourceId == null || 'string' || 'firefox'
        if (navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob)) {
          navigator.getDisplayMedia(screen_constraints).then(stream => {
            document.querySelector('video').srcObject = stream
          }, error => {
            alert('Please make sure to use Edge 17 or higher.')
          })

          return
        }

        if (error === 'not-installed') {
          // todo 安装chrome插件的交互需要添加
          alert('Please install Chrome extension.')
          return
        }

        navigator.mediaDevices.getUserMedia(screen_constraints).then(function (stream) {
          // 此处需要将视频流传递给后台服务器 （RTCPeerConnection API）
          if (stream) {
            _this.setState({
              isCapturing: true
            })
          }
          _this.videoRef.current.srcObject = stream

          // share this "MediaStream" object using RTCPeerConnection API
          stream.getTracks()[0].onended = _this.handleScreenEnded
        }).catch(function (error) {
          console.error('getScreenId error', error)

          alert('Failed to capture your screen. Please check Chrome console logs for further information.')
        })
      })
    })
  }

  handleScreenEnded = (e) => {
    this.videoRef.current.srcObject = null
    this.setState({
      isCapturing: false
    })
  }


  render () {
    return (
      <span className='screen-share-btn' onClick={this.handleGetScreenId}>
        共享视频
        <video
          controls={true}
          autoPlay={true}
          playsInline={true}
          ref={this.videoRef}
          onStalled={(e) => { console.log(e) }}
          style={{
            display: 'none',
            position: 'fixed',
            width: 1000,
            left: 300,
            top: 100,
            zIndex: 10000
          }}
        />
      </span>
    )
  }
}

export default ScreenShare
