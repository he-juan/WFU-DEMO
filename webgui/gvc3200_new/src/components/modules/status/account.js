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
                codetext = "a_1138";
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
                codetext = "a_1139";
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
        let number = this.tr("a_10006");
        let sipserver = this.tr("a_23536");
        let status = this.tr("a_10060");

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

      const data = [];
      const codeArr = [];
        if(accountItems['account_3_status']!=0){
            data.push({
                key: 0,
                row0: accountItems["account_0_name"] || "SIP",
                row1: accountItems["account_0_no"] || "_",
                row2: accountItems["account_3_server"] || "_",
                row3: this.view_status_code_to_text(accountItems["account_3_status"]),
            });
        }else if(accountItems['account_4_status']!=0){
            data.push({
                key: 0,
                row0: accountItems["account_0_name"] || "SIP",
                row1: accountItems["account_0_no"] || "_",
                row2: accountItems["account_4_server"] || "_",
                row3: this.view_status_code_to_text(accountItems["account_4_status"]),
            });
        }else{
            data.push({
                key: 0,
                row0: accountItems["account_0_name"] || "SIP",
                row1: accountItems["account_0_no"] || "_",
                row2: accountItems["account_0_server"] || "_",
                row3: this.view_status_code_to_text(accountItems["account_0_status"]),
            });
        }
        data.push({
            key: 1,
            row0: "IPVideoTalk",
            row1: accountItems["account_1_no"] || "_",
            row2: accountItems["account_1_server"] || "_",
            row3: this.view_status_code_to_text(accountItems["account_1_status"]),
        });
        data.push({
            key: 2,
            row0: "BlueJeans",
            row1: accountItems["account_2_no"] || "_",
            row2: accountItems["account_2_server"] || "_",
            row3: this.view_status_code_to_text(accountItems["account_2_status"]),
        });
        data.push({
            key: 6,
            row0: "H.323",
            row1: accountItems["account_6_no"] || "_",
            row2: accountItems["account_6_server"] || "_",
            row3: this.view_status_code_to_text(accountItems["account_6_status"]),
        });


      return (
          <Content className="content-container">
              <div className="subpagetitle">{this.tr("a_4306")}</div>
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
