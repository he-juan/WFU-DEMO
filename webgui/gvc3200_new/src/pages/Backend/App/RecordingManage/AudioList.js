import React, { Component } from 'react'
import { Form, Input, Button, Modal, message, Icon, Table } from 'antd'
import Nodata from '@/components/NoData'
import API from '@/api'
import { $t, $fm } from '@/Intl'
import { momentFormat, debounceReactEvent } from '@/utils/tools'

const mSpChar = ['\\', '\/', '*', '?', '<', '>', '|', '\'', '\"', '？']

@Form.create()
class AudioList extends Component {
  // state
  state = {
    dataList: [],
    curRecord: {},
    displayModal: false,
    selectedRowKeys: [], // 选中的Rowkeys
    selectedRows: [],
    curPage: 1, // 分页
    filterKey: ''
  }

  async componentDidMount () {
    let data3 = await this.handleGetRecordingList()

    this.setState({
      dataList: data3.Data
    })
  }

  // 获取录像列表
  handleGetRecordingList = () => {
    return new Promise((resolve, reject) => {
      API.getRecordingList().then(msgs => {
        if (msgs.Response === 'Success') {
          /**
           * 过滤出录音列表
           */
          msgs.Data = msgs.Data.filter(item => item.Type === '2')
          resolve(msgs)
        } else {
          resolve({ Data: [] })
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
        dataList: data.Data,
        ...obj,
        ...extra
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
      <span title={name}>
        {name}
        {record.Lock === '1' ? <i className='icons icon-lock' style={{ marginLeft: 10 }}/> : ''}
      </span>
    )
  }

  // 格式化 td 的 time
  formatTime = (text, record, index) => {
    return momentFormat(text, { showtime: true }).strRes
  }

  // 格式化 td 的 action
  formatAction = (text, record, index) => {
    let tit = Array(3).fill('')
    if (record.Lock === '1') {
      tit = [$t('m_253'), $t('b_020'), $t('m_255')]
    } else {
      tit = [$t('b_018'), $t('b_019'), $t('b_003')]
    }
    return (
      <div id={'record' + record.Id} className='record-operation'>
        {/* 下载 */}
        <button className='icons icon-tddownload' title={$t('b_021')} id = {'download' + index} onClick={() => this.handleDownloadItem(record)}></button>
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
  validateRenameinputIsexit = (dataList) => {
    let { curRecord: { Id, Path } } = this.state
    let type = Path.match(/\.[^\.]*$/)[0]
    return {
      validator: (data, value, callback) => {
        let hasExist = false
        // 文件名已存在，请重新输入
        for (let i = 0; i < dataList.length; i++) {
          const item = dataList[i]
          let { name } = this.getRecordNameAndPath(item.Path)
          if ((value + type) === name && item['Id'] !== Id) {
            hasExist = true
            break
          }
        }

        if (hasExist) {
          callback($fm('m_042'))
        } else {
          callback()
        }
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
          // let reg = new RegExp('^[a-zA-Z0-9\u4E00-\u9FA5\uF900-\uFA2D_-]+$')
          // if (value && !reg.test(value)) {
          //   illegalflag = true
          // }
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
  setDiaplayModal = (bool = true, obj = {}) => {
    let displayModal = bool
    let curRecord = obj
    this.setState({ displayModal, curRecord })
  }

  // 保存 录像名称
  handleSaveRecordName = () => {
    const { validateFields } = this.props.form

    validateFields((err, value) => {
      if (!err) {
        let { curRecord: { Id, Path } } = this.state
        let info = this.getRecordNameAndPath(Path)
        let newname = value['renameinput'] + info.name.match(/\.[^\.]*$/)[0]
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
              this.setDiaplayModal(false)
            } else {
              message.error($t('m_039'))
            }
          })
        } else {
          this.setDiaplayModal(false)
        }
      }
    })
  }

  // 表格 操作 - 下载
  handleDownloadItem = ({ Id }) => {
    API.downloadRecord(Id).then(res => {
      if (res.Response === 'Success') {
        const a = document.createElement('a')
        a.setAttribute('id', 'downloadRecord')
        a.setAttribute('href', '/' + res.Path)
        a.setAttribute('download', '')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        message.error($t('m_118'))
      }
    })
  }

  // 表格 操作 - 编辑
  handleEditItem = (record, index) => {
    let { Lock } = record
    if (Lock === '1') {
      return message.error($t('m_044'))
    }
    this.setDiaplayModal(true, record)
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
      title: $t('m_243'),
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
      title: $t('m_251'),
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

  handleFilterChange = debounceReactEvent((e) => {
    this.setState({
      filterKey: e.target.value,
      curPage: 1
    })
  }, 400)

  // render
  render () {
    const { getFieldDecorator: gfd } = this.props.form
    let { displayModal, dataList, selectedRowKeys, curPage, filterKey } = this.state

    const filteredDataList = dataList.filter(item => {
      let name = item.Path.split('/').slice(-1)[0]
      return new RegExp(filterKey, 'i').test(name)
    })

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
      width: '30%',
      render: (text, record, index) => (
        this.formatName(text, record, index)
      )
    }, {
      title: $t('c_028'),
      key: 'Size',
      dataIndex: 'Size',
      width: '25%'
    }, {
      title: $t('c_029'),
      key: 'Time',
      dataIndex: 'Time',
      width: '25%',
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
    let pageobj = {
      current: curPage,
      showSizeChanger: true,
      total: filteredDataList.length,
      onChange: this.changePage
    }
    // -----------处理table end
    return (
      <div className='recording-manage'>
        {/* 保存路径/编辑录像名称 modal */}
        {
          displayModal && <Modal visible={displayModal} width='500px' title={<span style={{ display: 'block', textAlign: 'center' }}>{$t('c_349')}</span>} className='record-setmodal' centered={true} okText={$t('b_002')} cancelText={$t('b_005')} onOk={this.handleSaveRecordName} onCancel={() => { this.setDiaplayModal(false) }}>
            <div className='confirm-content'>
              <Form>
                <Form.Item>
                  {
                    gfd('renameinput', {
                      rules: [
                        { required: true, whitespace: true, message: $t('m_249') },
                        { max: 64, message: $t('m_050') + 64 },
                        this.validateRenameinputIsexit(dataList),
                        this.validateRenameinputIsillegal()
                      ]
                    })(
                      <Input placeholder={$t('m_247')}/>
                    )
                  }
                </Form.Item>
              </Form>
            </div>
          </Modal>
        }

        {/* btns-box */}
        <div className='btns-box'>
          <Button type='primary' disabled={selectedRowKeys.length === 0} onClick={this.handleDeleteConfirm}>
            <Icon type='delete' />{$t('b_003')}
          </Button>
          <Input
            onChange={this.handleFilterChange}
            prefix={<Icon type='search'/>}
            placeholder={$t('c_209')}
            className='record-search-input'
          />
        </div>

        {/* table */}
        {
          filteredDataList.length > 0 ? <Table
            className='record-table'
            rowKey='Id'
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredDataList}
            showHeader={true}
            pagination={pageobj}
          /> : <Nodata />
        }
      </div>
    )
  }
}

export default AudioList
