import React, {Component} from 'react'
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Col, Form, Icon, Input, Layout, Modal, Row, Switch,Button} from "antd"

const Content = Layout;
const FormItem = Form.Item;
const timeout = 120;


class RenameModal extends Component {
    constructor(props) {
        super(props);
        this.state = {okbtndisabled:false}
    }

    componentWillReceiveProps = (nextProps) => {
        if (!this.props.renamemodalvisible && nextProps.renamemodalvisible ) {
            this.setState({okbtndisabled:false});
        }
    }

    handelRename = () => {
        let obj = this.props.form.getFieldsValue(['newdevicename']);
        this.props.setbtname(obj.newdevicename, (data)=>{
            var result = eval("(" + data + ")");
            this.props.handleHideModal(obj.newdevicename);
            if(result["res"] == "success"){
                this.props.promptMsg('SUCCESS','a_edit_ok');
            }else{
                this.props.promptMsg('ERROR','a_edit_failed');
            }
        });
    }

    changeInput =(e) => {
        var deviceName = e.target.value.trim();
        if(deviceName == ""){
            this.setState({okbtndisabled:true});
        }else{
            this.setState({okbtndisabled:false});
        }
    }

    handleCancel = () => {
        this.props.handleHideModal();
    }

    render() {
        const renamemodalvisible = this.props.renamemodalvisible;
        const {getFieldDecorator} = this.props.form;
        const callTr = this.props.callTr;
        return (
            <Modal className="blueth-raname-modal" title={callTr("a_69")} visible={renamemodalvisible}
                   onOk={this.handelRename} onCancel={this.handleCancel}
                   footer={[
                       <Button key="back" onClick={this.handleCancel}>{callTr("a_3")}</Button>,
                       <Button key="submit" type="primary" disabled={this.state.okbtndisabled} onClick={this.handelRename}>{callTr("a_2")}</Button>,
                   ]}>
                <Form hideRequiredMark>
                    <FormItem>
                        {getFieldDecorator('newdevicename', {
                        })(
                            <Input type="text" style={{width:300}}  onChange={this.changeInput.bind(this)}/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const RenameModalForm = Form.create()(RenameModal);

class Bluetooth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            devicename: '',
            bluetoothEnabled: false,
            bluetoothenabled: 'display-hidden',
            discoveredEnabled: false,
            renamemodalvisible: false,
            paireddevices: [],
            displayTimeout: ''
        }
        this.curTimeout = 0;
    }

    componentDidMount = () => {
        this.props.getBluetoothState((data) => {
            var obj = eval("(" + data + ")");
            if (obj['res'] == 'success' && obj['state'] == '12') {
                this.setState({bluetoothEnabled: true});
                this.setState({bluetoothenabled: 'display-block'});
                this.setState({devicename: decodeURIComponent(obj['btDeviceName'])});
                this.handlePairedBluetoothlist(0);
                this.refreshBluetooth = setInterval(()=>{this.handleBluetoothScan()},15000);
                this.props.getDiscoverableEnable((data) => {
                    var obj = eval("(" + data + ")");
                    if (obj['res'] == 'success' && obj['state'] == 'true') {
                        this.props.getDiscoverableTimeout((data) => {
                            let tObj = JSON.parse(data);
                            if (obj['res'] == "success") {
                                if(Number(tObj['timeout']) == 0){
                                    this.props.setDiscoverable(0);
                                    this.setState({discoveredEnabled: false});
                                }else{
                                    this.setState({discoveredEnabled: true,});
                                    this.curTimeout = Number(tObj['timeout']);
                                    this.countdownInterval = setInterval(() => {this.countdown();}, 1000);
                                }
                            }
                        });
                    } else {
                        this.setState({discoveredEnabled: false});
                    }
                });
            } else {
                this.setState({bluetoothEnabled: false});
                this.setState({bluetoothenabled: 'display-hidden'});
                if (obj['btDeviceName']) {
                    this.setState({devicename: decodeURIComponent(obj['btDeviceName'])});
                }
            }
        });
    }

    componentWillUnmount = () => {
        clearInterval(this.countdownInterval);
        clearInterval(this.refreshBluetooth);
    }

    handleBluetoothScan = () => {
        this.props.getPairedBluetooth((data) => {
            var result = eval("(" + data + ")");
            if (result.res == "success") {
                this.setState({paireddevices: result.list});
            }
        });
    }

    handlePairedBluetoothlist = (count) => {
        let self = this;
        this.props.getPairedBluetooth((data) => {
            var result = eval("(" + data + ")");
            if (result.res == "success") {
                if (result.list.length == 0 && count < 4) {
                    count++;
                    setTimeout(function () {self.handlePairedBluetoothlist(count)}, 2000);
                } else {
                    self.setState({paireddevices: result.list});
                }
            }
        });
    }

    handleBluetoothChange = (value) => {
        this.setState({bluetoothEnabled: value});
        if (value == false) {
            this.props.setBluetoothEnabled(0, (data)=>{
                var result = eval("(" + data + ")");
                if(result['res'] == "success"){
                    clearInterval(this.countdownInterval);
                    clearInterval(this.refreshBluetooth);
                    this.setState({
                        bluetoothenabled: 'display-hidden',
                        discoveredEnabled: false,
                        displayTimeout: ''
                    });
                }
            });
        } else {
            if (this.state.devicename == '') {
                this.props.getBluetoothState((data) => {
                    var obj = eval("(" + data + ")");
                    this.setState({devicename: decodeURIComponent(obj['btDeviceName'])});
                });
            }
            this.setState({bluetoothenabled: 'display-block'});
            this.props.setBluetoothEnabled(1, (result) => {
                var obj = eval("(" + result + ")");
                if (obj["res"] == "success") {
                    this.handlePairedBluetoothlist(0);
                    this.refreshBluetooth = setInterval(()=>{this.handleBluetoothScan()},15000);
                }
            });
        }
    }

    handleBluetoothDiscoverable = (value) => {
        if (!this.state.bluetoothEnabled)
            return;
        let self = this;
        this.setState({
            discoveredEnabled: value,
            displayTimeout: ''
        });
        if (value == false) {
            this.props.setDiscoverable(0);
            clearInterval(this.countdownInterval);
        } else {
            this.props.getBluetoothState((data) => {
                var obj = eval("(" + data + ")");
                if (obj['res'] == 'success' && obj['state'] == '12') {
                    this.props.setDiscoverable(1, timeout, (result) => {
                        var obj = eval("(" + result + ")");
                        if (obj['res'] == "success") {
                            this.curTimeout = timeout;
                            this.countdown();
                            this.countdownInterval = setInterval(() => {this.countdown();}, 1000);
                        }
                    });
                } else {
                    setTimeout(() => {self.handleBluetoothDiscoverable(value)}, 2000);
                }
            });
        }
    }

    countdown = () => {
        if (this.curTimeout <= 0) {
            clearInterval(this.countdownInterval);
            this.props.setDiscoverable(0);
            this.setState({
                displayTimeout: '',
                discoveredEnabled: false
            });
            return;
        }
        let displayTimeout = this.timeConvert(this.curTimeout);
        this.setState({displayTimeout: displayTimeout});
        this.curTimeout --;
    }

    timeConvert = (time) => {
        let min = Math.floor(time / 60);
        let sec = time % 60;
        min = `0${min}`;
        if (sec < 10) {
            sec = `0${sec}`;
        }
        return `${min}:${sec}`;
    }

    showModal = () => {
        this.setState({renamemodalvisible: true,});
        this.props.form.setFieldsValue({newdevicename: this.state.devicename});
    }

    handleHideModal = (newdevicename) => {
        this.setState({renamemodalvisible: false});
        if (newdevicename) {
            this.setState({devicename: newdevicename});
        }
    }

    getConnectedBluetoothIndex = () => {
        let paireddevices = this.state.paireddevices;
        let len = paireddevices.length;
        for (var index = 0; index < len; index++) {
            if (paireddevices[index].isConnected == "true") {
                return index;
            }
        }
        return -1;
    }

    handleUnpair =(address) => {
        this.props.unpairbluetooth(address, (data) => {
            var result = eval("(" + data + ")");
            if (result['msg'] == "unpair success") {
                this.cb_handleUnpair(address)
            }
        });
    }

    cb_handleUnpair = (address) => {
        let self = this;
        self.props.getPairedBluetooth((data) => {
            var result = eval("(" + data + ")");
            if (result.res == "success") {
                var flag = false;
                for (let i in result.list) {
                    let item = result.list[i];
                    if (item.address == address) {
                        flag = true;
                    }
                }
                if (flag) {
                    setTimeout(function () {self.cb_handleUnpair(address);}, 1000);
                } else {
                    self.setState({paireddevices: result.list});
                }
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {renamemodalvisible, paireddevices, bluetoothenabled, devicename, bluetoothEnabled} = this.state;

        let index = this.getConnectedBluetoothIndex();
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_bluetooth")}</div>
                <Form hideRequiredMark style={{minHeight: this.props.mainHeight}} className="configform blth">
                    <FormItem label={<span>{this.tr("a_bluetooth")}</span>}>
                        {getFieldDecorator("bluetooth", {})(
                            <Switch checked={this.state.bluetoothEnabled} onChange={this.handleBluetoothChange}/>
                        )}
                    </FormItem>
                    <FormItem label={<span>{this.tr("a_discoverable")}</span>} className={bluetoothenabled}>
                        {getFieldDecorator("discoverable", {})(
                            <Switch checked={this.state.discoveredEnabled} onChange={this.handleBluetoothDiscoverable}/>
                        )}
                        <span style={{position: "absolute", marginLeft: 12}}> {this.state.displayTimeout} </span>
                    </FormItem>
                    <FormItem label={<span>{this.tr("a_devicename")}</span>}>
                        <span ref="devicename" className="ellips devicename" title={this.state.devicename}>{this.state.devicename}</span>
                        <button className='allow-edit bluetooth-edit-btn' onClick={this.showModal}
                                disabled={!bluetoothEnabled}></button>
                    </FormItem>

                    <FormItem className={bluetoothenabled} label="  ">
                        <div className="paireddevicelist">
                            {
                                !paireddevices.length ?
                                    <div className = "nodatatips">
                                        <div></div>
                                        <p>{this.tr("a_nodevice")}</p>
                                    </div> :
                                    <div>
                                        {
                                            index != -1 ?
                                                <Row className="devicerow connectedbluetooth">
                                                    <Col span={18} className="ellips" title={paireddevices[index].name}>{paireddevices[index].name}</Col>
                                                    <Col span={2}></Col>
                                                    <Col span={4}>
                                                        {/*<div>{this.tr("a_23529")}</div>*/}
                                                        <Button className="blth-unpairbtn"
                                                                onClick={this.handleUnpair.bind(this, paireddevices[index].address)}>{this.tr("a_blthunpair")}</Button>
                                                    </Col>
                                                </Row> : ""
                                        }
                                        {
                                            index != -1 && paireddevices.length == 1 ? "" :
                                                <div>
                                                    <div className="paireddevicetitle">
                                                        {this.tr("a_paireddevices")}
                                                    </div>
                                                    {
                                                        this.state.paireddevices.map((pairedDevice, i) => {
                                                                if (i == index)
                                                                    return "";
                                                                return (
                                                                    <Row key={i} className="devicerow">
                                                                        <Col span={18}
                                                                             className="ellips" title={pairedDevice.name}>{pairedDevice.name}</Col>
                                                                        <Col span={2}></Col>
                                                                        <Col span={4}>
                                                                            <Button className="blth-unpairbtn"
                                                                                    onClick={this.handleUnpair.bind(this, pairedDevice.address)}>{this.tr("a_blthunpair")}</Button>
                                                                        </Col>
                                                                    </Row>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </div>
                                        }
                                    </div>
                            }
                        </div>
                    </FormItem>
                </Form>
                <RenameModalForm {...this.props} renamemodalvisible={renamemodalvisible} callTr={this.tr} handleHideModal={this.handleHideModal} name={this.state.devicename}/>
            </Content>
        )
    }
}

const BluetoothForm = Form.create()(Enhance(Bluetooth));
const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        getBluetoothState: Actions.getBluetoothState,
        setBluetoothEnabled: Actions.setBluetoothState,
        getDiscoverableEnable: Actions.getDiscoverableEnable,
        setDiscoverable: Actions.setDiscoverableEnable,
        getPairedBluetooth: Actions.getPairedBluetooth,
        getDiscoverableTimeout: Actions.getDiscoverableTimeout,
        setbtname: Actions.setbtname,
        unpairbluetooth: Actions.unpairbluetooth,
        promptMsg: Actions.promptMsg
    }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(BluetoothForm));
