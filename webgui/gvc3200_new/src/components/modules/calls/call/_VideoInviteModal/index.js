import React, { Component, PropTypes } from 'react'
import Enhance from "../../../../mixins/Enhance"
import { Layout,Checkbox, Button, Modal } from "antd"
import * as Actions from '../../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout

class VideoinviteDialog extends Component {
    constructor(props) {
        super(props);
        let checkedinfo = [];
        checkedinfo[0] = true;
        this.state = {
            checkedstate: checkedinfo,
            checkedlines: []
        }
    }


    handleCallDialog = () => {
    }

    onChange = (line, e) => {
        let checkedlines = this.state.checkedlines;
        if (e.target.checked) {
            checkedlines.push(line);
        } else {
            for (let i = 0; i < checkedlines.length; i++) {
                if (checkedlines[i] == line) {
                    checkedlines.splice(i, 1);
                    break;
                }
            }
        }
        this.setState({
            checkedlines: checkedlines
        });
    }

    handleInvite = (isaccept) => {
        let checkedlines = this.state.checkedlines;
        if (checkedlines.length == 0) {
            this.props.promptMsg("WARNING", this.tr("a_16671"));
            return;
        }
        for (let i = 0; i < checkedlines.length; i++) {
            this.props.acceptOrRejectvideo(isaccept, checkedlines[i]);
        }
    }
    componentWillReceiveProps (nextProps) {
        if(JSON.stringify(this.props.videoinvitelines) != JSON.stringify(nextProps.videoinvitelines)) {
            this.setState({
                checkedlines: nextProps.videoinvitelines.split(',')
            })
        }
    }
    render() {
        // if(this.props.videoinvitelines.length == 0) return null;
        let linestatus = this.props.linestatus;
        let videoinvitelines = this.props.videoinvitelines.split(","); //["0", "1"]

        return (
            <Modal 
                title={this.tr("a_607")} 
                visible={this.props.videoinvitelines.length > 0}
                closable={false} 
                className="selectvideodiv" 
                footer={
                    <div className="selectbtn">
                        <Button className="rejectvideo" onClick={this.handleInvite.bind(this, 0)}>{this.tr("a_523")}</Button>
                        <Button type="primary" className="accpvideo" onClick={this.handleInvite.bind(this, 1)}>{this.tr("a_10000")}</Button>
                    </div>
                }
            >
                <div className="selectlist">
                    {
                        videoinvitelines.map((item, i) => {
                            let num, name, defaultchecked = true;
                            for(let j = 0 ; j < linestatus.length; j++){
                                if(linestatus[j].line == item ){
                                    num = linestatus[j].num;
                                    name = linestatus[j].name || linestatus[j].num;
                                    break;
                                }
                            }
                            return <div className="itemdiv" key={i}>
                                <span className="itemcheck">
                                    <Checkbox defaultChecked={defaultchecked}  onChange={this.onChange.bind(this,item)}></Checkbox></span>
                                <span className="itemname"><em title={name}>{name}</em></span>
                                <span className="itemnum"><em title={num}>{num}</em></span>
                            </div>
                        })
                    }
                </div>
            </Modal>

        );
    }}

const mapStateToProps = (state) => ({
    videoinvitelines: state.videoinvitelines,
})

function mapDispatchToProps(dispatch) {
    var actions = {
        promptMsg: Actions.promptMsg,
        acceptOrRejectvideo: Actions.acceptOrRejectvideo,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(VideoinviteDialog));
