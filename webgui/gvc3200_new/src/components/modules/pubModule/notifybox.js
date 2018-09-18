import React,{Component} from 'react';
import Enhance from '../../mixins/Enhance';
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { message } from 'antd';

const notifyType = {
    "SUCCESS": {},
    "ERROR": {},
    "WARNING": {},
    "INFO": {}
};

class NotifyBox extends Component {
    constructor(props) {
        super(props);
    }

    tipdivAnimation(type,label) {
        message.destroy();
        message.config({
            top: 32,
        });
        if(label) {
            switch(type)
                {
                    case "success":
                        message.success(label);
                        break;
                    case "error":
                        message.error(label);
                        break;
                    case "warning":
                        message.warning(label);
                        break;
                    case "info":
                        message.info(label);
                        break;
                    default:
                        break;
                }
        }
    }

    componentWillMount = () => {
        this.props.promptMsg('',"");
    }

    render() {
        let type = '';
        var label = '';
        if (this.props.notifyMsg && notifyType[this.props.notifyMsg.type]) {
            type = this.props.notifyMsg.type.toLowerCase();
            label = this.tr(this.props.notifyMsg.content);
            if(label == ""){
                return null;
            }
        }
        this.tipdivAnimation(type,label);
        return (
            null
        )
    }
};

const mapStateToProps = (state) => ({
    notifyMsg: state.notifyMsg
});

function mapDispatchToProps(dispatch) {
    var actions = {
        promptMsg:Actions.promptMsg
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps ,mapDispatchToProps)(Enhance(NotifyBox));
