import React, {Component} from 'react'
import Enhance from "../../../../mixins/Enhance";
import * as Actions from '../../../../redux/actions/index';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Modal} from "antd"

class DetailsModal extends Component {
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

    splitStrarray = (str, type) => {
        let tObj = {};
        if(type == "video" || type == "content"){
            //string  "lost=0.0%;bitrate=1677Kbps;fps=30;codec=H264/HP;resolution=1920x1080"
            let curstr = str.split(";");
            for(let i = 0; i < curstr.length; i++){
                let resstr = curstr[i].split("=");
                switch (resstr[0]) {
                    case "lost":
                        tObj.lost = resstr[1];
                        break;
                    case "bitrate":
                        tObj.bitrate = resstr[1];
                        break;
                    case "fps":
                        tObj.fps = resstr[1];
                        break;
                    case "codec":
                        tObj.codec = resstr[1];
                        break;
                    case "resolution":
                        tObj.resolution = resstr[1];
                        break;
                }
            }
        }
        else{
            //lost=N/A;bitrate=0Kbps;codec=PCMU"
            let curstr = str.split(";");
            for(let i = 0; i < curstr.length; i++){
                let resstr = curstr[i].split("=");
                switch (resstr[0]) {
                    case "lost":
                        tObj.lost = resstr[1];
                        break;
                    case "bitrate":
                        tObj.bitrate = resstr[1];
                        break;
                    case "codec":
                        tObj.codec = resstr[1];
                        break;
                }
            }
        }
        return tObj;
    }

