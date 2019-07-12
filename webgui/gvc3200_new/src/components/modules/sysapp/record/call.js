import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm, Select } from "antd";
import * as Actions from '../../../redux/actions/index';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
let rowkeys =[]

class Call extends Component {
    dataList = [];
    selectedDataList = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            curDataList: [],
            pathlist: [],
            displaySetModal: false,
            curpath: '',
            tempRecordPath: '',
            curPage: 1,
            selectedRows:[],
            pagesize: 15
        }
    }

    componentDidMount = () => {
        this._createData()
        this.updatePath()
        if(!this.props.recordinglist.length) {
            this.props.get_recordinglist();
            let self = this
            setTimeout(function () {
                self._createData();
            },500)
        }
    }

    updatePath = () => {
        this.props.getRecordingPath((res)=> {
            // res = {"curpath": "/mnt/usbhost0/8_1",
            //     "list": [
            //     "/mnt/usbhost0/8_1",
            //     "/mnt/usbhost1",
            //     "/mnt/usbhost2",
            //     "/mnt/extsd"
            // ]}
            this.setState({curpath:res.curpath,pathlist:res.list})
        })
    }

    componentWillReceiveProps = () => {
        let self = this
        setTimeout(function () {
            self._createData();
        },500)
    }

    onSelectChange = (selectedRowKeys,selectedRows) => {
        let page = this.state.curPage
        this.setState({selectedRowKeys,selectedRows});
        if(page!=1) {
            let arr = []
            let data = this.getCurSelectedRows(page)
            for (let i = 0; i < selectedRowKeys.length; i++) {
                arr.push(data[selectedRowKeys[i]])
            }
            this.setState({selectedRows:arr});
        }
        rowkeys = selectedRowKeys
    }

    onSelectItem = (record, selected, selectedRows) => {
        let selectedRowKeys = rowkeys
        let page = this.state.curPage
        if(page!=1) {
            selectedRows = []
            let data = this.getCurSelectedRows(page)
            for (let i = 0; i < selectedRowKeys.length; i++) {
                selectedRows.push(data[selectedRowKeys[i]])
            }
            this.setState({selectedRows:selectedRows});
        }
    }

    onSelectAllRecords = (selected, selectedRows) => {
        let page = this.state.curPage
        if(page != 1) {
            selectedRows = this.getCurSelectedRows(page)
        } else {
            this.setState({selectedRows:selectedRows})
        }
    }

    getCurSelectedRows = (page) =>{
        if(page == 1) {
            return
        }
        let selectedRows = []
        let pagesize = this.state.pagesize
        let begin = pagesize * (page-1)
        let i = 0
        while (i<pagesize) {
            selectedRows.push(this.state.curDataList[begin+i])
            i+=1
        }
        this.setState({selectedRows:selectedRows})
        return selectedRows
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
        let selectedRecords = this.state.selectedRows
        let task = []
        let hasLockDoc = false;
        for (var i = 0; i < selectedRecords.length; i++) {
            let item = selectedRecords[i].row0
            let id = item.Id;
            let lock = item.Lock
            if(lock !== '1') {
                // let path = selectedRecords[i].path.replace(/ogg/g, "rgs").replace(/wav/g, "rgs").replace(/rgs/g, "*").replace(/,/g, " ")
                let path = item.Path
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
                    self._createData()
                });

                for (let i = 0; result[i] != undefined ; i++) {
                    if(result[i].res == 'success') {
                        successNum = successNum + 1
                    }
                }
                self.props.updateData()

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
        self.setState({selectedRowKeys: [],selectedRows:[]});
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
        let selectedDataList = this.state.selectedRows
        for(let i = 0; i<selectedDataList.length;i++){
            for(let j=0;j<data.length;j++){
                let id = data[j].row0.Id;
                let id2 = selectedDataList[i].row0.Id
                if(id2 === id){
                    selectRows.push(j);
                    break;
                }
            }
        }
        if(selectRows.length > 0) {
            this.setState({
                selectedRowKeys:selectRows
            });
        }

        this.setState({
            curDataList: data
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

    showSetRecordPath = () => {
        this.setState({displaySetModal:true})
    }

    handleSetModalCancel =() => {
        this.setState({displaySetModal:false,tempRecordPath:''})
    }

    changeTempPath = (value) => {
        this.setState({tempRecordPath:value})
    }

    setRecordPath = () => {
        let v = this.state.tempRecordPath
        if(v) {
            this.props.setRecordingPath(v,()=>{
                this.updatePath()
            })
        }
        this.handleSetModalCancel()
    }

    changePage = (pageNumber) => {
        this.setState({
            curPage: pageNumber,
            selectedRows: [],
            selectedRowKeys:[]
        });
    }

    onShowSizeChange = (current, size) => {
        this.setState({
            curPage:current,
            pagesize:size
        })
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

        let {curpath, pathlist, tempRecordPath} = this.state
        let children = []
        let sellect
        if(pathlist.length > 0) {
            let isExist = pathlist.find(item => {return item == curpath})
            if(!isExist) {
                curpath = pathlist[0]
            }
            let pathArr = ['a_usbdisk0','a_usbdisk1','a_usbdisk2','a_extsd']
            let usb0num = 0,usb1num = 0,usb2num = 0,sdnum = 0
            let index = 0
            pathlist.forEach((item) => {
                let extStr = ''
                if(item.indexOf('usbhost0')!=-1) {
                    index = 0
                    if(usb0num) {
                        extStr = '_' + usb0num
                    }
                    usb0num += 1
                } else if (item.indexOf('usbhost1')!=-1) {
                    index = 1
                    if(usb1num) {
                        extStr = '_' + usb1num
                    }
                    usb1num += 1
                } else if (item.indexOf('usbhost2')!=-1) {
                    index = 2
                    if(usb2num) {
                        extStr = '_' + usb2num
                    }
                    usb2num += 1
                } else if (item.indexOf('extsd')!=-1) {
                    index = 3
                    if(sdnum) {
                        extStr = '_' + sdnum
                    }
                    sdnum += 1
                }
                children.push(<Option value = {item} key={item}>{callTr(pathArr[index]) + extStr}</Option>)
            })
            if(tempRecordPath){
                curpath = tempRecordPath
            }
            sellect =
                <Select value={curpath} style={{width:'300'}} onChange={this.changeTempPath}>
                    {children}
                </Select>
        } else {
            sellect =
                <Select placeholder = {callTr("a_norecordpath")} disabled={true} style={{width:'300'}}>
                    {children}
                </Select>
        }
        let pageobj = false
        if(data.length>15) {
            pageobj = {
                pageSize: this.state.pagesize,
                onChange:this.changePage,
                total: data.length,
                showTotal: total => callTr('a_total') + ": " + total,
                showSizeChanger:true,
                pageSizeOptions:["15","30","45","100"],
                onShowSizeChange:this.onShowSizeChange
            }
        }

        return (
            <div style={{margin:"0px 10px"}}>
                <div style={{margin:"4px 10px 10px 22px", height:'32px'}}>
                    <div style={{'float':'left'}}>
                        <Popconfirm placement="right" title={this.tr("a_delRecords")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleOkDeleteMulti}>
                            <Button className="select-delete" type="primary" disabled={!hasSelected}>
                                <i className={!hasSelected ? "select-delete-icon" : ""} />
                                {this.tr("a_19067")}
                            </Button>
                        </Popconfirm>
                        <Button className="select-delete" type="primary" disabled={false} onClick={this.showSetRecordPath} style={{marginLeft:10}}>
                            {this.tr("a_319")}
                        </Button>
                        <Modal visible={this.state.displaySetModal} title={this.tr("a_recodrPath")} className="confirm-modal recordsetmodal"
                            okText={this.tr("a_2")} cancelText={this.tr("a_3")} onOk={this.setRecordPath} onCancel={this.handleSetModalCancel}>
                            <div className="confirm-content">{sellect}</div>
                        </Modal>
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
                        pagination = { pageobj }
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
