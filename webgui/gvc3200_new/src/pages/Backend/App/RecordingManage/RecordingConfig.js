import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button, Select } from 'antd'
import FormItem, { SelectItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import API from '@/api'
import { $t } from '@/Intl'

@Form.create()
class RecordingConifg extends FormCommon {
  constructor (props) {
    super(props)

    this.state = {
      pathList: [], // 路径列表
      curPath: '', // 当前路径
      tempPath: ''
    }

    this.options = getOptions('App.RecordingManage.RecordingConfig')
  }

  async componentDidMount () {
    const { setFieldsValue } = this.props.form

    let data1 = await this.initFormValue(this.options)
    let data2 = await this.handleGetRecordingPath()

    setFieldsValue(data1)
    this.setState({
      pathList: data2.list || [],
      curPath: data2.curpath || ''
    })
  }

  // 获取 设置录像路径
  handleGetRecordingPath = () => {
    return new Promise((resolve, reject) => {
      API.getRecordingPath().then(msgs => {
        if (+msgs.result === 0 && msgs.data) {
          resolve(msgs.data)
        } else {
          resolve({ list: [], curpath: '' })
        }
      })
    })
  }

   // 路径 change
   handleChangeRecordPath = (value) => {
     this.setState({ tempPath: value })
   }

  // 保存路径列表
  buildPathSelect = () => {
    let { pathList, curPath, tempPath } = this.state
    let children = []
    if (pathList.length > 0) {
      let isExist = pathList.find(item => item === curPath)
      !isExist && (curPath = pathList[0])

      pathList.forEach((item, index) => {
        children.push(<Select.Option value={item} key={item}>{$t('c_030') + (index + 1)}</Select.Option>)
      })
      tempPath && (curPath = tempPath)
      return (
        <Select value={curPath} onChange={this.handleChangeRecordPath} getPopupContainer={(triggerNode) => { return triggerNode }}>
          {children}
        </Select>
      )
    } else {
      return (
        <Select placeholder={$t('m_047')} disabled={true} >
          {children}
        </Select>
      )
    }
  }

  // 保存 存储路径
  handleSaveRecordPath = () => {
    let { tempPath } = this.state
    if (tempPath) {
      API.setRecordingPath(tempPath).then(msgs => {
        if (+msgs.result === 0) {
          this.handleGetRecordingPath().then(data => {
            this.setState({
              pathList: data['list'] || [],
              curPath: data['curpath']
            })
          })
        }
      })
    }
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.handleSaveRecordPath()
        this.submitFormValue(values)
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form>
        {/* 保存路径 */}
        <FormItem {...options['record_path']}>
          {this.buildPathSelect()}
        </FormItem>
        {/* 录制模式 */}
        <SelectItem
          gfd={gfd}
          {...options['Pvideo_record_mode']}
          selectOptions={[
            { v: 'camera', t: $t('c_339') },
            { v: 'auto', t: $t('c_340') }
          ]}
        />
        <FormItem>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default RecordingConifg