    render() {
        const {curline,ipvinfo} = this.state;
        const {visible, onHide, linestatus, detailinfo} = this.props;
        let account, mSendWholeBit = 0, mRecvWholeBit = 0;
        let detailinfobj = {};
        for(let i = 0; i < linestatus.length; i++){
            if(linestatus[i].line == curline){
                account = linestatus[i].acct;
                break;
            }
        }
        //获取当前要显示的通话线路的信息
        if(detailinfo.line == curline) {
            detailinfobj.audiosnd = this.splitStrarray(detailinfo.audio_snd.split("snd;")[1], "audio");
            detailinfobj.audiorcv = this.splitStrarray(detailinfo.audio_rcv.split("rcv;")[1], "audio");
            mSendWholeBit += parseInt(detailinfobj.audiosnd.bitrate);
            mRecvWholeBit += parseInt(detailinfobj.audiorcv.bitrate);
            if (detailinfo.video_snd != "") {
                detailinfobj.videosnd = this.splitStrarray(detailinfo.video_snd.split("snd;")[1], "video");
                detailinfobj.videorcv = this.splitStrarray(detailinfo.video_rcv.split("rcv;")[1], "video");
                mSendWholeBit += parseInt(detailinfobj.videosnd.bitrate);
                mRecvWholeBit += parseInt(detailinfobj.videorcv.bitrate);
            }
            if (detailinfo.present_content != "") {
                if (detailinfo.present_content.indexOf("snd") != -1) {
                    detailinfobj.presentsnd = this.splitStrarray(detailinfo.video_snd.split("snd;")[1], "content");
                }else{
                    detailinfobj.presentrcv = this.splitStrarray(detailinfo.video_snd.split("rcv;")[1], "content");
                }
            }
        }
        let ipvline = this.getIPVline(linestatus);
        let existvideosnd = detailinfo.video_snd != "" && detailinfobj.videosnd;
        let existvideorcv = detailinfo.video_rcv != "" && detailinfobj.videorcv;


        return (
            <Modal className="call-details-modal" visible={visible} title={this.tr('a_10015')} width="920px" maskClosable="false" footer={null} onCancel={onHide}>
                <div className="detailscontent" style={{ height:  '630px'}}>
                    {/*显示所有线路名字作为导航*/}
                    <div className="lineinfo">
                        {
                            linestatus.map((lineitem, index) =>{
                                let classname = "inelist"
                                if(lineitem.line == curline){
                                    classname += " active"
                                }
                                return <div className={classname} onClick={this.lineswitch.bind(this,lineitem.line)}>
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
                            <div id="detailsend"><div><span id="a_detailsend">Send</span>&nbsp;:&nbsp;</div><div><span id="detailsendnum">{mSendWholeBit}</span>Kbps</div></div>
                            <div id="detailreceive"><div><span id="a_detailreceive">Receive</span>&nbsp;:&nbsp;</div><div><span id="detailreceivenum">{mRecvWholeBit}</span>Kbps</div></div>
                        </div>
                        <div className="onedetails">
                            <div className="videodetail">
                                <div className="titlediv"><span>{this.tr("a_10016")}</span></div>
                                <div className="sendinfo">
                                    <div className="lostdiv">
                                        <span className="spantitle">{this.tr("a_10019")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{existvideosnd ? detailinfobj.videosnd.lost : ""}</span>
                                    </div>
                                    <div className="bitratediv">
                                        <span className="spantitle">{this.tr("a_10020")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{existvideosnd ? detailinfobj.videosnd.bitrate : ""}</span>
                                    </div>
                                    <div className="fpsdiv">
                                        <span className="spantitle">{this.tr("a_12147")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{existvideosnd ? detailinfobj.videosnd.fps + this.tr("a_16277") : ""}</span>
                                    </div>
                                    <div className="codecdiv">
                                        <span className="spantitle">{this.tr("a_16115")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{existvideosnd ? detailinfobj.videosnd.codec : ""}</span>
                                    </div>
                                    <div className="resolutiondiv">
                                        <span className="spantitle">{this.tr("a_10023")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{existvideosnd ? detailinfobj.videosnd.resolution : ""}</span>
                                    </div>
                                </div>
                                <div className="receinfo">
                                    <div className="lostdiv">
                                        <span className="spantitle">{this.tr("a_10019")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{existvideorcv ? detailinfobj.videorcv.lost : ""}</span>
                                    </div>
                                    <div className="bitratediv">
                                        <span className="spantitle">{this.tr("a_10020")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{existvideorcv  ? detailinfobj.videorcv.bitrate : ""}</span>
                                    </div>
                                    <div className="fpsdiv">
                                        <span className="spantitle">{this.tr("a_12147")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{existvideorcv  ? detailinfobj.videorcv.fps + this.tr("a_16277") : ""}</span>
                                    </div>
                                    <div className="codecdiv">
                                        <span className="spantitle">{this.tr("a_16115")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{existvideorcv ? detailinfobj.videorcv.codec : ""}</span>
                                    </div>
                                    <div className="resolutiondiv">
                                        <span className="spantitle">{this.tr("a_10023")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{existvideorcv ? detailinfobj.videorcv.resolution : ""}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="audiodetail">
                                <div className="titlediv"><span>Audio</span></div>
                                <div className="sendinfo">
                                    <div className="lostdiv">
                                        <span className="spantitle">{this.tr("a_10019")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{detailinfobj.audiosnd && detailinfobj.audiosnd.lost ? detailinfobj.audiosnd.lost : ""}</span>
                                    </div>
                                    <div className="bitratediv">
                                        <span className="spantitle">{this.tr("a_10069")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{detailinfobj.audiosnd && detailinfobj.audiosnd.bitrate ? detailinfobj.audiosnd.bitrate:""}</span>
                                    </div>
                                    <div className="codecdiv">
                                        <span className="spantitle">{this.tr("a_10022")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{detailinfobj.audiosnd && detailinfobj.audiosnd.codec ? detailinfobj.audiosnd.codec: ""}</span>
                                    </div>
                                </div>
                                <div className="receinfo">
                                    <div className="lostdiv">
                                        <span className="spantitle">{this.tr("a_10019")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{detailinfobj.audiorcv && detailinfobj.audiorcv.lost ? detailinfobj.audiorcv.lost : ""}</span>
                                    </div>
                                    <div className="bitratediv">
                                        <span className="spantitle">{this.tr("a_10069")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{detailinfobj.audiorcv && detailinfobj.audiorcv.bitrate ? detailinfobj.audiorcv.bitrate : ""}</span>
                                    </div>
                                    <div className="codecdiv">
                                        <span className="spantitle">{this.tr("a_10022")}</span>
                                        <span className="spansign">:</span>
                                        <span className="spancontent">{detailinfobj.audiorcv && detailinfobj.audiorcv.codec ? detailinfobj.audiorcv.codec : ""}</span>
                                    </div>
                                </div>
                            </div>
                            {
                                JSON.stringify(detailinfo) !=='{}' && detailinfo.present_content != "" ?
                                <div className="presentdetail" style={{display: detailinfo.present_content == "" ? 'none' : 'block'}}>
                                    <div className="titlediv"><span>{this.tr("a_10004")}</span></div>
                                    {
                                        detailinfo.present_content && detailinfo.present_content.indexOf("snd") != -1 ?
                                            <div className="sendinfo">
                                                <div className="lostdiv">
                                                    <span className="spantitle">{this.tr("a_10019")}</span>
                                                    <span className="spansign">:</span>
                                                    <span className="spancontent">{detailinfobj.presentsnd.lost}</span>
                                                </div>
                                                <div className="bitratediv">
                                                    <span className="spantitle">{this.tr("a_10020")}</span>
                                                    <span className="spansign">:</span>
                                                    <span className="spancontent">{detailinfobj.presentsnd.bitrate}</span>
                                                </div>
                                                <div className="fpsdiv">
                                                    <span className="spantitle">{this.tr("a_12147")}</span>
                                                    <span className="spansign">:</span>
                                                    <span className="spancontent">{detailinfobj.presentsnd.fps + this.tr("a_16277")}</span>
                                                </div>
                                                <div className="codecdiv">
                                                    <span className="spantitle">{this.tr("a_16115")}</span>
                                                    <span className="spansign">:</span>
                                                    <span className="spancontent">{detailinfobj.presentsnd.codec}</span>
                                                </div>
                                                <div className="resolutiondiv">
                                                    <span className="spantitle">{this.tr("a_10023")}</span>
                                                    <span className="spansign">:</span>
                                                    <span className="spancontent">{detailinfobj.presentsnd.resolution}</span>
                                                </div>
                                            </div> :
                                            <div className="receinfo">
                                                <div className="lostdiv">
                                                    <span className="spantitle">Packet Loss Rate</span>
                                                    <span className="spansign">:</span>
                                                    <span className="spancontent">{detailinfobj.presentrcv.lost}</span>
                                                </div>
                                                <div className="bitratediv">
                                                    <span className="spantitle">Video Bit Rate</span>
                                                    <span className="spansign">:</span>
                                                    <span className="spancontent">{detailinfobj.presentrcv.bitrate}</span>
                                                </div>
                                                <div className="fpsdiv">
                                                    <span className="spantitle">Frames Per Second</span>
                                                    <span className="spansign">:</span>
                                                    <span className="spancontent">{detailinfobj.presentrcv.fps + this.tr("a_16277")}</span>
                                                </div>
                                                <div className="codecdiv">
                                                    <span className="spantitle">{this.tr("a_16115")}</span>
                                                    <span className="spansign">:</span>
                                                    <span className="spancontent">{detailinfobj.presentrcv.codec}</span>
                                                </div>
                                                <div className="resolutiondiv">
                                                    <span className="spantitle">{this.tr("a_10023")}</span>
                                                    <span className="spansign">:</span>
                                                    <span className="spancontent">{detailinfobj.presentrcv.resolution}</span>
                                                </div>
                                            </div>
                                    }
                                </div> : ""
                            }

                        </div>
                    </div>

                </div>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    detailinfo: state.detailinfo
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getIPVConfInfo: Actions.getIPVConfInfo
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DetailsModal))