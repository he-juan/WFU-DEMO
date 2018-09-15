import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance";
import {Form, Input, Icon, Tooltip, Radio, Select, Button, Row, InputNumber, Upload, Modal } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
let req_items;
let whole_items;
var m_load = 0;

class LanguageForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            cusdftlangStyle:"",
            cusdftlanglist:"",
            lang:"",
            a_importlan:"display-hidden",
            disabled:""
        }

        this.handleNvram();
    }

    handleNvram = () => {
         whole_items = [];
         whole_items.push(
             this.getReqItem("enablecuslang", "customed_language", ""),
             this.getReqItem("cusdftlang", "default_customed_language", ""),
             this.getReqItem("cusdftcountry", "default_customed_country", "")
         )
         return whole_items;
    }

    getLanguagesDone = (values) => {
        var lan = values.headers["language"];
        lan = lan.split("\n")[0];
        if(m_load == 0) {
            m_load = 1;
        } else {

        }
        if(lan.indexOf(".txt") != -1) {
            this.setState({
                lang:"customized"
            })
        } else {
            this.setState({
                lang:lan
            })
        }
    }

    get_items_suc = (values) => {
        var cuslangval = values["cusdftlang"] + "_" + values["cusdftcountry"];
        this.setState({
            cusdftlanglist:cuslangval
        })
        let cusdftlangStyle;
        let lang;
        let disabled;
        let a_importlan;
        if(values["enablecuslang"] == "1") {
            cusdftlangStyle = "display-block";
            lang = "customized";
            disabled = "";
            a_importlan = "display-block";
        } else {
            cusdftlangStyle = "display-hidden";
            a_importlan = "display-hidden";
            this.props.getLanguagesValues((values)=>{
                this.getLanguagesDone(values);
            });
        }
        this.setState({
            cusdftlangStyle:cusdftlangStyle,
            lang:lang,
            disabled:disabled,
            a_importlan:a_importlan
        })
    }

    onChangeLang = (value) => {
        if(value == "customized") {
            this.setState({
                a_importlan:"display-block",
                disabled:"disabled"
            })
        } else {
            this.setState({
                a_importlan:"display-hidden",
                cusdftlangStyle:"display-hidden",
                disabled:""
            })
        }
    }

    setUploadsuccess = () => {
        this.setState({
            disabled:"",
            cusdftlangStyle:"display-block"
        })
    }

    cb_put_lan = (values1,values2) => {
        var lan_ct = values1;
        if (values1 == "customized") {
            lan_ct = values2;
        }
        this.props.putLanguage(lan_ct);
    }

    componentDidMount() {
        this.props.getItemValues(whole_items,(values) => {
            this.get_items_suc(values);
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(whole_items,(values) => {
                    this.get_items_suc(values);
                });
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
                let values = this.props.form.getFieldsValue();
                //this.props.setItemValues(whole_items, values);
                if(values.lang == "customized") {
                    var cusdftlangval = values.cusdftlanglist;
                    var cuslang = cusdftlangval.split("_");
                    values.cusdftlang = cuslang[0];
                    values.cusdftcountry = cuslang[1];
                    whole_items = [];
                    whole_items.push(
                        this.getReqItem("cusdftlang", "default_customed_language", ""),
                        this.getReqItem("cusdftcountry", "default_customed_country", "")
                    )
                    this.props.setItemValues(whole_items, values);
                } else {
                    values.enablecuslang = "0";
                    whole_items = [];
                    whole_items.push(
                        this.getReqItem("enablecuslang", "customed_language", "")
                    )
                    this.props.setItemValues(whole_items, values);
                }
                this.cb_put_lan(values.lang,values.cusdftlanglist);
            }
        });
    }

    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const { getFieldDecorator } = this.props.form;
        let lang = this.state.lang;
        let disabled = this.state.disabled;
        let cusdftlanglist = this.state.cusdftlanglist;
        const cb_ping = this.props.cb_ping;
        const cb_put_importlan = this.props.cb_put_importlan;
        const cb_get_import_response = this.props.cb_get_import_response;

        const self = this

        const props = {
            name: 'file',
            showUploadList: false,
            action: '../upload?type=importlan',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    cb_ping();
                }

                if (info.file.status === 'done') {
                    Modal.info({
                        content: <span dangerouslySetInnerHTML={{__html: callTr("a_uploadsuctips")}}></span>,
                        okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                        onOk() {},
                    });
                    cb_put_importlan( () => {
                        self.setUploadsuccess();
                    });
                } else if (info.file.status === 'error') {
                    Modal.error({
                        content: <span dangerouslySetInnerHTML={{__html: callTr("a_uploadfail")}}></span>,
                        okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                        onOk() {},
                    });
                }
            },
        };

        let itemList =
            <Form hideRequiredMark>
                <FormItem className = "select-item" label={<span>{callTr("a_23526")} <Tooltip title={callTipsTr("Language")}> <Icon type="question-circle-o"/> </Tooltip> </span> } >
                    { getFieldDecorator('lang', {
                        rules: [],
                        initialValue: lang
                    })(
                    <Select onChange={ this.onChangeLang.bind(this) }>
                        <Option value="ja_JP">日本語</Option>
                        <Option value="zh_TW">中文 (繁體)</Option>
                        <Option value="zh_CN">中文 (简体)</Option>
                        <Option value="in_ID">Bahasa Indonesia</Option>
                        <Option value="ms_MY">Bahasa Melayu</Option>
                        <Option value="af_ZA">Afrikaans</Option>
                        <Option value="ca_ES">Català</Option>
                        <Option value="cs_CZ">Čeština</Option>
                        <Option value="da_DK">Dansk</Option>
                        <Option value="de_DE">Deutsch (Deutschland)</Option>
                        <Option value="de_LI">Deutsch (Liechtenstein)</Option>
                        <Option value="de_AT">Deutsch (Österreich)</Option>
                        <Option value="de_CH">Deutsch (Schweiz)</Option>
                        <Option value="en_AU">English (Australia)</Option>
                        <Option value="en_CA">English (Canada)</Option>
                        <Option value="en_NZ">English (New Zealand)</Option>
                        <Option value="en_SG">English (Singapore)</Option>
                        <Option value="en_GB">English (United Kingdom)</Option>
                        <Option value="en_US">English (United States)</Option>
                        <Option value="es_ES">Español (España)</Option>
                        <Option value="es_US">Español (Estados Unidos)</Option>
                        <Option value="tl_PH">Filipino</Option>
                        <Option value="fr_BE">Français (Belgique)</Option>
                        <Option value="fr_CA">Français (Canada)</Option>
                        <Option value="fr_FR">Français (France)</Option>
                        <Option value="fr_CH">Français (Suisse)</Option>
                        <Option value="hr_HR">Hrvatski</Option>
                        <Option value="zu_ZA">IsiZulu</Option>
                        <Option value="it_IT">Italiano (Italia)</Option>
                        <Option value="it_CH">Italiano (Svizzera)</Option>
                        <Option value="sw_TZ">Kiswahili</Option>
                        <Option value="lv_LV">Latviešu</Option>
                        <Option value="lt_LT">Lietuvių</Option>
                        <Option value="hu_HU">Magyar</Option>
                        <Option value="nl_BE">Nederlands (België)</Option>
                        <Option value="nl_NL">Nederlands (Nederland)</Option>
                        <Option value="nb_NO">Norsk bokmål</Option>
                        <Option value="pl_PL">Polski</Option>
                        <Option value="pt_BR">Português (Brasil)</Option>
                        <Option value="pt_PT">Português (Portugal)</Option>
                        <Option value="ro_RO">Română</Option>
                        <Option value="rm_CH">Romansh</Option>
                        <Option value="sk_SK">Slovenčina</Option>
                        <Option value="sl_SI">Slovenščina</Option>
                        <Option value="fi_FI">Suomi</Option>
                        <Option value="sv_SE">Svenska</Option>
                        <Option value="vi_VN">Tiếng Việt</Option>
                        <Option value="tr_TR">Türkçe</Option>
                        <Option value="el_GR">Ελληνικά</Option>
                        <Option value="bg_BG">Български</Option>
                        <Option value="ru_RU">Русский</Option>
                        <Option value="sr_RS">Српски</Option>
                        <Option value="uk_UA">Українська</Option>
                        <Option value="iw_IL">עברית</Option>
                        <Option value="ar_EG">العربية"</Option>
                        <Option value="fa_IR">فارسی</Option>
                        <Option value="am_ET">አማርኛ</Option>
                        <Option value="hi_IN">हिन्दी</Option>
                        <Option value="th_TH">ไทย</Option>
                        <Option value="ko_KR">한국어</Option>
                        <Option value="customized">{this.tr("a_15")}</Option>
                    </Select>
                    )
                }
