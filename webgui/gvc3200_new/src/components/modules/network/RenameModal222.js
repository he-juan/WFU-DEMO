import React, {Component} from 'react'
import Enhance from "../../mixins/Enhance";
import {Form, Input, Layout, Modal} from "antd";

const Content = Layout;
const FormItem = Form.Item;

class Renamemodal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handelRename = () => {
        console.log("----");
    }

    handleCancel = () => {
        this.props.handleHideModal();
    }

    render() {
        const renamemodalvisible = this.props.renamemodalvisible;
        const {getFieldDecorator} = this.props.form;
        const callTr = this.props.callTr;
        return (
            <Modal className="blueth-raname-modal" title={callTr("a_69")} visible={renamemodalvisible}
                   onOk={this.handelRename} onCancel={this.handleCancel}>
                <Form hideRequiredMark>
                    <FormItem>
                        {getFieldDecorator('devicename1', {
                        })(
                            <Input type="text"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Enhance(Renamemodal);