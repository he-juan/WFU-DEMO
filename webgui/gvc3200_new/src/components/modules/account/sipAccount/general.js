import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance";
import { FormattedHTMLMessage } from 'react-intl'
import { Form, Layout, Input, Icon, Tooltip, Checkbox, Select, Button } from "antd";
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items = new Array;
const nvram = {
    'accountactive' : ["271", "401", "501", "601", "1701", "1801","50601","50701","50801","50901","51001","51101","51201","51301","51401","51501"],
    'accountname' : ["270", "417", "517", "617", "1717", "1817","50617","50717","50817","50917","51017","51117","51217","51317","51417","51517"],
    'sipserver' : ["47", "402", "502", "602", "1702", "1802","50602","50702","50802","50902","51002","51102","51202","51302","51402","51502"],
    'slavesipserver2': ["50602","51102"],
    'slavesipserver3': ["50702","51202"],
    'slavesipserver4': ["50802","51302"],
    'slavesipserver5': ["50902","51402"],
    'slavesipserver6': ["51002","51502"],
    'userid' : ["35", "404", "504", "604", "1704", "1804","50604","50704","50804","50904","51004","51104","51204","51304","51404","51504"],
    'authid' : ["36", "405", "505", "605", "1705", "1805","50605","50705","50805","50905","51005","51105","51205","51305","51405","51505"],
    'authpwd' : ["34", "406", "506", "606", "1706", "1806","50606","50706","50806","50906","51006","51106","51206","51306","51406","51506"],
    'name' : ["3", "407", "507", "607", "1707", "1807","50607","50707","50807","50907","51007","51107","51207","51307","51407","51507"],
    'nameonly' : ["2380", "2480", "2580", "2680", "2780", "2880","51680","51780","51880","51980","52080","52180","52280","52380","52480","52580"],
    'teluri' : ["63", "409", "509", "609", "1709", "1809","50609","50709","50809","50909","51009","51109","51209","51309","51409","51509"],
    'vmuserid' : ["33","426","526","626","1726","1826","50626","50726","50826","50926","51026","51126","51226","51326","51426","51526"],
    'outbp' : ["48", "403", "503", "603", "1703", "1803","50603","50703","50803","50903","51003","51103","51203","51303","51403","51503"],
    'secoutbp' : ["2333", "2433", "2533", "2633", "2733", "2833","51633","51733","51833","51933","52033","52133","52233","52333","52433","52533"],
    'dnsfailmode' : ["26040", "26140", "26240", "26340", "26440", "26540","52640","52740","52840","52940","53040","53140","53240","53340","53440","53540"],
    'usednssrv' : ["103", "408", "508", "608", "1708", "1808","50608","50708","50808","50908","51008","51108","51208","51308","51408","51508"],
    'natstun' : ["52", "414", "514", "614", "1714", "1814","50614","50714","50814","50914","51014","51114","51214","51314","51414","51514"],
    'proxy' : ["197", "418", "518", "618", "1718", "1818","50618","50718","50818","50918","51018","51118","51218","51318","51418","51518"]
};

class GeneralForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addSipServer:"",
            pwdstatus:Array(16).fill('password'),
            slaveSipval: [],
        }
    }

    handlePvalue = (activeAccount) => {
         let curAccount = activeAccount ? activeAccount : this.props.curAccount;
         req_items = [];
         req_items.push(
             this.getReqItem("accountactive", nvram["accountactive"][curAccount], ""),
             this.getReqItem("accountname"+curAccount, nvram["accountname"][curAccount], ""),
             this.getReqItem("sipserver"+curAccount, nvram["sipserver"][curAccount], ""),
             this.getReqItem("userid"+curAccount, nvram["userid"][curAccount], ""),
             this.getReqItem("authid"+curAccount, nvram["authid"][curAccount], ""),
             //this.getReqItem("authpwd"+curAccount, nvram["authpwd"][curAccount], ""),
             this.getReqItem("name"+curAccount, nvram["name"][curAccount], ""),
             this.getReqItem("nameonly", nvram["nameonly"][curAccount], ""),
             this.getReqItem("teluri", nvram["teluri"][curAccount], ""),
             this.getReqItem("vmuserid"+curAccount, nvram["vmuserid"][curAccount], ""),
             this.getReqItem("outbp"+curAccount, nvram["outbp"][curAccount], ""),
             this.getReqItem("secoutbp"+curAccount, nvram["secoutbp"][curAccount], ""),
             this.getReqItem("dnsfailmode", nvram["dnsfailmode"][curAccount], ""),
             this.getReqItem("usednssrv", nvram["usednssrv"][curAccount], ""),
             this.getReqItem("natstun", nvram["natstun"][curAccount], ""),
             this.getReqItem("proxy"+curAccount, nvram["proxy"][curAccount], ""),
             this.getReqItem("slavesipserver"+curAccount+"2", nvram["slavesipserver2"][curAccount], ""),
             this.getReqItem("slavesipserver"+curAccount+"3", nvram["slavesipserver3"][curAccount], ""),
             this.getReqItem("slavesipserver"+curAccount+"4", nvram["slavesipserver4"][curAccount], ""),
             this.getReqItem("slavesipserver"+curAccount+"5", nvram["slavesipserver5"][curAccount], "")
         );

        if(!this.isWP8xx()) {
            req_items.splice(req_items.length-4,req_items.length-1)
        }
         return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            this.setSlaveSip(values);
        });
    }

    componentWillUpdate = () => {
        let selP = document.querySelectorAll("#sipserverbox>p.select-p")
        let spanChecked = document.querySelectorAll("#sipserverbox>p.select-p span.ant-checkbox-checked")
        let inputs = document.querySelectorAll("#sipserverbox>p.select-p input")
        for(let i = 0,len=selP.length;i<len;i++){
            selP[i].className = ''
            spanChecked[i].className = 'ant-checkbox'
            inputs[i].checked = false
        }
    }

    setSlaveSip = (values) => {
        let curAccount = this.props.curAccount;
        let slave2 = values[`slavesipserver${curAccount}2`]
        let slave3 = values[`slavesipserver${curAccount}3`]
        let slave4 = values[`slavesipserver${curAccount}4`]
        let slave5 = values[`slavesipserver${curAccount}5`]
        let slave = [slave2,slave3,slave4,slave5]
        let slaveSipval = [];
        for (var i = 0;i<4;i++) {
            if(slave[i] !== undefined && slave[i] != "") {
                slaveSipval.push(slave[i])
            }
        }
        this.setState({slaveSipval:slaveSipval})
    }


    handleChangeInputVal = (e) => {
        this.setState({addSipServer:e.target.value})
    }

    handleAddSipServer = (e) => {
        if(document.all.addSipInput.value == "" && document.all.addSipInput.value.trim() == "") {
            this.props.promptMsg('ERROR',"a_servicelimit")
            return false;
        }

        let ps = document.querySelectorAll("#sipserverbox>p")
        if(ps.length >= 4) {
            this.props.promptMsg('ERROR',"a_servicecountlimit")
            return false;
        }

        for (let i=0;i<ps.length;i++) {
            if (ps[i].textContent == this.state.addSipServer) {
                this.props.promptMsg('ERROR',"a_serverrepeat")
                return false;
            }
        }
        let sipserver = this.state.addSipServer
        let flag = false
        this.checkaddressPath(0,sipserver,(data) => {
            if(data != undefined) {
                $("#addSipInput").parent().parent().parent().attr("class","ant-form-item-control has-error");
                setTimeout(function () {
                    $("#addSipInput").parent().parent().parent().attr("class","ant-form-item-control has-success");
                }, 2000);
                this.props.promptMsg('ERROR',data)
                flag = true
            }
        })
        if(flag == true) {
            return false
        }

        let slaveSipval = this.state.slaveSipval
        slaveSipval.push(sipserver)
        this.setState({addSipServer:"",slaveSipval:slaveSipval})
        document.all.addSipInput.value = ""
    }

    handleSlaveSipPvalue = (values) => {
        let ps = document.querySelectorAll("#sipserverbox>p")
        let curAccount = this.props.curAccount;
        if(ps.length !== 0) {
            for (var j = 2,len=ps.length+2;j<len;j++) {
                values["slavesipserver"+curAccount+j] = ps[j-2].textContent
            }
            for (let k = j;k<6;k++) {
                values["slavesipserver"+curAccount+k] = ""
            }
        } else {
            for(let i = 2;i<6;i++) {
                values["slavesipserver"+curAccount+i] = ""
            }
        }
        return values;
    }

    hanleSelSpan = (idx,e) => {
        let checkbox = e.target
        if(checkbox.checked == true) {
            document.getElementById("p"+idx).className = "select-p"
            document.getElementById("p"+idx).firstElementChild.firstElementChild.className = 'ant-checkbox ant-checkbox-checked'
        } else {
            document.getElementById("p"+idx).className = ""
            document.getElementById("p"+idx).firstElementChild.firstElementChild.className = 'ant-checkbox'
        }
    }

    hanleDeleteSip = () => {
        let SelP = document.querySelectorAll("#sipserverbox>p.select-p")
        if (SelP.length != 0) {
            Array.from(SelP).map((p,idx,SelP) => {
                let slaveSipval = this.state.slaveSipval
                let delIndex = slaveSipval.indexOf(p.textContent)
                if( delIndex != -1) {
                    slaveSipval.splice(delIndex,1)
                }
                this.setState({slaveSipval:slaveSipval})
            })
        }
    }

    hanldSipMove = (move) => {
        let SelP = document.querySelectorAll("#sipserverbox>p.select-p")
        let ps = document.querySelectorAll("#sipserverbox>p")
        if (SelP.length == 1) {
            let parent = document.all.sipserverbox
            let index1 = Array.prototype.indexOf.call(parent.children, SelP[0]);
            switch (move) {
                case "up":
                    let prev = SelP[0].previousSibling
                    if (index1 != 0) {
                        let index2 = Array.prototype.indexOf.call(parent.children, prev);
                        parent.insertBefore(SelP[0],parent.children[index2]);
                        parent.insertBefore(prev,parent.children[index1]);
                    }
                    break;
                case "down":
                    let next = SelP[0].nextSibling
                    if (index1 != ps.length -1) {
                        let index2 = Array.prototype.indexOf.call(parent.children, next);
                        parent.insertBefore(next,parent.children[index1]);
                        parent.insertBefore(SelP[0],parent.children[index2]);
                    }
                    break;
                default:

            }
        }
    }

    handlePwdVisible = () => {
        let curAccount = this.props.curAccount;
        let pwdstatus = this.state.pwdstatus;
        pwdstatus[curAccount] = pwdstatus[curAccount] == "password" ? "text" : "password";
        this.setState({pwdstatus: pwdstatus});
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed or selected account changed
            if (this.props.activeKey != nextProps.activeKey
                || this.props.curAccount != nextProps.curAccount) {

                this.props.getItemValues(this.handlePvalue(nextProps.curAccount), (values) => {
                    this.setSlaveSip(values);
                });
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              let req_items = this.handlePvalue()
              let curAccount = this.props.curAccount;
              if(this.props.form.getFieldValue("authpwd" + curAccount)){
                  req_items.push(this.getReqItem("authpwd" + curAccount, nvram["authpwd"][curAccount], ""),)
              }
              if (this.isWP8xx()) {
                  this.handleSlaveSipPvalue(values)
              }
              for (let key in values) {
                  if(values[key] == undefined) {
                      values[key] = ""
                  }
              }
              this.props.setItemValues(req_items, values, 1);
          }
        });
     }

    render() {
        const { getFieldDecorator } = this.props.form;
        const [callTr,curAccount] = [this.props.callTr,this.props.curAccount];
        if(this.isEmptyObject(this.props.itemValues)) {
            return null;
        }

        let itemList =
           <Form onSubmit={this.handleSubmit}>
               <p className="blocktitle"><s></s>{callTr("a_accountregister")}</p>
               <FormItem label={(<span>{callTr("a_accountactive")}&nbsp;<Tooltip title= {this.tips_tr("Account Active")} ><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('accountactive', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['accountactive'])
                    })(<Checkbox className={"P-" + nvram["accountactive"][curAccount]} />)
                    }
               </FormItem>
               <FormItem label={(<span>{callTr("a_accountname")}&nbsp;<Tooltip title={this.tips_tr("Account Name")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('accountname'+curAccount, {
                        rules: [{ max:64, message: callTr("max_length64"), whitespace: true }],
                        initialValue: this.props.itemValues['accountname'+curAccount] ? this.props.itemValues['accountname'+curAccount] : ""
                    })(<Input className={"P-" + nvram["accountname"][curAccount]} />)
                    }
               </FormItem>
               <FormItem label={(<span>{callTr("a_sipserver")}&nbsp;<Tooltip title={this.tips_tr("SIP Server")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('sipserver'+curAccount, {
                       rules: [{
                         max:64,message: callTr("max_length64"),
                       },{
                         validator: (data, value, callback) => {
                           this.checkaddressPath(data, value, callback)
                         }
                     }],
                     initialValue: this.props.itemValues['sipserver'+curAccount]
                     })(
                       <Input type="text" id="sipserver" className={"P-" + nvram["sipserver"][curAccount]} />
                 )}
               </FormItem>
               <FormItem className='formitem-sipserver-box' label={(<span>{callTr("a_secsipserver")}&nbsp;<Tooltip title={this.tips_tr("SIP User ID")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   <div style = {{float:'left'}}>
                       <div  style={{width:"210px",float:"left"}}>
                           <div  name="sipserverbox" id="sipserverbox" style={{border:'1px solid #ccc',borderRadius:'3px',height:'150px',padding: '6px 0 0 7px'}} size = "6">
                            {
                                this.state.slaveSipval.map((val,idx,arr) => {
                                    return (<p id={"p"+idx}><Checkbox onChange={this.hanleSelSpan.bind(this,idx)}></Checkbox><b></b>{val}</p>)
                                })
                            }
                           </div>
                       </div>
                       <div style={{margin: "20px",width:"50px",height:"90px",float:"left"}}>
                           <Button onClick={this.hanleDeleteSip} type="button" className="sip-btn-o"><Icon type="close-square-o" style={{ fontSize: 16, color: '#08c' }} />{callTr("a_delete")}</Button>
                           <Button onClick={this.hanldSipMove.bind(this,"up")} type="button" className="sip-btn-o"><Icon type="up-square-o" style={{ fontSize: 16, color: '#08c' }} />{callTr("a_up")}</Button>
                           <Button onClick={this.hanldSipMove.bind(this,"down")} type="button" className="sip-btn-o"><Icon type="down-square-o" style={{ fontSize: 16, color: '#08c' }} />{callTr("a_down")}</Button>
                   　  </div>
　　　　　　　　　　　　　 <div style={{height: "30px",lineHeight:"30px", clear:"both",position:'relative',top:'-20px'}}>
                           <Input id="addSipInput" onChange={this.handleChangeInputVal} type="text" style={{width:"210px"}} />
                           <Button onClick={this.handleAddSipServer} style= {{marginLeft:"20px",marginTop:"-4px"}}><Icon type="plus-square-o" style={{ fontSize: 16, color: '#08c' }} />{this.tr("a_add")}</Button>
                      </div>
                    </div>
               </FormItem>
               <FormItem label={(<span>{callTr("a_sipuid")}&nbsp;<Tooltip title={this.tips_tr("SIP User ID")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('userid'+curAccount, {
                       rules: [{
                          max:64,message: callTr("max_length64"),
                        }],
                        initialValue: this.props.itemValues['userid'+curAccount]
                        })(
                          <Input type="text" id="userid" className={"P-" + nvram["userid"][curAccount]} />
                    )}
               </FormItem>
               <FormItem label={(<span>{callTr("a_authid")}&nbsp;<Tooltip title={this.tips_tr("SIP Authentication ID")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   <Input type="text" name = "authid" style= {{display:"none"}} disabled autocomplete = "off"/>
                   {getFieldDecorator('authid'+curAccount, {
                       rules: [{
                          max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['authid'+curAccount]
                       })(
                       <Input type="text" name="authid" className={"P-" + nvram["authid"][curAccount]} />
                   )}
               </FormItem>
               <FormItem label={(<span>{callTr("a_authpwd")}&nbsp;<Tooltip title={this.tips_tr("SIP Authentication Password")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    <Input type={this.state.pwdstatus[curAccount]} name = "authpwd" style= {{display:"none"}} disabled autocomplete = "off"/>
                   {getFieldDecorator('authpwd'+curAccount, {
                       rules: [{
                          max:64,message: callTr("max_length64"),
                       }],
                       initialValue: "" //this.props.itemValues['authpwd'+curAccount]
                       })(
                       <Input type={this.state.pwdstatus[curAccount]} id = "authpwd" name = "authpwd" className={"P-" + nvram["authpwd"][curAccount]} suffix={<Icon type="eye" className={this.state.pwdstatus[curAccount]} onClick={this.handlePwdVisible} />}/>
                   )}
               </FormItem>
               <FormItem label={(<span>{callTr("a_displayname")}&nbsp;<Tooltip title={this.tips_tr("Name")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('name'+curAccount, {
                       rules: [{
                          max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['name'+curAccount]
                       })(
                       <Input type="text" id="name" className={"P-" + nvram["name"][curAccount]} />
                   )}
               </FormItem>
               <FormItem style={{display:'none'}} label={(<span>{callTr("a_nameonly")}&nbsp;<Tooltip title={this.tips_tr("Show Account Name Only")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('nameonly', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['nameonly'])
                    })(<Checkbox className={"P-" + nvram["nameonly"][curAccount]} />)
                    }
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_teluri")}&nbsp;<Tooltip title={this.tips_tr("Tel URI")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('teluri', {
                       initialValue: this.props.itemValues['teluri'] ? this.props.itemValues['teluri'] : "0"
                       })(
                           <Select className={"P-" + nvram["teluri"][curAccount]}>
                               <Option value="0">{callTr("a_disable")}</Option>
                               <Option value="1">{callTr("a_userphone")}</Option>
                               <Option value="2">{callTr("a_enabled")}</Option>
                           </Select>
                   )}
          　　　</FormItem>
              <FormItem label={(<span>{callTr("a_voicemailuid")}&nbsp;<Tooltip title={this.tips_tr("Voice Mail Access Number")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('vmuserid'+curAccount, {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['vmuserid'+curAccount]
                   })(
                       <Input type="text" id="vmuserid" className={"P-" + nvram["vmuserid"][curAccount]} />
                   )}
               </FormItem>

               <p className="blocktitle"><s></s>{callTr("account_net")}</p>
               <FormItem label={(<span>{callTr("a_outbp")}&nbsp;<Tooltip title={this.tips_tr("Outbound Proxy")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                  {getFieldDecorator('outbp'+curAccount, {
                      rules: [{
                          validator: (data, value, callback) => {
                              this.checkaddressPath(data, value, callback)
                          }
                       }],
                       initialValue: this.props.itemValues['outbp'+curAccount]
                       })(
                          <Input type="text" id="outbp" className={"P-" + nvram["outbp"][curAccount]}/>
                  )}
              </FormItem>
              <FormItem label={(<span>{callTr("a_secoutbp")}&nbsp;<Tooltip title={this.tips_tr("Secondary Outbound Proxy")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('secoutbp'+curAccount, {
                      rules: [{
                          max:64,message: callTr("max_length64"),
                       },{
                          validator: (data, value, callback) => {
                              this.checkaddressPath(data, value, callback)
                         }
                       }],
                       initialValue: this.props.itemValues['secoutbp'+curAccount]
                       })(
                          <Input type="text" id="secoutbp" className={"P-" + nvram["secoutbp"][curAccount]}/>
                  )}
              </FormItem>
              <FormItem className = "select-item"  label={(<span>{callTr("a_usedns")}&nbsp;<Tooltip title={this.tips_tr("DNS Mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('usednssrv', {
                       initialValue: this.props.itemValues['usednssrv'] ? this.props.itemValues['usednssrv'] : "0"
                       })(
                           <Select className={"P-" + nvram["usednssrv"][curAccount]}>
                               <Option value="0">A Record</Option>
                               <Option value="1">SRV</Option>
                               <Option value="2">NAPTR/SRV</Option>
                           </Select>
                  )}
         　　　</FormItem>
              <FormItem className = "select-item" label={(<span>{callTr("a_dnsfailmode")}&nbsp;<Tooltip title={this.tips_tr("DNS SRV Fail-over Mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('dnsfailmode', {
                       initialValue: this.props.itemValues['dnsfailmode'] ? this.props.itemValues['dnsfailmode'] : "0"
                       })(
                           <Select className={"P-" + nvram["dnsfailmode"][curAccount]}>
                               <Option value="0">{callTr("a_default")}</Option>
                               <Option value="1">{callTr("a_dnsttl")}</Option>
                               <Option value="2">{callTr("a_dnsnores")}</Option>
                           </Select>
                  )}
         　　　</FormItem>
              <FormItem className = "select-item"  label={(<span>{callTr("a_natstun")}&nbsp;<Tooltip title={this.isWP8xx() ? this.tips_tr("NAT Traversal for WP800") : this.tips_tr("NAT Traversal")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('natstun', {
                       initialValue: this.props.itemValues['natstun'] ? this.props.itemValues['natstun'] : "0"
                       })(
                           <Select className={"P-" + nvram["natstun"][curAccount]}>
                               <Option value="0">NAT NO</Option>
                               <Option value="1">STUN</Option>
                               <Option value="2">{callTr("a_keepalive")}</Option>
                               <Option style={{display:this.isWP8xx() ? 'none' : 'block' }} value="3">UPnP</Option>
                               <Option value="4">{callTr("a_auto")}</Option>
                               <Option value="5">OpenVPN</Option>
                           </Select>
                  )}
        　　 　</FormItem>
              <FormItem  label={(<span>{callTr("a_proxy")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Proxy-Require")} />}><Icon type="question-circle-o" /></Tooltip></span>)} >
                  {getFieldDecorator('proxy'+curAccount, {
                      rules: [{
                          max:64,message: callTr("max_length64"),
                      }],
                      initialValue: this.props.itemValues['proxy'+curAccount]
                      })(
                         <Input type="text" id="proxy" className={"P-" + nvram["proxy"][curAccount]}/>
                  )}
              </FormItem>
              <FormItem>
                  <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
              </FormItem>
        </Form>;
        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return itemList;

    }
}

const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    product: state.product
})

export default connect(mapStateToProps)(Enhance(GeneralForm));
