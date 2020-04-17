import React, { useState, useCallback, useEffect } from 'react'
import { message, Collapse, Icon } from 'antd'
import { getLicense, getLicenseById } from '@/api/api.common'
import './License.less'

const { Panel } = Collapse

const License = (props) => {
  const [files, setFiles] = useState([])

  const handleExpandPanel = useCallback(
    (key) => {
      if (key !== undefined) {
        if (!files[key].content) {
          getLicenseById(files[key].licenseId).then(res => {
            if (+res.result === 0) {
              setFiles(files.reduce((total, curr, index) => {
                if (index === +key) {
                  total.push({ ...curr, content: res.data.content })
                } else {
                  total.push(curr)
                }
                return total
              }, []))
            } else {
              message.error(res.msg)
            }
          })
        }
      }
    },
    [files]
  )

  useEffect(() => {
    getLicense().then(res => {
      if (+res.result === 0) {
        setFiles(res.data.files)
      } else {
        message.error(res.msg)
      }
    })
    return () => {
      console.log('cleanup')
    }
  }, [])

  return (
    <div className='license-page'>
      <Collapse
        accordion
        bordered={false}
        defaultActiveKey={[]}
        expandIcon={({ isActive }) => <Icon type='caret-right' rotate={isActive ? 90 : 0} />}
        onChange={handleExpandPanel}>
        {
          files.map((file, index) => {
            return (
              <Panel header={file.name} key={index} className='file-item'>
                <pre>{file.content}</pre>
              </Panel>
            )
          })
        }
      </Collapse>
    </div>
  )
}

export default License
