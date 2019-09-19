import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button } from 'antd'
import FormItem, { SelectItem, InputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { $t } from '@/Intl'
import { rebootNotify } from '@/utils/tools'

const contryCode = [{ 'code': 'AF', 'coun': 'Afghanistan' }, { 'code': 'AX', 'coun': 'Aland Islands' },
  { 'code': 'AL', 'coun': 'Albania' }, { 'code': 'DZ', 'coun': 'Algeria' },
  { 'code': 'AS', 'coun': 'American Samoa' }, { 'code': 'AD', 'coun': 'Andorra' },
  { 'code': 'AO', 'coun': 'Angola' }, { 'code': 'AI', 'coun': 'Anguilla' },
  { 'code': 'AQ', 'coun': 'Antarctica' }, { 'code': 'AG', 'coun': 'Antigua and Barbuda' },
  { 'code': 'AR', 'coun': 'Argentina' }, { 'code': 'AM', 'coun': 'Armenia' },
  { 'code': 'AW', 'coun': 'Aruba' }, { 'code': 'AU', 'coun': 'Australia' },
  { 'code': 'AT', 'coun': 'Austria' }, { 'code': 'AZ', 'coun': 'Azerbaijan' },
  { 'code': 'BS', 'coun': 'Bahamas' }, { 'code': 'BH', 'coun': 'Bahrain' },
  { 'code': 'BD', 'coun': 'Bangladesh' }, { 'code': 'BB', 'coun': 'Barbados' },
  { 'code': 'BY', 'coun': 'Belarus' }, { 'code': 'BE', 'coun': 'Belgium' },
  { 'code': 'BZ', 'coun': 'Belize' }, { 'code': 'BJ', 'coun': 'Benin' },
  { 'code': 'BM', 'coun': 'Bermuda' }, { 'code': 'BT', 'coun': 'Bhutan' },
  { 'code': 'BO', 'coun': 'Bolivia (Plurinational State of)' }, { 'code': 'BQ', 'coun': 'Bonaire, Sint Eustatius and Saba' },
  { 'code': 'BA', 'coun': 'Bosnia and Herzegovina' }, { 'code': 'BW', 'coun': 'Botswana' },
  { 'code': 'BV', 'coun': 'Bouvet Island' }, { 'code': 'BR', 'coun': 'Brazil' },
  { 'code': 'IO', 'coun': 'British Indian Ocean Territory' }, { 'code': 'BN', 'coun': 'Brunei Darussalam' },
  { 'code': 'BG', 'coun': 'Bulgaria' }, { 'code': 'BF', 'coun': 'Burkina Faso' },
  { 'code': 'BI', 'coun': 'Burundi' }, { 'code': 'CV', 'coun': 'Cabo Verde' },
  { 'code': 'KH', 'coun': 'Cambodia' }, { 'code': 'CM', 'coun': 'Cameroon' },
  { 'code': 'CA', 'coun': 'Canada' }, { 'code': 'KY', 'coun': 'Cayman Islands' },
  { 'code': 'CF', 'coun': 'Central African Republic' }, { 'code': 'TD', 'coun': 'Chad' },
  { 'code': 'CL', 'coun': 'Chile' }, { 'code': 'CN', 'coun': 'China' },
  { 'code': 'CX', 'coun': 'Christmas Island' }, { 'code': 'CC', 'coun': 'Cocos (Keeling) Islands' },
  { 'code': 'CO', 'coun': 'Colombia' }, { 'code': 'KM', 'coun': 'Comoros' },
  { 'code': 'CG', 'coun': 'Congo' }, { 'code': 'CD', 'coun': 'Congo (Democratic Republic of the)' },
  { 'code': 'CK', 'coun': 'Cook Islands' }, { 'code': 'CR', 'coun': 'Costa Rica' },
  { 'code': 'CI', 'coun': "Côte d'Ivoire" }, { 'code': 'HR', 'coun': 'Croatia' },
  { 'code': 'CU', 'coun': 'Cuba' }, { 'code': 'CW', 'coun': 'Curaçao' },
  { 'code': 'CY', 'coun': 'Cyprus' }, { 'code': 'CZ', 'coun': 'Czechia' },
  { 'code': 'DK', 'coun': 'Denmark' }, { 'code': 'DJ', 'coun': 'Djibouti' },
  { 'code': 'DM', 'coun': 'Dominica' }, { 'code': 'DO', 'coun': 'Dominican Republic' },
  { 'code': 'EC', 'coun': 'Ecuador' }, { 'code': 'EG', 'coun': 'Egypt' },
  { 'code': 'SV', 'coun': 'El Salvador' }, { 'code': 'GQ', 'coun': 'Equatorial Guinea' },
  { 'code': 'ER', 'coun': 'Eritrea' }, { 'code': 'EE', 'coun': 'Estonia' },
  { 'code': 'ET', 'coun': 'Ethiopia' }, { 'code': 'FK', 'coun': 'Falkland Islands (Malvinas)' },
  { 'code': 'FO', 'coun': 'Faroe Islands' }, { 'code': 'FJ', 'coun': 'Fiji' },
  { 'code': 'FI', 'coun': 'Finland' }, { 'code': 'FR', 'coun': 'France' },
  { 'code': 'GF', 'coun': 'French Guiana' }, { 'code': 'PF', 'coun': 'French Polynesia' },
  { 'code': 'TF', 'coun': 'French Southern Territories' }, { 'code': 'GA', 'coun': 'Gabon' },
  { 'code': 'GM', 'coun': 'Gambia' }, { 'code': 'GE', 'coun': 'Georgia' },
  { 'code': 'DE', 'coun': 'Germany' }, { 'code': 'GH', 'coun': 'Ghana' },
  { 'code': 'GI', 'coun': 'Gibraltar' }, { 'code': 'GR', 'coun': 'Greece' },
  { 'code': 'GL', 'coun': 'Greenland' }, { 'code': 'GD', 'coun': 'Grenada' },
  { 'code': 'GP', 'coun': 'Guadeloupe' }, { 'code': 'GU', 'coun': 'Guam' },
  { 'code': 'GT', 'coun': 'Guatemala' }, { 'code': 'GG', 'coun': 'Guernsey' },
  { 'code': 'GN', 'coun': 'Guinea' }, { 'code': 'GW', 'coun': 'Guinea-Bissau' },
  { 'code': 'GY', 'coun': 'Guyana' }, { 'code': 'HT', 'coun': 'Haiti' },
  { 'code': 'HM', 'coun': 'Heard Island and McDonald Islands' }, { 'code': 'VA', 'coun': 'Holy See' },
  { 'code': 'HN', 'coun': 'Honduras' }, { 'code': 'HK', 'coun': 'Hong Kong' },
  { 'code': 'HU', 'coun': 'Hungary' }, { 'code': 'IS', 'coun': 'Iceland' },
  { 'code': 'IN', 'coun': 'India' }, { 'code': 'ID', 'coun': 'Indonesia' },
  { 'code': 'IR', 'coun': 'Iran (Islamic Republic of)' }, { 'code': 'IQ', 'coun': 'Iraq' },
  { 'code': 'IE', 'coun': 'Ireland' }, { 'code': 'IM', 'coun': 'Isle of Man' },
  { 'code': 'IL', 'coun': 'Israel' }, { 'code': 'IT', 'coun': 'Italy' },
  { 'code': 'JM', 'coun': 'Jamaica' }, { 'code': 'JP', 'coun': 'Japan' },
  { 'code': 'JE', 'coun': 'Jersey' }, { 'code': 'JO', 'coun': 'Jordan' },
  { 'code': 'KZ', 'coun': 'Kazakhstan' }, { 'code': 'KE', 'coun': 'Kenya' },
  { 'code': 'KI', 'coun': 'Kiribati' }, { 'code': 'KP', 'coun': "Korea (Democratic People's Republic of)" },
  { 'code': 'KR', 'coun': 'Korea (Republic of' }, { 'code': 'KW', 'coun': 'Kuwait' },
  { 'code': 'KG', 'coun': 'Kyrgyzstan' }, { 'code': 'LA', 'coun': "Lao People's Democratic Republic" },
  { 'code': 'LV', 'coun': 'Latvia' }, { 'code': 'LB', 'coun': 'Lebanon' },
  { 'code': 'LS', 'coun': 'Lesotho' }, { 'code': 'LR', 'coun': 'Liberia' },
  { 'code': 'LY', 'coun': 'Libya' }, { 'code': 'LI', 'coun': 'Liechtenstein' },
  { 'code': 'LT', 'coun': 'Lithuania' }, { 'code': 'LU', 'coun': 'Luxembourg' },
  { 'code': 'MO', 'coun': 'Macao' }, { 'code': 'MK', 'coun': 'Macedonia (the former Yugoslav Republic of)' },
  { 'code': 'MG', 'coun': 'Madagascar' }, { 'code': 'MW', 'coun': 'Malawi' },
  { 'code': 'MY', 'coun': 'Malaysia' }, { 'code': 'MV', 'coun': 'Maldives' },
  { 'code': 'ML', 'coun': 'Mali' }, { 'code': 'MT', 'coun': 'Malta' },
  { 'code': 'MH', 'coun': 'Marshall Islands' }, { 'code': 'MQ', 'coun': 'Martinique' },
  { 'code': 'MR', 'coun': 'Mauritania' }, { 'code': 'MU', 'coun': 'Mauritius' },
  { 'code': 'YT', 'coun': 'Mayotte' }, { 'code': 'MX', 'coun': 'Mexico' },
  { 'code': 'FM', 'coun': 'Micronesia (Federated States of)' }, { 'code': 'MD', 'coun': 'Moldova (Republic of)' },
  { 'code': 'MC', 'coun': 'Monaco' }, { 'code': 'MN', 'coun': 'Mongolia' },
  { 'code': 'ME', 'coun': 'Montenegro' }, { 'code': 'MS', 'coun': 'Montserrat' },
  { 'code': 'MA', 'coun': 'Morocco' }, { 'code': 'MZ', 'coun': 'Mozambique' },
  { 'code': 'MM', 'coun': 'Myanmar' }, { 'code': 'NA', 'coun': 'Namibia' },
  { 'code': 'NR', 'coun': 'Nauru' }, { 'code': 'NP', 'coun': 'Nepal' },
  { 'code': 'NL', 'coun': 'Netherlands' }, { 'code': 'NC', 'coun': 'New Caledonia' },
  { 'code': 'NZ', 'coun': 'New Zealand' }, { 'code': 'NI', 'coun': 'Nicaragua' },
  { 'code': 'NE', 'coun': 'Niger' }, { 'code': 'NG', 'coun': 'Nigeria' },
  { 'code': 'NU', 'coun': 'Niue' }, { 'code': 'NF', 'coun': 'Norfolk Island' },
  { 'code': 'MP', 'coun': 'Northern Mariana Islands' }, { 'code': 'NO', 'coun': 'Norway' },
  { 'code': 'OM', 'coun': 'Oman' }, { 'code': 'PK', 'coun': 'Pakistan' },
  { 'code': 'PW', 'coun': 'Palau' }, { 'code': 'PS', 'coun': 'Palestine, State of' },
  { 'code': 'PA', 'coun': 'Panama' }, { 'code': 'PG', 'coun': 'Papua New Guinea' },
  { 'code': 'PY', 'coun': 'Paraguay' }, { 'code': 'PE', 'coun': 'Peru' },
  { 'code': 'PH', 'coun': 'Philippines' }, { 'code': 'PN', 'coun': 'Pitcairn' },
  { 'code': 'PL', 'coun': 'Poland' }, { 'code': 'PT', 'coun': 'Portugal' },
  { 'code': 'PR', 'coun': 'Puerto Rico' }, { 'code': 'QA', 'coun': 'Qatar' },
  { 'code': 'RE', 'coun': 'Réunion' }, { 'code': 'RO', 'coun': 'Romania' },
  { 'code': 'RU', 'coun': 'Russian Federation' }, { 'code': 'RW', 'coun': 'Rwanda' },
  { 'code': 'BL', 'coun': 'Saint Barthélemy' }, { 'code': 'SH', 'coun': 'Saint Helena, Ascension and Tristan da Cunha' },
  { 'code': 'KN', 'coun': 'Saint Kitts and Nevis' }, { 'code': 'LC', 'coun': 'Saint Lucia' },
  { 'code': 'MF', 'coun': 'Saint Martin (French part)' }, { 'code': 'PM', 'coun': 'Saint Pierre and Miquelon' },
  { 'code': 'VC', 'coun': 'Saint Vincent and the Grenadines' }, { 'code': 'WS', 'coun': 'Samoa' },
  { 'code': 'SM', 'coun': 'San Marino' }, { 'code': 'ST', 'coun': 'Sao Tome and Principe' },
  { 'code': 'SA', 'coun': 'Saudi Arabia' }, { 'code': 'SN', 'coun': 'Senegal' },
  { 'code': 'RS', 'coun': 'Serbia' }, { 'code': 'SC', 'coun': 'Seychelles' },
  { 'code': 'SL', 'coun': 'Sierra Leone' }, { 'code': 'SG', 'coun': 'Singapore' },
  { 'code': 'SX', 'coun': 'Sint Maarten (Dutch part)' }, { 'code': 'SK', 'coun': 'Slovakia' },
  { 'code': 'SI', 'coun': 'Slovenia' }, { 'code': 'SB', 'coun': 'Solomon Islands' },
  { 'code': 'SO', 'coun': 'Somalia' }, { 'code': 'ZA', 'coun': 'South Africa' },
  { 'code': 'GS', 'coun': 'South Georgia and the South Sandwich Islands' }, { 'code': 'SS', 'coun': 'South Sudan' },
  { 'code': 'ES', 'coun': 'Spain' }, { 'code': 'LK', 'coun': 'Sri Lanka' },
  { 'code': 'SD', 'coun': 'Sudan' }, { 'code': 'SR', 'coun': 'Suriname' },
  { 'code': 'SJ', 'coun': 'Svalbard and Jan Mayen' }, { 'code': 'SZ', 'coun': 'Swaziland' },
  { 'code': 'SE', 'coun': 'Sweden' }, { 'code': 'CH', 'coun': 'Switzerland' },
  { 'code': 'SY', 'coun': 'Syrian Arab Republic' }, { 'code': 'TW', 'coun': 'Taiwan, Province of China' },
  { 'code': 'TJ', 'coun': 'Tajikistan' }, { 'code': 'TZ', 'coun': 'Tanzania, United Republic of' },
  { 'code': 'TH', 'coun': 'Thailand' }, { 'code': 'TL', 'coun': 'Timor-Leste' },
  { 'code': 'TG', 'coun': 'Togo' }, { 'code': 'TK', 'coun': 'Tokelau' },
  { 'code': 'TO', 'coun': 'Tonga' }, { 'code': 'TT', 'coun': 'Trinidad and Tobago' },
  { 'code': 'TN', 'coun': 'Tunisia' }, { 'code': 'TR', 'coun': 'Turkey' },
  { 'code': 'TM', 'coun': 'Turkmenistan' }, { 'code': 'TC', 'coun': 'Turks and Caicos Islands' },
  { 'code': 'TV', 'coun': 'Tuvalu' }, { 'code': 'UG', 'coun': 'Uganda' },
  { 'code': 'UA', 'coun': 'Ukraine' }, { 'code': 'AE', 'coun': 'United Arab Emirates' },
  { 'code': 'GB', 'coun': 'United Kingdom of Great Britain and Northern Ireland' }, { 'code': 'US', 'coun': 'United States of America' },
  { 'code': 'UM', 'coun': 'United States Minor Outlying Islands' }, { 'code': 'UY', 'coun': 'Uruguay' },
  { 'code': 'UZ', 'coun': 'Uzbekistan' }, { 'code': 'VU', 'coun': 'Vanuatu' },
  { 'code': 'VE', 'coun': 'Venezuela (Bolivarian Republic of)' }, { 'code': 'VN', 'coun': 'Viet Nam' },
  { 'code': 'VG', 'coun': 'Virgin Islands (British)' }, { 'code': 'VI', 'coun': 'Virgin Islands (U.S.)' },
  { 'code': 'WF', 'coun': 'Wallis and Futuna' }, { 'code': 'EH', 'coun': 'Western Sahara' },
  { 'code': 'YE', 'coun': 'Yemen' }, { 'code': 'ZM', 'coun': 'Zambia' },
  { 'code': 'ZW', 'coun': 'Zimbabwe' }]

@Form.create()
class WifiAdvanced extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('Network.WIFI.Advanced')
    // 获取当前组件中 重启配置项
    this.rebootOptions = {}
  }
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
      // 保存 初始值
      for (const key in this.options) {
        if (this.options[key].reboot) {
          this.rebootOptions[key] = data[key]
        }
      }
    })
  }
  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        this.submitFormValue(values).then(msgs => {
          if (msgs.Response === 'Success') {
            // 判断是否 弹出 重启提示弹窗
            rebootNotify({ oldOptions: this.rebootOptions, newOptions: values }, () => {
              for (const key in this.rebootOptions) {
                this.rebootOptions[key] = values[key].toString()
              }
            })
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
        {/* 国家码 */}
        <SelectItem
          {...options['P7831']}
          gfd={gfd}
          selectOptions={contryCode.map((item) => ({ v: item.code, t: item.coun }))}
        />
        {/* 主机名(Option 12) */}
        <InputItem
          {...options['P146']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen('40'),
              this.checkNoCH()
            ]
          }}
        />
        {/* 厂家类别名(Option 60) */}
        <InputItem
          {...options['P148']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen('40')
            ]
          }}
        />
        <FormItem>
          <Button className='sub-btn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default WifiAdvanced
