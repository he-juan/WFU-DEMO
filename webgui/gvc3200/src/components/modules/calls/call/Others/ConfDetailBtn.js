import React, {Component} from 'react'
import Enhance from "../../../../mixins/Enhance";
import * as Actions from '../../../../redux/actions/index';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Modal} from "antd"


/*********************************普通的会议详情 ************************************************ */

class DetailsModalNormal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ipvinfo: {}
        }
    }

    componentDidMount = () => {
        let line = this.getIPVline(this.props.linestatus);
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


    render() {
        const {ipvinfo} = this.state;
        const {visible, onHide, linestatus} = this.props;

        

        return (
            <Modal className="call-details-modal" visible={visible} title={'会议详情'} width="920px" maskClosable="false" footer={null} onCancel={onHide}>
                <div className="detailscontent" style={{ height:  '630px'}}>
                    <div className="linedetails">
                        {
                            <div className= "ipvconfdetails">
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
                            </div>
                        }
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

    render() {
      const {visible, onHide, sfu_meetinginfo} = this.props;
      return (
        <Modal className="call-details-modal" visible={visible}  width="920px" maskClosable="false" footer={null} onCancel={onHide}>
          <div className="detailscontent sfu-details" style={{ height:  '630px'}}>
            
            <div className="linedetails">
              {/* 会议信息 */}
              {
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

class ConfDetailsBtn extends Component {
    constructor() {
        super()
        this.state = {
          detailsModalVisible:false,
        }
    }

    showDetails = () =>{
        this.setState({
            detailsModalVisible:true
        });
        this.props.hideOtherCtrl()
    }

    getSipline = (linestatus) =>{
      for(let i = 0; i < linestatus.length; i++){
          if(linestatus[i].acct == "0"){
              return linestatus[i].line
          }
      }
      return "";
    }

    handlehidedetails = () =>{
        this.setState({detailsModalVisible:false});
    }
    render() {
        const { linestatus, msfurole, acctstatus, sfu_meetinginfo, getIPVConfInfo } = this.props

        let sipline = this.getSipline(linestatus);
        // sip会议不显示会议详情
        if(sipline && msfurole < 1) return null;
        return (
            <div onClick={this.showDetails}>
                会议详情
                
                {/* 会议详情 */}
                {
                    linestatus.length > 0 && msfurole < 1 && this.state.detailsModalVisible ?
                    <DetailsModalNormal 
                        visible={this.state.detailsModalVisible} 
                        linestatus={this.props.linestatus} 
                        onHide={this.handlehidedetails}
                        getIPVConfInfo={getIPVConfInfo}
                    /> : ""
                }
                {
                    msfurole >= 1 && this.state.detailsModalVisible ?
                    <DetailModalSfu 
                        visible={this.state.detailsModalVisible}  
                        acctstatus={acctstatus}
                        sfu_meetinginfo={sfu_meetinginfo}
                        onHide={this.handlehidedetails}
                    /> : ""
                }


            </div>
        )
    }
}


const mapStateToProps3 = (state) => ({
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

export default connect(mapStateToProps3, mapDispatchToProps3)(Enhance(ConfDetailsBtn))