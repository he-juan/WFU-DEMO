import React,{Component} from 'react';
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Layout} from 'antd';

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout className='footer-container'>
                <span className={this.props.oemId == "54" ? 'display-hidden' : 'display-block'}>{"All Rights Reserved " + this.props.vendor + " 2018"}</span>
            </Layout>
        );
    }
};

const mapStateToProps = (state) => ({
    vendor: state.vendor,
    oemId: state.oemId
})

export default connect(mapStateToProps)(Footer);
