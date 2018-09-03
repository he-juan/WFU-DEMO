import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Table, Layout, Tabs } from 'antd';
const Content = Layout;
const TabPane = Tabs.TabPane;

class Account extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    view_status_code_to_text(code) {
        var codetext;
        switch (code){
            case "1":
            case "2":
                codetext = "a_register";
                return codetext;
            case "3":
            case "5":
                codetext = "a_dialing";
                return codetext;
            case "4":
                codetext = "a_ring";
                return codetext;
            case "6":
                codetext = "a_talking";
                return codetext;
            case "7":
                codetext = "a_registering";
                return codetext;
            case "0":
            default:
                codetext = "a_unregister";
                return codetext;
        }
    }

    componentDidMount() {
        this.props.getAcctStatus();
    }

    _createStatue = (text, record, index) => {
        let statue;
        statue = <span className = {text}>{this.tr(text)}</span>;
        return statue;
    }

    _createAccount = (text, record, index) => {
        let Account;
        Account = <span><i className = "accountIcon"></i>{text}</span>
        return Account;
    }

    render() {
        let accountStatus = this.props.acctStatus;
        var accountItems = [];
        for(var item in accountStatus.headers){
          accountItems[item]=accountStatus.headers[item]
        }

        for (let i = 0; i< 16; i++) {
            if ((accountItems["account_"+ `${i}`+"_status"] == "1") || (accountItems["account_"+ `${i}`+"_status"] == "2")) {
                   $(".accountTable .ant-table-tbody .ant-table-row:eq(" + i + ")").addClass("aRegister");
               }else if (accountItems["account_"+ `${i}`+"_status"] == "7"){
                   $(".accountTable .ant-table-tbody .ant-table-row:eq(" + i + ")").addClass("Registering");
               } else {
                   $(".accountTable .ant-table-tbody .ant-table-row:eq(" + i + ")").removeClass("aRegister");
               }
        }

        let account = this.tr("a_account");
        let number = this.tr("a_number");
        let sipserver = this.tr("a_sipserver");
        let status = this.tr("a_status");

        const columns = [{
            title: account,
            key: 'row0',
            dataIndex: 'row0',
            width: 150,
            render: (text, record, index) => (
                this._createAccount(text, record, index)
            ),
        }, {
            title: number,
            key: 'row1',
            dataIndex: 'row1',
            width: 150,
        }, {
            title: sipserver,
            key: 'row2',
            dataIndex: 'row2',
            width: 150,
        },{
            title: status,
            key: 'row3',
            dataIndex: 'row3',
            width: 150,
            render: (text, record, index) => (
                this._createStatue(text, record, index)
            )
      }];

      let accstatus = this.tr("a_account");
      const data = [];
      const codeArr = [];
      let accountItemsNum = this.props.maxAcctNum;
      for (let i = 0; i< accountItemsNum; i++) {
          var code = accountItems["account_"+ `${i}`+"_status"];
          codeArr[i] = this.view_status_code_to_text(code);
          data.push({
              key: i,
              row0: accstatus + ` ${i+1}`,
              row1: accountItems["account_"+ `${i}`+"_no"] || "_",
              row2: accountItems["account_"+ `${i}`+"_server"] || "_",
              row3: codeArr[i],
          });
      }
      if (accountItemsNum == 15) {
          var codeItem = accountItems["account_"+ `${15}`+"_status"];
          var codeArrItem = this.view_status_code_to_text(codeItem)
          data.push({
              key: 15,
              row0: "IPVideoTalk",
              row1: accountItems["account_"+ `${15}`+"_no"],
              row2: accountItems["account_"+ `${15}`+"_server"],
              row3: codeArrItem,
          })
      }

      return (
          <Content className="content-container">
              <div className="subpagetitle">{this.tr("status_acc")}</div>
                <div style={{"margin": "10px 16px 0 16px","borderRadius":"4px 4px 0px 0px","minHeight":this.props.mainHeight}} >
                    <Table className = "accountTable"
                      rowKey=""
                      columns={ columns }
                      pagination={ false }
                      dataSource={ data }
                      showHeader={ true }
                    />
                </div>
          </Content>
      )
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    acctStatus: state.acctStatus,
    mainHeight: state.mainHeight,
    maxAcctNum: state.maxAcctNum
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getAcctStatus:Actions.getAcctStatus
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Account));
