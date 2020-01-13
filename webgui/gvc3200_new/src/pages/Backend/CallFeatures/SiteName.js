import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button, message } from 'antd'
import ColorPicker from '@/components/ColorPicker'
import FormItem, { CheckboxItem, SelectItem, InputItem, SliderItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import API from '@/api'
import { $t } from '@/Intl'

@Form.create()
class SiteName extends FormCommon {
  options = getOptions('CallFeature.SiteName')

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    API.getSiteNameInfo().then(msg => {
      if (msg.Response === 'Success') {
        let data = msg.Data[0]
        setFieldsValue({
          sitename: data['Sitename'],
          bgtp: data['bg_tp'],
          dispos: data['displayposition'],
          disdura: data['displayduration'],
          fontcolor: data['fontcolor'],
          fontsize: data['fontsize'],
          bold: data['bold'],
          horizont: data['horizont'],
          vertical: data['vertical']
        })
      }
    })
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        const { sitename, bgtp, dispos, disdura: disduration, fontcolor, fontsize, bold, horizont, vertical } = values
        Promise.all([
          API.setSitesettingInfo({ sitename, bgtp, dispos, disduration, fontcolor: encodeURIComponent(fontcolor), fontsize, bold }),
          API.setSitesettingOffset({ vertical: vertical, direction: 'y' }),
          API.setSitesettingOffset({ horizont: horizont, direction: 'x' })
        ]).then((m) => {
          if (m.filter(r => r.res !== 'success').length === 0) {
            message.success('保存成功!')
          }
        })
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form>
        {/* 会场名称 */}
        <InputItem
          {...options['sitename']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen(16)
            ]
          }}
        />
        {/* 背景透明度 */}
        <SelectItem
          {...options['bgtp']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_144') },
            { v: '1', t: '5%' },
            { v: '2', t: '10%' },
            { v: '3', t: '15%' },
            { v: '4', t: '20%' }
          ]}
        />
        {/* 显示位置 */}
        <SelectItem
          {...options['dispos']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_145') },
            { v: '1', t: $t('c_146') },
            { v: '2', t: $t('c_147') },
            { v: '3', t: $t('c_148') }
          ]}
        />
        {/* 显示时间 */}
        <SelectItem
          {...options['disdura']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_149') },
            { v: '1', t: '1 ' + $t('c_090') },
            { v: '2', t: '5 ' + $t('c_090') },
            { v: '3', t: '10 ' + $t('c_090') },
            { v: '4', t: $t('c_150') }
          ]}
        />
        {/* 字体颜色 */}
        <FormItem {...options['fontcolor']}>
          {
            gfd('fontcolor')(
              <ColorPicker />
            )
          }
        </FormItem>
        {/* 字体大小 */}
        <SelectItem
          {...options['fontsize']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_151') },
            { v: '1', t: $t('c_152') },
            { v: '2', t: $t('c_153') },
            { v: '3', t: $t('c_154') },
            { v: '4', t: $t('c_155') },
            { v: '5', t: $t('c_156') },
            { v: '6', t: $t('c_157') }
          ]}
        />
        {/* 是否加粗 */}
        <CheckboxItem
          {...options['bold']}
          gfd={gfd}
        />
        {/* 水平偏移 */}
        <SliderItem
          {...options['horizont']}
          gfd={gfd}
          min={0}
          max={96}
        />
        {/* 垂直偏移 */}
        <SliderItem
          {...options['vertical']}
          gfd={gfd}
          min={0}
          max={96}
        />
        <FormItem>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default SiteName
