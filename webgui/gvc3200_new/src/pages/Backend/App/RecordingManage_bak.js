import React, { Component } from 'react'
import { Form, Select, Input, Button, Modal, message, Icon, Divider, Table } from 'antd'
// import Cookie from 'js-cookie'
import moment from 'moment'
import Nodata from '@/components/NoData'
import API from '@/api'
import './RecordingManage.less'
import { $t, $fm } from '@/Intl'

const mSpChar = ['\\', ':', '*', '?', '<', '>', '|', '\'']

@Form.create()
class RecordingManage extends Component {
  // state
  state = {
    recordingList: [],
    use24Hour: '0',
    datefmt: '',
    timezone: '',
    pathList: [], // 路径列表
    curPath: '', // 当前路径
    tempPath: '',
    curRecord: {},
    displayModal: {
      show: false,
      type: '' // path: '路径', name: '名称'
    },
    selectedRowKeys: [], // 选中的Rowkeys
    selectedRows: [],
    curPage: 1 // 分页
  }

  // 获取 pvalue
  handleGetPvalue = () => {
    return new Promise((resolve, reject) => {
      API.getPvalues(['P102']).then(data => {
        resolve(data)
      })
    })
  }

  // 获取时区
  // handleGetTimezone = () => {
  //   return new Promise((resolve, reject) => {
  //     let lang = Cookie.get('locale')
  //     lang = lang === 'en' ? '0' : '1'
  //     API.getTimezone(lang).then(data => {
  //       resolve(data)
  //     })
  //   })
  // }

  // 获取录像列表
  handleGetRecordingList = () => {
    return new Promise((resolve, reject) => {
      API.getRecordingList().then(msgs => {
        if (msgs.Response === 'Success') {
          resolve(msgs)
        } else {
          resolve({ Use24Hour: '', Data: [] })
        }
      })
    })
  }

