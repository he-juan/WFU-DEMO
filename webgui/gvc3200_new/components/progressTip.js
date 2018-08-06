import React,{Component} from 'react';
import Enhance from './mixins/Enhance';
import * as Actions from './redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { Progress } from 'antd';

class ProgressMessage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let percent = this.props.progressMsg.percent;
        return (
            <div style={{display:this.props.progressMsg.display =='block' ? 'block' :'none' }} className ={'loadingMask'}>
                <div className = 'upgradediv'></div>
                <div>
                    <p className = 'upgradeinfo' style={{textAlign:'center'}}>{ this.props.progressMsg.text }</p>
                    <Progress strokeWidth={7} percent={percent} format={percent => `${percent} %` }/>
                </div>
            </div>
        )
    }
};

const mapStateToProps = (state) => ({
    progressMsg: state.progressMsg
});

const mapDispatchToProps = (dispatch) => {
    const actions = {
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(Enhance(ProgressMessage));
