import React from "react";
import Enhance from './mixins/Enhance';
import * as Actions from './redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Index from "./index";
import LoginMain from "./modules/pubModule/loginMain";
import RebootMain from "./modules/pubModule/rebootMain";
import { productInit } from "./modules/pubModule/productInit";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.cb_getloginstate();
    }

    componentWillMount = () => {
        this.props.getProduct();
        this.props.getColorExit();
        productInit();
    }

    cb_getloginstate = () => {
        var urihead = "action=ping";
        urihead += "&time=" + new Date().getTime();
        var self = this;
        $.ajax ({
          type: 'get',
          url:'/manager',
          data:urihead,
          dataType:'text',
          async:false,
          success:function(data) {
              var msgs = this.res_parse_rawtext(data);
              if (msgs.headers['response'].toLowerCase() == "pong") {
                  let hashname = location.hash.split('/');
                  if( !hashname[1] ){
                      this.props.setPageStatus(0)
                  }else {
                      this.props.setPageStatus(1)
                  }
              } else {
                  this.props.setPageStatus(0)
              }
          }.bind(this),
          error:function(xmlHttpRequest, errorThrown) {
             self.cb_networkerror(xmlHttpRequest, errorThrown);
          }
        });
    }

    renderProj = () => {
          if(this.props.pageStatus == 1){
              var index = React.createFactory(Index);
              return index({});
          } else if (this.props.pageStatus == 2){
              var rebootMain = React.createFactory(RebootMain);
              return rebootMain({});
          } else if (this.props.pageStatus == 0) {
              var loginMain = React.createFactory(LoginMain);
              return loginMain({});
          }
    }

    render() {
        return (
            <div className = "reactRoot">
               {this.renderProj()}
            </div>
        );
    }
};
const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    pageStatus: state.pageStatus,
})

const mapDispatchToProps = (dispatch) => {
  var actions = {
      setPageStatus:Actions.setPageStatus,
      getProduct: Actions.getProduct,
      getColorExit: Actions.getColorExit,
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(App));
