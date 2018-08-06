import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Button, Select, Row, Col} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"typeenable0", "pvalue":"2971", "value":""},
                    {"name":"typeop0", "pvalue":"2972", "value":""},
                    {"name":"typeenable1", "pvalue":"2973", "value":""},
                    {"name":"typeop1", "pvalue":"2974", "value":""},
                    {"name":"typeenable2", "pvalue":"2975", "value":""},
                    {"name":"typeop2", "pvalue":"2976", "value":""},
                    {"name":"typeenable3", "pvalue":"2977", "value":""},
                    {"name":"typeop3", "pvalue":"2978", "value":""},
                    {"name":"typeenable4", "pvalue":"2979", "value":""},
                    {"name":"typeop4", "pvalue":"2980", "value":""},
                    {"name":"typeenable5", "pvalue":"8343", "value":""},
                    {"name":"typeop5", "pvalue":"8344", "value":""},
                    {"name":"typeenable6", "pvalue":"2981", "value":""},
                    {"name":"typeop6", "pvalue":"2982", "value":""},
                    {"name":"typeenable7", "pvalue":"2983", "value":""},
                    {"name":"typeop7", "pvalue":"2984", "value":""},
                    {"name":"typeenable8", "pvalue":"2985", "value":""},
                    {"name":"typeop8", "pvalue":"2986", "value":""}];

class NetListForm extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items);
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                this.props.setItemValues(req_items, values);
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const itemvalue = this.props.itemValues;

		const netlistarray = ["a_typeop1", "a_typeop3", "a_typegroupcm", "a_typeentercm", "a_typeop2", "a_typeop9", "a_typeop4", "a_typeop5", "a_typeop6"];

        return(
            <Form className="netlistform" style={{"width":"800px", "marginLeft":"100px", "fontSize":"0.875rem"}} hideRequiredMark>
                <Row type="flex" justify="space-around" style={{"margin-bottom":"40px"}}>
					<Col span={4} style={{"font-weight":"bold"}}>{callTr("a_type")}</Col>
					<Col span={10}></Col>
					<Col span={10} style={{"font-weight":"bold"}}>{callTr("a_name1")}</Col>
				</Row>
				{
					netlistarray.map((netitem, i) => {
						return (
							<Row type="flex" justify="space-around">
								<Col span={4} style={{"line-height":"36px"}}>{callTr(netitem)}</Col>
								<Col span={10}>
									<FormItem className="colitem">
					                    {getFieldDecorator(`typeenable${i}`, {
                                            initialValue: itemvalue[`typeenable${i}`] ? itemvalue[`typeenable${i}`] : "0"
                                        })(
					                        <Select>
												<Option value="0">{callTr("a_disabled")}</Option>
												<Option value="1">{callTr("a_enabled1")}</Option>
											</Select>
					                    )}
					                </FormItem>
								</Col>
								<Col span={10}>
									<FormItem className="colitem">
					                    {getFieldDecorator(`typeop${i}`, {
                                            initialValue: itemvalue[`typeop${i}`]
                                        })(
					                        <Input />
					                    )}
					                </FormItem>
								</Col>
							</Row>
						)
					})
				}
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
                </FormItem>
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(NetListForm);
