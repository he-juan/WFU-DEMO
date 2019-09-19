import React, { Component } from 'react'
import { Form } from 'antd'
import FormItem from '@/components/FormItem'
import API from '@/api'
import { $t } from '@/Intl'

class SystemInfo extends Component {
  state = {
    sysInfo: {}
  }
  componentDidMount () {
    Promise.all([
      API.getPvalues(['Phw_rev', 'P68', 'P7033', 'P69', 'P70', 'Pand_rev', 'Plcd_sn', 'Pddr_sn', 'Pfct_sn', 'Pcpe_version', 'Pcpe_running']),
      API.getSysProduct(),
      API.getSysPn(),
      API.getSysUptime()
    ]).then(data => {
      let sysInfo = Object.assign({}, data[0], data[1], data[2])
      sysInfo.uptime = this.parseUpTime(data[3])
      this.setState({
        sysInfo
      })
    })
  }

  parseUpTime = (timeInfo) => {
    const { Day, Hour, Min, Sec } = timeInfo
    return `${Day + $t('c_088')}, ${Hour + $t('c_089')}, ${Min + $t('c_090')}, ${Sec + $t('c_091')}`
  }
  render () {
    const { sysInfo } = this.state
    return (
      <Form>
        {/* 产品型号 */}
        <FormItem lang='sta_016'>
          {sysInfo['Product'] || ''}
        </FormItem>
        {/* 硬件版本 */}
        <FormItem lang='sta_017'>
          {sysInfo['Phw_rev'] || ''}
        </FormItem>
        {/* PN值 */}
        <FormItem lang='sta_018'>
          {sysInfo['PN'] || ''}
        </FormItem>
        {/* 系统版本 */}
        <FormItem lang='sta_019'>
          {sysInfo['P68'] || ''}
        </FormItem>
        {/* Recovery版本 */}
        <FormItem lang='sta_020'>
          {sysInfo['P7033'] || ''}
        </FormItem>
        {/* 引导程序 */}
        <FormItem lang='sta_021'>
          {sysInfo['P69'] || ''}
        </FormItem>
        {/* 内核版本 */}
        <FormItem lang='sta_022'>
          {sysInfo['P70'] || ''}
        </FormItem>
        {/* Android™版本 */}
        <FormItem lang='sta_023'>
          {sysInfo['Pand_rev'] || ''}
        </FormItem>
        {/* CPE版本 */}
        <FormItem lang='sta_024' hide={sysInfo['Pcpe_running'] === '' || sysInfo['Pcpe_running'] === '0'}>
          {sysInfo['Pcpe_version'] || ''}
        </FormItem>
        {/* 运行时长 */}
        <FormItem lang='sta_025'>
          {sysInfo['uptime'] || ''}
        </FormItem>
      </Form>
    )
  }
}

export default SystemInfo
