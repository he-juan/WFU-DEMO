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
        let reboottype = $.cookie('reboottype') || '0';
        
        setTimeout(() => this.props.sysReboot(reboottype), 1000);
        // if( $.cookie("resetreboot") != "1" ){
        //     setTimeout(() => this.props.reboot(), 1000);
        // }else{
        //     $.cookie("resetreboot", "0", { path: '/', expires: 10 });
        // }
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
        let rebootype = $.cookie('reboottype') || '0';
        let title, subtitle, tips;
        if(rebootype == '0' || rebootype == '4') {
            title = this.tr("a_19324");
            subtitle = this.tr('a_19355');
            tips = this.tr('a_19356');
        } else if (rebootype == '1' || rebootype == '5') {
            title = this.tr('a_19325');
            subtitle = this.tr('a_19348');
            tips = this.tr('a_19349');
        } else if ( rebootype == '2' || rebootype == '6' ) {
            title = this.tr("a_16375");
            subtitle = this.tr("a_19350");
            tips = this.tr("a_19351");
        }
        return (
            <div className="a_19324">
                <div className="reboot_title">
                    <div className='header-vendor-div'>
                        <a href="http://www.grandstream.com" target="_blank">
                            <i className ="sprite"></i>
                            <span>{this.props.productStr}</span>
                        </a>
                    </div>
                    <div className="reboot_title_span">{title}</div>
                </div>
                <div className="rebootContent">
                    <div className="rebootContent_title">{subtitle}</div>
                    <div className="rebootContent_content">{tips}</div>
                   
                    <a href="index.html"><span id="clicklogin">{this.tr("clicklogin")}</span></a>
                    
                    <span style={{color:"#bac0ca",fontSize:"12px"}} id="vendor">
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
        sysReboot: Actions.sysReboot
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(RebootMain));
