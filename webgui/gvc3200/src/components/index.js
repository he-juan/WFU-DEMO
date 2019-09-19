import React,{Component} from 'react';
import MainHeader from "./modules/pubModule/header";
import Main from "./main";
import {Layout} from "antd";
import SpinBlock from "./modules/pubModule/spinblock";
import IncomingcallDialog from './modules/calls/call/incomingcallDialog'
import ProgressMessage from "./modules/pubModule/progressTip";
import NotifyBox from "./modules/pubModule/notifybox";
import HandleWebsocket from './websocket/websocket.js';
import * as Actions from './redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Index extends Component {

    constructor(props) {
        super(props);
    }

    handleclick(ev){
        var hiddenInputSearchdiv = true;
        if( ev.target.id == 'inputSearchresultdiv' || $(ev.target).parents('#inputSearchresultdiv').hasClass('searchInput-fadein') ){
            hiddenInputSearchdiv = false;
        }
        if( hiddenInputSearchdiv && $('#inputSearchresultdiv').attr('class') == 'searchInput-fadein' ){
            $('#searchbtn').click();
        }
    }
    componentDidMount = () =>{
        this.props.getUserType();
    }

    render() {

        if(this.props.userType != "admin" && this.props.userType != "user"){
            return null;
        }
        return (
            <Layout style={{"width":"100%","height":"100%"}} onClick={this.handleclick.bind(this)}>
                <MainHeader />
                <NotifyBox />
                <Main />
                <SpinBlock />
                <IncomingcallDialog />
                <ProgressMessage />
                <HandleWebsocket />
            </Layout>
        );
    }
};

const mapStateToProps = (state) => ({
    userType: state.userType
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getUserType: Actions.getUserType
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
