import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance";
import { promptMsg, getContacts, promptSpinMsg, getAcctStatus } from '../../../../redux/actions';
import { Modal, Select, Input, Checkbox } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const Option = Select.Option

class InviteMemberModal extends Component {
  constructor() {
    super();
    this.state = {
      activeAcc: '0',
      callType: '0',
      mediaType: '1',
      contactList: [],
      acctstatus: [],
      errmsg: '',
      isBjAccount: false,
      contactFilter: ''
    }
    this.modalStyle = {
      position: 'absolute',
      left: '0',
      top: '-10px',
      bottom: '0',
      right: '0',
      margin: 'auto',
      height: '700px',
      paddingBottom: '0',
    },
    this.iconType = {
      "1": "incomming",
      "2": "callout",
      "3": "miss"
    }
  }
  doRequest = (action, region, params) => {
    let uri = `/manager?action=${action}&region=${region}&time=${new Date().getTime()}`
    if (params) {
      uri += params
    }
    return new Promise((resolve, reject) => {
      $.ajax({
        url: uri,
        method: 'GET',
        success: (data) => {
          resolve(data);
        },
        error: (err) => {
          this.props.promptMsg("ERROR", "a_16418");
        }
      })
    })
  }
  componentDidMount() {
    this.props.getAcctStatus(this.getAcctStatusData.bind(this))
    this.getDefaultAcct();
  }
  componentWillUpdate(nextProps) {
    if (this.props.visible != nextProps.visible && nextProps.visible == true) {
      this.initModal();
    }
  }
  toogleAcc = (v) => {
    this.setState({ 
      activeAcc: v,
      isBjAccount: v == '2' ,
      contactFilter: ''
    })
  }
  initModal = () => {
    this.getDefaultAcct();
    if (this.state.contactList.length == 0) {
      this.props.promptSpinMsg('display-block', '');
      this.props.getContacts(this.getContactList.bind(this));
    }
  }
  getDefaultAcct = () => {
    this.doRequest('get', '', '&var-0000=22046').then(msg => {
      let data = this.res_parse_rawtext(msg);
      let acc = data['headers'][22046];
      this.setState({
        activeAcc: acc,
        isBjAccount: acc == '2'
      })
    })
  }
  getAcctStatusData = (acctstatus) => {
    let curAcct = [];
    const acctStatus = acctstatus.headers;
    let max = 4;
    for (let i = 0; i < max; i++) {
      if (i == 3) {
        curAcct.push(
          {
            "acctindex": i,
            "register": acctStatus[`account_${6}_status`],
            "activate": acctStatus[`account_${6}_activate`],
            "num": acctStatus[`account_${6}_name`],
            "name": "H.323"
          });
      } else {
        let accountname = acctStatus[`account_${i}_name`];
        if (i == 0) {
          if (acctStatus[`account_${i}_name`].length > 0) {
            accountname = acctStatus[`account_${i}_name`];
          } else if (acctStatus[`account_${i}_no`].length > 0) {
            accountname = acctStatus[`account_${i}_no`];
          } else {
            accountname = "SIP";
          }
        }
        curAcct.push(
          {
            "acctindex": i,
            "register": acctStatus[`account_${i}_status`],
            "activate": acctStatus[`account_${i}_activate`],
            "num": acctStatus[`account_${i}_no`],
            "name": accountname
          });
      }
    }
    this.setState({ acctstatus: curAcct });
  }
  getContactList = () => {
    this.doRequest('sqlitecontacts', 'apps', '&type=calllog&flag=2&logtype=0').then(data => {
      let list = this.props.msgsContacts.concat(JSON.parse(data).Data);
      this.setState({
        contactList: list
      });
      this.props.promptSpinMsg('display-hidden', '');
    })
  }
  selectContact = (item, i) => {
    if(item["Number"] == "anonymous") {
      this.showError("无法拨打匿名号码!");
      return false
    }
    let {maxlinecount, linestatus} = this.props;
    let { acctstatus, contactList} = this.state;
    let _contactList = this.state.contactList.slice();
    if(!_contactList[i].checked){
      let itemAcc = parseInt(item.AcctIndex);                   // 当前帐号
      if(itemAcc == 8) itemAcc = 3;
      if(acctstatus[itemAcc].activate == '0'){
        this.showError('帐号未激活!');
        return false;
      }
      let existIpvt = this.hasExistIpvt(linestatus);  // 线路中是否存在ipvt
      if((!existIpvt && itemAcc == 1) || itemAcc != 1){
        let allow = maxlinecount - linestatus.length;   // 非IPVT 最大允许个数 
        let checkedItem = contactList.filter(item => {
          return item.AcctIndex != '1' && item.checked
        });
        if(checkedItem.length >= allow) {
          return this.showError('成员个数达到最大!');
        }
      };
      _contactList[i].checked = true;
      _contactList.unshift(_contactList.splice(i,1)[0]);
    } else {
      delete _contactList[i].checked
    }
    this.setState({
      contactList: _contactList
    });
  }
  showError = (msg) => {
    this.setState({
      errmsg: msg
    })
    let timer = setTimeout(() => {
      clearTimeout(timer);
      this.setState({
        errmsg: ''
      })
    },1000);
  }
  hasExistIpvt = (linestatus) => {
    let existIpvt = false;     
    for (let i = 0; i < linestatus.length; i++) {
      if(linestatus[i].acct == 1) {
        existIpvt = true;
        break;
      }
    }
    return existIpvt;
  }
  handleFilter = (e) => {
    let v = e.target.value;
    let reg = new RegExp("^[0-9]|/.*$");
    this.setState({
      contactFilter: v
    });
  }
  addNewContacts = (v) => {
    const {maxlinecount, linestatus} = this.props;
    const itemAcc = parseInt(this.state.activeAcc);
    let newContact = {
      AcctIndex: this.state.activeAcc,
      Name: v,
      ContactName: v,
      Number: v,
      checked: true
    }

    let _contactList = this.state.contactList.slice();
    let existIpvt = this.hasExistIpvt(linestatus);  // 线路中是否存在ipvt
    if((!existIpvt && itemAcc == 1) || itemAcc != 1){
      let allow = maxlinecount - linestatus.length;   // 非IPVT 最大允许个数 
      let checkedItem = contactList.filter(item => {
        return item.AcctIndex != '1' && item.checked
      });
      if(checkedItem.length >= allow) {
        this.setState({
          contactFilter: ''
        })
        return this.showError('成员个数达到最大!');
      }
    };
    _contactList.unshift(newContact)
    this.setState({
      contactList: _contactList,
      contactFilter: ''
    })
  }

