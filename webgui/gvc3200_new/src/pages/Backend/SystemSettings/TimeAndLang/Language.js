import React from 'react'
import FormCommon from '@/components/FormCommon'
import FormItem from '@/components/FormItem'
import { Form, Upload, Button, Icon, Cascader, message, Modal } from 'antd'
import { getOptions } from '@/template'
import API from '@/api'
import { history } from '@/App'
import './Language.less'
import { $t } from '@/Intl'

@Form.create()
class Language extends FormCommon {
  constructor () {
    super()
    this.options = getOptions('System.TimeAndLang.Language')

    this.state = {
      hasCustom: false, // 是否存在自定义语言文件
      localeList: [], // 可选的语言列表
      curLanguage: [] // 当前语言
    }

    let _this = this
    this.uploadConfig = {
      name: 'file',
      showUploadList: false,
      accept: '.txt',
      action: '/upload?type=importlan',
      onChange (info) {
        const { response, status } = info.file
        if (response && response.indexOf('Authentication Required') > -1) {
          history.push(`/login?redirect=${encodeURIComponent(history.location.pathname)}`)
          return false
        }
        if (status === 'done') {
          API.importLang().then(m => {
            if (m.res === 'success') {
              message.success($t('m_018'))
              _this.checkCustom()
            }
          })
        } else if (status === 'error') {
          message.error($t('m_019'))
        }
      }
    }
  }
  componentDidMount () {
    this.initLanguageAndList()
    this.checkCustom()
  }
  // 是否有自定义语言文件
  checkCustom = () => {
    API.custLanExist().then(m => {
      this.setState({
        hasCustom: m.isExist === '1'
      })
    })
  }
  // 初始化语言列表以及相应的值
  initLanguageAndList = () => {
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

      this.setState({
        curLanguage: [langLv0, langLv1],
        localeList: localeList
      }, () => {
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
          this.setState({
            localeList: localeList
          })
        } else {
          this.updateLocalListWithLv1(langLv0)
        }
      })
    })
  }
  // 获取次级语言列表
  handleLoadLv1List = (selOptions) => {
    let targetOption = selOptions[selOptions.length - 1]
    let langLv0 = targetOption.value
    this.updateLocalListWithLv1(langLv0)
  }
  // 获取次级语言列表并更新整个语言列表
  updateLocalListWithLv1 = (langLv0) => {
    let { localeList } = this.state
    API.getLocaleList(1, langLv0).then(data => {
      let _localeList = localeList.map(item => {
        if (item.value === langLv0) {
          item.children = this.parseLocaleList(data.localeList, true)
        }
        return item
      })
      this.setState({ localeList: _localeList })
    })
  }
  //
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
  handleLanChange = (v) => {
    this.setState({
      curLanguage: v
    })
  }
  handleDelCustom = () => {
    let modal = Modal.confirm({
      title: <span>{$t('m_036')}</span>,
      okText: <span>{$t('b_002')}</span>,
      onOk: () => {
        API.rmCustlan().then(m => {
          if (m.res === 'success') {
            this.checkCustom()
          }
        })
        modal.destroy()
      },
      cancelText: <span>{$t('b_005')}</span>,
      onCancel () {}
    })
  }
  handleSubmit = () => {
    const { curLanguage } = this.state
    const lan = curLanguage[curLanguage.length - 1]
    API.putLanguage(lan).then(m => {
      if (m.res === 'success') {
        message.success($t('m_001'))
      } else {
        message.error($t('m_002'))
      }
    })
  }
  render () {
    const { hasCustom, localeList, curLanguage } = this.state
    const options = this.options

    return (
      <Form>
        {/* 语言选择 */}
        <FormItem {...options['curLanguage']}>
          <Cascader
            value={curLanguage}
            options={localeList}
            onChange={this.handleLanChange}
            loadData={this.handleLoadLv1List}
            allowClear={false}
          />
        </FormItem>
        {/* 选择语言文件 */}
        <FormItem {...options['importlan']}>
          <Upload {...this.uploadConfig}>
            <Button><Icon type='upload' />{$t(hasCustom ? 'b_015' : 'b_016')}</Button>
          </Upload>
          { hasCustom ? <i onClick={this.handleDelCustom} className='icons icon-del-customfile'></i> : null}
        </FormItem>
        <FormItem>
          <Button className='sub-btn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Language
