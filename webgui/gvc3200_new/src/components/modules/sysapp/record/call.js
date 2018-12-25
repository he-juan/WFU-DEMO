import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm } from "antd";
import * as Actions from '../../../redux/actions/index';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

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
        this._createData()
        if(!this.props.recordinglist.length) {
            this.props.get_recordinglist();
            let self = this
            setTimeout(function () {
                self._createData();
            },500)
        }
    }

    componentWillReceiveProps = () => {
        let self = this
        setTimeout(function () {
            self._createData();
        },500)
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onSelectItem = (record, selected, selectedRows) => {
        record = record.row0
        let name = this.props.getRecordNameAndPath(record.Path).name.toLowerCase()
        let id = record.Id;
        if (selected) {
            this.selectedDataList.push({name: name, id: id,path: record.Path});
        } else {
            for (let j = 0; j < this.selectedDataList.length; j++) {
                if (this.selectedDataList[j].id == id) {
                    this.selectedDataList.splice(j, 1);
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
                    let item = selectedRows[i].row0;
                    let name = this.props.getRecordNameAndPath(item.Path).name.toLowerCase()
                    self.selectedDataList.push({name:name, id:item.Id, path: item.Path});
                }
            } else {
                for (let i = 0; i < selectedRows.length; i++) {
                    let item = selectedRows[i].row0
                    let name = this.props.getRecordNameAndPath(item.Path).name.toLowerCase()
                    let id = item.Id;
                    for (var j = 0; j < self.selectedDataList.length; j++) {
                        if (self.selectedDataList[j].id === id && self.selectedDataList[j].name === name) {
                            break;
                        }
                    }
                    if (j == self.selectedDataList.length) {
                        self.selectedDataList.push({name: name, id: id, path:item.Path});
                    }
                }
            }
        } else {
            for (let i = self.state.curDataList.length - 1; i >= 0; i--) {
                let index = null
                for (var j = 0; j < self.selectedDataList.length; j++) {
                    let item = self.state.curDataList[i].row0
                    let name = this.props.getRecordNameAndPath(item.Path).name.toLowerCase();
                    let id = item.Id
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

    delTask = (id,path) => {
        let self = this
        return new Promise(function(resolve, reject) {
            var requestDelete = "recording&region=maintenance&type=deleterecord&id=" + id + "&filename=" + encodeURIComponent(path);
            self.props.get_deleteRecord(requestDelete, (data) => {
                if (data.Id && data.Id == id) {
                    resolve({res:'success',id:id})
                } else {
                    reject({res:'error'})
                }
            })
        })
    }


    handleOkDeleteMulti = () => {
        const recordinglist = this.props.recordinglist;
        let selectedRecords = this.selectedDataList
        let task = []
        let hasLockDoc = false;
        for (var i = 0; i < selectedRecords.length; i++) {
            let id = selectedRecords[i].id;
            let dom = 'locktype' + id;
            let className = document.getElementById(dom).className;
            var lock = className.split('locktype')[1]
            if(lock !== '1') {
                let path = selectedRecords[i].path.replace(/ogg/g, "rgs").replace(/wav/g, "rgs").replace(/rgs/g, "*").replace(/,/g, " ")
                task.push(this.delTask(id,path))
            } else {
                hasLockDoc = true;
            }
        }
        let self = this
        if(task.length >0) {
            Promise.all(task).then(function (result) {
                let successNum = 0
                self.props.get_recordinglist( (result) => {
                    self.props.recordinglist = result;
                    self._createData()
                });
                for (let i = 0; result[i] != undefined ; i++) {
                    if(result[i].res == 'success') {
                        successNum = successNum + 1
                        let id = result[i].id
                        var recordinglist = self.props.recordinglist;
                        for (var j = recordinglist.length; j > 0 ; j--) {
                            if (id == recordinglist[j-1]['Id']) {
                                recordinglist.splice(j-1,1);
                                break;
                            }
                        }
                    }
                }
                if(successNum == task.length ) {
                    if(hasLockDoc) {
                        self.props.promptMsg('SUCCESS',"a_16428");
                    } else {
                        self.props.promptMsg('SUCCESS',"a_57");
                    }
                } else if (successNum < task.length) {
                    self.props.promptMsg('SUCCESS',"a_20157");
                }
            })
        } else {
            this.props.promptMsg('ERROR',"a_6162");
        }
        self.setState({selectedRowKeys: []});
        self.selectedRecords = []
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
                let item = dataSource[i].row0;
                let name = this.props.getRecordNameAndPath(item.Path).name.toLowerCase();
                if (name.indexOf(searchkey) != -1) {
                    data.push(dataSource[i]);
                }
            }
        }
        let selectRows = [];
        for(let i = 0; i<self.selectedDataList.length;i++){
            for(let j=0;j<data.length;j++){
                let item = data[j].row0;
                let name = this.props.getRecordNameAndPath(item.Path).name.toLowerCase();
                let id = item.Id;
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
        if(recordinglist.length == 0) {
            return data
        }
        for (let i = 0; i< recordinglist.length; i++) {
            data.push({
                key: i,
                row0: recordinglist[i],
                row1: recordinglist[i].Size,
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
        const _createTime = this.props._createTime;
        const _createActions = this.props._createActions;
        const columns = [{
            title: callTr("a_2040"),
            key: 'row0',
            dataIndex: 'row0',
            className: 'filename',
            width: '40%',
            render: (text, record, index) => (
                _createName(text, record, index)
            )
        }, {
            title: callTr("a_2005"),
            key: 'row1',
            dataIndex: 'row1',
            width: '20%'
        },{
            title: callTr("a_12225"),
            key: 'row2',
            dataIndex: 'row2',
            width: '20%',
            render: (text, record, index) => (
                _createTime(text, record, index)
            )
        },{
            title: callTr("a_44"),
            key: 'row3',
            dataIndex: 'row3',
            width: '20%',
            render: (text, record, index) => (
                _createActions(text, record, index)
            )
        }];
        let data = this.state.curDataList;
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
                        <Popconfirm placement="right" title={this.tr("a_6288")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleOkDeleteMulti}>
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
                <div className = 'CallDiv recordList'>
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
                        <p>{this.tr("a_10082")}</p>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    recordinglist:state.videorecordinglist
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        get_recordinglist: Actions.getVideoRecording,
        get_deleteRecord: Actions.get_deleteRecord,
        get_recordingNotify: Actions.get_recordingNotify
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Call));