　　　         </FormItem>
              <FormItem className = {this.state.a_importlan} label={ <span> {callTr("a_19023")} <Tooltip title={callTipsTr("Custom Language")}> <Icon type="question-circle-o" /> </Tooltip> </span> } >
                {getFieldDecorator('a_19023', {
                    valuePropName: 'fileList',
                    normalize: this._normFile
                })
                    (<Upload {...props}>
                        <Button>
                          <Icon type="upload" /> {this.tr("a_16486")}
                        </Button>
                    </Upload>)
                }
              </FormItem>
              <FormItem className = {"select-item" + " " +this.state.cusdftlangStyle} label={ <span> {callTr("a_19024")} <Tooltip title={callTipsTr("Default Custom Language")}> <Icon type="question-circle-o" /> </Tooltip> </span> }>
                  { getFieldDecorator('cusdftlanglist', {
                      rules: [],
                      initialValue: cusdftlanglist
                  })(
                    <Select>
                        <Option value="ja_JP">日本語</Option>
                        <Option value="zh_TW">中文 (繁體)</Option>
                        <Option value="zh_CN">中文 (简体)</Option>
                        <Option value="in_ID">Bahasa Indonesia</Option>
                        <Option value="ms_MY">Bahasa Melayu</Option>
                        <Option value="af_ZA">Afrikaans</Option>
                        <Option value="ca_ES">Català</Option>
                        <Option value="cs_CZ">Čeština</Option>
                        <Option value="da_DK">Dansk</Option>
                        <Option value="de_DE">Deutsch (Deutschland)</Option>
                        <Option value="de_LI">Deutsch (Liechtenstein)</Option>
                        <Option value="de_AT">Deutsch (Österreich)</Option>
                        <Option value="de_CH">Deutsch (Schweiz)</Option>
                        <Option value="en_AU">English (Australia)</Option>
                        <Option value="en_CA">English (Canada)</Option>
                        <Option value="en_NZ">English (New Zealand)</Option>
                        <Option value="en_SG">English (Singapore)</Option>
                        <Option value="en_GB">English (United Kingdom)</Option>
                        <Option value="en_US">English (United States)</Option>
                        <Option value="es_ES">Español (España)</Option>
                        <Option value="es_US">Español (Estados Unidos)</Option>
                        <Option value="tl_PH">Filipino</Option>
                        <Option value="fr_BE">Français (Belgique)</Option>
                        <Option value="fr_CA">Français (Canada)</Option>
                        <Option value="fr_FR">Français (France)</Option>
                        <Option value="fr_CH">Français (Suisse)</Option>
                        <Option value="hr_HR">Hrvatski</Option>
                        <Option value="zu_ZA">IsiZulu</Option>
                        <Option value="it_IT">Italiano (Italia)</Option>
                        <Option value="it_CH">Italiano (Svizzera)</Option>
                        <Option value="sw_TZ">Kiswahili</Option>
                        <Option value="lv_LV">Latviešu</Option>
                        <Option value="lt_LT">Lietuvių</Option>
                        <Option value="hu_HU">Magyar</Option>
                        <Option value="nl_BE">Nederlands (België)</Option>
                        <Option value="nl_NL">Nederlands (Nederland)</Option>
                        <Option value="nb_NO">Norsk bokmål</Option>
                        <Option value="pl_PL">Polski</Option>
                        <Option value="pt_BR">Português (Brasil)</Option>
                        <Option value="pt_PT">Português (Portugal)</Option>
                        <Option value="ro_RO">Română</Option>
                        <Option value="rm_CH">Romansh</Option>
                        <Option value="sk_SK">Slovenčina</Option>
                        <Option value="sl_SI">Slovenščina</Option>
                        <Option value="fi_FI">Suomi</Option>
                        <Option value="sv_SE">Svenska</Option>
                        <Option value="vi_VN">Tiếng Việt</Option>
                        <Option value="tr_TR">Türkçe</Option>
                        <Option value="el_GR">Ελληνικά</Option>
                        <Option value="bg_BG">Български</Option>
                        <Option value="ru_RU">Русский</Option>
                        <Option value="sr_RS">Српски</Option>
                        <Option value="uk_UA">Українська</Option>
                        <Option value="iw_IL">עברית</Option>
                        <Option value="ar_EG">العربية"</Option>
                        <Option value="fa_IR">فارسی</Option>
                        <Option value="am_ET">አማርኛ</Option>
                        <Option value="hi_IN">हिन्दी</Option>
                        <Option value="th_TH">ไทย</Option>
                        <Option value="ko_KR">한국어</Option>
                    </Select>)}
