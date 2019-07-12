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
        let curnum = item.split('--- ---')[0].trim();
        let acct = item.split('--- ---')[1];
        let memToCall =[]
        memToCall.push({
            num: curnum,
            acct: acct,
            isvideo: 0,
            source: '1',
            isconf: '1',
        })
        this.props.makeCall(memToCall)
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
            selectnumArray.push(selectnum[i]+ '--- ---' + selectacct[i])
        }
        let obj = {
            '-1': 'Active account',
            '0': 'SIP',
            '1': 'IPVideoTalk',
            '8':'H.323'
        }
        return (
            <div className = "callselectdiv">
                {
                    selectnumArray && selectnumArray.map((item, idx,items) => {
                        return (
                            <div className='callselectItem' key={idx}>
                                {/* <p> */}
                                    <span className='ellips' title = {item.split('--- ---')[0] + ` (${obj[item.split('--- ---')[1]]})`}>
                                        {item.split('--- ---')[0] + ` (${obj[item.split('--- ---')[1]]})`}
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