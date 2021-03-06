import React, { Component } from 'react'
import { Form } from 'antd'
import FormItem from '@/components/FormItem'
import API from '@/api'
import { $t } from '@/Intl'

class RemoteControlStatus extends Component {
  state = {
    rcStatus: {}
  }

  componentDidMount () {
    // Premote_patch_ver 已废弃 改为 P25027
    API.getPvalues(['Premote_battery', 'P25026', 'P25028', 'P25027']).then(data => {
      this.setState({
        rcStatus: data
      })
    })
  }

  render () {
    const { rcStatus } = this.state
    const unknown = $t('c_092')

    return (
      <Form>
        {/* 硬件版本 */}
        <FormItem lang='sta_026'>
          {rcStatus['P25028'] || unknown}
        </FormItem>
        {/* 软件版本 */}
        <FormItem lang='sta_027'>
          {rcStatus['P25026'] || unknown}
        </FormItem>
        {/* 补丁版本 */}
        <FormItem lang='sta_028'>
          {rcStatus['P25027'] || unknown}
        </FormItem>
        {/* 遥控器电量 */}
        <FormItem lang='sta_029'>
          {rcStatus['Premote_battery'] ? `${rcStatus['Premote_battery']}%` : unknown}
        </FormItem>
      </Form>
    )
  }
}

export default RemoteControlStatus
