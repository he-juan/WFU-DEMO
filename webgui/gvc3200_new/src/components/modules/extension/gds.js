import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import { FormattedHTMLMessage } from 'react-intl';
import {Layout, Form, Tooltip, Icon, Button, Input, Table, Popconfirm, Tabs, Select} from "antd";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const {Column} = Table;

class GdsForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            type: "password"
        }
    }

    handleCancel = () => {
        const form = this.props.form;
        form.setFieldsValue({
            gdsname: "",
            gdsnumber: "",
            gdspwd: ""
        });
        this.props.onChangeState(2, "a_23");
        this.props.ctrlGdsOperations("hide");
    }

    handlePwdVisible = () => {
        this.setState({type: this.state.type == "password" ? "text" : "password"});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                const operatename = this.props.operatename;
                let startindex, gdsdata = this.props.gdsdata;;
                for(let i = 0; i < gdsdata.length; i++){
                    if(operatename == "a_23" && values['gdsnumber'] == gdsdata[i].gdsnumber){
                        this.props.promptMsg('ERROR',"a_sameuseriderror");
                        return false;
                    }
                }

                let reg = new RegExp("^[A-Za-z0-9-_.!~*'()+$]+$");
                if(values['gdsnumber'] != "" && !reg.test(values['gdsnumber'])){
                    this.props.promptMsg('ERROR',"a_gdsnumbererror");
                    return false;
                }
                if(operatename == "a_23"){
                    const cmparray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                    startindex = -1;

                    for(let i = 0; i < gdsdata.length; i++){
                        if(cmparray[i] != gdsdata[i].key){
                            startindex = i;
                            break;
                        }
                    }

                    if(startindex == -1)
                        startindex = gdsdata.length;
                }
                else{
                    startindex = this.props.form.getFieldValue("gdsorder");
                }

                let startorder = 32000 + 5 * startindex;
                let items = [{"name": "serviceType", "pvalue": startorder},
                             {"name": "doorsystemType", "pvalue": startorder + 1},
                            {"name": "gdsname", "pvalue": startorder + 2},
                            {"name": "gdsnumber", "pvalue": startorder + 3},
                            {"name": "gdspwd", "pvalue": startorder + 4}];
                values.gdsorder = "0";
                this.props.setItemValues(items, values, 0, () => {
                    let servicetype = (values["serviceType"] == '0' ? "GDS" : "DTMF");
                    let tempitem = {key: startindex, gdsorder: startindex + 1, serviceType: servicetype, doorsystemType: (values["serviceType"] == '0' ? values["doorsystemType"] : '0'), gdsname: values["gdsname"], gdsnumber: (values["serviceType"] == '0' ? values["gdsnumber"] : ''),
                        gdspwd: values["gdspwd"]};
                    if(operatename == "a_23"){
                        gdsdata.splice(startindex, 0, tempitem);
                    }
                    else{
                        for(let i = 0; i < gdsdata.length; i++){
                            if(gdsdata[i].key == startindex){
                                gdsdata[i] = tempitem;
                                break;
                            }
                        }
                    }
                    this.props.onChangeState(1, gdsdata);
                    this.handleCancel();
                });
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;

        return(
            <Form className={this.props.gdsvisible} onSubmit={this.handleSubmit} hideRequiredMark>
                {getFieldDecorator("gdsorder")}
                <FormItem className = "select-item" label={(<span>{callTr("a_servicetype")}&nbsp;<Tooltip title={callTipsTr("Phonebook Key Function")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('serviceType', {
                        initialValue: "0"
                    })(
                        <Select onChange={this.props.handleChangeType}>
                            <Option value="0">{callTr("a_dstype")}</Option>
                            <Option value="1">{callTr("a_7477")}</Option>
                        </Select>
                    )
                    }
                </FormItem>
                <FormItem className = {"select-item " + this.props.systemTypeDisplay} label={(<span>{callTr(this.props.systemType)}&nbsp;<Tooltip title={callTipsTr("Phonebook Key Function")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('doorsystemType', {
                        initialValue: "0"
                    })(
                        this.props.systemType == "a_doorsysytemtype" ?
                        (<Select>
                            <Option value="0">{callTr("a_gdssystem")}</Option>
                            <Option value="1">{callTr("a_dtmfsystem")}</Option>
                        </Select>) :
                        (<Select>
                            <Option value="0">{callTr("a_inandoutcall")}</Option>
                            <Option value="1">{callTr("a_incallonly")}</Option>
                            <Option value="2">{callTr("a_outcallonly")}</Option>
                            <Option value="3">{callTr("a_matchedcall")}</Option>
                        </Select>)
                    )
                    }
                </FormItem>
                <FormItem label={<span>{callTr("a_7474")}<Tooltip title={callTipsTr("GDS Name")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("gdsname", {
                        rules: [{
                            required: true, message: callTr("a_gdsnameempty")
                        },{
                            max: 64, message: callTr("a_gdsnamelimit")
                        }]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem className={this.props.systemTypeDisplay} label={<span>{callTr(this.props.systemId)}<Tooltip title={callTipsTr("GDS Number")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <Input type="text" name = "gdsnumber" style= {{display:"none"}} disabled autoComplete = "off"/>
                    {getFieldDecorator("gdsnumber", {
                        rules: [{
                            //required: true, message: callTr("a_gdsnumempty")
                        },{
                            max: 64, message: callTr("a_gdsnumberlimit")
                        },{
                            //validator: this.checkGDSNumber
                        }]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr(this.props.systemPwd)}<Tooltip title={callTipsTr("GDS Password")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <Input type={this.state.type} name = "gdspwd" style= {{display:"none"}} disabled autoComplete = "off"/>
                    {getFieldDecorator("gdspwd", {
                        rules: [{
                            required: true, message: callTr("a_gdspwdempty")
                        },{
                            max: 32, message: callTr("a_gdspwdlimit")
                        }]
                    })(
                        this.props.systemPwd == "a_gdspwd" ?
                        (<Input name = "gdspwd" type={this.state.type}
                            suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible} />}/>) :
                        (<Input name = "gdspwd" />)
                    )}
                </FormItem>
                <FormItem className="operatebtn">
                    <Button className="cancel" size="large" onClick={this.handleCancel}>{callTr("a_3")}</Button>
                    <Button className="submit" type="primary" htmlType="submit" size="large" disabled={this.props.disableAppend}>
                        {callTr(this.props.operatename)}
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const AddGdsForm = Form.create()(GdsForm);

class Gds extends Component {
    constructor(props){
        super(props);

        this.state = {
            selectedRowKeys: [], //configure the default column
            gdsdata: [],
            operatename: "a_23",
            disableAppend: false,  // to control add gds item button disabled or not , the max num is 10
            gdsvisible: "display-hidden",
            disabledbtn: false,
            systemId: 'a_gdsnumber',
            systemPwd: 'a_gdspwd',
            systemType: 'a_doorsysytemtype',
            systemTypeDisplay: 'display-block'
        }
    }

    componentDidMount = () => {
        let req_items = [];
        for(let i = 0; i < 50; i++){
            req_items.push({"name": i, "pvalue": 32000 + i + ""});
        }
        this.props.getItemValues(req_items, (values) => {
            let tempgds = [];
            for(let j = 0; j < 10; j++){
                if(values[j * 5] != ""){
                    tempgds.push({
                        key: j,
                        gdsorder: j + 1,
                        serviceType: values[j * 5] == '0' ? 'GDS' : 'DTMF',
                        doorsystemType: values[j * 5 + 1],
                        gdsname: values[j * 5 + 2],
                        gdsnumber: values[j * 5 + 3],
                        gdspwd: values[j * 5 + 4],
                        //gdspwd: values[j * 5] == '0' ? '-' : values[j * 5 + 4],
                    });
                }
            }

            this.setState({
                gdsdata: tempgds,
            });

            if(tempgds.length == 10){
                this.setState({
                    disableAppend: true,
                    disabledbtn: true
                });
            }
        });
    }

    handleChangeType = (val) => {
        var systemId;
        var systemPwd;
        var systemType;
        var systemTypeDisplay;
        if (val == '0') {
            systemId = "a_gdsnumber";
            systemPwd = "a_gdspwd";
            systemType = "a_doorsysytemtype";
            systemTypeDisplay = "display-block";
        } else {
            systemId = "a_dtmfcondcid";
            systemPwd = 'a_dtmfcontent';
            systemType = "a_dtmfcond";
            systemTypeDisplay = "display-hidden";
        }
        this.setState({
            systemId: systemId,
            systemPwd: systemPwd,
            systemType: systemType,
            systemTypeDisplay: systemTypeDisplay
        })
    }

    saveFormRef = (form) => {
        this.form = form;
    }

    handleGdsEdit = (text) => {
        const form = this.form;
        form.setFieldsValue({
            gdsorder: text.key,
            serviceType: text.serviceType == 'GDS' ? '0' : '1',
            doorsystemType: text.doorsystemType,
            gdsname: text.gdsname,
            gdsnumber: text.gdsnumber,
            gdspwd: text.gdspwd
        });
        document.getElementById("gdsname").focus();
        this.setState({
            operatename: "a_17",
            disableAppend: false,
        });
    }

    handleEditItem = (text) => {
        var systemId;
        var systemPwd;
        var systemType;
        var systemTypeDisplay;
        if (text.serviceType == 'GDS') {
            systemId = "a_gdsnumber";
            systemPwd = "a_gdspwd";
            systemType = "a_doorsysytemtype";
            systemTypeDisplay = "display-block";
        } else {
            systemId = "a_dtmfcondcid";
            systemPwd = 'a_dtmfcontent';
            systemType = "a_dtmfcond";
            systemTypeDisplay = "display-hidden";
        }
        this.setState({
            systemId: systemId,
            systemPwd: systemPwd,
            systemType: systemType,
            systemTypeDisplay: systemTypeDisplay
        })
        this.handleGdsEdit(text);
        this.ctrlGdsOperations("show");
    }

    handleDeleteItem = (text, index) => {
        let startorder = 32000 + 5 * text.key;
        let items = [startorder, startorder + 1, startorder + 2, startorder + 3, startorder + 4];
        let values = ["", "", "", "", ""];

        this.props.putNvrams(items, values, "a_del_ok", () => {
            let temparray = this.state.gdsdata;
            temparray.splice(index, 1);
            this.setState({
                gdsdata: temparray,
                disableAppend: false,
                disabledbtn: false
            });
        });
    }

    handleDeleteMulti = () => {
        const {selectedRowKeys} = this.state;
        let nvrams = [], values = [];
        for(let i = 0; i < selectedRowKeys.length; i++){
            let startorder = 32000 + 5 * selectedRowKeys[i];
            nvrams.push(startorder);
            nvrams.push(startorder + 1);
            nvrams.push(startorder + 2);
            nvrams.push(startorder + 3);
            nvrams.push(startorder + 4);
        }
        for(let j = 0; j < selectedRowKeys.length * 4; j++)
            values.push("");

        this.props.putNvrams(nvrams, values, "a_del_ok", () => {
            let temparray = this.state.gdsdata;
            for(let i = 0; i < selectedRowKeys.length; i++){
                for(let j = 0; j < temparray.length; j++){
                    if(selectedRowKeys[i] == temparray[j].key){
                        temparray.splice(j, 1);
                        break;
                    }
                }
            }
            this.setState({
                gdsdata: temparray,
                disableAppend: false,
                disabledbtn: false,
                selectedRowKeys: []
            });
        });
    }

    onChangeState = (type, value) => {
        switch (type) {
            case 1:
                this.setState({
                    gdsdata: value,
                });

                if(value.length == 10){
                    this.setState({
                        disableAppend: true,
                    });
                }
                break;
            case 2:
                this.setState({
                    operatename: value,
                });
                break;
        }

    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    /*add animate for gds edit form on the top*/
    ctrlGdsOperations = (operate) => {
        switch (operate) {
            case "show":
                this.setState({
                    gdsvisible: "a-fadein",
                    disabledbtn: true
                });
                break;
            case "hide":
                this.setState({
                    gdsvisible: "a-fadeout"
                });
                if(this.state.gdsdata.length < 10){
                    this.setState({disabledbtn: false})
                }
        }

    }

    render(){
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_gds")}</div>
                <div className="configform" style={{minHeight: this.props.mainHeight, padding: 0}}>
                    <div className="blocktitle"><s></s>{this.tr("a_gds") + " (" + this.state.gdsdata.length + "/10)"}</div>
                    <AddGdsForm {...this.props} ref={this.saveFormRef} callTr={this.tr} callTipsTr={this.tips_tr} operatename={this.state.operatename}
                        onChangeState={this.onChangeState} gdsdata={this.state.gdsdata} handleChangeType={this.handleChangeType} systemId={this.state.systemId} systemPwd={this.state.systemPwd} systemType={this.state.systemType} systemTypeDisplay={this.state.systemTypeDisplay} handleGdsEdit={this.handleGdsEdit} disableAppend={this.state.disableAppend}
                        gdsvisible={this.state.gdsvisible} ctrlGdsOperations={this.ctrlGdsOperations}/>
                    <div className="gdslist">
                        <div>
                            <Button className="select-delete" type="primary" onClick={this.ctrlGdsOperations.bind(this, "show")} disabled={this.state.disabledbtn}>
                                {this.tr("a_23")}
                            </Button>
                            <Popconfirm placement="top" title={this.tr("a_promptdelete")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleDeleteMulti}>
                                <Button className="select-delete" type="primary" disabled={!hasSelected}>
                                    <i className={!hasSelected ? "select-delete-icon" : ""} />
                                    {this.tr("a_19067")}
                                </Button>
                            </Popconfirm>
                        </div>
                        <Table style={{"max-width":"1100px"}} rowSelection={rowSelection} dataSource={this.state.gdsdata} pagination={false} >
                            <Column title={this.tr("a_groupnum")} dataIndex="gdsorder" key="order" />
                            <Column title={this.tr("a_servicetype")} dataIndex="serviceType" key="type" />
                            <Column title={this.tr("a_7474")} dataIndex="gdsname" key="name" />
                            <Column title={this.tr("a_gdsnumber")} dataIndex="gdsnumber" key="number" />
                            <Column title={this.tr("a_dtmfcontent")} className="display-hidden" dataIndex="gdspwd" key="pwd" />
                            <Column title={this.tr("a_44")} key="operate" render={(text, record, index) => (
                                <span>
                                    <a className="edit-icon" onClick={this.handleEditItem.bind(this, text)}></a>
                                    <Popconfirm placement="top" title={this.tr("a_promptdelete")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleDeleteItem.bind(this, text, index)}>
                                        <a className="delete-icon" style={{marginLeft: "10px", "marginTop": "3px"}}></a>
                                    </Popconfirm>
                                </span>
                            )}/>
                        </Table>
                    </div>
                </div>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues: state.itemValues,
    mainHeight: state.mainHeight
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues: Actions.getItemValues,
      setItemValues: Actions.setItemValues,
      putNvrams: Actions.putNvrams,
      promptMsg:Actions.promptMsg
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Gds));