　　　         </FormItem>
              <FormItem>
                  <Button className="submit"  disabled = {disabled} type="primary" size="large" onClick={this.handleSubmit}>{this.tr("a_17")}</Button>
              </FormItem>
              <FormItem>
                  {getFieldDecorator('enablecuslang', {
                      rules: [],
                      initialValue: this.props.itemValues.enablecuslang
                  })(<Input maxLength="40" style = {{display:"none"}} className="P-customed_language"/>)
                  }
              </FormItem>
              <FormItem>
                  {getFieldDecorator('cusdftlang', {
                      rules: [],
                      initialValue: this.props.itemValues.cusdftlang
                  })(<Input maxLength="40" style = {{display:"none"}} className="P-default_customed_language"/>)
                  }
              </FormItem>
              <FormItem>
                  {getFieldDecorator('cusdftcountry', {
                      rules: [],
                      initialValue: this.props.itemValues.cusdftcountry
                  })(<Input maxLength="40" style = {{display:"none"}} className="P-default_customed_country"/>)
                  }
              </FormItem>
         </Form>;

     let hideItem = this.props.hideItem;
     for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
         itemList.props.children.splice(hideItem[i], 1);
     }

     return itemList;
   }
}

//export default Enhance(LanguageForm);
const mapStateToProps = (state) => ({
    changeLanguage: state.changeLanguage,
    itemValues: state.itemValues,
    languagesValues:state.languagesValues,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey

})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        getLanguagesValues:Actions.getLanguagesValues,
        putLanguage:Actions.putLanguage,
        cb_ping:Actions.cb_ping,
        cb_put_importlan:Actions.cb_put_importlan,
        cb_get_import_response:Actions.cb_get_import_response,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(LanguageForm));
