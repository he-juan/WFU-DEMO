import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm  } from "antd";
import * as Actions from '../../../redux/actions/index';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
var mDateObj = new Date();
var mUse24Hour = 1;
var mEitdId;
var mSpChar = ["\\",":","*","?","<",">","|","\""];
var mOpid;
var mType;
var path;

class Normal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: []
        }
    }

    componentDidMount = () => {
        this.props.get_norrecordinglist();
    }

    onSelectChange = (selectedRowKeys) => {
        if(selectedRowKeys.length >0) {
            let trs = document.querySelectorAll('.NormalDiv table tbody tr');
            let trLen = trs.length;
            for(let i= trLen-1; i >= 0; i--) {
                if(trs[i].style.display == 'none') {
                    selectedRowKeys.splice(i,1)
                }
            }
        }
        this.setState({selectedRowKeys});
    }

    handleOkDeleteMultiNor = () => {
        const {selectedRowKeys} = this.state;
        const norrecordinglist = this.props.norrecordinglist;
        var delteId = [];
        var pathArr = [];
        var urlparame = '';
        for (var i = 0; i < selectedRowKeys.length; i++) {
            delteId.push(norrecordinglist[selectedRowKeys[i]]['Id']);
            pathArr.push(norrecordinglist[selectedRowKeys[i]]['Path'].replace(/ogg/g, "rgs").replace(/wav/g, "rgs").replace(/rgs/g, "*").replace(/,/g, " "));
            urlparame += "&id"+i+"="+norrecordinglist[selectedRowKeys[i]]['Id']+"&filename"+i+"="+encodeURIComponent(pathArr)+"&recordtype"+i+"=2";
        }
        mType = "2";
        var requestDelete = "recording&region=maintenance&type=deleterecord"+urlparame+"&num="+selectedRowKeys.length;
        this.props.get_deleteRecord(mType,requestDelete, delteId);
        this.setState({selectedRowKeys: []});
    }

    handleChangeNor = (e) => {
        const norrecordinglist = this.props.norrecordinglist;
        var self = this;
        var searchCount = 0;
        var searchkey = e.target.value.toLowerCase();
        let trs = document.querySelectorAll(".NormalDiv table tbody tr");
        if (searchkey == ""){
            for (var i = 0; i < trs.length; i++) {
                trs[i].style.display = "table-row";
            }
        } else {
            for (var i = 0; i < norrecordinglist.length; i++) {
                if (norrecordinglist[i]['Name'].toLowerCase().indexOf(searchkey) == -1) {
                    trs[i].style.display = "none";
                    self.onSelectChange([]);
                } else {
                    trs[i].style.display = "table-row";
                }
            }
        }
    }

    render() {
        let norrecordinglist = this.props.norrecordinglist;
        const _createDuration = this.props._createDuration;
        const _createTime = this.props._createTime;
        const _createActions = this.props._createActions;
        const callTr = this.props.callTr;
        const columnsNor = [{
            title: callTr("a_2040"),
            key: 'row0',
            dataIndex: 'row0',
            className: 'filename'
        }, {
            title: callTr("a_6289"),
            key: 'row1',
            dataIndex: 'row1',
            render: (text, record, index) => (
                _createDuration(text, record, index)
            )
        },{
            title: callTr("a_4304"),
            key: 'row2',
            dataIndex: 'row2',
            render: (text, record, index) => (
                _createTime(text, record, index)
            )
        },{
            title: callTr("a_44"),
            key: 'row3',
            dataIndex: 'row3',
            render: (text, record, index) => (
                _createActions(text, record, index)
            )
        }];

        let dataNor = [];
        const TimeArr = [];
        for (let i = 0; i< norrecordinglist.length; i++) {
            dataNor.push({
                key: i,
                row0: norrecordinglist[i].Name,
                row1: norrecordinglist[i],
                row2: norrecordinglist[i].Time,
                row3: norrecordinglist[i]
            });
        }

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <div style = {{margin:"20px 50px 20px 20px"}}>
                <div style={{margin:"12px 10px", height:'32px','maxWidth':'1100px'}}>
                    <div style={{'float':'left'}}>
                        <Popconfirm placement="right" title={this.tr("a_deleteall")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleOkDeleteMultiNor}>
                            <Button className="select-delete" type="primary" disabled={!hasSelected}>
                                <i className={!hasSelected ? "select-delete-icon" : ""} />
                                {this.tr("a_19067")}
                            </Button>
                        </Popconfirm>
                    </div>
                    <div style={{'float':'right'}}>
                        <div className = 'search_div'>
                            <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.handleChangeNor.bind(this)} placeholder = {callTr("a_2036")}></Input>
                        </div>
                    </div>
                </div>
                <div className = 'NormalDiv' style={{margin:"12px 10px"}}>
                    <Table
                        style={{"max-width":"1100px"}}
                        rowSelection={rowSelection}
                        rowKey=""
                        columns = { columnsNor }
                        pagination={ false }
                        dataSource={ dataNor }
                        showHeader={ true }
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    norrecordinglist:state.norrecordinglist
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        get_norrecordinglist: Actions.get_norrecordinglist,
        get_deleteRecord: Actions.get_deleteRecord
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Normal));
