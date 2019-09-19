import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index'
import * as optionsFilter from "../../template/optionsFilter.js";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Layout, Tooltip, Icon, Tabs } from 'antd';
import './peripheralState.less'

const Content = Layout;
const TabPane = Tabs.TabPane;
let req_items;

const FormItem = Form.Item;




class peripheral extends Component {
    constructor() {
        super()
        this.state = {
            hdmiinstate: '0',
            hdmi1state: '0',
            hdmi2state: '0',
            usbstate: '0',
            sdcardstate: '0'
        }
    }
    componentDidMount() {
        const {gethdmiinstate, gethdmi1state, gethdmi2state, getusbstate, getsdcardstate} = this.props
        gethdmiinstate((data) => {
            this.setState({
                hdmiinstate: data.state || '0'
            })
        })
        gethdmi1state((data) => {
            this.setState({
                hdmi1state: data.state || '0'
            })
        })
        gethdmi2state((data) => {
            this.setState({
                hdmi2state: data.state || '0'
            })
        })
        getusbstate((data) => {
            this.setState({
                usbstate: data.msg || '0'
            })
        })
        getsdcardstate((data) => {
            this.setState({
                sdcardstate: data.msg || '0'
            })
        })

        this.props.getItemValues([
            this.getReqItem("vgaIn","vgaIn", ""),
            this.getReqItem("UsbAudio","UsbAudio", ""),
        ]);
    }
    render() {
        const {vgaIn, UsbAudio} = this.props.itemValues
        const { hdmi1state, hdmi2state, hdmiinstate,sdcardstate, usbstate} = this.state
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_16630")}</div>
                <div className="preipheralstate" style={{minHeight: this.props.mainHeight}}>
                    <table className='preipheralstate-table'>
                        <tr>
                            <th width="15%">VGA输入</th>
                            <th width="15%">HDMI输入</th>
                            <th width="25%">HDMI输出</th>
                            <th width="15%">SD卡</th>
                            <th width="15%">USB 1</th>
                            <th width="15%">USB 2</th>
                        </tr>
                        <tr>
                            <td>
                                <span className={`vga-in ${vgaIn == '1' ? 'on' : ''}`}></span>
                            </td>
                            <td>
                                <span className={`hdmi-in ${hdmiinstate == '1' ? 'on' : ''}`}></span>
                            </td>
                            <td>
                                <span className={`hdmi-out2 ${hdmi2state == '1' ? 'on' : ''}`}></span>
                                <span className={`hdmi-out1 ${hdmi1state == '1' ? 'on' : ''}`}></span>
                            </td>
                            <td>
                                <span className={`sd-card ${sdcardstate == '1' ? 'on' : ''}`}></span>
                            </td>
                            <td>
                                <span className={`usb-1 ${UsbAudio == '1' ? 'on' : ''}`}></span>
                            </td>
                            <td>
                                <span className={`usb-2 ${usbstate == '1' ? 'on' : ''}`}></span>
                            </td>
                        </tr>
                    </table>
                </div>
                
            </Content>
        )
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    mainHeight: state.mainHeight
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues: Actions.getItemValues,
        gethdmiinstate: Actions.gethdmiinstate2,
        gethdmi1state: Actions.gethdmi1state2,
        gethdmi2state: Actions.gethdmi2state2,
        getusbstate: Actions.getusbstate2,
        getsdcardstate: Actions.getsdcardstate2,

    };
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(peripheral));