  // 更新表格
  updateData = (obj = {}, cb = '') => {
    this.handleGetRecordingList().then(data => {
      let extra = {}
      if (cb) {
        extra = cb(data.Data)
      }
      this.setState({
        recordingList: data.Data,
        use24Hour: data.Use24Hour,
        ...obj,
        ...extra
      })
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

  // 获取记录的 name 和 path /mnt/usbhost0/Recording/BBB-20190718161647.mkv
  getRecordNameAndPath = (path, isdownload) => {
    let mNameIndex = path.lastIndexOf('/') + 1
    let name = path.substring(mNameIndex) // BBB-20190718161647.mkv
    let pathOnly
    if (isdownload) {
      pathOnly = path.substring('/mnt'.length, mNameIndex) // usbhost0/Recording
    } else {
      pathOnly = path.substring(0, mNameIndex - 1) // /mnt/usbhost0/Recording
    }
    return { name, pathOnly }
  }

  // 格式化 td 的 name
  formatName = (text, record, index) => {
    let path = record.Path
    let { name } = this.getRecordNameAndPath(path)
    return (
      <span>
        {name}
        {record.Lock === '1' ? <i className='icons icon-lock' style={{ marginLeft: 10 }}/> : ''}
      </span>
    )
  }

  // 格式化 td 的 time
  formatTime = (text, record, index) => {
    // let { datefmt, timezone } = this.state
    // datefmt = datefmt || '3'
    // var Timevalue = this.convertTime(text, datefmt, timezone)
    // return Timevalue
    return moment(text * 1000).format('D/M HH:mm')
  }

  // 格式化 td 的 action
  formatAction = (text, record, index) => {
    let tit = Array(3).fill('')
    if (record.Lock === '1') {
      tit = [$t('m_040'), $t('b_020'), $t('m_041')]
    } else {
      tit = [$t('b_018'), $t('b_019'), $t('b_003')]
    }
    return (
      <div id={'record' + record.Id} className='record-operation'>
        {/* 下载 */}
        <button className='icons icon-tddownload' title={$t('b_021')} id = {'download' + index} onClick={() => this.handleDownloadItem(record, index)}></button>
        {/* 编辑 */}
        <button className='icons icon-tdedit' disabled={record.Lock === '1'} title={tit[0]} id = {'edit' + index} onClick={() => this.handleEditItem(record, index)}></button>
        {/* 锁定/解锁 */}
        <button className={'icons icon-td' + (record.Lock === '0' ? 'unlock' : 'lock')} title ={tit[1]} id={'lock' + index} onClick={() => this.handleLockItem(record, index)}></button>
        {/* 删除 */}
        <button className={'icons icon-tdclose' + (record.Lock === '1' ? ' un' : '')} id={'delete' + index} disabled={record.Lock === '1'} title={tit[2]} onClick={() => this.handleDeleteItem(record, index)
        }></button>
      </div>
    )
  }

  // 计算当前页码
  coputeCurPage = (data) => {
    let { curPage } = this.state
    let pages = (data.length / 15).toString().split('.')
    pages = pages.length > 1 ? +pages[0] + 1 : +pages[0]

    if (pages >= curPage) {
      return { curPage }
    } else if (pages > 1) {
      return { curPage: curPage-- }
    } else {
      return { curPage: pages === 0 ? 0 : 1 }
    }
  }

  // renameinput 是否存在 检验
  validateRenameinputIsexit = (recordingList) => {
    let { curRecord: { Id } } = this.state
    return {
      validator: (data, value, callback) => {
        // 文件名已存在，请重新输入
        for (let i = 0; i < recordingList.length; i++) {
          const item = recordingList[i]
          let { name } = this.getRecordNameAndPath(item.Path)
          if ((value + '.mkv') === name && item['Id'] !== Id) {
            callback($fm('m_042'))
            return false
          }
        }
        callback()
      }
    }
  }

  // renameinput 是否存在无效字符 检验
  validateRenameinputIsillegal = () => {
    return {
      validator: (data, value, callback) => {
        if (value) {
          // 重命名失败, 存在无效字符!
          let illegalflag = false
          for (let i = 0; i < mSpChar.length; i++) {
            if (value.indexOf(mSpChar[i]) !== -1) {
              illegalflag = true
              break
            }
          }
          let reg = new RegExp('^[a-zA-Z0-9\u4E00-\u9FA5\uF900-\uFA2D_-]+$')
          if (value && !reg.test(value)) {
            illegalflag = true
          }
          if (illegalflag) {
            callback($fm('m_043'))
            return false
          }
        }
        callback()
      }
    }
  }

  // 设置存储路径 录像名称 modal
  setDiaplayModal = (bool = true, type = 'path', obj = {}) => {
    let displayModal = {
      show: bool,
      type
    }
    let o = {}
    type === 'path' && (o = { tempPath: '' })
    type === 'name' && (o = { curRecord: obj })
    this.setState({ displayModal, ...o })
  }

  // 路径 change
  handleChangeRecordPath = (value) => {
    this.setState({ tempPath: value })
  }

  // 保存 存储路径
  handleSaveRecordPath = () => {
    let { tempPath } = this.state
    if (tempPath) {
      API.setRecordingPath(tempPath).then(msgs => {
        if (+msgs.result === 0) {
          message.success($t('m_001'))
          this.handleGetRecordingPath().then(data => {
            this.setState({
              pathList: data['list'] || [],
              curPath: data['curpath']
            })
          })
        } else {
          message.error($t('m_002'))
        }
      })
    }
    this.setDiaplayModal(false, 'path')
  }

  // 保存 录像名称
  handleSaveRecordName = () => {
    const { validateFields } = this.props.form

    validateFields((err, value) => {
      if (!err) {
        let { curRecord: { Id, Path } } = this.state
        let info = this.getRecordNameAndPath(Path)
        let newname = value['renameinput'] + '.mkv'
        if (newname !== info.name) {
          let params = {
            id: Id,
            name: info.name,
            newname: encodeURIComponent(newname),
            pathonly: encodeURIComponent(info.pathOnly)
          }
          API.renameRecord(params).then(msgs => {
            if (msgs['Response'] === 'Success') {
              message.success($t('m_027'))
              this.updateData()
              this.setDiaplayModal(false, 'name')
            } else {
              message.error($t('m_039'))
            }
          })
        } else {
          this.setDiaplayModal(false, 'name')
        }
      }
    })
  }

  // displayModal 公用保存 modal 方法
  handleSaveModal = () => {
    let { displayModal: { type } } = this.state
    if (type === 'path') {
      this.handleSaveRecordPath()
    } else {
      this.handleSaveRecordName()
    }
  }

  // 表格 操作 - 下载
  handleDownloadItem = (record, index) => {
    let { Path } = record
    let { pathOnly, name } = this.getRecordNameAndPath(Path, true)
    if (pathOnly.indexOf('usbhost') !== -1) {
      window.location.href = pathOnly + encodeURIComponent(name) + '?time=' + new Date().getTime()
    } else {
      window.location.href = '/Recording/' + encodeURIComponent(name) + '?time=' + new Date().getTime()
    }
  }

  // 表格 操作 - 编辑
  handleEditItem = (record, index) => {
    let { Lock } = record
    if (Lock === '1') {
      return message.error($t('m_044'))
    }
    this.setDiaplayModal(true, 'name', record)
  }

  // 表格 操作 - 锁定/解锁
  handleLockItem = (record, index) => {
    let { selectedRowKeys, selectedRows } = this.state
    let { Id, Lock } = record
    let obj = {}
    API.setRecordLockstate(Id, +Lock === 1 ? '0' : '1').then(msgs => {
      if (msgs['Response'] === 'Success') {
        if (+Lock === 0) {
          selectedRowKeys = selectedRowKeys.filter(item => item !== Id)
          selectedRows = selectedRows.filter(item => item.Id !== Id)
          obj = { selectedRowKeys, selectedRows }
        }
        message.success($t('m_027'))
        this.updateData(obj)
      } else {
        message.error($t('m_028'))
      }
    })
  }

  // 表格 操作 - 删除单条录像
  handleDeleteItem = (record, index) => {
    let { Id, Path } = record
    let { name } = this.getRecordNameAndPath(Path)
    Modal.confirm({
      title: $t('m_045'),
      content: name,
      centered: true,
      okText: $t('b_002'),
      okType: 'danger',
      cancelText: $t('b_005'),
      onOk: (cb) => {
        API.deleteRecord(Id, Path).then(msgs => {
          if (msgs.Id === Id) {
            message.success($t('m_013'))
            this.updateData({}, this.coputeCurPage)
          } else {
            message.error($t('m_014'))
          }
          cb()
        })
      }
    })
  }

  // 选中项发生变化时的回调
  onRowsChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }

  // promise.all 删除任务
  delRecordTask = (Id, Path) => {
    return new Promise((resolve, reject) => {
      API.deleteRecord(Id, Path).then(msgs => {
        if (msgs.Id === Id) {
          resolve({ res: 'success', Id })
        } else {
          reject(Path)
        }
      })
    })
  }

  // 删除所选录像按钮
  handleDeleteConfirm = () => {
    Modal.confirm({
      title: $t('m_046'),
      content: '',
      okText: $t('b_002'),
      okType: 'danger',
      cancelText: $t('b_005'),
      onOk: (cb) => {
        let { selectedRows } = this.state
        let task = selectedRows.map(item => {
          let { Id, Path } = item
          return this.delRecordTask(Id, Path)
        })
        let callback = () => {
          cb()
          this.updateData({ selectedRowKeys: [], selectedRows: [] }, this.coputeCurPage)
        }
        Promise.all(task).then(result => {
          message.success($t('m_013'))
          callback()
        }).catch(error => {
          let { name } = this.getRecordNameAndPath(error)
          message.error(`${name} ` + $t('m_014'))
          callback()
        })
      }
    })
  }

  // table 改变分页
  changePage = (pageNumber) => {
    this.setState({
      curPage: pageNumber,
      selectedRowKeys: [],
      selectedRows: []
    })
  }

  // componentDidMount
  async componentDidMount () {
    let data1 = await this.handleGetPvalue()
    // let data2 = await this.handleGetTimezone() 可以暂时不获取
    let data3 = await this.handleGetRecordingList()
    let data4 = await this.handleGetRecordingPath()

    this.setState({
      datefmt: data1['P102'],
      // timezone: data2['timezone'],
      recordingList: data3.Data,
      use24Hour: data3.Use24Hour,
      pathList: data4.list || [],
      curPath: data4.curpath || ''
    })
  }

  // render
  render () {
    const { getFieldDecorator: gfd } = this.props.form
    let { pathList, curPath, tempPath, displayModal, recordingList, selectedRowKeys, curPage } = this.state

    // -----------处理设置路径/录像名称 start
    let modalHtml = ''
    if (displayModal.show) {
      let { type } = displayModal
      // 路径
      if (type === 'path') {
        let children = []
        if (pathList.length > 0) {
          let isExist = pathList.find(item => item === curPath)
          !isExist && (curPath = pathList[0])
          let s = $t('c_030')
          let pathArr = [s + '0', s + '1', s + '2', $t('c_031')] // let pathArr = ['a_usbdisk0', 'a_usbdisk1', 'a_usbdisk2', 'a_extsd']
          let [usb0num, usb1num, usb2num, sdnum, index] = Array(5).fill(0)

          pathList.forEach(item => {
            let extStr = ''
            if (item.indexOf('usbhost0') !== -1) {
              index = 0
              usb0num && (extStr = '_' + usb0num)
              usb0num += 1
            } else if (item.indexOf('usbhost1') !== -1) {
              index = 1
              usb1num && (extStr = '_' + usb1num)
              usb1num += 1
            } else if (item.indexOf('usbhost2') !== -1) {
              index = 2
              usb2num && (extStr = '_' + usb2num)
              usb2num += 1
            } else if (item.indexOf('extsd') !== -1) {
              index = 3
              sdnum && (extStr = '_' + sdnum)
              sdnum += 1
            }
            children.push(<Select.Option value={item} key={item}>{pathArr[index] + extStr}</Select.Option>)
          })
          tempPath && (curPath = tempPath)
          modalHtml =
            <Select value={curPath} style={{ width: 300 }} onChange={this.handleChangeRecordPath} getPopupContainer={(triggerNode) => { return triggerNode }}>
              {children}
            </Select>
        } else {
          modalHtml =
            <Select placeholder={$t('m_047')} disabled={true} style={{ width: 300 }}>
              {children}
            </Select>
        }
      } else {
        modalHtml =
          <Form>
            <Form.Item>
              {
                gfd('renameinput', {
                  rules: [
                    { required: true, whitespace: true, message: $t('m_048') },
                    { max: 64, message: $t('m_050') + 64 },
                    this.validateRenameinputIsexit(recordingList),
                    this.validateRenameinputIsillegal()
                  ]
                })(
                  <Input placeholder={$t('m_049')}/>
                )
              }
            </Form.Item>
          </Form>
      }
    }
    // -----------处理设置路径/录像名称 end

    // -----------处理table start
    // rowSelection
    const rowSelection = {
      selectedRowKeys, // 指定选中项的 key 数组，需要和 onChange 进行配合
      onChange: this.onRowsChange,
      getCheckboxProps: record => ({
        disabled: record.Lock === '1', // Column configuration not to be checked
        Id: record.Id
      })
    }
    // columns
    const columns = [{
      title: $t('c_027'),
      key: 'Path',
      dataIndex: 'Path',
      width: '40%',
      render: (text, record, index) => (
        this.formatName(text, record, index)
      )
    }, {
      title: $t('c_028'),
      key: 'Size',
      dataIndex: 'Size',
      width: '20%'
    }, {
      title: $t('c_029'),
      key: 'Time',
      dataIndex: 'Time',
      width: '20%',
      render: (text, record, index) => (
        this.formatTime(text, record, index)
      )
    }, {
      title: $t('c_005'),
      key: 'Operation',
      dataIndex: 'Operation',
      width: '20%',
      render: (text, record, index) => (
        this.formatAction(text, record, index)
      )
    }]
    // pageobj
    let pageobj = false
    if (recordingList.length > 15) {
      pageobj = {
        current: curPage,
        pageSize: 15,
        total: recordingList.length,
        onChange: this.changePage
      }
    }
    // -----------处理table end
    return (
      <div className='recording-manage'>
        {/* 保存路径/编辑录像名称 modal */}
        {
          displayModal.show && <Modal visible={displayModal.show} width='500px' title={<span style={{ display: 'block', textAlign: 'center' }}>{$t(displayModal.type === 'path' ? 'c_032' : 'c_033')}</span>} className='record-setmodal' centered={true} okText={$t('b_002')} cancelText={$t('b_005')} onOk={this.handleSaveModal} onCancel={() => { this.setDiaplayModal(false) }}>
            <div className='confirm-content'>{modalHtml}</div>
          </Modal>
        }

        {/* btns-box */}
        <div className='btns-box'>
          <Button type='primary' disabled={selectedRowKeys.length === 0} onClick={this.handleDeleteConfirm}>
            <Icon type='delete' />{$t('b_003')}
          </Button>
          <Button type='primary' onClick={() => { this.setDiaplayModal() }} style={{ marginLeft: 10 }}>{$t('b_017')}</Button>
        </div>

        <Divider />

        {/* table */}
        {
          recordingList.length > 0 ? <Table
            className='record-table'
            rowKey='Id'
            rowSelection={rowSelection}
            columns={columns}
            dataSource={recordingList}
            showHeader={true}
            pagination={pageobj}
          /> : <Nodata />
        }
      </div>
    )
  }
}

export default RecordingManage
