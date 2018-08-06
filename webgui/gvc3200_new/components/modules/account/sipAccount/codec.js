import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance"
import { FormattedHTMLMessage } from 'react-intl'
import { Form, Layout, Transfer,Modal, Input, Icon, Tooltip, Checkbox, Radio, Select, Button } from "antd"
const FormItem = Form.Item
const Content = Layout
const Option = Select.Option
const RadioGroup = Radio.Group
let req_items = new Array;
let dtmfpayload;
const nvram = {
    'P57' : ["57","451","551","651","1751","1851","50651","50751","50851","50951","51051","51151","51251","51351","51451","51551"],
    'P58' : ["58","452","552","652","1752","1852","50652","50752","50852","50952","51052","51152","51252","51352","51452","51552"],
    'P59' : ["59","453","553","653","1753","1853","50653","50753","50853","50953","51053","51153","51253","51353","51453","51553"],
    'P60' : ["60","454","554","654","1754","1854","50654","50754","50854","50954","51054","51154","51254","51354","51454","51554"],
    'P61' : ["61","455","555","655","1755","1855","50655","50755","50855","50955","51055","51155","51255","51355","51455","51555"],
    'P62' : ["62","456","556","656","1756","1856","50656","50756","50856","50956","51056","51156","51256","51356","51456","51556"],
    'P46' : ["46","457","557","657","1757","1857","50657","50757","50857","50957","51057","51157","51257","51357","51457","51557"],
    'P98' : ["98","458","558","658","1758","1858","50658","50758","50858","50958","51058","51158","51258","51358","51458","51558"],
    'codecpri' : ["29061", "29161", "29261", "29361", "29461", "29561","53661","53761","53861","53961","54061","54161","54261","54361","54461","54561"],
    'usefvcode' : ["2348", "2448", "2548", "2648", "2748", "2848","51648","51748","51848","51948","52048","52148","52248","52348","52448","52548"],
    'ilibcfs' : ["97", "495", "595", "695", "1795", "1895","50695","50795","50895","50995","51095","51195","51295","51395","51495","51595"],
    'g726payload' : ["2369", "2469", "2569", "2669", "2769", "2869","51669","51769","51869","51969","52069","52169","52269","52369","52469","52569"],
    'dynamicpt' : ["2365", "2465", "2565", "2665", "2765", "2865","51665","51765","51865","51965","52065","52165","52265","52365","52465","52565"],
    'opuspayload' : ["2385", "2485", "2585", "2685", "2785", "2885","51685","51785","51885","51985","52085","52185","52285","52385","52485","52585"],
    'inaudio' : ["2301","2401","2501","2601","2701","2801","51601","51701","51801","51901","52001","52101","52201","52301","52401","52501"],
    'RFC2833' : ["2302","2402","2502","2602","2702","2802","51602","51702","51802","51902","52002","52102","52202","52302","52402","52502"],
    'sipinfo' : ["2303","2403","2503","2603","2703","2803","51603","51703","51803","51903","52003","52103","52203","52303","52403","52503"],
    'dtmfpayload': ["79", "496", "596", "696", "1796", "1896","50696","50796","50896","50996","51096","51196","51296","51396","51496","51596"],
    'jitterbt' : ["133","498","598","698","1798","1898","50698","50798","50898","50998","51098","51198","51298","51398","51498","51598"],
    'audioredfec' : ["26073","26173","26273","26373","26473","26573","52673","52773","52873","52973","53073","53173","53273","53373","53473","53573"],
    'audiofecpayload' : ["26074","26174","26274","26374","26474","26574","52674","52774","52874","52974","53074","53174","53274","53374","53474","53574"],
    'audioredpayload' : ["26075","26175","26275","26375","26475","26575","52675","52775","52875","52975","53075","53175","53275","53375","53475","53575"],
    'silencesup' : ["50", "485", "585", "685", "1785", "1885","50685","50785","50885","50985","51085","51185","51285","51385","51485","51585"],
    'vocfp' : ["37", "486", "586", "686", "1786", "1886","50686","50786","50886","50986","51086","51186","51286","51386","51486","51586"],
    'P295' : ["295","464","564","664","1764","1864","50664","50764","50864","50964","51064","51164","51264","51364","51464","51564"],
    'P296' : ["296","465","565","665","1765","1865","50665","50765","50865","50965","51065","51165","51265","51365","51465","51565"],
     'P8' : ["1307","475","575","675","1775","1875","50675","50775","50875","50975","51075","51175","51275","51375","51475","51575"],
    'enablefec' : ["2393", "2493", "2593", "2693", "2793", "2893","51693","51793","51893","51993","52093","52193","52293","52393","52493","52593"],
    'enablerfc' : ["1331", "478", "578", "678", "1778", "1878","50678","50778","50878","50978","51078","51178","51278","51378","51478","51578"],
    'fecmode' : ["26022", "26122", "26222", "26322", "26422", "26522","52622","52722","52822","52922","53022","53122","53222","53322","53422","53522"],
    'fecpayload' : ["2394", "2494", "2594", "2694", "2794", "2894","51694","51794","51894","51994","52094","52194","52294","52394","52494","52594"],
    'packetmodel' : ["26005", "26105", "26205", "26305", "26405", "26505","52605","52705","52805","52905","53005","53105","53205","53305","53405","53505"],
    'imgsize' : ["2307", "2407", "2507", "2607", "2707", "2807","51607","51707","51807","51907","52007","52107","52207","52307","52407","52507"],
    'useh264profile' : ["26045", "26145", "26245", "26345", "26445", "26545","52645","52745","52845","52945","53045","53145","53245","53345","53445","53545"],
    'protype' : ["2362", "2462", "2562", "2662", "2762", "2862","51662","51762","51862","51962","52062","52162","52262","52362","52462","52562"],
    'vbrate' : ["2315", "2415", "2515", "2615", "2715", "2815","51615","51715","51815","51915","52015","52115","52215","52315","52415","52515"],
    'sdpattr' : ["2360", "2460", "2560", "2660", "2760", "2860","51660","51760","51860","51960","52060","52160","52260","52360","52460","52560"],
    'h264payload' : ["293", "462", "562", "662", "1762", "1862","50662","50762","50862","50962","51062","51162","51262","51362","51462","51562"],
    'disablepresent' : ["26001", "26101", "26201", "26301", "26401", "26501","52601","52701","52801","52901","53001","53101","53201","53301","53401","53501"],
    'initialinvite' : ["sendPreMode_0","sendPreMode_1","sendPreMode_2","sendPreMode_3","sendPreMode_4","sendPreMode_5","sendPreMode_6","sendPreMode_7","sendPreMode_8","sendPreMode_9","sendPreMode_10","sendPreMode_11","sendPreMode_12","sendPreMode_13","sendPreMode_14","sendPreMode_15"],
    'presentimagesize' : ["2376","2476","2576","2676","2776","2876","51676","51776","51876","51976","52076","52176","52276","52376","52476","52576"],
    'presentprofile' : ["2377","2477","2577","2677","2777","2877","51677","51777","51877","51977","52077","52177","52277","52377","52477","52577"],
    'presentvideobitrate' : ["2378","2478","2578","2678","2778","2878","51678","51778","51878","51978","52078","52178","52278","52378","52478","52578"],
    'presentvideoframebate' : ["26042","26142","26242","26342","26442","26542","52642","52742","52842","52942","53042","53142","53242","53342","53442","53542"],
    'bfcptranspro' : ["26041","26141","26241","26341","26441","26541","52641","52741","52841","52941","53041","53141","53241","53341","53441","53541"],
    'srtp' : ["183", "443", "543", "643", "1743", "1843","50643","50743","50843","50943","51043","51143","51243","51343","51443","51543"],
    'encryptdigit' : ["2383", "2483", "2583", "2683", "2783", "2883","51683","51783","51883","51983","52083","52183","52283","52383","52483","52583"],
    'srtplifttime' : ["2363", "2463", "2563", "2663", "2763", "2863","51663","51763","51863","51963","52063","52163","52263","52363","52463","52563"],
    'rtcpserver' : ["2390", "2490", "2590", "2690", "2790", "2890","51690","51790","51890","51990","52090","52190","52290","52390","52490","52590"],
    'symrtp' : ["291", "460", "560", "660", "1760", "1860","50660","50760","50860","50960","51060","51160","51260","51360","51460","51560"],
    'rtpipfilter' : ["26026", "26126", "26226", "26326", "26426", "26526","52626","52726","52826","52926","53026","53126","53226","53326","53426","53526"]
}

