import React,{Component} from 'react';
import Enhance from './mixins/Enhance';
import * as Actions from './redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin, Alert } from 'antd';

class SpinBlock extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let spinStyle = this.props.spinMsg.spinStyle;
        let spinTip = this.tr(this.props.spinMsg.spinTip);

        if (spinStyle === undefined) {
            spinStyle = 'display-hidden'
        }
        return (
            <div className ={'loadingMask' + ' ' + spinStyle}>
                <div className = 'loadingdiv'></div>
                <Spin tip = {spinTip} size = 'large'>
                </Spin>
            </div>
        )
    }
};

const mapStateToProps = (state) => ({
    spinMsg: state.spinMsg
});

export default connect(mapStateToProps)(Enhance(SpinBlock));
