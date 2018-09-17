import React, { Component } from 'react'
import Enhance from '../../../mixins/Enhance'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Tooltip, Icon, Input, Row, Col, Checkbox, Button } from "antd";
const FormItem = Form.Item;

let uri_items = new Array("134","444","544","644","1744","1844","50644","50744","50844","50944","51044","51144","51244","51344","51444","51544");
let prefix_items = new Array("1347","481","581","681","1781","1881","50681","50781","50881","50981","51081","51181","51281","51381","51481","51581");
let forceblfs_items = new Array("6752","6753","6754","6755","6756","6757","52683","52783","52883","52983","53083","53183","53283","53383","53483","53583");
let acctname_item = ['270','417','517','617','1717','1817',"50617","50717","50817","50917","51017","51117","51217","51317","51417","51517"];
let accountactive = ["271", "401", "501", "601", "1701", "1801","50601","50701","50801","50901","51001","51101","51201","51301","51401","51501"];

class GeneralForm extends Component {
    constructor(props){
        super(props);
        this.state = {acctLength:16}
    }

    handlePvalue = () => {
        let req_items = [];
        let acctLength = acctname_item.length;
        if(this.props.maxAcctNum==15) {
            acctLength--;
            this.setState({acctLength:15})
        }
        for(let i = 0 ;i<acctLength;i++) {
            req_items.push(
                this.getReqItem("eventuri"+i, uri_items[i], ""),
                this.getReqItem("callpre"+i, prefix_items[i], ""),
                this.getReqItem("forceblf"+i, forceblfs_items[i], ""),
                this.getReqItem("accountactive"+i, accountactive[i], "")
            )
        }

        for(let i = 0 ;i<acctname_item.length;i++) {
            req_items.push(
                this.getReqItem("name"+i,acctname_item[i],"")
            )
        }
         return req_items;
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(this.handlePvalue());
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }
    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue())
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let req_items = this.handlePvalue()
                req_items.splice(req_items.length-16,req_items.length-1)
                this.props.setItemValues(req_items, values,2);
            }
        });
     }

    render() {
        const { getFieldDecorator } = this.props.form;
        const [callTr,itemValues] = [this.props.callTr,this.props.itemValues];
        if(this.isEmptyObject(this.props.itemValues)) {
            return null;
        }
        return (
            <Form style={{margin: 10}}>
                <Row type="flex" justify="around" className="mpk-general" align="middle" style={{backgroundColor:'#f7fafc',borderTop:'1px solid #eceff2',borderBottom:'1px solid #eceff2',height:'40px',fontSize:'0.875rem'}}>
                    <Col span={1}></Col>
                    <Col span={3}>{callTr("a_account")}&nbsp;<Tooltip title={this.tips_tr("Account Name")}><Icon type="question-circle-o" style={{marginLeft: '5px', color: '#08c' }} /></Tooltip></Col>
                    <Col span={6}>{callTr("a_7419")}&nbsp;<Tooltip title={this.tips_tr("BLF Call-pickup Prefix")}><Icon type="question-circle-o" style={{marginLeft: '5px', color: '#08c' }} /></Tooltip></Col>
                    <Col span={6}>{callTr("a_eventuri")}&nbsp;<Tooltip title={this.tips_tr("Eventlist BLF URI")}><Icon type="question-circle-o" style={{marginLeft: '5px', color: '#08c' }} /></Tooltip></Col>
                    <Col span={6}>{callTr("a_forceblf")}&nbsp;<Tooltip title={this.tips_tr("Force BLF Call-pickup by Prefix")}><Icon type="question-circle-o" style={{marginLeft: '5px', color: '#08c' }} /></Tooltip></Col>
                </Row>
                {
                    [...Array(this.state.acctLength)].map((val,i,arr) => {
                        let style = {backgroundColor:i%2 == 0 ? '#fff' : '#fafbfc',height:'46px',fontSize:'0.875rem'};
                        return (
                            <Row type="flex" align="middle" justify="around" className="mpk-general" style={style}>
                                <Col span={1}></Col>
                                <Col span={3}>{(itemValues["name"+i] != undefined && itemValues["name"+i] != "" && itemValues["accountactive"+i])==1  ? itemValues["name"+i] : `${this.tr("a_301")} ${i+1}`}</Col>
                                <Col span={6}>
                                    {getFieldDecorator('callpre'+i, {
                                        rules: [{
                                            max:64,message: callTr("max_length64"),
                                        }],
                                        initialValue: itemValues["callpre"+i]
                                        })(
                                            <Input type="text" className={"P-" + prefix_items[i]}/>
                                    )}
                                </Col>
                                <Col span={6}>
                                    {getFieldDecorator('eventuri'+i, {
                                        rules: [{
                                            max:64,message: callTr("max_length64"),
                                        }],
                                        initialValue: itemValues["eventuri"+i]
                                        })(
                                            <Input type="text" className={"P-" + uri_items[i]}/>
                                    )}
                                </Col>
                                <Col span={6}>
                                    {getFieldDecorator('forceblf'+i, {
                                        valuePropName: 'checked',
                                        initialValue: parseInt(itemValues["forceblf"+i])
                                        })(
                                            <Checkbox className={"P-" + forceblfs_items[i]}/>
                                    )}
                                </Col>
                            </Row>

                        )
                    })
                }
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>
        )
  }
}

const mapStateToProps = (state) => ({
    activeKey: state.TabactiveKey
})

const mapDispatchToProps = (dispatch) => {
    const actions = {}
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(GeneralForm));