class CodecForm extends React.Component {
    constructor(props) {
      super(props);
      this.handlePvalue();
      this.state = {
          VocoderData: [],
          VocoderTargetKeys: [],
          VideoDate: [],
          VideoTargetKeys: [],
          beforeImgsize:"",
          beforePacketModel:""
      }
    }

    handlePvalue = (activeAccount) => {
         let curAccount = activeAccount ? activeAccount : this.props.curAccount;
         req_items = [];
         req_items.push(
             this.getReqItem("P57", nvram["P57"][curAccount], ""),
             this.getReqItem("P58", nvram["P58"][curAccount], ""),
             this.getReqItem("P59", nvram["P59"][curAccount], ""),
             this.getReqItem("P60", nvram["P60"][curAccount], ""),
             this.getReqItem("P61", nvram["P61"][curAccount], ""),
             this.getReqItem("P62", nvram["P62"][curAccount], ""),
             this.getReqItem("P46", nvram["P46"][curAccount], ""),
             this.getReqItem("P98", nvram["P98"][curAccount], ""),
             this.getReqItem("codecpri", nvram["codecpri"][curAccount], ""),
             this.getReqItem("usefvcode", nvram["usefvcode"][curAccount], ""),
             this.getReqItem("ilibcfs", nvram["ilibcfs"][curAccount], ""),
             this.getReqItem("g726payload", nvram["g726payload"][curAccount], ""),
             this.getReqItem("dynamicpt"+curAccount, nvram["dynamicpt"][curAccount], ""),
             this.getReqItem("opuspayload"+curAccount, nvram["opuspayload"][curAccount], ""),
             this.getReqItem("inaudio", nvram["inaudio"][curAccount], ""),
             this.getReqItem("RFC2833", nvram["RFC2833"][curAccount], ""),
             this.getReqItem("sipinfo", nvram["sipinfo"][curAccount], ""),
             this.getReqItem("dtmfpayload"+curAccount, nvram["dtmfpayload"][curAccount], ""),
             this.getReqItem("jitterbt", nvram["jitterbt"][curAccount], ""),
             this.getReqItem("audioredfec", nvram["audioredfec"][curAccount], ""),
             this.getReqItem("audiofecpayload"+curAccount, nvram["audiofecpayload"][curAccount], ""),
             this.getReqItem("audioredpayload"+curAccount, nvram["audioredpayload"][curAccount], ""),
             this.getReqItem("silencesup", nvram["silencesup"][curAccount], ""),
             this.getReqItem("vocfp"+curAccount, nvram["vocfp"][curAccount], ""),
             this.getReqItem("P295", nvram["P295"][curAccount], ""),
             //this.getReqItem("P296", nvram["P296"][curAccount], ""),
             //this.getReqItem("P8", nvram["P8"][curAccount], ""),
             this.getReqItem("enablefec", nvram["enablefec"][curAccount], ""),
             this.getReqItem("enablerfc", nvram["enablerfc"][curAccount], ""),
             this.getReqItem("fecmode", nvram["fecmode"][curAccount], ""),
             this.getReqItem("fecpayload"+curAccount, nvram["fecpayload"][curAccount], ""),
             this.getReqItem("packetmodel", nvram["packetmodel"][curAccount], ""),
             this.getReqItem("imgsize", nvram["imgsize"][curAccount], ""),
             this.getReqItem("useh264profile", nvram["useh264profile"][curAccount], ""),
             this.getReqItem("protype", nvram["protype"][curAccount], ""),
             this.getReqItem("vbrate", nvram["vbrate"][curAccount], ""),
             this.getReqItem("sdpattr", nvram["sdpattr"][curAccount], ""),
             this.getReqItem("h264payload"+curAccount, nvram["h264payload"][curAccount], ""),
             this.getReqItem("disablepresent", nvram["disablepresent"][curAccount], ""),
             this.getReqItem("initialinvite", nvram["initialinvite"][curAccount], ""),
             this.getReqItem("presentimagesize", nvram["presentimagesize"][curAccount], ""),
             this.getReqItem("presentprofile", nvram["presentprofile"][curAccount], ""),
             this.getReqItem("presentvideobitrate", nvram["presentvideobitrate"][curAccount], ""),
             this.getReqItem("presentvideoframebate", nvram["presentvideoframebate"][curAccount], ""),
             this.getReqItem("bfcptranspro", nvram["bfcptranspro"][curAccount], ""),
             this.getReqItem("srtp", nvram["srtp"][curAccount], ""),
             this.getReqItem("encryptdigit", nvram["encryptdigit"][curAccount], ""),
             this.getReqItem("srtplifttime", nvram["srtplifttime"][curAccount], ""),
             this.getReqItem("rtcpserver"+curAccount, nvram["rtcpserver"][curAccount], ""),
             this.getReqItem("symrtp", nvram["symrtp"][curAccount], ""),
             this.getReqItem("rtpipfilter", nvram["rtpipfilter"][curAccount], "")

         );
         return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            this.setCodecTransfer(values);
            this.setState({
                beforeImgsize:values['imgsize'],
                beforePacketModel:values['packetmodel']
            })
        });
    }

    setCodecTransfer = (values) => {
        this.getVocoderData(values);
        this.getVideoData(values);
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed or selected account changed
            if (this.props.activeKey != nextProps.activeKey
                || this.props.curAccount != nextProps.curAccount) {
                this.props.getItemValues(this.handlePvalue(nextProps.curAccount), (values) => {
                    this.setCodecTransfer(values);
                });
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    checkServerPath = (data, value, callback) => {
        //address port is needed
        var expression = /^((https?:\/\/)?|(ftp:\/\/)?|(tftp:\/\/)?)(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])))(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        if (!value || expression.test(value)) {
            callback();
        } else {
            callback(this.tr("tip_url"));
        }
    }

    getVocoderData = (itemValues) => {
        const VocoderTargetKeys = [];
        const VocoderData = [];
        let itemVal = itemValues;
        let ops,values;
        if (this.isWP8xx()) {
             ops = ["PCMU","PCMA","G722","G729A/B","iLBC","Opus"];
             values = ['0','8','9','18','98','123'];
        } else if (this.props.product == "GAC2510") {
             ops = ["PCMU","PCMA","G722","G.722.1","G729A/B","G726-32","iLBC","Opus","G.722.1C"];
             values = ['0','8','9','104','18','2','98','123','103'];
        } else {
            ops = ["PCMU","PCMA","G722","G729A/B","G726-32","iLBC","Opus"];
            values = ['0','8','9','18','2','98','123'];
        }
        const keys = ['P57','P58','P59','P60','P61','P62','P46','P98'];
        let set = new Set([itemVal['P57'],itemVal['P58'],itemVal['P59'],itemVal['P60'],itemVal['P61'],itemVal['P62'],itemVal['P46'],itemVal['P98']])
        for (let i = 0,j = [...set].length; i < ops.length; i++) {
            let chosenIdx = values.indexOf([...set][i])
            const data = {
                key: i.toString(),
                description: ops[i],
                chosen: j--
            };
            j = j <= 0 ? j=0 : j;
            if (data.chosen && [...set][i] != "") {
                VocoderTargetKeys.push(`${chosenIdx}`);
            }
            VocoderData.push(data);
        }
        this.setState({ VocoderData, VocoderTargetKeys });
    }

    getVideoData = (itemValues) => {
        const VideoTargetKeys = [];
        const VideoData = [];
        let itemVal = itemValues;
        //const ops = ["H263","H264","VP8"];
        //const values = ['34','99','100'];
        //const keys = ['P296','P295',"P8"];
        const ops = ["H264"];
        const values = ['99'];
        const keys = ['P295'];
        //let set = new Set([itemVal['P295'],itemVal['P296'],itemVal['P8']])
        let set = new Set([itemVal['P295']])
        for (let i = 0,j = [...set].length; i < keys.length; i++) {
            let chosenIdx = values.indexOf([...set][i])
            const data = {
                key: i.toString(),
                description: ops[i],
                chosen: j--
            };
            j = j <= 0 ? j=0 : j;
            if (data.chosen && [...set][i] != "") {
                VideoTargetKeys.push(`${chosenIdx}`);

            }
            VideoData.push(data);
        }
        this.setState({ VideoData, VideoTargetKeys });
    }

    handleVocoderChange = (VocoderTargetKeys, direction, moveKeys) => {
        if(VocoderTargetKeys.length == 0) {
            this.props.promptMsg("ERROR","a_moreone")
            return false;
        }
        this.setState({ VocoderTargetKeys });
    }

    handleVideoChange = (VideoTargetKeys, direction, moveKeys) => {
        if(VideoTargetKeys.length == 0) {
            this.props.promptMsg("ERROR","a_moreone")
            return false;
        }
        this.setState({ VideoTargetKeys });
    }

    savePreferredVocoder = () => {
        let pv = this.state.VocoderTargetKeys;
        let keys = ['P57','P58','P59','P60','P61','P62',"P46",'P98'];
        let values;
        if (this.isWP8xx()) {
            values = ['0','8','9','18','98','123'];
        }else if (this.props.product == "GAC2510") {
            values = ['0','8','9','104','18','2','98','123','103'];
        } else {
            values = ['0','8','9','18','2','98','123'];
        }

        for(var i = 0,pvObj={};i < pv.length;i++) {
            let pvkey = Number(pv[i]);
            pvObj[keys[i]] = values[pvkey];
        }
        for (var i = pv.length; i< keys.length; i++) {
            pvObj[keys[i]] = '';
        }
        return pvObj;
    }

    saveVideo = () => {
        let video = this.state.VideoTargetKeys;
        //let keys = ['P296','P295','P8'];
        //let values = ['34','99','100'];
        let keys = ['P295'];
        let values = ['99'];
        for(var i = 0,videoObj={};i < video.length;i++) {
            let videokey = Number(video[i]);
            videoObj[keys[i]] = values[videokey];
        }
        for (var i = video.length; i< keys.length; i++) {
            videoObj[keys[i]] = '';
        }
        return videoObj;
    }

    renderItem = (item) => {
        const customLabel = (
            <span className="custom-item">
                {item.description}
            </span>
        );

        return {
          label: customLabel,  // for displayed item
          value: item.title,   // for title and filter matching
        };
    }

    handlePacketModel = (value) => {
        let imgsize = this.props.form.getFieldValue('imgsize');
        this.checkPacketModelAndImgsize(value,imgsize);

    }

    handleImgsize = (value) => {
        let packetmodel = this.props.form.getFieldValue('packetmodel');
        this.checkPacketModelAndImgsize(packetmodel,value);
    }

    checkPacketModelAndImgsize = (packetmodel,imgsize) => {
        if(packetmodel == 0 && (imgsize=='1' || imgsize == '4' || imgsize == '9' || imgsize == '10')) {
            let a_ok = this.tr('a_ok'), a_cancel = this.tr('a_cancel'), self = this;
            let packetmodetip = this.tr('a_packetmodetip');
            Modal.confirm({
                content: <div><span dangerouslySetInnerHTML={{__html: packetmodetip}}></span></div>,
                cancelText: <span dangerouslySetInnerHTML={{__html: a_cancel}}></span>,
                okText: <span dangerouslySetInnerHTML={{__html: a_ok}}></span>,
                onOk() {
                    self.props.form.setFieldsValue({'imgsize': '5'});
                    self.setState({beforeImgsize: '5', beforePacketModel: packetmodel})
                },
                onCancel() {
                    self.props.form.setFieldsValue({
                        'packetmodel': self.state.beforePacketModel,
                        'imgsize': self.state.beforeImgsize
                    });
                },
            });
        } else {
            this.setState({beforeImgsize:imgsize,beforePacketModel:packetmodel})
        }

    }

    handleSubmit = () => {
        const curAccount = this.props.curAccount;
        const product = this.props.product;
        const { setFieldsValue } = this.props.form;
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              if(values["opuspayload"+curAccount] == "") {
                  values["opuspayload"+curAccount] = "123";
                  setFieldsValue({
                      ['opuspayload'+curAccount]:"123"
                  })
              }
              if ((product !== 'GAC2510') && (this.isWP8xx())) {
                  if(values["h264payload"+curAccount] == "") {
                      values["h264payload"+curAccount] = "99";
                      setFieldsValue({
                          ['h264payload'+curAccount]:"99"
                      })
                  }
              }
              if(values["fecpayload"+curAccount] == "") {
                  values["fecpayload"+curAccount] == "120";
                  setFieldsValue({
                      ['fecpayload'+curAccount]:"120"
                  })
              }
              if ((product == 'GXV3380') || (product == 'GXV3370')) {
                  let setValue = new Set ([values["audiofecpayload"+curAccount],values["audioredpayload"+curAccount]]);
                  if (setValue.has('98') || setValue.has('99')) {
                      this.props.promptMsg('ERROR',"payload_error4")
                      return false;
                  }
              }
              let set;
              if (product == 'GAC2510') {
                  set = new Set([values['dtmfpayload'+curAccount],values["opuspayload"+curAccount],values["dynamicpt"+curAccount],values["audiofecpayload"+curAccount],values["audioredpayload"+curAccount]])
              } else if (this.isWP8xx()) {
                  set = new Set([values['dtmfpayload'+curAccount],values["opuspayload"+curAccount],values["audiofecpayload"+curAccount],values["audioredpayload"+curAccount]])
              } else {
                  set = new Set([values['dtmfpayload'+curAccount],values["h264payload"+curAccount],values["opuspayload"+curAccount],values["dynamicpt"+curAccount],values["fecpayload"+curAccount],values["audiofecpayload"+curAccount],values["audioredpayload"+curAccount]])
              }
              if(set.has('97')) {
                  this.props.promptMsg('ERROR',"payload_error2")
                  return false;
              } else if ((product == 'GAC2510') && (set.has('98') || set.has('99') || set.has('102') || set.has('103') || set.has('104'))) {
                  this.props.promptMsg('ERROR',"payload_error3")
                  return false;
              }else if((this.isWP8xx()) && ([...set].length != 4)) {
                  this.props.promptMsg('ERROR',"payload_error")
                  return false;
              }else if((product == 'GAC2510') && ([...set].length != 5)) {
                  this.props.promptMsg('ERROR',"payload_error")
                  return false;
              }else if(((product == 'GXV3370') ||(product == 'GXV3380') ) && ([...set].length != 7)) {
                  this.props.promptMsg('ERROR',"payload_error")
                  return false;
              }

              // save selectMultiple
              let pvObj = this.savePreferredVocoder()
              let videoObj = this.saveVideo()
              Object.assign(values, pvObj,videoObj);

              this.props.setItemValues(req_items, values,1);
          }
        });
     }

    render() {
        const { getFieldDecorator } = this.props.form;
        const [callTr,product,curAccount] = [this.props.callTr,this.props.product,this.props.curAccount];
        if(this.isEmptyObject(this.props.itemValues)) {
            return null;
        }
        let itemList =
           <Form>
               <p className="blocktitle"><s></s>{callTr("a_prevocoder")}</p>
               <FormItem　className = "precodeSet" label={(<span>{callTr("a_prevocoder")}&nbsp;<Tooltip title={this.tips_tr("Preferred Vocoder")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   <Transfer className="vocodertrans" dataSource={this.state.VocoderData} sorter={ true } titles = {[callTr("a_notallowed"),callTr("a_allowed")]} listStyle={{ width: 135, height: 206,}} targetKeys={this.state.VocoderTargetKeys} onChange={this.handleVocoderChange} render={this.renderItem} />
               </FormItem>
               <FormItem className = "select-item"　label={(<span>{callTr("a_codecpri")}&nbsp;<Tooltip title={this.tips_tr("Codec Negotiation Priority")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('codecpri', {
                        initialValue: this.props.itemValues['codecpri'] ? this.props.itemValues['codecpri'] : "0"
                        })(
                            <Select className={"P-" + nvram["codecpri"][curAccount]}>
                                <Option value="0">{callTr("a_caller")}</Option>
                                <Option value="1">{callTr("a_callee")}</Option>
                            </Select>
                   )}
          　　　</FormItem>
              <FormItem  label={(<span>{callTr("a_usefvcode")}&nbsp;<Tooltip title={this.tips_tr("Use First Matching Vocoder in 200OK SDP")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('usefvcode', {
                      valuePropName: 'checked',
                      initialValue: parseInt(this.props.itemValues["usefvcode"])
                  })(<Checkbox className={"P-" + nvram["usefvcode"][curAccount]}/>)
                  }
              </FormItem>
              <FormItem className = "select-item" label={(<span>{callTr("a_ilibcfs")}&nbsp;<Tooltip title={this.tips_tr("iLBC Frame Size")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('ilibcfs', {
                       initialValue: this.props.itemValues['ilibcfs'] ? this.props.itemValues['ilibcfs'] : "0"
                       })(
                           <Select className={"P-" + nvram["ilibcfs"][curAccount]}>
                               <Option value="0">20ms</Option>
                               <Option value="1">30ms</Option>
                           </Select>
                  )}
         　　　</FormItem>

              <FormItem className = "select-item"  label={(<span>{callTr("a_g726payload")}&nbsp;<Tooltip title={this.tips_tr("G726-32 ITU Payload")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('g726payload', {
                       initialValue: this.props.itemValues['g726payload'] ? this.props.itemValues['g726payload'] : "0"
                       })(
                           <Select className={"P-" + nvram["g726payload"][curAccount]}>
                               <Option value="0">2</Option>
                               <Option value="1">{callTr("a_dynamic")}</Option>
                           </Select>
                  )}
        　　　 </FormItem>
              <FormItem label={(<span>{callTr("a_dynamicpt")}&nbsp;<Tooltip title={this.tips_tr("G726-32 Dynamic PT")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                  {getFieldDecorator('dynamicpt'+curAccount, {
                      rules: [{
                          validator: (data, value, callback) => {
                              this.digits(data, value, callback)
                          }
                      },{
                          validator: (data, value, callback) => {
                              this.range(data, value, callback, 96, 126)
                          }
                      }],
                      initialValue: this.props.itemValues['dynamicpt'+curAccount]
                      })(
                          <Input type="text" className={"P-" + nvram["dynamicpt"][curAccount]}/>
                  )}
              </FormItem>

              <FormItem  label={(<span>{callTr("a_opuspayload")}&nbsp;<Tooltip title={this.tips_tr("Opus Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                  {getFieldDecorator('opuspayload'+curAccount, {
                      rules: [{
                          validator: (data, value, callback) => {
                              this.digits(data, value, callback)
                          }
                      },{
                          validator: (data, value, callback) => {
                              this.range(data, value, callback, 96, 126)
                          }
                      }],
                      initialValue: this.props.itemValues['opuspayload'+curAccount]
                      })(
                          <Input type="text" className={"P-" + nvram["opuspayload"][curAccount]}/>
                  )}
              </FormItem>
               <FormItem  label={(<span>{"DTMF"}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("DTMF")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('inaudio', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["inaudio"])
                   })(<Checkbox className={"P-" + nvram["inaudio"][curAccount]}>In audio</Checkbox>)
                   }
                   {getFieldDecorator('RFC2833', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["RFC2833"])
                   })( <Checkbox className={"P-" + nvram["RFC2833"][curAccount]}>RFC2833</Checkbox>)
                   }
                   {getFieldDecorator('sipinfo', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["sipinfo"])
                   })( <Checkbox className={"P-" + nvram["sipinfo"][curAccount]}>SIP INFO</Checkbox>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_dtmfpayload")}&nbsp;<Tooltip title={this.tips_tr("DTMF Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('dtmfpayload'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 96, 126)
                           }
                       }],
                       initialValue: this.props.itemValues['dtmfpayload'+curAccount]
                   })(<Input className={"P-" + nvram["dtmfpayload"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_jitterbt")}&nbsp;<Tooltip title={this.tips_tr("Jitter Buffer Type")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('jitterbt', {
                       initialValue: this.props.itemValues['jitterbt'] ? this.props.itemValues['jitterbt'] : "0"
                   })(
                       <Select className={"P-" + nvram["jitterbt"][curAccount]}>
                           <Option value="0">{callTr("a_fixed")}</Option>
                           <Option value="1">{callTr("a_adap")}</Option>
                       </Select>
                   )}
               </FormItem>
              <FormItem  label={(<span>{callTr("a_audioredfec")}&nbsp;<Tooltip title={this.tips_tr("Enable Audio RED with FEC")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('audioredfec', {
                      valuePropName: 'checked',
                      initialValue: parseInt(this.props.itemValues["audioredfec"])
                  })(<Checkbox className={"P-" + nvram["audioredfec"][curAccount]}/>)
                  }
              </FormItem>
              <FormItem  label={(<span>{callTr("a_audiofecpayload")}&nbsp;<Tooltip title={this.tips_tr("Audio FEC Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                  {getFieldDecorator('audiofecpayload'+curAccount, {
                      rules: [{
                          validator: (data, value, callback) => {
                              this.digits(data, value, callback)
                          }
                      },{
                          validator: (data, value, callback) => {
                              this.range(data, value, callback, 96, 126)
                          }
                      }],
                      initialValue: this.props.itemValues['audiofecpayload'+curAccount] ? this.props.itemValues['audiofecpayload'+curAccount] : 121
                      })(
                          <Input type="text" className={"P-" + nvram["audiofecpayload"][curAccount]}/>
                  )}
              </FormItem>
              <FormItem  label={(<span>{callTr("a_audioredpayload")}&nbsp;<Tooltip title={this.tips_tr("Audio RED Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                  {getFieldDecorator('audioredpayload'+curAccount, {
                      rules: [{
                          validator: (data, value, callback) => {
                              this.digits(data, value, callback)
                          }
                      },{
                          validator: (data, value, callback) => {
                              this.range(data, value, callback, 96, 126)
                          }
                      }],
                      initialValue: this.props.itemValues['audioredpayload'+curAccount] ? this.props.itemValues['audioredpayload'+curAccount] : 124
                      })(
                          <Input type="text" className={"P-" + nvram["audioredpayload"][curAccount]}/>
                  )}
              </FormItem>
               <FormItem  label={(<span>{callTr("a_silsup")}&nbsp;<Tooltip title={this.tips_tr("Silence Suppression")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('silencesup', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["silencesup"])
                   })(<Checkbox className={"P-" + nvram["silencesup"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_vocfp")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Voice Frames Per TX")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('vocfp'+curAccount, {
                       rules: [
                           {
                               validator: (data, value, callback) => {
                                   this.digits(data, value, callback)
                               }
                           },
                           {
                               validator: (data, value, callback) => {
                                   this.range(data, value, callback, 1, 64)
                               }
                           }
                       ],
                       initialValue: this.props.itemValues['vocfp'+curAccount]
                   })(<Input className={"P-" + nvram["vocfp"][curAccount]}/>)
                   }
               </FormItem>

               <p className="blocktitle"><s></s>{callTr("a_prevcoder")}</p>
               <FormItem label={(<span>{callTr("a_prevcoder")}&nbsp;<Tooltip title={this.tips_tr("Preferred Video Coder")}><Icon type="question-circle-o" /></Tooltip></span>)}>
　　　　　　　　　　　 <Transfer dataSource={this.state.VideoData} sorter={ true } titles = {[callTr("a_notallowed"),callTr("a_allowed")]} listStyle={{ width: 135, height: 206,}} targetKeys={this.state.VideoTargetKeys} onChange={this.handleVideoChange} render={this.renderItem} />
               </FormItem>
               <FormItem label={(<span>{callTr("a_enablefec")}&nbsp;<Tooltip title={this.tips_tr("Enable Video FEC")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enablefec', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["enablefec"])
                   })(<Checkbox className={"P-" + nvram["enablefec"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem label={(<span>{callTr("a_enablerfc")}&nbsp;<Tooltip title={this.tips_tr("Enable RFC5168 Support")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enablerfc', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["enablerfc"])
                   })(<Checkbox className={"P-" + nvram["enablerfc"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem label={(<span>{callTr("a_fecmode")}&nbsp;<Tooltip title={this.tips_tr("Video FEC Mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('fecmode', {
                       initialValue: this.props.itemValues['fecmode']
                   })(
                       <RadioGroup className={"P-" + nvram["fecmode"][curAccount]}>
                           <Radio value="0">0</Radio>
                           <Radio value="1">1</Radio>
                       </RadioGroup>
                   )
                   }
               </FormItem>
               <FormItem label={(<span>{callTr("a_fecpayload")}&nbsp;<Tooltip title={this.tips_tr("FEC Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('fecpayload'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 96, 126)
                           }
                       }],
                       initialValue: this.props.itemValues['fecpayload'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["fecpayload"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem label={(<span>{callTr("a_packetmodel")}&nbsp;<Tooltip title={this.tips_tr("Packetization-mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('packetmodel', {
                       initialValue: this.props.itemValues['packetmodel']
                   })(
                       <Select onChange={this.handlePacketModel.bind(this)} className={"P-" + nvram["packetmodel"][curAccount]}>
                           <Option value="0">{callTr('a_single')}</Option>
                           <Option value="1">{callTr('a_nonInterleaved')}</Option>
                           {/*<Option value="10">{callTr('a_prevelnonInterleaved')}</Option>*/}
                       </Select>
                   )
                   }
               </FormItem>
               <FormItem className = "select-item"　 label={(<span>{callTr("a_h264imgsize")}&nbsp;<Tooltip title={this.tips_tr(product == 'GXV3380' ? "H.264 Image Size" : "H.264 Image Size ")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('imgsize', {
                        initialValue: this.props.itemValues['imgsize'] ? this.props.itemValues['imgsize'] : "5"
                        })(
                            <Select onChange={this.handleImgsize.bind(this)} className={"P-" + nvram["imgsize"][curAccount]}>
                                <Option value="10" className={product == 'GXV3380' ? "display-block" : "display-hidden"}>1080P</Option>
                                <Option value="9">720P</Option>
                                <Option value="4">4CIF</Option>
                                <Option value="1">VGA</Option>
                                <Option value="5">CIF</Option>
                                <Option value="0">QVGA</Option>
                                <Option value="6">QCIF</Option>
                            </Select>
                   )}
               </FormItem>
               <FormItem label={(<span>{callTr("a_useh264profile")}&nbsp;<Tooltip title={this.tips_tr("Use H.264 Constrained Profiles")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('useh264profile', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["useh264profile"])
                   })(<Checkbox className={"P-" + nvram["useh264profile"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem className = "select-item"　 label={(<span>{callTr("a_h264protype")}&nbsp;<Tooltip title={this.tips_tr("H.264 Profile Type")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('protype', {
                        initialValue: this.props.itemValues['protype'] ? this.props.itemValues['protype'] : "0"
                        })(
                            <Select className={"P-" + nvram["protype"][curAccount]}>
                                <Option value="0">{callTr("a_baseline")}</Option>
                                <Option value="1">{callTr("a_mainp")}</Option>
                                <Option value="2">{callTr("a_highp")}</Option>
                                <Option value="3">{callTr("a_bpmphp")}</Option>
                            </Select>
                   )}
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_vidbr")}&nbsp;<Tooltip title={this.tips_tr("Video Bit Rate")}><Icon type="question-circle-o" /></Tooltip></span>)}>
               {getFieldDecorator('vbrate', {
                    initialValue: this.props.itemValues['vbrate'] ? this.props.itemValues['vbrate'] : "2048"
                    })(
                        <Select className={"P-" + nvram["vbrate"][curAccount]}>
                            <Option value="32">32 Kbps</Option>
                            <Option value="64">64 Kbps</Option>
                            <Option value="96">96 Kbps</Option>
                            <Option value="128">128 Kbps</Option>
                            <Option value="160">160 Kbps</Option>
                            <Option value="192">192 Kbps</Option>
                            <Option value="210">210 Kbps</Option>
                            <Option value="256">256 Kbps</Option>
                            <Option value="384">384 Kbps</Option>
                            <Option value="512">512 Kbps</Option>
                            <Option value="640">640 Kbps</Option>
                            <Option value="768">768 Kbps</Option>
                            <Option value="1024">1024 Kbps</Option>
                            <Option value="1280">1280 Kbps</Option>
                            <Option value="1536">1536 Kbps</Option>
                            <Option value="2048">2048 Kbps</Option>
                        </Select>
               )}
              </FormItem>
              <FormItem className = "select-item"  label={(<span>{callTr("a_sdpattr")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("SDP Bandwidth Attribute")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('sdpattr', {
                       initialValue: this.props.itemValues['sdpattr'] ? this.props.itemValues['sdpattr'] : "0"
                       })(
                           <Select className={"P-" + nvram["sdpattr"][curAccount]}>
                               <Option value="0">{callTr("a_std")}</Option>
                               <Option value="1">{callTr("a_medialev")}</Option>
                               <Option value="2">{callTr("a_sessionlev")}</Option>
                               <Option value="3">{callTr("a_none")}</Option>
                           </Select>
                  )}
              </FormItem>
              <FormItem label={(<span>{callTr("a_h264payload")}&nbsp;<Tooltip title={this.tips_tr("H.264 Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                  {getFieldDecorator('h264payload'+curAccount, {
                      rules: [{
                          validator: (data, value, callback) => {
                              this.digits(data, value, callback)
                          }
                      },{
                          validator: (data, value, callback) => {
                              this.range(data, value, callback, 96, 126)
                          }
                      }],
                      initialValue: this.props.itemValues['h264payload'+curAccount]
                      })(
                          <Input type="text" className={"P-" + nvram["h264payload"][curAccount]}/>
                  )}
              </FormItem>
              <p className="blocktitle"><s></s>{callTr("a_presentation")}</p>
              <FormItem label={(<span>{callTr("a_disablepresent")}&nbsp;<Tooltip title={this.tips_tr(product == 'GXV3370' ? "Disable BFCP " : "Disable BFCP")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('disablepresent', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues['disablepresent'])
                   })(<Checkbox className={"P-" + nvram["disablepresent"][curAccount]}/>)
                  }
              </FormItem>
              <FormItem label={(<span>{callTr("a_initialinvite")}&nbsp;<Tooltip title={this.tips_tr("INITIAL INVITE")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('initialinvite', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues['initialinvite'])
                   })(<Checkbox className={"P-" + nvram["initialinvite"][curAccount]}/>)
                  }
              </FormItem>
              <FormItem className = "select-item"  label={(<span>{callTr("a_presentimagesize")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Presentation H.264 Image Size")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('presentimagesize', {
                       initialValue: this.props.itemValues['presentimagesize'] ? this.props.itemValues['presentimagesize'] : "10"
                       })(
                           <Select className={"P-" + nvram["presentimagesize"][curAccount]}>
                               <Option value="10">1080P</Option>
                               <Option value="9">720P</Option>
                           </Select>
                  )}
              </FormItem>
              <FormItem className = "select-item"  label={(<span>{callTr("a_presentprofile")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Presentation H.264 Profile")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('presentprofile', {
                       initialValue: this.props.itemValues['presentprofile'] ? this.props.itemValues['presentprofile'] : "0"
                       })(
                           <Select className={"P-" + nvram["presentprofile"][curAccount]}>
                               <Option value="0">{callTr("a_baseline")}</Option>
                               <Option value="1">{callTr("a_mainp")}</Option>
                               <Option value="2">{callTr("a_highp")}</Option>
                               <Option value="3">{callTr("a_bpmphp")}</Option>
                           </Select>
                  )}
              </FormItem>
              <FormItem className = "select-item"  label={(<span>{callTr("a_presentvideobitrate")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Presentation Video Bit Rate(Kbps)")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('presentvideobitrate', {
                       initialValue: this.props.itemValues['presentvideobitrate'] ? this.props.itemValues['presentvideobitrate'] : "2048"
                       })(
                           <Select className={"P-" + nvram["presentvideobitrate"][curAccount]}>
                               <Option value="512">512Kbps</Option>
                               <Option value="768">768Kbps</Option>
                               <Option value="1024">1024Kbps</Option>
                               <Option value="1280">1280Kbps</Option>
                               <Option value="1536">1536Kbps</Option>
                               <Option value="1792">1792Kbps</Option>
                               <Option value="2048">2048Kbps</Option>
                           </Select>
                  )}
              </FormItem>
              <FormItem className = "select-item"  label={(<span>{callTr("a_presentvideoframebate")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Presentation Video Frame Rate")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('presentvideoframebate', {
                       initialValue: this.props.itemValues['presentvideoframebate'] ? this.props.itemValues['presentvideoframebate'] : "5"
                       })(
                           <Select className={"P-" + nvram["presentvideoframebate"][curAccount]}>
                               <Option value="5">{callTr("a_5f")}</Option>
                               <Option value="10">{callTr("a_10f")}</Option>
                               <Option value="15">{callTr("a_15f")}</Option>
                           </Select>
                  )}
              </FormItem>
              <FormItem className = "select-item"  label={(<span>{callTr("a_bfcptranspro")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("BFCP Transport Protocol")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('bfcptranspro', {
                       initialValue: this.props.itemValues['bfcptranspro'] ? this.props.itemValues['bfcptranspro'] : "0"
                       })(
                           <Select className={"P-" + nvram["bfcptranspro"][curAccount]}>
                               <Option value="0">{callTr("a_automatic")}</Option>
                               <Option value="1">UDP</Option>
                               <Option value="2">TCP</Option>
                           </Select>
                  )}
              </FormItem>
               <p className="blocktitle"><s></s>{callTr("account_rtp")}</p>
               <FormItem className = "select-item"  label={(<span>{callTr("a_srtp")}&nbsp;<Tooltip title={this.tips_tr("SRTP Mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('srtp', {
                       initialValue: this.props.itemValues['srtp'] ? this.props.itemValues['srtp'] : "0"
                   })(
                       <Select className={"P-" + nvram["srtp"][curAccount]}>
                           <Option value="0">{callTr("a_disable")}</Option>
                           <Option value="1">{callTr("a_enabledbut")}</Option>
                           <Option value="2">{callTr("a_enableand")}</Option>
                       </Select>
                   )}
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_encryptdigit")}&nbsp;<Tooltip title={this.tips_tr("SRTP Key Length")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('encryptdigit', {
                       initialValue: this.props.itemValues['encryptdigit'] ? this.props.itemValues['encryptdigit'] : "0"
                   })(
                       <Select className={"P-" + nvram["encryptdigit"][curAccount]}>
                           <Option value="0">AES 128&256 bit</Option>
                           <Option value="1">AES 128 bit</Option>
                           <Option value="2">AES 256 bit</Option>
                       </Select>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_srtplifttime")}&nbsp;<Tooltip title={this.tips_tr("Enable SRTP Key Life Time")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('srtplifttime', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["srtplifttime"])
                   })(<Checkbox className={"P-" + nvram["srtplifttime"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_rtcpserver")}&nbsp;<Tooltip title={this.tips_tr("RTCP Destination")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('rtcpserver'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.checkaddressPath(data, value, callback)
                           }
                       }],
                       initialValue: this.props.itemValues['rtcpserver'+curAccount]
                   })(<Input className={"P-" + nvram["rtcpserver"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_symrtp")}&nbsp;<Tooltip title={this.tips_tr("Symmetric RTP")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('symrtp', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["symrtp"])
                   })(<Checkbox className={"P-" + nvram["symrtp"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_rtpipfilter")}&nbsp;<Tooltip title={this.tips_tr("RTP IP Filter")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('rtpipfilter', {
                       initialValue: this.props.itemValues['rtpipfilter'] ? this.props.itemValues['rtpipfilter'] : "0"
                   })(
                       <Select className={"P-" + nvram["rtpipfilter"][curAccount]}>
                           <Option value="0">{callTr("a_disable")}</Option>
                           <Option value="1">{callTr("a_iponly")}</Option>
                           <Option value="2">{callTr("a_ipandport")}</Option>
                       </Select>
                   )}
               </FormItem>
              <FormItem>
                  <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
              </FormItem>
           </Form>;

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return itemList;

    }
}

const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    product: state.product
})

export default connect(mapStateToProps)(Enhance(CodecForm));
