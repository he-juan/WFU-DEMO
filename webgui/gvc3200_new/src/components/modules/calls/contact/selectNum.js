import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router';
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class CallSelectNum extends Component {
    constructor(props) {
        super(props)
    }

    handleCallNum = (item, idx, index) => {
        if(!this.props.existActiveAccount){
            this.props.promptMsg('WARNING','a_19374');
            return;
        }
        // request won't be sent when there is a call exists
        if(this.props.callDialog == "minimize"){
            this.props.promptMsg('WARNING','a_19639');
            return;
        }
        let calltip = document.getElementsByClassName('on-call-tip')[0];

        if(!calltip){
            let curnum = item.split(' ')[0].trim();
            let acct = item.split(' ')[1];
            let source = 1;
            this.props.sendSingleCall(curnum, acct, 0, 0, source, 0);
        }
    }

    render () {
        let selectnumItem = this.props.selectnumItem;
        let selectnum = [];
        let selectacct = [];
        selectnumItem.forEach(item => {
            selectnum.push(item.number)
            selectacct.push(item.acct)
        });
        let selectnumArray = new Array;
        for (let i = 0; i < (selectnum && selectnum.length); i++) {
            selectnumArray.push(selectnum[i]+ ' ' + selectacct[i])
        }
        let obj = {
            '-1': 'Active account',
            '0': 'SIP',
            '1': 'IPVideoTalk',
            'H.323':'H.323'
        }
        return (
            <div className = "callselectdiv">
                {
                    selectnumArray && selectnumArray.map((item, idx,items) => {
                        return (
                            <div className='callselectItem'>
                                {/* <p> */}
                                    <span className='ellips' title = {item.split(' ')[0] + ` (${obj[item.split(' ')[1]]})`}>
                                        {item.split(' ')[0] + ` (${obj[item.split(' ')[1]]})`}
                                        <i onClick={this.handleCallNum.bind(this, item, idx, this.props.index)}></i>
                                    </span>
                                {/* </p> */}
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    callDialog: state.callDialog
})

function mapDispatchToProps(dispatch) {
  var actions = {
      sendSingleCall: Actions.sendSingleCall,
      promptMsg: Actions.promptMsg
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CallSelectNum);