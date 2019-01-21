import React, { Component } from 'react';
import ScreenItems from './ScreenItems';

function callTr(text) {
  let tr_text = text;
  let language = $.cookie('MyLanguage') == null ? 'en' : $.cookie('MyLanguage');
  try {
      tr_text = window.eval(text+"_" + language);
  } catch (err) {
  } finally {
      return tr_text;
  }
}






class CustomLayout extends Component {
  constructor() {
    super();
    this.state = {
      tab: 0,
    };
  }
  componentDidMount() {
    
  }
  getVideoIndex(n, list){
    for( let i = 0; i < list.length; i++){
      var number = list[i].number
      if(number == n){
        return i
      }
    }
    return -1
  }
  operate(operate, v, curIndex, isActive){
    if(isActive == 'active') return false;
    const {layoutSet, memberlist} = this.props;
    const {tab} = this.state;
    let _layoutSet = JSON.parse(JSON.stringify(layoutSet));
    let set = _layoutSet[tab].displayList;
    let memberInSet = this.findIndexInSet(set, v.number);

    if(operate == 'full') {
      if(memberInSet) {
        let temp = set.splice(memberInSet.i, 1)[0];
        set.unshift(temp);
      } else {
        set.unshift(v);
      }
    } else if(operate == 'hide') {
      set.splice(memberInSet.i, 1)[0];
      // 不能为空
      if(set.length == 0) {
        let nextIndex = (curIndex + 1) % memberlist.length;
        set.push(memberlist[nextIndex]);
      }
    } else if(operate == 'normal') {
      let nextIndex = (curIndex + 1) % memberlist.length;
      let nextMemberInSet = this.findIndexInSet(set, memberlist[nextIndex].number)
      if(memberInSet && memberInSet.i == 0) {
        if(nextMemberInSet) {
          set.splice(nextMemberInSet.i, 1);
        }
        set.unshift(memberlist[nextIndex]);
      }
      set.push(v);

      _layoutSet[tab].displayList = this.sortByMemberList(set);
    }

    // 更新
    this.props.updateCustomLayoutSet(_layoutSet);
  }
  findIndexInSet(set, number) {
    let result = null
    $.each(set, function(i, v){
      if(v.number == number) {
        result = {
          i: i,
          v: v
        }
      }
    })
    return result
  }

  sortByMemberList(set){
    let MEMBERLIST = this.props.memberlist
    let setWithout0 = $('.SFU_cusaverage').hasClass('active') ? set.splice(0) : set.splice(1)     //除去第一个member 再进行排序
    let temp = []
    for(let i = 0; i < MEMBERLIST.length; i++) {
      for(let j = 0; j < setWithout0.length; j++) {
        if(MEMBERLIST[i]['number'] == setWithout0[j]['number']) {
          temp.push(setWithout0[j])
          break;
        }
      }
    }
    return set.concat(temp)
  }

  changeCustomMode(mode) {
    const {layoutSet} = this.props;
    const {tab} = this.state;
    let _layoutSet = JSON.parse(JSON.stringify(layoutSet));
    _layoutSet[tab].mode = mode;
    // 更新
    this.props.updateCustomLayoutSet(_layoutSet);
  }
  render() {
    const _this = this
    const { layoutSet, hdmi2State, hdmi1mode, memberlist } = this.props
    const { tab } = this.state
    // 左侧列表
    const customControlList = (
      <div className="custom-control-list" >
        {
          memberlist.map(function(v, i){
            let videoIndex = _this.getVideoIndex(v.number, layoutSet[tab].displayList);
            let name = v.name == 'null' ? callTr('a_10004') : v.trackId == 'Camera' ? callTr('a_10032') : v.name;
            let hideActive = videoIndex == -1 ? 'active' : '';
            let normalActive = (videoIndex == 0 && layoutSet[tab].mode == 'Average') || videoIndex > 0 ? 'active': '';
            let fullActive = videoIndex == 0 ? 'active' : '';
            return (
              <p key={i}>
                <span className="linename" title={name}>
                  {name}
                </span>
                {
                  v.trackId == 'Camera' ? <span className="layoutlocalicon" title={callTr('a_10032')}></span> : ''
                }
                <span
                  className={`hidescreen screendiv ${hideActive}`}
                  title={callTr('a_19339')}
                  onClick={() => _this.operate('hide',v, i, hideActive)}
                />
                <span
                  className={`normalscreen screendiv ${normalActive}`}
                  title={callTr('a_12168')}
                  onClick={() => _this.operate('normal', v, i, normalActive)}
                />
                {
                  layoutSet[tab].mode !== 'Average' ?
                  <span
                    className={`fullscreen screendiv ${fullActive}`}
                    title={callTr('a_12167')}
                    onClick={() => _this.operate('full', v, i, fullActive)}
                  /> : ''
                }
                
              </p>
            )
          })
        }
      </div>
    )
    
    return (
      <div className="custom-control custom-preview">
        {customControlList}
        <div className="custom-control-preview">
          {
            hdmi2State == '1' ?
            <div className="hdmi-tab">
              <span>
                <strong
                  className={tab == 0 ? 'active' : ''}
                  onClick={() => {
                    this.setState({ tab: 0 });
                  }}
                >
                  HDMI1
                </strong>
              </span>
              <span>
                <strong
                  className={tab == 1 ? 'active' : ''}
                  onClick={() => {
                    this.setState({ tab: 1 });
                  }}
                >
                  HDMI2
                </strong>
              </span>
            </div> : ''
          }
          <div className="custom-main">
            <ScreenItems set={layoutSet[tab]} />
          </div>
          <div className="cusmodecls">
            <ul>
              <li
                className={`cusmode cusoverlap ${layoutSet[tab].mode == 'Average' ? 'active' : ''}`}
                onClick={() => this.changeCustomMode('Average')}
              />
              <li
                className={`cusmode cuschildmother ${layoutSet[tab].mode == 'POP' ? 'active' : ''}`}
                onClick={() => this.changeCustomMode('POP')}
              />
              {
                memberlist.length <= 3 ?
                <li
                  className={`cusmode cuspop ${layoutSet[tab].mode == 'PIP' ? 'active' : ''}`}
                  onClick={() => this.changeCustomMode('PIP')}
                /> : ''
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomLayout;
