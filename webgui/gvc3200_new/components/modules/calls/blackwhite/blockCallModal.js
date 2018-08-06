import React, { Component } from 'react'
import Enhance from "../../../mixins/Enhance";
import * as Actions from '../../../redux/actions/index';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form,Checkbox, Modal, Tooltip, Table, Icon, Row,Col, Input, Button, Select, Radio } from "antd"

class BlockCallModal extends Component {
    blockCallList = [];
    selectedBlockCallList = []
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            curBlockCallList:[]
        }
    }

    componentDidMount = () => {
        this.props.get_Blacklist("history",(result)=>{
            let interceptItemdata = this.props.interceptItemdata;
            let data = [];
            let len = interceptItemdata.length;
            let counter = 0;
            let numberArr = {};
            for (let i = len-1; i >= 0; i--) {
                let item = interceptItemdata[i];
                if(numberArr[item.number]){
                    continue;
                }
                numberArr[item.number] = item.number;
                data.push({
                    key: counter++,
                    name: item.note || item.number,
                    type: item.number,
                    number: item.number,
                    time: parseInt(item.time)
                });
            }
            this.blockCallList = [...data];
            this.setState({
                curBlockCallList: data
            });
        });
        this.props.get_Blacklist("members");
    }

    componentDidUpdate = () => {
        if (!this.props.displayBlockCallModal ) {
            if($("#blockCallSearch").val() || this.selectedBlockCallList.length>0){
                $("#blockCallSearch").val("");
                this.selectedBlockCallList = [];
                this.setState({
                    selectedRowKeys: [],
                    curBlockCallList:this.blockCallList
                });
            }
        }
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    _createName = (text, record, index) => {
        return <div><span className="blockcallname contactstext ellips"><i className={"block"}></i>{text}</span></div>;
    }
    _createItemType = (text, record, index) => {
        const callTr = this.props.callTr;
        let len = this.props.whitelistItemdata.length;
        for (let i = 0; i < len; i++) {
            if (text == this.props.whitelistItemdata[i].number) {
                return <span className="whitelist" style={{marginTop:'5px'}}>{callTr("a_whiteset")}</span>;
            }
        }
        len = this.props.blacklistItemdata.length;
        for (let i = 0; i < len; i++) {
            if (text == this.props.blacklistItemdata[i].number) {
                return <span className="blacklist" style={{marginTop:'5px'}}>{callTr("a_blackset")}</span>;
            }
        }
        return <span></span>
    }

    _createNumber = (text, record, index) => {
        return <div><span className="contactstext ellips" style={{marginTop:'10px'}}>{text}</span></div>;
    }


    _createTime = (text, record, index) => {
        var Timevalue = this.convertTime(text);
        return <span className="contactstext ellips" style={{marginTop:'10px'}}>{Timevalue}</span>;
    }

    handleChange = (e) => {
        var self = this;
        var searchkey = e.target.value.toLowerCase().trim();
        let data = [];
        if (searchkey == "") {
            data = [...this.blockCallList];
        } else {
            let len = this.blockCallList.length;
            for (let i = 0; i < len; i++) {
                let callItem = this.blockCallList[i];
                if (callItem.number.indexOf(searchkey) != -1 || callItem.name.toLowerCase().indexOf(searchkey) != -1) {
                    data.push(callItem);
                }
            }
        }
        let selectRows = [];
        let len = self.selectedBlockCallList.length;
        for(let i = 0; i < len;i++) {
            let dataLen = data.length;
            for (let j = 0; j < dataLen; j++) {
                if (self.selectedBlockCallList[i].number === data[j].number) {
                    selectRows.push(j);
                    break;
                }
            }
        }
        this.setState({
            curBlockCallList: data,
            selectedRowKeys:selectRows
        });

    }
    handleOk = () => {
        let self = this;
        let len = self.selectedBlockCallList.length;
        if (len == 0) {
            this.props.promptMsg('ERROR', "a_calliptchecked");
            return false;
        }
        var arrayNum = [];
        var arrayName = [];

        for (let i = 0; i < len; i++) {
            let name = self.selectedBlockCallList[i].name;
            let number = self.selectedBlockCallList[i].number;
            arrayNum = arrayNum.concat(number);
            arrayName = arrayName.concat(name);
        }
        let numbers = arrayNum.join(':::');
        let names = arrayName.join(':::');
        self.props.addNewWhiteMember(numbers, names, (result) => {
            self.props.get_Whitelist("members");
        });
        self.setState({selectedRowKeys: []});
        this.props.handleHideBlockCallModal();
    }

    handleCancel = () => {
        this.props.handleHideBlockCallModal();
    }

    onSelectItem = (record, selected, selectedRows) => {
        let self = this;
        if (selected) {
            self.selectedBlockCallList.push({name: record.name, number: record.number});
        } else {
            let len = self.selectedBlockCallList.length;
            for (let j = 0; j < self.selectedBlockCallList.length; j++) {
                if (self.selectedBlockCallList[j].number == record.number) {
                    self.selectedBlockCallList.splice(j, 1);
                    break;
                }
            }
        }
    }
    onSelectAllBlockCalls = (selected, selectedRows) => {
        let self = this;
        if (selected) {
            if (selectedRows.length == self.blockCallList.length) {
                self.selectedBlockCallList = [...self.blockCallList];
            } else {
                let len = selectedRows.length;
                for (let i = 0; i < len; i++) {
                    for (var j = 0; j < self.selectedBlockCallList.length; j++) {
                        if (self.selectedBlockCallList[j].number == selectedRows[i].number) {
                            break;
                        }
                    }
                    if (j == self.selectedBlockCallList.length) {
                        self.selectedBlockCallList.push(selectedRows[i]);
                    }
                }
            }
        } else {
            for (let i = self.state.curBlockCallList.length - 1; i >= 0; i--) {
                let selectedBlockCallListLen = self.selectedBlockCallList.length;
                for (var j = 0; j < selectedBlockCallListLen; j++) {
                    if (self.selectedBlockCallList[j].number == self.state.curBlockCallList[i].number) {
                        break;
                    }
                }
                if (j != self.selectedBlockCallList.length) {
                    self.selectedBlockCallList.splice(j, 1);
                }
            }
        }
    }

    render() {
        var showtips = "none";
        if (this.state.curBlockCallList.length == 0) {
            showtips = "block";
        } else {
            showtips = "none";
        }
        const interceptItemdata = this.props.interceptItemdata;
        const callTr = this.props.callTr;
        const columns = [
            {
                title: "", key: 'name', dataIndex: 'name', width: '25%',
                render: (text, record, index) => (
                    this._createName(text, record, index))
            },
            {
                title: callTr(""), key: 'type', dataIndex: 'type', width: '25%',
                render: (text, record, index) => (
                    this._createItemType(text, record, index))
            },
            {
                title: "", key: 'number', dataIndex: 'number', width: '25%',
                render: (text, record, index) => (
                    this._createNumber(text, record, index)
                )
            },
            {
                title: "", key: 'time', dataIndex: 'time', width: '25%',
                render: (text, record, index) => (
                    this._createTime(text, record, index))
            }
        ];
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelectItem,
            onSelectAll: this.onSelectAllBlockCalls
        }
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <Modal title={callTr('a_blockhistorycall')} onOk={this.handleOk} onCancel={this.handleCancel}
                   className='selectcall-modal blockCallModal' visible={this.props.displayBlockCallModal} okText={callTr("a_ok")}
                   cancelText={callTr("a_cancel")}>
                <div className='search_call'>
                    <Input prefix={<Icon type="search" style={{color: 'rgba(0,0,0,.25)'}}/>} id="blockCallSearch"
                           onChange={this.handleChange.bind(this)} placeholder={callTr("a_search")}></Input>
                </div>
                {/*<div className='CallDiv'>*/}
                    <Table
                        rowSelection={rowSelection}
                        rowKey=""
                        columns={columns}
                        pagination={false}
                        dataSource={this.state.curBlockCallList}
                        showHeader={true}
                    />
                    <div className = "nodatooltips" style={{display: showtips}}>
                        <div></div>
                        <p>{this.tr("no_data")}</p>
                    </div>
                {/*</div>*/}
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    interceptItemdata: state.interceptItemdata,
    whitelistItemdata: state.whitelistItemdata,
    blacklistItemdata: state.blacklistItemdata
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        get_Blacklist: Actions.get_Blacklist
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(BlockCallModal))
