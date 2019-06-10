import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Tabs, Input, Icon, Tooltip, Button, Row } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Content = Layout;




class NslookupForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            className:'',
            lookupResult: '',
            btnDisable: true
        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.form.resetFields();
                this.setState({
                    className:'',
                    lookupResult: '',
                    btnDisable: true
                })
            }
        }
    }
    doRequest = (urihead) => new Promise((resolve, reject) => {
        // let _urihead = urihead + "&time=" + new Date().getTime();
        let _this = this;
        $.ajax({
            type: 'get',
            url: '/manager',
            data: urihead,
            dataType: 'text',
            success: function(data){
                resolve(data);
            },
            error: function(){
                _this.props.promptMsg("ERROR", "a_neterror");
            }
        })
    })
    
    startLookup = () => {
        this.props.form.validateFields((err, values) => {
            if(!err) {
                this.setState({
                    lookupResult: '',
                })
                let {targethost} = values
                this.doRequest(`action=nslookup&host=${targethost}`).then((data) => {
                    this.setState({
                        lookupResult: data,
                        className: 'content'
                    })
                })
            }
        })
    }
    render() {
        const {callTr, callTipsTr} = this.props;
        const {getFieldDecorator} = this.props.form;
        
        let itemList =
            <Form hideRequiredMark>
              <FormItem label={( <span> {callTr("a_19815")} <Tooltip title={callTipsTr("Nslookup Target Host")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {getFieldDecorator('targethost', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.setState({
                                        btnDisable: value != '' ? false : true
                                    })
                                    this.checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                    })(<Input/>)}
                </FormItem>
                <Row style = {{"paddingLeft":"435px"}}>
                    <Button style = {{"marginRight":"20px"}} type="primary" onClick={() => {this.startLookup()}} disabled={this.state.btnDisable}>
                        {this.tr("a_19816")}
                    </Button>
                </Row>
                <Row style = {{"marginTop":"15px"}}><Input  type="textarea" id="pingres" disabled={false} value={this.state.lookupResult}  className={this.state.className} style={{fontSize:"0.875rem"}} /></Row>
            </Form>

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
    promptMsg: Actions.promptMsg
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(NslookupForm));
