import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm } from "antd";
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

class Call extends Component {
    dataList = [];
    selectedDataList = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            curDataList: []
        }
    }

    componentDidMount = () => {
        this.props.get_recordinglist();
    }

    componentWillReceiveProps = () => {
        this._createData();
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onSelectItem = (record, selected, selectedRows) => {
        let self = this;
        let name = record.row0.Name.toLowerCase();
        let id = record.row0.Id;
        if (selected) {
            self.selectedDataList.push({name: name, id: id});
        } else {
            for (let j = 0; j < self.selectedDataList.length; j++) {
                if (self.selectedDataList[j].id == id) {
                    self.selectedDataList.splice(j, 1);
                    break;
                }
            }
        }
    }

    onSelectAllRecords = (selected, selectedRows) => {
        let self = this;
        if (selected) {
            if (self.dataList.length == selectedRows.length) {
                self.selectedDataList = [];
                for(let i = 0; i< selectedRows.length; i++){
                    let item = selectedRows[i];
                    self.selectedDataList.push({name:item.row0.Name.toLowerCase(), id:item.row0.Id});
                }
            } else {
                for (let i = 0; i < selectedRows.length; i++) {
                    let item = selectedRows[i]
                    let name = item.row0.Name.toLowerCase();
                    let id = item.row0.Id;
                    for (var j = 0; j < self.selectedDataList.length; j++) {
                        if (self.selectedDataList[j].id === id && self.selectedDataList[j].name === name) {
                            break;
                        }
                    }
                    if (j == self.selectedDataList.length) {
                        self.selectedDataList.push({name: name, id: id});
                    }
                }
            }
        } else {
            for (let i = self.state.curDataList.length - 1; i >= 0; i--) {
                let index = null
                for (var j = 0; j < self.selectedDataList.length; j++) {
                    let name = self.state.curDataList[i].row0.Name.toLowerCase();
                    let id = self.state.curDataList[i].row0.Id
                    if (self.selectedDataList[j].id === id && self.selectedDataList[j].name === name) {
                        index = j
                        break;
                    }
                }
                if (j != self.selectedDataList.length) {
                    self.selectedDataList.splice(index, 1);
                }
            }
        }

    }


    handleOkDeleteMulti = () => {
        const {selectedRowKeys} = this.state;
        const recordinglist = this.props.recordinglist;
        var delteId = [];
        var pathArr = [];
        var urlparame = '';
        let hasLockDoc = false;
        let unLockedRowKeys = []
        for (var i = 0; i < selectedRowKeys.length; i++) {
            let id = recordinglist[selectedRowKeys[i]]['Id'];
            let dom = 'locktype' + id;
            let className = document.getElementById(dom).className;
            var lock = className.split(' ')[1].substring(8);
            if(lock !== '1') {
                delteId.push(id);
                pathArr.push(recordinglist[selectedRowKeys[i]]['Path'].replace(/ogg/g, "rgs").replace(/wav/g, "rgs").replace(/rgs/g, "*").replace(/,/g, " "));
                urlparame += "&id"+i+"="+recordinglist[selectedRowKeys[i]]['Id']+"&filename"+i+"="+encodeURIComponent(pathArr)+"&recordtype"+i+"=0";
                unLockedRowKeys.push(selectedRowKeys[i])
            } else {
                hasLockDoc = true;
            }
        }
        mType = "0";
        var requestDelete = "recording&region=maintenance&type=deleterecord"+urlparame+"&num="+selectedRowKeys.length;
        this.props.get_deleteRecord(requestDelete, (data) => {
            if (data.id == '') {
                this.props.promptMsg('ERROR',"a_del_failed");
            } else if (data.id === delteId.join(',')) {
                this.props.get_recordinglist( (result) => {
                    this.props.recordinglist = result;
                });
                if(hasLockDoc) {
                    this.props.promptMsg('SUCCESS',"a_delpart");
                } else {
                    this.props.promptMsg('SUCCESS',"a_del_ok");
                }
            } else {
                this.props.promptMsg('ERROR',"a_delerr");
            }
            var deltesucId = data.id.split(',');
            for (var i = 0; i < deltesucId.length; i++) {
                for (var j = recordinglist.length; j > 0 ; j--) {
                    if (deltesucId[i] == recordinglist[j]['Id']) {
                        recordinglist.splice(j,1);
                        break;
                    }
                }
            }
            var requesturi = "recordingnotify&region=maintenance&type=rename&id=" + data.id;
            this.props.get_recordingNotify(requesturi);
        });
        this.setState({selectedRowKeys: []});
    }

    handleChange = (e) => {
        var self = this;
        var searchkey = e.target.value.toLowerCase().trim();
        let data = [];
        let dataSource = self.dataList
        if (searchkey === "") {
            data = [...dataSource];
        } else {
            let len = dataSource.length;
            for (let i = 0; i < len; i++) {
                let item = dataSource[i];
                let name = item.row0.Name.toLowerCase();
                if (name.indexOf(searchkey) != -1) {
                    data.push(item);
                }
            }
        }
        let selectRows = [];
        for(let i = 0; i<self.selectedDataList.length;i++){
            for(let j=0;j<data.length;j++){
                let item = data[j];
                let name = item.row0.Name.toLowerCase();
                let id = item.row0.Id;
                if(self.selectedDataList[i].id === id && self.selectedDataList[i].name === name){
                    selectRows.push(j);
                    break;
                }
            }
        }
        this.setState({
            curDataList: data,
            selectedRowKeys:selectRows
        });
    }

    _createData = () => {
        let recordinglist = this.props.recordinglist;
        let data = [];
        for (let i = 0; i< recordinglist.length; i++) {
            data.push({
                key: i,
                row0: recordinglist[i],
                row1: recordinglist[i],
                row2: recordinglist[i].Time,
                row3: recordinglist[i]
            });
        }
        this.dataList = data;
        this.setState({
            curDataList: data
        });
        return data
    }

    render() {
        const callTr = this.props.callTr;
        const _createName = this.props._createName;
        const _createDuration = this.props._createDuration;
        const _createTime = this.props._createTime;
        const _createActions = this.props._createActions;
        let curDataList = this.state.curDataList;
        const columns = [{
            title: callTr("a_2040"),
            key: 'row0',
            dataIndex: 'row0',
            className: 'filename',
            width: '20%',
            render: (text, record, index) => (
                _createName(text, record, index)
            )
        }, {
            title: callTr("a_6289"),
            key: 'row1',
            dataIndex: 'row1',
            width: '40%',
            render: (text, record, index) => (
                _createDuration(text, record, index)
            )
        },{
            title: callTr("a_4304"),
            key: 'row2',
            dataIndex: 'row2',
            width: '20%',
            render: (text, record, index) => (
                _createTime(text, record, index)
            )
        },{
            title: callTr("a_operate"),
            key: 'row3',
            dataIndex: 'row3',
            width: '20%',
            render: (text, record, index) => (
                _createActions(text, record, index)
            )
        }];

        let data = curDataList ? curDataList : this._createData()
        var showtips = "none";
        if (data.length == 0) {
            showtips = "block";
        } else {
            showtips = "none";
        }

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelectItem,
            onSelectAll: this.onSelectAllRecords
        }
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div style={{margin:"0px 10px"}}>
                <div style={{margin:"4px 10px 10px 22px", height:'32px'}}>
                    <div style={{'float':'left'}}>
                        <Popconfirm placement="right" title={this.tr("a_deleteall")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleOkDeleteMulti}>
                            <Button className="select-delete" type="primary" disabled={!hasSelected}>
                                <i className={!hasSelected ? "select-delete-icon" : ""} />
                                {this.tr("a_19067")}
                            </Button>
                        </Popconfirm>
                    </div>
                    <div style={{'float':'right'}}>
                        <div className = 'search_div'>
                            <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} id="search" onChange={this.handleChange.bind(this)} placeholder = {callTr("a_2036")}></Input>
                        </div>
                    </div>
                </div>
                <div className = 'CallDiv'>
                    <Table
                        rowSelection={rowSelection}
                        rowKey=""
                        columns = { columns }
                        pagination={ false }
                        dataSource={ data }
                        showHeader={ true }
                    />
                    <div className = "nodatooltips" style={{display: showtips}}>
                        <div></div>
                        <p>{this.tr("no_data")}</p>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    recordinglist:state.recordinglist
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        get_recordinglist: Actions.get_recordinglist,
        get_deleteRecord: Actions.get_deleteRecord,
        get_recordingNotify: Actions.get_recordingNotify
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Call));
