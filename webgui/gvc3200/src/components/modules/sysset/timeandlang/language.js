import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance";
            import {Form, Input, Icon, Tooltip, Radio, Select, Button, Row, InputNumber, Upload, Modal ,Cascader} from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class LanguageForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lang:"",
            langlist:[],
            hasCustom:false,
            options:[],
            languageValues:[]
        }
    }

    getLanguagesDone = (values) => {
        var lan = values["locale"];
        var name = values["name"];
        let languageValues=lan.split("_")
        languageValues.pop();
        let lan2=languageValues.join("_")
        this.setState({
            languageValues:[lan2,lan]
        })

        this.props.getLocaleList("0","",(data)=>{
            let options=[]
            let hasThisValue=false;
            for(let i=0;i<data.localeList.length;i++){
                if(data.localeList[i].locale==lan2){
                    hasThisValue=true
                }
                options.push({
                    label:data.localeList[i].name,
                    value:data.localeList[i].locale,
                    isLeaf: false,
                })
            }
            if(!hasThisValue){
                if(name.indexOf("(")!=-1){
                    let firstIndex=name.indexOf("(")
                    let lastIndex=name.indexOf(")")
                    let firstStr=name.substring(0,firstIndex)
                    let lastStr=name.substring(firstIndex+1,lastIndex)
                    options.push({
                        label:firstStr,
                        value:lan2,
                        children:[
                            {
                                label:lastStr,
                                value:lan
                            }
                        ]
                    })
                }else{
                    options.push({
                        label:name,
                        value:lan2,
                        children:[
                            {
                                label:name,
                                value:lan
                            }
                        ]
                    })
                }
            }
            this.setState({
                options: options
            },()=>{
                if(hasThisValue){
                    this.props.getLocaleList("1",lan2,(data)=>{
                        let oldOption=this.state.options
                        let options=[]
                        for(let i=0;i<data.localeList.length;i++){
                            options.push({
                                label:data.localeList[i].name,
                                value:data.localeList[i].locale
                            })
                        }
                        for(let i=0;i<oldOption.length;i++){
                            if(lan2==oldOption[i].value){
                                oldOption[i].children=options
                            }
                        }
                        this.setState({
                            options: oldOption,
                        });
                    })
                }
            });
        })
    }

    componentDidMount() {
        this.props.getLanguagesValues((values)=>{
            this.getLanguagesDone(values);
        });
        this.props.getCustomstate((data)=>{
            this.setState({
                hasCustom:data.isExist=="1"?true:false
            })
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getLanguagesValues((values)=>{
                    this.getLanguagesDone(values);
                });
                this.props.getCustomstate((data)=>{
                    this.setState({
                        hasCustom:data.isExist=="1"?true:false
                    })
                })
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
                this.props.putLanguage(this.state.languageValues[this.state.languageValues.length-1]);
            }
        });
    }

    setUploadsuccess = ()=> {
        this.setState({
            hasCustom:true
        })
    }

    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }

    deleteCustom() {
        let modal = Modal.confirm({
            content: <span dangerouslySetInnerHTML={{__html: this.tr("a_19818")}}></span>,
            okText: <span dangerouslySetInnerHTML={{__html: this.tr("a_2")}}></span>,
            onOk:()=> {
                this.props.deleteCustom(()=>{
                    this.setState({
                        hasCustom:false
                    })
                    modal.destroy()
                })
            },
            cancelText: <span dangerouslySetInnerHTML={{__html: this.tr("a_3")}}></span>,
            onCancel() {}
        });
    }

    onChange = (value, selectedOptions) => {
        this.setState({
            languageValues:value
        })
    }

    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // load options lazily
        this.props.getLocaleList("1",targetOption.value,(data)=>{
            targetOption.loading = false;
            let options=[]
            for(let i=0;i<data.localeList.length;i++){
                options.push({
                    label:data.localeList[i].name,
                    value:data.localeList[i].locale
                })
            }
            targetOption.children=options
            this.setState({
                options: [...this.state.options],
            });
        })
    }


    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const { getFieldDecorator } = this.props.form;
        const cb_ping = this.props.cb_ping;
        const cb_put_importlan = this.props.cb_put_importlan;

        const self = this

        const props = {
            name: 'file',
            showUploadList: false,
            accept: '.txt',
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
                        content: <span dangerouslySetInnerHTML={{__html: callTr("a_16669")}}></span>,
                        okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                        onOk() {},
                    });
                    cb_put_importlan( () => {
                        self.setUploadsuccess();
                    });
                } else if (info.file.status === 'error') {
                    Modal.error({
                        content: <span dangerouslySetInnerHTML={{__html: callTr("a_16477")}}></span>,
                        okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                        onOk() {},
                    });
                }
            },
        };

        let itemList =
            <Form hideRequiredMark className="icecontact" id="language_form">
                <FormItem label={<span>{callTr("a_8113")} <Tooltip title={callTipsTr("Language")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    <Cascader
                        value={this.state.languageValues}
                        options={this.state.options}
                        loadData={this.loadData}
                        onChange={this.onChange}
                        allowClear={false}
                    />
                </FormItem>
              <FormItem label={ <span> {callTr("a_19023")} <Tooltip title={callTipsTr("Custom Language")}> <Icon type="question-circle-o" /> </Tooltip> </span> } >
                {getFieldDecorator('a_19023', {
                    valuePropName: 'fileList',
                    normalize: this._normFile
                })
                    (<Upload {...props}>
                        <Button>
                          <Icon type="upload" /> {this.state.hasCustom?this.tr("a_71"):this.tr("a_16486")}
                        </Button>
                    </Upload>)
                }
                  <i className='del-btn'
                     onClick={()=>{this.deleteCustom()}}
                     style={{backgroundPosition:'-21px -25px',"left":"35%","display":this.state.hasCustom?"inline-block":"none"}}/>
              </FormItem>
              <FormItem>
                  <Button className="submit"  type="primary" size="large" onClick={this.handleSubmit}>{this.tr("a_17")}</Button>
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
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getLanguagesValues:Actions.getLanguagesValues,
        putLanguage:Actions.putLanguage,
        cb_ping:Actions.cb_ping,
        cb_put_importlan:Actions.cb_put_importlan,
        getLocaleList:Actions.getLocaleList,
        getCustomstate:Actions.getCustomstate,
        deleteCustom:Actions.deleteCustom
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(LanguageForm));
