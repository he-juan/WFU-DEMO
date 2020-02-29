import React from 'react'
import { Form, Row, Col, Select, Input, Button, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import { $t } from '@/Intl'
import './NetworkDir.less'
import API from '@/api'

@Form.create()
class NetworkDir extends FormCommon {
  configs = [
    { label: 'c_454', enabled: 'P2971', name: 'P2972' }, // 群组目录
    { label: 'c_456', enabled: 'P2973', name: 'P2974' }, // 企业目录
    { label: 'c_453', enabled: 'P2975', name: 'P2976' }, // 群组常用
    { label: 'c_455', enabled: 'P2977', name: 'P2978' }, // 企业常用
    { label: 'c_452', enabled: 'P2979', name: 'P2980' }, // 个人目录
    { label: 'c_457', enabled: 'P8343', name: 'P8344' }, // Polycom电话簿
    { label: 'c_460', enabled: 'P2981', name: 'P2982' }, // 未接来电记录
    { label: 'c_461', enabled: 'P2983', name: 'P2984' }, // 拨打记录
    { label: 'c_462', enabled: 'P2985', name: 'P2986' } // 接听记录
  ].filter(i => !!i)

  componentDidMount () {
    let pvalues = []
    this.configs.forEach(item => {
      pvalues.push(item.enabled, item.name)
    })
    API.getPvalues(pvalues).then(data => {
      data['P2971'] = data['P2971'] || '0'
      data['P2973'] = data['P2973'] || '0'
      data['P2975'] = data['P2975'] || '0'
      data['P2977'] = data['P2977'] || '0'
      data['P2979'] = data['P2979'] || '0'
      data['P8343'] = data['P8343'] || '0'
      data['P2981'] = data['P2981'] || '0'
      data['P2983'] = data['P2983'] || '0'
      data['P2985'] = data['P2985'] || '0'
      this.props.form.setFieldsValue(data)
    })
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        API.putPvalues(values).then(() => {
          message.success($t('m_001'))
        })
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    return (
      <Form className='broadsoft-network-dirs'>
        <Row className='row-header'>
          <Col span={4}>{$t('c_458')}</Col>
          <Col span={6}></Col>
          <Col span={6} offset={2}>{$t('c_459')}</Col>
        </Row>
        {
          this.configs.map((config, i) => {
            return (
              <Row key={i} className='row-list'>
                <Col span={4}>{$t(config.label)}</Col>
                <Col span={6}>
                  <Form.Item>
                    {
                      gfd(config.enabled)(
                        <Select>
                          <Select.Option value='0'>{$t('c_391')}</Select.Option>
                          <Select.Option value='1'>{$t('c_399')}</Select.Option>
                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={6} offset={2}>
                  <Form.Item>
                    {
                      gfd(config.name)(
                        <Input />
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
            )
          })
        }
        <p className='bak-form-item'>
          <Button type='primary' className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </p>
      </Form>
    )
  }
}

export default NetworkDir
