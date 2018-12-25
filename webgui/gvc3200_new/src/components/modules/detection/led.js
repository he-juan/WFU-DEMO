import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance"
import { Layout, Button } from "antd"
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout

class Led extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            ledotype: "",
            iconhover: ""
        }
    }
    
    showLights = (tag) => {
        this.setState({
            ledotype: tag + 1
        });

        let lightcolor = [1, 0, 2, 4];  // tag-0 -- lightcolor-1 -- green; tag-1 -- lightcolor-0 --red; tag-2 -- lightcolor-2 --blue; tag-3 -- lightcolor-4 --white
        this.props.openLight(lightcolor[tag]);
    }
    
    lightsHidden = () => {
        this.setState({
            ledotype: 0
        });
        
        this.props.closeLight();
    }

    render(){
        let checkLights = ['show_green', 'show_red', 'show_blue', 'show_white'];
        return (
            <Content className="content-container">
                <div className="subpagetitle">{this.tr("a_18520")}</div>
                <div className="detect-area" style={{minHeight:this.props.mainHeight}}>
                    <div className="ab-center detect-led">
                        <p className="ledtip">{this.tr("led_testtip")}</p>
                        <div className="led-pic">
                            <div className={`led-dot dot-type-${this.state.ledotype}`}></div>
                            <div className="tip-dot-line"></div>
                            <div>LED</div>
                        </div>
                        <div className="lights-btn">
                            {
                                checkLights.map((btntext, i) => {
                                    return <Button className={`light-type-${i+1}`} onMouseDown={this.showLights.bind(this, i)} onMouseUp={this.lightsHidden} ><span className={`ledicon led-icon-${i+1} ${this.state.iconhover}`}></span>{this.tr(btntext)}</Button>
                                })
                            }
                        </div>
                    </div>
                </div>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
})

function mapDispatchToProps(dispatch) {
  var actions = {
      openLight: Actions.openLight,
      closeLight: Actions.closeLight
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Led));
