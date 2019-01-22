import React from 'react'
import './layoutModal_sfu.css'

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

const getItemStyles = (mode, length) => {
  if(mode === 'Average' || mode === 'sysrcmd' || mode === 'remote') {
    switch(length) {
      case 1:
        return [{height: '90%', width: '90%', left: '5%', top: '5%'}];
      case 2:
        return [
          {height: '50%', width: '42%', left: '5%', top: '25%'},
          {height: '50%', width: '42%', right: '5%', top: '25%'}
        ];
      case 3: 
        return [
          {height: '41%', width: '43%', left: '29%', top: '7%'},
          {height: '41%', width: '43%', left: '5%', bottom: '7%'},
          {height: '41%', width: '43%', right: '5%', bottom: '7%'}
        ];
      case 4:
        return [
          {height: '40%', width: '42%', left: '5%', top: '7%'},
          {height: '40%', width: '42%', right: '5%', top: '7%'},
          {height: '40%', width: '42%', left: '5%', bottom: '7%'},
          {height: '40%', width: '42%', right: '5%', bottom: '7%'}
        ];
      case 5:
        return [
          {height: '40%', width: '30%', left: '18.5%', top: '7%'},
          {height: '40%', width: '30%', right: '18.5%', top: '7%'},
          {height: '40%', width: '30%', left: '2%', bottom: '7%'},
          {height: '40%', width: '30%', right: '35%', bottom: '7%'},
          {height: '40%', width: '30%', right: '2%', bottom: '7%'}
        ]   
    }
  } else if(mode == 'POP') {
    switch(length) {
      case 1:
        return [{height: '90%', width: '90%', left: '5%', top: '5%'}];
      case 2:
        return [
          {height: '80%', width: '60%', left: '3%', top: '10%'},
          {height: '40%', width: '32%', right: '3%', top: '30%'}
        ];
      case 3: 
        return [
          {height: '80%', width: '60%', left: '3%', top: '10%'},
          {height: '38%', width: '32%', right: '3%', top: '10%'},
          {height: '38%', width: '32%', right: '3%', bottom: '10%'}
        ];
      case 4:
        return [
          {height: '62%', width: '62%', left: '3%', top: '3%'},
          {height: '29%', width: '30%', right: '3%', top: '3%'},
          {height: '29%', width: '30%', right: '3%', top: '36%'},
          {height: '29%', width: '30%', left: '3%', bottom: '3%'}
        ];
      case 5:
        return [
          {height: '62%', width: '62%', left: '3%', top: '3%'},
          {height: '29%', width: '30%', right: '3%', top: '3%'},
          {height: '29%', width: '30%', right: '3%', top: '36%'},
          {height: '29%', width: '30%', left: '3%', bottom: '3%'},
          {height: '29%', width: '30%', left: '35%', bottom: '3%'}
        ];   

    }
  } else if (mode == 'PIP') {
    switch(length) {
      case 1: 
        return [{height: '90%', width: '90%', left: '5%', top: '5%'}];
      case 2: 
        return [
          {height: '90%', width: '90%', left: '5%', top: '5%'},
          {height: '30%', width: '30%', right: '5%', bottom: '5%', border: '2px solid #aaa'}
        ];
      case 3: 
        return [
          {height: '90%', width: '90%', left: '5%', top: '5%'},
          {height: '30%', width: '30%', right: '5%', bottom: '5%', border: '2px solid #aaa'},
          {height: '30%', width: '30%', left: '5%', bottom: '5%', border: '2px solid #aaa'}
        ];
    }
  }
}



const ScreenItems = ({set}) => {
  if(!set) return false
  let { mode, displayList } = set
  let styles = getItemStyles(mode, displayList.length)
  return (
    <div className="SFU_ScreenItems">
      {
        displayList.map((v, i) => {
          return <div className="preview-item" style={styles[i]} key={i}>
                  {
                    v.name == 'null' /**演示 */ ?　
                    <p><strong>{callTr('a_10004')}</strong></p> : 
                    v.trackId == 'Camera' ?
                    <p><strong>{callTr('a_10032')}</strong></p> :   
                    <p><strong>{v.name}</strong><span>{v.number}</span></p> 
                  }
                  
                </div>
        })
      }
    </div>
  )
}


export default ScreenItems