  handleSubmit = () => {
    /**
     * 提交参数: numbers, accounts, confid, callmode, isvideo, isquickstart, pingcode, isdialplan, confname
     */
    let _numbers_, _accounts_, _confid, _callmode_, _isvideo_, _isquickstart_, _pingcode_, _isdialplan_, _confname_;
    let {contactFilter} = this.state
    let checkedContacts = this.state.contactList.filter(item => item.checked);
    // 将输入框中的值插入数组
    if(contactFilter.length > 0) {
      checkedContacts.unshift({
        AcctIndex: this.state.activeAcc,
        Name: contactFilter,
        ContactName: contactFilter,
        Number: contactFilter,
        checked: true
      })
    }
    _numbers_ = checkedContacts.map(item => item.Number).join(':::');
    _accounts_ = checkedContacts.map(item => item.AcctIndex).join(':::');
    console.log(_numbers_, _accounts_)


    
  }
  render() {
    const { visible, onHide } = this.props;
    const { activeAcc, callType, mediaType, contactList, acctstatus, errmsg, isBjAccount, contactFilter } = this.state;
    if (contactList.length == 0) {
      return null
    }
    return (
      <Modal
        width="900"
        style={this.modalStyle}
        className="invite-modal"
        visible={visible}
        onCancel={onHide}
        title={"添加成员"}
        okText="添加"
        onOk={() => this.handleSubmit()}
      >
        <div style={{ height: '612px' }}>
          <div className="invite-filter">
            <Select value={activeAcc} style={{ width: 200 }} onSelect={this.toogleAcc}>
              {
                acctstatus.map((item) => {
                  return item.activate == '1' ? <Option value={item.name != 'H.323' ? String(item.acctindex) : '8'} key={item.acctindex}>{item.name}</Option> : null
                })
              }
            </Select>
            &nbsp;&nbsp;&nbsp;
            <Select value={callType} style={{ width: 120 }} onSelect={(v) => this.setState({ callType: v })}>
              <Option value="0" key="0">呼叫</Option>
              {/* <Option value="1" key="1">Paging</Option> */}
              <Option value="2" key="2">IP呼叫</Option>
            </Select>
            &nbsp;&nbsp;&nbsp;
            <Select value={mediaType} style={{ width: 120 }} onSelect={(v) => this.setState({ mediaType: v })}>
              <Option value="1" key="1">视频</Option>
              <Option value="0" key="0">音频</Option>
            </Select>
          </div>
          <br />
          <div className="invite-input">
            {
              isBjAccount ? 
              <div >
                <Input placeholder="输入号码" value={contactFilter} onChange={(e) => this.handleFilter(e)} style={{width: '220px', marginRight: '20px'}}/> 
                <Input placeholder="密码" style={{width: '220px'}}/>
              </div> 
              : < Input placeholder="输入号码" value={contactFilter} onChange={(e) => this.handleFilter(e)} style={{width: '460px'}} />
            }
          </div>
          <div className="error-tips">
            {errmsg}
          </div>
          <ul className="invite-list">
            {
              contactList.map((item, i) => {
                let Name = (item.ContactName && item.ContactName != '') ? item.ContactName : item.Name;
                let IconType = item.Type ? this.iconType[item.Type] : 'contact';
                if(contactFilter.length > 0) {
                  if(Name.indexOf(contactFilter) == -1 && item.Number.indexOf(contactFilter) == -1) {
                    return null;
                  }
                }
                return (
                  <li>
                    <Checkbox checked={item.checked} onChange={() => this.selectContact(item, i)}/> <span className={`${IconType}-icon`}></span> <strong>{Name}</strong> <em>{item.Number}</em>
                  </li>
                )
              })
            }
            {
              contactFilter.length > 0 && /^[0-9].*$/ig.test(contactFilter) ? 
              <li>
                <Checkbox onChange={() => this.addNewContacts(contactFilter)} /> <span className="contact-icon"></span> <strong>{contactFilter}</strong> <em>{contactFilter}</em>
              </li> :
              null
            }
          </ul>
        </div>
      </Modal>
    )
  }
}




const mapState = (state) => {
  return {
    msgsContacts: state.msgsContacts,
    maxlinecount: state.maxlinecount, // 最大连接数
    linesinfo: state.linesinfo // 当前连接状态
  }
}
const mapDispatch = (dispatch) => {
  let actions = {
    promptMsg: promptMsg,
    getContacts: getContacts,
    promptSpinMsg: promptSpinMsg,
    getAcctStatus: getAcctStatus
  }
  return bindActionCreators(actions, dispatch)
}
export default connect(mapState, mapDispatch)(Enhance(InviteMemberModal))

