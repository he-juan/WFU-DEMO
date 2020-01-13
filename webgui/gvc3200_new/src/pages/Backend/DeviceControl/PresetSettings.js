import React, { Component } from 'react'
import { Tooltip, Modal, Input, Button, message, Spin } from 'antd'
import API from '@/api'
import './PresetSettings.less'
import { deepCopy } from '@/utils/tools'
import EPTZControl from '@/components/EPTZControl'
import { $t } from '@/Intl'

class PresetSettings extends Component {
  state = {
    dataLoading: false,
    presetsData: Array(24).fill(null),
    posApplied: -1,
    posEditing: null
  }

  componentDidMount () {
    this.getPresetInfo()
  }

  // 获取预置位列表
  getPresetInfo = () => {
    this.setState({
      dataLoading: true
    })
    let presetsData = Array(24).fill(null)
    return API.getPresetInfo().then(m => {
      if (m.Response === 'success') {
        m.Data.forEach(item => {
          let pos = parseInt(item.position)
          if (pos > 24) return false
          presetsData[pos] = item
        })
        this.setState({
          presetsData
        })
      }
      this.setState({
        dataLoading: false
      })
    })
  }

  // 应用预置位
  applyPreset = (pos) => {
    API.gotoPreset(pos).then(m => {
      // 接口有点问题 暂时这样处理, 后续看情况再改
      if (m.Response === 'Success') {
        this.setState({
          posApplied: Number(pos)
        })
      }
    })
  }

  // 编辑预置位
  handleEdit = (item) => {
    this.setState({
      posEditing: item
    })
  }

  // 取消编辑并关闭弹窗
  cancelEdit = () => {
    this.setState({
      posEditing: null
    })
  }

  // 删除预置位
  handleDelPreset = () => {
    const { posEditing: { position }, presetsData } = this.state
    message.loading($t('m_015'))
    API.deletePreset(position).then(() => {
      message.success($t('m_013'))
      message.destroy()
      this.cancelEdit()
      let _presetsData = deepCopy(presetsData)
      _presetsData[parseInt(position)] = null
      this.setState({
        presetsData: _presetsData
      })
    })
  }

  handleSavePreset = () => {
    const { posEditing: { position, name }, presetsData } = this.state
    message.loading($t('m_038'))
    API.addPreset(position).then(() => {
      message.success($t('m_001'))
      message.destroy()
      this.cancelEdit()
      let _presetsData = deepCopy(presetsData)
      _presetsData[parseInt(position)] = { position, name }
      this.setState({
        presetsData: _presetsData
      })
      API.addPreset('100')
    })
  }

  // 修改预置位名称
  handlePresetName = (e) => {
    const { posEditing } = this.state
    this.setState({
      posEditing: Object.assign({}, posEditing, { name: e.target.value })
    })
  }

  render () {
    const { presetsData, posApplied, posEditing, dataLoading } = this.state
    return (
      <Spin spinning={dataLoading} wrapperClassName='common-loading-spin'>
        <div className='preset-page'>
          <ul className='preset-box'>
            {
              presetsData.map((item, i) => {
                if (item) {
                  return (
                    <li key={i} >
                      <Tooltip title={$t('c_034')} overlayClassName='white' >
                        <div className='preset-item saved' onClick={() => this.applyPreset(item.position) }>
                          <h5 className='preset-title'>
                            <span>{i + 1}</span>
                            {item.name ? <strong>{item.name}</strong> : null}
                          </h5>
                          <img alt={i} src={`/com.base.module.preset/${item.position}.jpg?${new Date().getTime()}`}/>
                          {posApplied === i ? <span className='apply-words'>{$t('c_036')}</span> : null}
                          <i className='icons icon-edit preset-edit' onClick={() => this.handleEdit(item)} />
                        </div>
                      </Tooltip>
                    </li>
                  )
                }
                return (
                  <li className='preset-item' key={i} onClick={() => this.handleEdit({ position: i, name: '', notUsed: 1 })}>
                    <Tooltip title={$t('c_035')} overlayClassName='white'>
                      <div className='preset-item'>
                        <em>{i + 1}</em>
                      </div>
                    </Tooltip>
                  </li>
                )
              })
            }
          </ul>
          <Modal
            title={null}
            footer={null}
            width={380}
            visible={!!posEditing}
            onCancel={() => this.cancelEdit()}
            className='preset-edit-modal'
          >
            <h4>{$t('c_037')}</h4>
            <Input type='text' value={posEditing && posEditing.name} onChange={this.handlePresetName}/>
            <h4>{$t('c_038')}</h4>
            <EPTZControl />
            <div className='edit-btns'>
              <Button type='danger' className='preset-del-btn' onClick={this.handleDelPreset} disabled={posEditing && !!posEditing.notUsed}>{$t('b_003')}</Button>
              <Button type='primary' className='preset-save-btn' onClick={this.handleSavePreset}>{$t('b_001')}</Button>
            </div>
          </Modal>
        </div>
      </Spin>
    )
  }
}

export default PresetSettings
