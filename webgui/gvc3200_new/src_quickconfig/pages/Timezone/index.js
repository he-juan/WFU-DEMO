
import React, { Component } from 'react'
import { Picker, List, Button } from 'antd-mobile'
import { Link } from 'react-router-dom'
import API from '../../api'
import { history } from '../../QuickConfigApp'
import { GlobalContext } from '../../ContextProvider'
import { $t } from '../../Intl'

class Timezone extends Component {
  static contextType = GlobalContext

  componentDidMount () {
    this.initTimezone()
  }

  // 获取时区列表以及相应的值
  initTimezone = () => {
    const { curLocale, timezoneList, setTimezone, setTimezoneList } = this.context
    if (timezoneList.length > 0) return false
    API.getTimezone(curLocale[0]).then(data => {
      let _timezonelist = []
      let flag = false
      data.list.forEach(item => {
        _timezonelist.push({ value: item.id, label: item.name })
        if (item.id === data.timezone.id) {
          flag = true
        }
      })
      if (!flag) {
        _timezonelist.push({ value: data.timezone.id, label: data.timezone.name })
      }
      setTimezone([data.timezone.id])
      setTimezoneList(_timezonelist)
    })
  }

  handlePickLang = (v) => {
    this.context.setTimezone(v)
  }
  handleSubmit = () => {
    let timezoneValue = this.context.timezone[0]
    API.saveTimeSet(timezoneValue).then(m => {
      if (m.res === 'success') {
        history.replace('/network')
      }
    })
  }
  render () {
    const { timezone, timezoneList } = this.context
    return (
      <div className='page timezone-page'>
        <h3>{$t('c_047') }</h3>
        <List>
          <Picker
            data={timezoneList}
            cols={1}
            value={timezone}
            onPickerChange={this.handlePickLang}
          >
            <List.Item arrow='horizontal'>{$t('c_006')}</List.Item>
          </Picker>
        </List>
        <div className='page-footer'>
          <div className='link-btns'>
            <Link className='link-btn' to='/language' replace>
              {$t('c_002')}
            </Link>
            <Button type='primary' onClick={this.handleSubmit}>
              {$t('c_001')}
            </Button>
          </div>
          <p>2/5</p>
        </div>
      </div>
    )
  }
}

export default Timezone
