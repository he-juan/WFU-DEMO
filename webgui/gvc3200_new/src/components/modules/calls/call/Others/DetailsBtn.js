import React, {Component} from 'react'
import Enhance from "../../../../mixins/Enhance";
import * as Actions from '../../../../redux/actions/index';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Modal} from "antd"
import './DetailsModal_sfu.css'


/*********************************普通的通话详情************************************************ */
class DetailsModalNormal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curline: "0",
            ipvinfo: {}
        }
    }

    componentDidMount = () => {
        let line = this.getIPVline(this.props.linestatus);
        this.setState({curline: this.props.linestatus[0].line});
        if(line){
            this.props.getIPVConfInfo(line, (data)=>{
                this.setState({ipvinfo:data});
            });
        }
    }

    //线路改变时触发  for 32XX
    componentWillReceiveProps = (nextProps) => {
        if ( this.props.linestatus != nextProps.linestatus ) {
            let line = this.getIPVline(nextProps.linestatus);
            if(line){
                this.props.getIPVConfInfo(line, (data)=>{
                    this.setState({ipvinfo:data});
                });
            }else{
                this.setState({ipvinfo: {}})
            }
        }
    }

    getIPVline = (linestatus) =>{
        for(let i = 0; i < linestatus.length; i++){
            if(linestatus[i].acct == "1"){
                return linestatus[i].line
            }
        }
        return "";
    }

    lineswitch = (line) =>{
        if(line != this.state.curline){
            this.setState({curline:line});
        }
    }


    render() {
        const {curline,ipvinfo} = this.state;
        const {visible, onHide, linestatus, detailinfo} = this.props;
        if(JSON.stringify(detailinfo) == '{}') return null
        let account, mSendWholeBit = 0, mRecvWholeBit = 0;
        let detailinfobj = {};
        for(let i = 0; i < linestatus.length; i++){
            if(linestatus[i].line == curline){
                account = linestatus[i].acct;
                break;
            }
        }

        let _callstatus = detailinfo.info.callStatus
        let audio_send, audio_recv, video_send, video_recv, present_send, present_recv
        if(detailinfo.line == curline) {
            audio_send = _callstatus[0]
            audio_recv = _callstatus[1]
            video_send = _callstatus[2]
            video_recv = _callstatus[3]
            if(_callstatus[4]) {
                if(_callstatus[4].mode == 'send'){
                    present_send = _callstatus[4]
                } else if(_callstatus[4].mode == 'recv') {
                    present_recv = _callstatus[4]
                }
            }

        }


        //获取当前要显示的通话线路的信息
        // if(detailinfo.line == curline) {
        //     detailinfobj.audiosnd = this.splitStrarray(detailinfo.audio_snd.split("snd;")[1], "audio");
        //     detailinfobj.audiorcv = this.splitStrarray(detailinfo.audio_rcv.split("rcv;")[1], "audio");
        //     mSendWholeBit += parseInt(detailinfobj.audiosnd.bitrate);
        //     mRecvWholeBit += parseInt(detailinfobj.audiorcv.bitrate);
        //     if (detailinfo.video_snd != "") {
        //         detailinfobj.videosnd = this.splitStrarray(detailinfo.video_snd.split("snd;")[1], "video");
        //         detailinfobj.videorcv = this.splitStrarray(detailinfo.video_rcv.split("rcv;")[1], "video");
        //         mSendWholeBit += parseInt(detailinfobj.videosnd.bitrate);
        //         mRecvWholeBit += parseInt(detailinfobj.videorcv.bitrate);
        //     }
        //     if (detailinfo.present_content != "") {
        //         if (detailinfo.present_content.indexOf("snd") != -1) {
        //             detailinfobj.presentsnd = this.splitStrarray(detailinfo.video_snd.split("snd;")[1], "content");
        //         }else{
        //             detailinfobj.presentrcv = this.splitStrarray(detailinfo.video_snd.split("rcv;")[1], "content");
        //         }
        //     }
        // }
        let ipvline = this.getIPVline(linestatus);
        // let existvideosnd = detailinfo.video_snd != "" && detailinfobj.videosnd;
        // let existvideorcv = detailinfo.video_rcv != "" && detailinfobj.videorcv;

        return (
            <Modal className="call-details-modal" visible={visible} title={this.tr('a_10015')} width="920px" maskClosable="false" footer={null} onCancel={onHide}>
                <div className="detailscontent" style={{ height:  '630px'}}>
                    {/*显示所有线路名字作为导航*/}
                    <div className="lineinfo">
                        {
                            linestatus.map((lineitem, index) =>{
                                let classname = "linelist"
                                if(lineitem.line == curline){
                                    classname += " active"
                                }
                                return <div key={lineitem.line} className={classname} onClick={this.lineswitch.bind(this,lineitem.line)}>
                                    <span title={lineitem.name || lineitem.num}>{lineitem.name || lineitem.num}</span></div>
                            })
                        }
                    </div>
                    <div className="linedetails">
                        {
                            ipvline ?
                            <div className= "ipvconfdetails" style={{ display: account == 1 ? 'block' : 'none' }}>
                                <div className="ipvconfdivs">
                                    <span id="a_ipvconftitle" className="ipvconfdes">Subject</span><span>:</span> <span id="ipvconftitle" className="ipvconftitle ipvconfcontent">{ipvinfo.IPVTitle}</span>
                                </div>
                                <div className="ipvconfdivs">
                                    <span id="a_ipvconfnumber" className="ipvconfdes">Meeting ID</span>:<span id="ipvconfnumber" className="ipvconfcontent">{ipvinfo.IPVNumber}</span>
                                </div>
                                <div className="ipvconfdivs">
                                    <span id="a_ipvconfhost" className="ipvconfdes">Host</span>:<span id="ipvconfhost" className="ipvconfcontent">{ipvinfo.IPVConfHost ? ipvinfo.IPVConfHost : "IPVideoTalk"}</span>
                                </div>
                                <div className="ipvconfdivs">
                                    <span id="a_ipvconfpass" className="ipvconfdes">Password</span>:<span id="ipvconfpass" className="ipvconfcontent">{ipvinfo.IPVPassword}</span>
                                </div>
                                <div className="ipvconfdivs" style={{display:"table"}}>
                                    <span id="a_ipvconfurl" className="ipvconfdes">URL</span><span style={{marginRight: '25px'}}>:
                                </span><span id="ipvconfurl" className="ipvconfcontent">{ipvinfo.IPVConfURL}</span>
                                </div>
                                <div className="ipvconfdivs" style={{display: ipvinfo.IPVHostcode ? 'block':'none'}}>
                                    <span id="a_ipvconfhostcode" className="ipvconfdes">Host code</span>:
                                    <span id="ipvconfhostcode" className="ipvconfcontent" >{ipvinfo.IPVHostcode ? ipvinfo.IPVHostcode : ""}</span>
                                </div>
                                <div className="ipvconfdivs" id="regiondivs" style={{display:ipvinfo.IPVRegion ? "block":"none"}}>
                                    <span id="a_ipvconfregion" className="ipvconfdes">Server area</span>:
                                    <span id="ipvconfregion" className="ipvconfcontent">{ipvinfo.IPVRegion}</span>
                                </div>
                                <div className="ipvconfdivs" id="pstndivs" style={{display: ipvinfo.IPVRegion=="0" || ipvinfo.IPVRegion == "" ? 'none':'table', marginBottom:'10px'}}>
                                    <span id="a_ipvconfpstn" className="ipvconfdes">Join by phone</span>
                                    <span style={{marginRight: '25px'}}>:</span>
                                    <span id="ipvconfpstn" className="ipvconfcontent" style={{maxWidth: '440px',lineHeight:'14px', display: 'table-cell', verticalAlign: 'middle', wordWrap: 'break-word'}}>
                                        {this.tr('a_9400')+" " + ipvinfo.IPVPSTN + " " + this.tr('a_15058')}
                                    </span>
                                </div>
                            </div> : ""
                        }
                        <div className="detailstitle">
                            <div id="detailsend"><div><span id="a_detailsend">Send</span>&nbsp;:&nbsp;</div></div>
                            <div id="detailreceive"><div><span id="a_detailreceive">Receive</span>&nbsp;:&nbsp;</div></div>
                        </div>
                        <div className="onedetails">
                            {/* 视频 */}
                            <div className="videodetail">
                                <div className="titlediv"><span>{this.tr("a_10016")}</span></div>
                                { 
                                    video_send ? 
                                    <div className="sendinfo">
                                        <div className="lostdiv">
                                            <span className="spantitle">{this.tr("a_10019")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{video_send.lost}</span>
                                        </div>
                                        <div className="bitratediv">
                                            <span className="spantitle">{this.tr("a_10020")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{video_send.bitrate}</span>
                                        </div>
                                        <div className="fpsdiv">
                                            <span className="spantitle">{this.tr("a_12147")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{video_send.fps + this.tr("a_16277")}</span>
                                        </div>
                                        <div className="codecdiv">
                                            <span className="spantitle">{this.tr("a_16115")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{video_send.codec}</span>
                                        </div>
                                        <div className="resolutiondiv">
                                            <span className="spantitle">{this.tr("a_10023")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{video_send.resolution}</span>
                                        </div>
                                    </div>
                                    : null
                                }
                                {
                                    video_recv ? 
                                    <div className="receinfo">
                                        <div className="lostdiv">
                                            <span className="spantitle">{this.tr("a_10019")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{video_recv.lost}</span>
                                        </div>
                                        <div className="bitratediv">
                                            <span className="spantitle">{this.tr("a_10020")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{video_recv.bitrate}</span>
                                        </div>
                                        <div className="fpsdiv">
                                            <span className="spantitle">{this.tr("a_12147")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{video_recv.fps + this.tr("a_16277")}</span>
                                        </div>
                                        <div className="codecdiv">
                                            <span className="spantitle">{this.tr("a_16115")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{video_recv.codec}</span>
                                        </div>
                                        <div className="resolutiondiv">
                                            <span className="spantitle">{this.tr("a_10023")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{video_recv.resolution}</span>
                                        </div>
                                    </div> 
                                    : null
                                }
                            </div>
                            {/* 音频 */}
                            <div className="audiodetail">
                                <div className="titlediv"><span>{this.tr("a_10017")}</span></div>
                                { 
                                    audio_send ? 
                                    <div className="sendinfo">
                                        <div className="lostdiv">
                                            <span className="spantitle">{this.tr("a_10019")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{audio_send.lost}</span>
                                        </div>
                                        <div className="bitratediv">
                                            <span className="spantitle">{this.tr("a_10069")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{audio_send.bitrate}</span>
                                        </div>
                                        <div className="codecdiv">
                                            <span className="spantitle">{this.tr("a_10022")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{audio_send.codec}</span>
                                        </div>
                                    </div>
                                    : null
                                }
                                {
                                    audio_recv ? 
                                    <div className="receinfo">
                                        <div className="lostdiv">
                                            <span className="spantitle">{this.tr("a_10019")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{audio_recv.lost}</span>
                                        </div>
                                        <div className="bitratediv">
                                            <span className="spantitle">{this.tr("a_10069")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{audio_recv.bitrate}</span>
                                        </div>
                                        <div className="codecdiv">
                                            <span className="spantitle">{this.tr("a_10022")}</span>
                                            <span className="spansign">:</span>
                                            <span className="spancontent">{audio_recv.codec}</span>
                                        </div>
                                    </div>
                                    : null
                                }
                            </div>
                            {/* 演示 */}
                            {
                               present_send || present_recv ? 
                               <div className="videodetail">
                                    <div className="titlediv"><span>{this.tr("a_10004")}</span></div>
                                    {
                                        present_send ? 
                                        <div className="sendinfo">
                                            <div className="lostdiv">
                                                <span className="spantitle">{this.tr("a_10019")}</span>
                                                <span className="spansign">:</span>
                                                <span className="spancontent">{present_send.lost}</span>
                                            </div>
                                            <div className="bitratediv">
                                                <span className="spantitle">{this.tr("a_10020")}</span>
                                                <span className="spansign">:</span>
                                                <span className="spancontent">{present_send.bitrate}</span>
                                            </div>
                                            <div className="fpsdiv">
                                                <span className="spantitle">{this.tr("a_12147")}</span>
                                                <span className="spansign">:</span>
                                                <span className="spancontent">{present_send.fps + this.tr("a_16277")}</span>
                                            </div>
                                            <div className="codecdiv">
                                                <span className="spantitle">{this.tr("a_16115")}</span>
                                                <span className="spansign">:</span>
                                                <span className="spancontent">{present_send.codec}</span>
                                            </div>
                                            <div className="resolutiondiv">
                                                <span className="spantitle">{this.tr("a_10023")}</span>
                                                <span className="spansign">:</span>
                                                <span className="spancontent">{present_send.resolution}</span>
                                            </div>
                                        </div>
                                        : null
                                    }
                                    {
                                        present_recv ? 
                                        <div className="receinfo" >
                                            <div className="lostdiv">
                                                <span className="spantitle">{this.tr("a_10019")}</span>
                                                <span className="spansign">:</span>
                                                <span className="spancontent">{present_recv.lost}</span>
                                            </div>
                                            <div className="bitratediv">
                                                <span className="spantitle">{this.tr("a_10020")}</span>
                                                <span className="spansign">:</span>
                                                <span className="spancontent">{present_recv.bitrate}</span>
                                            </div>
                                            <div className="fpsdiv">
                                                <span className="spantitle">{this.tr("a_12147")}</span>
                                                <span className="spansign">:</span>
                                                <span className="spancontent">{present_recv.fps + this.tr("a_16277")}</span>
                                            </div>
                                            <div className="codecdiv">
                                                <span className="spantitle">{this.tr("a_16115")}</span>
                                                <span className="spansign">:</span>
                                                <span className="spancontent">{present_recv.codec}</span>
                                            </div>
                                            <div className="resolutiondiv">
                                                <span className="spantitle">{this.tr("a_10023")}</span>
                                                <span className="spansign">:</span>
                                                <span className="spancontent">{present_recv.resolution}</span>
                                            </div>
                                        </div> 
                                        : null
                                    }
                                </div> : null
                            }
                        </div>
                    </div>

                </div>
            </Modal>
        )
    }
}


/*********************************普通的通话详情  end ************************************************ */




/*********************************SFU的通话详情 ***************************************************** */
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
                            <li key={v.number}>
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
  



/*********************************SFU的通话详情 end***************************************************** */
DetailsModalNormal = Enhance(DetailsModalNormal)
DetailModalSfu = Enhance(DetailModalSfu)

class DetailsBtn extends Component {
    constructor() {
        super()
        this.state = {
          detailsModalVisible:false,
        }
    }
    showDetails = () =>{
        this.props.callstatusreport("1");
        this.setState({
            detailsModalVisible:true
        });
        let webcalldetailitem = [this.getReqItem("web_calldetail", ":web_calldetail", "")];
        let values = {};
        values.web_calldetail = "1";
        this.props.setItemValues(webcalldetailitem, values,"3");
        this.props.hideOtherCtrl()
    }

    handlehidedetails = () =>{
        this.props.getguicalldetailstatus((data)=>{
            let state = data.headers[':gui_calldetail'];
            if(state == "" || state == undefined ){
                state = "0";
            }
            if(state == "0"){
                this.props.callstatusreport("0");
            }
        });
        this.setState({detailsModalVisible:false});
    }
    render() {
        const { linestatus, msfurole, acctstatus, detailinfo, sfu_meetinginfo, getIPVConfInfo } = this.props
        return (
            <div onClick={this.showDetails}>
                {this.tr("a_10015")}
                
                {/* 通话详情 */}
                {
                    linestatus.length > 0 && msfurole < 1 && this.state.detailsModalVisible ?
                    <DetailsModalNormal 
                        visible={this.state.detailsModalVisible} 
                        linestatus={this.props.linestatus} 
                        onHide={this.handlehidedetails}
                        detailinfo={detailinfo}
                        getIPVConfInfo={getIPVConfInfo}
                    /> : ""
                }
                {
                    msfurole >= 1 && this.state.detailsModalVisible ?
                    <DetailModalSfu 
                        visible={this.state.detailsModalVisible}  
                        onHide={this.handlehidedetails} 
                        acctstatus={acctstatus}
                        sfu_meetinginfo={sfu_meetinginfo}
                        detailinfo={detailinfo}
                        getIPVConfInfo={getIPVConfInfo}
                    /> : ""
                }


            </div>
        )
    }
}


const mapStateToProps3 = (state) => ({
    detailinfo: state.detailinfo,
    sfu_meetinginfo: state.sfu_meetinginfo,
    msfurole: state.msfurole,
})
const mapDispatchToProps3 = (dispatch) => {
const actions = {
    getIPVConfInfo: Actions.getIPVConfInfo,
    callstatusreport: Actions.callstatusreport,
    getguicalldetailstatus: Actions.getguicalldetailstatus,
    setItemValues: Actions.setItemValues
}
return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps3, mapDispatchToProps3)(Enhance(DetailsBtn))