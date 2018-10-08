import React, {Component, PropTypes} from 'react'
import Enhance from "../../mixins/Enhance";
import {
    Layout,
    Form,
    Radio,
    Select,
    Input,
    Tooltip,
    Checkbox,
    Icon,
    Button
} from "antd";

import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const Content = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


const req_items = [
    {"name": "remoteappconnect", "pvalue": "25022", "value": ""},
];


class eptz extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, () => {

        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.enterSave != nextProps.enterSave) {
            this.handleSubmit();
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                console.log(values)
                this.props.setItemValues(req_items, values, 0);
            }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const callTr = this.tr;
        const callTipsTr = this.tips_tr;
        const itemvalue = this.props.itemValues;

        return (
            <Content className="content-container config-container" id="preset">
                <div className="subpagetitle">{callTr("a_16635")}</div>
                <Form className="configform" hideRequiredMark style={{'min-height': this.props.mainHeight}}>
                    <FormItem label={<span>{callTr("a_16616")}<Tooltip title={callTipsTr("Disable Remote Control App Connection")}><Icon
                        type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator("remoteappconnect", {
                            valuePropName: 'checked',
                            initialValue: parseInt(itemvalue['remoteappconnect'])
                        })(
                            <Checkbox className={"P-25022"}/>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                    </FormItem>
                </Form>
            </Content>
        );
    }
}

const eptzForm = Form.create()(Enhance(eptz));


const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
    itemValues:state.itemValues,
    mainHeight:state.mainHeight
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues: Actions.getItemValues,
        setItemValues: Actions.setItemValues,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(eptzForm);