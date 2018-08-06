import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Button, Upload, Table, Popconfirm, message} from "antd";
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const {Column} = Table;
const customcertpvalue = "8472";
let maxnum = 1;

class CustomCert extends Component {
    constructor(props){
        super(props);
    }


    componentDidMount = () => {
        this.props.getVeriCert();

    }

    convertValidTime = (validate) => {
        let dateObj = new Date;
        //if( date != undefined && date != "" )
        dateObj.setTime(validate);
        let timestr = dateObj.getFullYear()+"-";
        let month = dateObj.getMonth()+1;
        if( month < 10 )
            timestr += "0";
        timestr += month;
        timestr += "-";
        let date = dateObj.getDate();
        if( date < 10 )
            timestr += "0";
        timestr += date;
        timestr += " ";
        let hours = dateObj.getHours();
        if( hours < 10 )
            timestr += "0"
        timestr += hours;
        timestr += ":";
        let minutes = dateObj.getMinutes();
        if( minutes < 10 )
            timestr += "0";
        timestr += minutes;
        timestr += ":";
        let seconds = dateObj.getSeconds();
        if( seconds < 10 )
            timestr += "0";
        timestr += seconds;
        return timestr;
    }

    deleteCert = (nvram) => {
        const getVeriCert = this.props.getVeriCert;
        let item = [], value = [];
        item.push(nvram);
        value.push("");
        this.props.putNvrams(item, value, "a_del_ok", () => {
            maxnum ++;
            getVeriCert();
        });
    }

    render(){
        const callTr = this.props.callTr;
        const getVeriCert = this.props.getVeriCert;
        const checkVeriCert = this.props.checkVeriCert;
        let certinfo, customcertdata = [];
            if(this.props.certInfo.Response == "Success"){
                certinfo = this.props.certInfo.Data;
                let owner = "", publisher = "";
                maxnum = 1;
            for(let i = 0; i < certinfo.length; i++) {
                if (certinfo[i].Pvalue == customcertpvalue) {
                    maxnum --;
                    for (let j = 0; j < certinfo[i].Info.length; j++) {
                        let curcert = certinfo[i].Info[j];
                        let identity = curcert.substring(curcert.length - 4, curcert.length);
                        if (identity == "(13)")
                            owner = curcert.substring(0, curcert.length - 4);
                        if (identity == "(17)")
                            publisher = curcert.substring(0, curcert.length - 4);
                    }
                    customcertdata.push({
                        certorder: 1,
                        issuedto: owner,
                        issuedby: publisher,
                        validate: this.convertValidTime(parseInt(certinfo[i].Validtime) * 1000),
                        pvalue: certinfo[i].Pvalue
                    });

                    break;
                }
            }
        }else{
            return null;
        }

        const customCertProps = {
            name: 'file',
            multiple: false,  //support upload multiple files or not
            showUploadList: false,  //show upload list or not
            action: '../upload?type=vericert',
            accept: '.pem, .crt, .cer, .der',
            onChange(info){
                const status = info.file.status;
                if(status !== "uploading"){
                    //console.log(info.file, info.fileList);
                }
                if(status === "done"){
                    if(maxnum < 1){
                        message.error(callTr("a_customcertmaxmum"));
                        return false;
                    }

                    checkVeriCert({type:"customCert",pvalue:customcertpvalue}, (data) => {
                        switch (data) {
                            case "1":
                                getVeriCert();
                                message.success(`${info.file.name} ` + callTr("a_uploadsuc"));
                                maxnum --;
                                break;
                            case "2":
                                message.error(callTr("a_invalidcert"));
                                break;
                            default:
                                message.error(callTr("a_invalidcert"));
                        }
                    });
                }else if(status === "error"){
                    message.error(`${info.file.name} ` + callTr("a_uploadfail"));
                }
            },
        };

        return(
            <div className="ca-cert-block">
                <div style={{"fontSize":"0.875rem", "margin-bottom":"40px"}}>
                    <div>{callTr("a_importcustomcert")}</div>
                    <Upload {...customCertProps}>
                        <Button className="upload-btn" disabled={!maxnum}>
                            <span className="upload-icon" />
                            <span style={{marginLeft: "5px"}}>{callTr("a_upload")}</span>
                        </Button>
                    </Upload>
                </div>
                <div style={{"fontSize":"0.875rem", "margin-bottom":"10px"}}>
                    {callTr("a_customcert")}
                </div>
                <Table className="list-table" style={{maxWidth: "950px", paddingRight: "40px"}} dataSource={customcertdata} pagination={false} >
                    <Column title={callTr("a_snumber")} dataIndex="certorder" key="certorder" />
                    <Column title={callTr("a_issuedto")} dataIndex="issuedto" key="issuedto" />
                    <Column title={callTr("a_issuedby")} dataIndex="issuedby" key="issuedby" />
                    <Column title={callTr("a_validdate")} dataIndex="validate" key="validate" />
                    <Column title={callTr("a_operate")} key="delete" render={(text, record, index) => (
                        <span>
                            <Popconfirm placement="top" title={callTr("a_promptdelete")} okText={callTr("a_ok")} cancelText={callTr("a_cancel")}
                                        onConfirm={this.deleteCert.bind(this, text.pvalue)}>
                                <a className="delete-icon"></a>
                            </Popconfirm>
                        </span>
                    )}/>
                </Table>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    certInfo: state.certInfo,
    checkCert: state.checkCert,
})

export default connect(mapStateToProps)(CustomCert);
