import React, { Component } from 'react'
import { Picker, List, Button } from 'antd-mobile'
import API from '../../api'
import { history } from '../../QuickConfigApp'
import { GlobalContext } from '../../ContextProvider'
import { $t } from '../../Intl'

class Language extends Component {
  static contextType = GlobalContext

  componentDidMount () {
    this.initLanguageAndList()
  }

  // 初始化语言列表以及相应的值
  initLanguageAndList = () => {
    const { localeList, setCurLocale, setLocaleList } = this.context
    if (localeList.length) return false
    Promise.all([
      API.getLanguage(),
      API.getLocaleList(0, '')
    ]).then(data => {
      let { locale: langLv1, name } = data[0]
      let { localeList } = data[1]
      localeList = this.parseLocaleList(localeList, false)
      let tmpArr = langLv1.split('_')
      tmpArr.pop()
      let langLv0 = tmpArr.join('_')

      setCurLocale([langLv0, langLv1])

      // 初始化lv1的列表
      if (localeList.filter(item => item.value === langLv0).length === 0) {
        if (name.indexOf('(') !== -1) {
          let firstIndex = name.indexOf('(')
          let lastIndex = name.indexOf(')')
          let firstStr = name.substring(0, firstIndex)
          let lastStr = name.substring(firstIndex + 1, lastIndex)
          localeList.push({
            label: firstStr,
            value: langLv0,
            children: [
              {
                label: lastStr,
                value: langLv1
              }
            ]
          })
        } else {
          localeList.push({
            label: name,
            value: langLv0,
            children: [
              {
                label: name,
                value: langLv1
              }
            ]
          })
        }

        setLocaleList(localeList)
      } else {
        this.updateLocalListWithLv1(langLv0, localeList)
      }
    })
  }
  // 获取次级语言列表并更新整个语言列表
  updateLocalListWithLv1 = (langLv0, localeList) => {
    const { setLocaleList } = this.context
    let _localeList = JSON.parse(JSON.stringify(localeList))
    let localeLv0Item = _localeList.find(item => item.value === langLv0)
    if (localeLv0Item.children) return Promise.resolve(localeLv0Item.children)
    return API.getLocaleList(1, langLv0).then(data => {
      localeLv0Item.children = this.parseLocaleList(data.localeList, true)
      setLocaleList(_localeList)
      return Promise.resolve(localeLv0Item.children)
    })
  }
  parseLocaleList = (list, isLeaf) => {
    let result = []
    for (let i = 0; i < list.length; i++) {
      let { name: label, locale: value } = list[i]
      if (result.some(item => item.value === value)) {
        continue
      }
      result.push({
        label,
        value,
        isLeaf
      })
    }
    return result
  }

  handlePickLang = (v) => {
    const { setCurLocale, localeList } = this.context
    this.updateLocalListWithLv1(v[0], localeList).then((lv1Options) => {
      setCurLocale(v.length === 1 ? [...v, lv1Options[0].value] : v)
    })
  }

  handleSubmit = () => {
    const { curLocale } = this.context
    if (curLocale.length === 0) return history.replace('/timezone')
    const lan = curLocale[curLocale.length - 1]
    API.putLanguage(lan).then(m => {
      history.replace('/timezone')
    })
  }
  render () {
    const { localeList, curLocale } = this.context
    return (
      <div className='page language-page'>
        <h3>{$t('c_046')}</h3>
        <List>
          <Picker
            data={localeList}
            cols={2}
            value={curLocale}
            onPickerChange={this.handlePickLang}
          >
            <List.Item arrow='horizontal'>{$t('c_005')}</List.Item>
          </Picker>
        </List>
        <div className='page-footer'>
          <div className='link-btns'>
            <Button type='primary' onClick={this.handleSubmit}>
              {$t('c_001')}
            </Button>
          </div>
          <p>1/5</p>
        </div>
      </div>
    )
  }
}

export default Language
