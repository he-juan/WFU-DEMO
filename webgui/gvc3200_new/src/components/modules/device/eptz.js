import React, {Component, PropTypes} from 'react'
import Enhance from "../../mixins/Enhance";
import {
    Layout,
    Form,
    Radio,
    Select,
    Input,
    Tooltip,
    Checkbox
} from "antd";

import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const Content = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


const req_items = [

];



class eptz extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
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

    }

    render() {
        return (
            <div className="content-container config-container">
                aaaaaaaaaa
            </div>
        );
    }
}

const eptzForm = Form.create()(Enhance(eptz));


const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues: Actions.getItemValues,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(eptzForm);