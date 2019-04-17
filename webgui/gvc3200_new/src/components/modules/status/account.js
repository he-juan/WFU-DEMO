import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Table, Layout, Tabs } from 'antd';
const Content = Layout;
const TabPane = Tabs.TabPane;

function parseText(code) {
    var codetext;
    switch (code){
        case "1":
        case "2":
            codetext = 'a_1138';
            break;
        case "3":
        case "5":
            codetext = 'a_503';
            break;
        case "4":
            codetext = 'a_521';
            break;
        case "6":
            codetext = 'a_510';
            break;
        default:
            codetext = 'a_1139';
    }
    return codetext
}

class Account extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

 

    componentDidMount() {
        this.props.getAcctStatus();
    }

    render() {
        let accountStatus = this.props.acctStatus;
        if(JSON.stringify(accountStatus) == '{}') return null
        var accountItems = [];
        for(var item in accountStatus.headers){
          accountItems[item]=accountStatus.headers[item]
        }


        let account = this.tr("a_301");
        let number = this.tr("a_10006");
        let sipserver = this.tr("a_23536");
        let status = this.tr("a_10060");

        const columns = [{
            title: account,
            key: 'row0',
            dataIndex: 'row0',
            width: 150,
            render: (text, record, index) => {
                let status = record.status
                let spanclass = status == 1 || status == 2 ? "aRegister" : status == 7 ? "Registering" : ""
                return <span className={spanclass}><i className = "accountIcon"></i>{text}</span>
            },
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
            render: (text, record, index) => {
                return <span className={text}>{this.tr(text)}</span>;
            }
        }];
      
        let data = [];
        let account_3_status = accountItems['account_3_status']
        let account_4_status = accountItems['account_4_status']
        let account_0_status = accountItems['account_0_status']
        let account_3_server = accountItems['account_3_server'] || "_"
        let account_4_server = accountItems['account_4_server'] || "_"
        let account_0_server = accountItems['account_0_server'] || "_"
        let row0Name = accountItems["account_0_name"] || "SIP";
        let row1No = accountItems["account_0_no"] || "_";
        let row2Ser = account_3_status != '0' ? account_3_server :　account_4_status != 0 ? account_4_server : account_0_server
        let Status = account_3_status != '0' ? account_3_status :　account_4_status != 0 ? 　account_4_status : account_0_status
        let row3Text =  parseText(Status)
        data.push({key: 0, row0: row0Name, row1: row1No, row2: row2Ser, row3:row3Text, status : Status})

        data.push({
            key: 1,
            row0: "IPVideoTalk",
            row1: accountItems["account_1_no"] || "_",
            row2: accountItems["account_1_server"] || "_",
            row3: parseText(accountItems["account_1_status"]),
            status: accountItems["account_1_status"]
        });
        data.push({
            key: 2,
            row0: "BlueJeans",
            row1: accountItems["account_2_no"] || "_",
            row2: accountItems["account_2_server"] || "_",
            row3: parseText(accountItems["account_2_status"]),
            status: accountItems["account_2_status"]
        });
        data.push({
            key: 6,
            row0: "H.323",
            row1: accountItems["account_6_no"] || "_",
            row2: accountItems["account_6_server"] || "_",
            row3: parseText(accountItems["account_6_status"]),
            status: accountItems["account_6_status"]
        });


      return (
          <Content className="content-container">
              <div className="subpagetitle">{this.tr("a_4146")}</div>
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
