import React,{Component} from 'react';
import ReactDOM from "react-dom";
import Enhance from './mixins/Enhance';
import * as Actions from './redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class RebootMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vendorMsg:""
        }
    }

    componentDidMount() {
       this.setVendorMsg();

       $('.mainrbtDiv').hide();
       $('.loginDiv').hide();
       $('.mainrbtDiv').slideDown(1000,function(){
           $('.loginDiv').fadeIn(1000);
       });
       if( $.cookie("resetreboot") != "1" ){
           setTimeout(() => this.props.reboot(), 1000);
       }else{
           $.cookie("resetreboot", "0", { path: '/', expires: 10 });
       }
    }

    setVendorMsg = () => {
        const vendor = this.props.vendor;
        let vendorMsg;
        if( vendor == "" || vendor == undefined) {
            vendorMsg = "All Rights Reserved Grandstream Networks, Inc. 2018";
        } else {
            vendorMsg = "All Rights Reserved " + vendor + " 2018";
        }
        this.setState({
            vendorMsg: vendorMsg
        })
    }

    render() {
        return (
            <div className="reboot">
                <div className="reboot_title">
                    <div className='header-vendor-div'>
                        {this.props.oemId=="54"?<span>{this.props.productStr}</span>:
                            this.props.oemId=="70"?
                                <a>
                                    <i className ="spriteNec"></i>
                                    <span>{this.props.productStr}</span>
                                </a>:
                                <a href="http://www.grandstream.com" target="_blank">
                                    <i className ="sprite"></i>
                                    <span>{this.props.productStr}</span>
                                </a>
                        }
                    </div>
                    <div className="reboot_title_span">{this.tr("a_reboot")}</div>
                </div>
                <div className="rebootContent">
                    <div className="rebootContent_title">{this.tr("rebooting")}</div>
                    <div className="rebootContent_content">{this.tr("reboottip")}</div>
                    {$.cookie("MyLanguage") == "zh" ?  <div className="rebootContent_content">{this.tr("clicktip")}<span style={{"color":"#3d77ff"}}>{this.tr("clicktip2")}</span>{this.tr("clicktip3")}</div> :
                    <div className="rebootContent_content">{this.tr("clicktip")}<span style={{"color":"#3d77ff"}}>{this.tr("clicktip2")}</span></div>}
                    <a href="index.html"><span id="clicklogin">{this.tr("clicklogin")}</span></a>
                    <span className={this.props.oemId == "54" ? 'display-hidden' : 'display-block'}  style={{color:"#bac0ca",fontSize:"12px"}} id="vendor">
                                {this.state.vendorMsg}
                             </span>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    vendor: state.vendor,
    productStr: state.productStr,
    oemId:state.oemId,
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        reboot: Actions.reboot
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(RebootMain));
