import React, {Component} from 'react'
import Enhance from "../../../../mixins/Enhance";
import * as Actions from '../../../../redux/actions/index';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Modal} from "antd"
import './DetailsModal_sfu.css'



class DetailModalSfu extends Component {
  constructor() {
    super()
    this.state = {
      currentInfo: 'conf-detail',
      currentMember: ''
    }
  }
  mapNumberToName(number, list){
    return list.filter(v => v.number == number)[0].name
  }
  calMemberDetailMap = (callStatus, allMemeberList, currAccNumber) => {
    // console.log(callStatus, allMemeberList, currAccNumber)
    let _this = this
    let result = {}
    callStatus.filter(v => v.type == 'video').forEach(v => {
      let number = v.track_id.match(/[^_]*_(\d+)_.*/)[1]
      if((number == currAccNumber && v.mode == 'send') || (number != currAccNumber && v.mode == 'recv')) {
        result[_this.mapNumberToName(number, allMemeberList)] = v
      }
    })

    return result
  }
  switchInfo = (tab, name) => {
    this.setState({
      currentInfo: tab
    })
    if(name)(
      this.setState({
        currentMember: name
      })
    )
  }

  render() {
    const {visible, onHide, detailinfo, sfu_meetinginfo, acctstatus} = this.props;
    const { currentInfo, currentMember } = this.state
    const callStatus = detailinfo.info ? detailinfo.info.callStatus : []

    const audioSend = callStatus.filter(v => v.type == "audio" && v.mode == "send")[0]
    const audioRecv = callStatus.filter(v => v.type == "audio" && v.mode == "recv")[0]
    const presentSend = callStatus.filter(v => v.type == "content" && v.mode == 'send')[0]
    const presentRecv = callStatus.filter(v => v.type == "content" && v.mode == 'recv')[0]
    // 计算得出所有成员
    const memberDetailMap = this.calMemberDetailMap(callStatus, sfu_meetinginfo.memberInfoList, acctstatus[0].number)

    const curMemInfo = memberDetailMap[currentMember]

    return (
      <Modal className="call-details-modal" visible={visible}  width="920px" maskClosable="false" footer={null} onCancel={onHide}>
        <div className="detailscontent sfu-details" style={{ height:  '630px'}}>
          <div className="lineinfo">
            <div className={currentInfo == 'conf-detail' ? 'linelist active' : 'linelist'} onClick={() => this.switchInfo('conf-detail')}>会议信息</div>
            <div className={currentInfo == 'general-detail' ? 'linelist active' : 'linelist'} onClick={() => this.switchInfo('general-detail')}>通用详情</div>
            {
              Object.keys(memberDetailMap).map( v => 
              <div className={currentInfo == 'member-detail' && currentMember == v ? 'linelist active' : 'linelist'} onClick={() => this.switchInfo('member-detail', v)}>{v}</div>
              )
            }
          </div>
          <div className="linedetails">
            {/* 会议信息 */}
            {
              currentInfo == 'conf-detail' ? 
              <div className="conf-detail">
                <div className="ipvconfdivs">
                  <span className="ipvconfdes">会议时间</span><span>:</span><span className="ipvconfcontent">{sfu_meetinginfo.beginTime}</span>
                </div>
                <div className="ipvconfdivs">
                  <span className="ipvconfdes">会议号码</span><span>:</span><span className="ipvconfcontent">{sfu_meetinginfo.meetingNumber}</span>
                </div>
                <div className="ipvconfdivs">
                  <span className="ipvconfdes">会议密码</span><span>:</span><span className="ipvconfcontent">{sfu_meetinginfo.meetingPassword ? sfu_meetinginfo.meetingPassword : '无'}</span>
                </div>
                <div className="ipvconfdivs">
                  <span className="ipvconfdes">会议主持人</span><span>:</span><span className="ipvconfcontent">{sfu_meetinginfo.hostUser}</span>
                </div>
                <div className="ipvconfdivs">
                  <span className="ipvconfdes">会议状态</span><span>:</span><span className="ipvconfcontent">{sfu_meetinginfo.isLocked != '1' ? '已解锁' : '已加锁'}</span>
                </div>
                <div className="ipvconfdivs">
                  <span className="ipvconfdes">参会者成员({sfu_meetinginfo.memberInfoList.length})</span><span>:</span>
                  <ul className="confmember">
                    {
                      sfu_meetinginfo.memberInfoList.map(v => {
                        return (
                          <li>
                            <span>{v.name}</span><span>{v.number}</span><em className={v.isMuted == '0' ? 'details-unmute' : 'details-mute'}></em>
                          </li>
                        )
                        
                      })
                    }
                    
                    
                  </ul>
                </div>
              </div>
              : null
            }
            


            {/* 通用详情  */}
            {
              currentInfo == 'general-detail' ? 

              <div className="general-detail">
              <div className="detailstitle">
                <div id="detailsend"><span id="a_detailsend">Send</span>&nbsp;:&nbsp;</div>
                <div id="detailreceive"><span id="a_detailreceive">Receive</span>&nbsp;:&nbsp;</div>
              </div>
              {/* 音频 */}
              <div className="audiodetail">
                <div className="titlediv"><span>{this.tr("a_10017")}</span></div>
                <div className="sendinfo">
                  <div className="lostdiv">
                      <span className="spantitle">{this.tr("a_10019")}</span>
                      <span className="spansign">:</span>
                      <span className="spancontent">{audioSend && audioSend.lost}</span>
                  </div>
                  <div className="bitratediv">
                      <span className="spantitle">{this.tr("a_10069")}</span>
                      <span className="spansign">:</span>
                      <span className="spancontent">{audioSend && audioSend.bitrate}</span>
                  </div>
                  <div className="codecdiv">
                      <span className="spantitle">{this.tr("a_10022")}</span>
                      <span className="spansign">:</span>
                      <span className="spancontent">{audioSend && audioSend.codec}</span>
                  </div>
                </div>
                <div className="receinfo">
                    <div className="lostdiv">
                        <span className="spantitle">{this.tr("a_10019")}</span>
                        <span className="spansign">:</span>
                        <span className="spancontent">{audioRecv && audioRecv.lost}</span>
                    </div>
                    <div className="bitratediv">
                        <span className="spantitle">{this.tr("a_10069")}</span>
                        <span className="spansign">:</span>
                        <span className="spancontent">{audioRecv && audioRecv.bitrate}</span>
                    </div>
                    <div className="codecdiv">
                        <span className="spantitle">{this.tr("a_10022")}</span>
                        <span className="spansign">:</span>
                        <span className="spancontent">{audioRecv && audioRecv.codec}</span>
                    </div>
                </div>
              </div>
              {/* 演示 */}
              {
                presentSend || presentRecv ? 
                <div className="videodetail">
                    <div className="titlediv"><span>{this.tr("a_10004")}</span></div>
                    {
                        presentSend ? 
                        <div className="sendinfo">
                            <div className="lostdiv">
                                <span className="spantitle">{this.tr("a_10019")}</span>
                                <span className="spansign">:</span>
                                <span className="spancontent">{presentSend.lost}</span>
                            </div>
                            <div className="bitratediv">
                                <span className="spantitle">{this.tr("a_10020")}</span>
                                <span className="spansign">:</span>
                                <span className="spancontent">{presentSend.bitrate}</span>
                            </div>
                            <div className="fpsdiv">
                                <span className="spantitle">{this.tr("a_12147")}</span>
                                <span className="spansign">:</span>
                                <span className="spancontent">{presentSend.fps + this.tr("a_16277")}</span>
                            </div>
                            <div className="codecdiv">
                                <span className="spantitle">{this.tr("a_16115")}</span>
                                <span className="spansign">:</span>
                                <span className="spancontent">{presentSend.codec}</span>
                            </div>
                            <div className="resolutiondiv">
                                <span className="spantitle">{this.tr("a_10023")}</span>
                                <span className="spansign">:</span>
                                <span className="spancontent">{presentSend.resolution}</span>
                            </div>
                        </div>
                        : null
                    }
                    {
                        presentRecv ? 
                        <div className="receinfo" >
                            <div className="lostdiv">
                                <span className="spantitle">{this.tr("a_10019")}</span>
                                <span className="spansign">:</span>
                                <span className="spancontent">{presentRecv.lost}</span>
                            </div>
                            <div className="bitratediv">
                                <span className="spantitle">{this.tr("a_10020")}</span>
                                <span className="spansign">:</span>
                                <span className="spancontent">{presentRecv.bitrate}</span>
                            </div>
                            <div className="fpsdiv">
                                <span className="spantitle">{this.tr("a_12147")}</span>
                                <span className="spansign">:</span>
                                <span className="spancontent">{presentRecv.fps + this.tr("a_16277")}</span>
                            </div>
                            <div className="codecdiv">
                                <span className="spantitle">{this.tr("a_16115")}</span>
                                <span className="spansign">:</span>
                                <span className="spancontent">{presentRecv.codec}</span>
                            </div>
                            <div className="resolutiondiv">
                                <span className="spantitle">{this.tr("a_10023")}</span>
                                <span className="spansign">:</span>
                                <span className="spancontent">{presentRecv.resolution}</span>
                            </div>
                        </div> 
                        : null
                    }
                  </div> : null  
                } 
              </div>
              :null
            }
            



            {/** 成员 */}
            {
              curMemInfo && currentInfo == 'member-detail' ? 
              <div className="member-detail">
                <div className="detailstitle">
                  <div id="detailsend"><span id="a_detailsend">{curMemInfo.mode == 'send' ? 'Send' : 'Receive'}</span>&nbsp;:&nbsp;</div>
                  </div>
                  <div className="videodetail">
                    <div className="titlediv"><span>{this.tr("a_10016")}</span></div>
                    <div className="sendinfo" >
                        <div className="lostdiv">
                            <span className="spantitle">{this.tr("a_10019")}</span>
                            <span className="spansign">:</span>
                            <span className="spancontent">{curMemInfo.lost}</span>
                        </div>
                        <div className="bitratediv">
                            <span className="spantitle">{this.tr("a_10020")}</span>
                            <span className="spansign">:</span>
                            <span className="spancontent">{curMemInfo.bitrate}</span>
                        </div>
                        <div className="fpsdiv">
                            <span className="spantitle">{this.tr("a_12147")}</span>
                            <span className="spansign">:</span>
                            <span className="spancontent">{curMemInfo.fps + this.tr("a_16277")}</span>
                        </div>
                        <div className="codecdiv">
                            <span className="spantitle">{this.tr("a_16115")}</span>
                            <span className="spansign">:</span>
                            <span className="spancontent">{curMemInfo.codec}</span>
                        </div>
                        <div className="resolutiondiv">
                            <span className="spantitle">{this.tr("a_10023")}</span>
                            <span className="spansign">:</span>
                            <span className="spancontent">{curMemInfo.resolution}</span>
                        </div>
                    </div> 
                  </div>
              </div>    
             : null
            }
           

          </div>
        </div>
      </Modal>
    )

  }

}



const mapStateToProps = (state) => ({
  detailinfo: state.detailinfo,
  sfu_meetinginfo: state.sfu_meetinginfo

})

const mapDispatchToProps = (dispatch) => {
  const actions = {
      getIPVConfInfo: Actions.getIPVConfInfo
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DetailModalSfu))