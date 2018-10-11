import React, { Component } from 'react';

const TwoHDMILayout = ({activeIndex, confname, conftype, presentation}) => {
  // presentation 标注是否在演示 
  if (!presentation) {
    //  未开演示
    return (
      <div className="layout-mode-preview">
        {/* mode = 4 推荐模式 */}
        <div style={{ display: activeIndex == 1 ? 'block' : 'none' }}>
          <div className='preview-box semi'>
            <div className="preview-item" style={{ width: '96%', height: '96%', margin: '9px 9px' }}>
              <p>
                <strong>{confname}</strong>
                <span>({confname})</span>
              </p>
            </div>
          </div>
          <div className='preview-box semi'>
            <div className="preview-item" style={{ width: '96%', height: '96%', margin: '9px 9px' }}>
              <p>
                <strong>本地</strong>
                <span>{conftype}</span>
              </p>
            </div>
          </div>
        </div>
        {/* mode = 4 等分模式 */}
        <div style={{ display: activeIndex == 2 ? 'block' : 'none' }}>
          <div className='preview-box semi'>
            <div className="preview-item" style={{ width: '96%', height: '96%', margin: '9px 9px' }}>
              <p>
                <strong>{confname}</strong>
                <span>({confname})</span>
              </p>
            </div>
          </div>
          <div className='preview-box semi'>
            <div className="preview-item" style={{ width: '47%', height: '40%', margin: '30% 9px', float: 'left' }}>
              <p>
                <strong>本地</strong>
                <span>{conftype}</span>
              </p>
            </div>
            <div className="preview-item" style={{ width: '47%', height: '40%', margin: '30% 9px 0 0 ', float: 'right' }}>
              <p>
                <strong>{confname}</strong>
                <span>({confname})</span>
              </p>
            </div>
          </div>
        </div>

        {/* mode = 5 子母模式 */}
        <div style={{ display: activeIndex == 3 ? 'block' : 'none' }}>
          <div className='preview-box semi'>
            <div className="preview-item" style={{ width: '96%', height: '96%', margin: '9px 9px' }}>
              <p>
                <strong>{confname}</strong>
                <span>({confname})</span>
              </p>
            </div>
          </div>
          <div className='preview-box semi'>
            <div className="preview-item" style={{ width: '61%', height: '50%', margin: '25% 9px', float: 'left' }}>
              <p>
                <strong>本地</strong>
                <span>{conftype}</span>
              </p>
            </div>
            <div className="preview-item" style={{ width: '32.5%', height: '25%', margin: '40% 9px 0 0 ', float: 'right' }}>
              <p>
                <strong>{confname}</strong>
                <span>({confname})</span>
              </p>
            </div>
          </div>
        </div>
        {/* mode = 6 画中画模式*/}

        <div style={{ display: activeIndex == 4 ? 'block' : 'none' }}>
          <div className='preview-box semi'>
            <div className="preview-item" style={{ width: '96%', height: '96%', margin: '9px 9px' }}>
              <p>
                <strong>{confname}</strong>
                <span>({confname})</span>
              </p>
            </div>
          </div>
          <div className='preview-box semi'>
            <div className="preview-item" style={{ width: '96%', height: '96%', margin: '9px', position: 'relative' }}>
              <p>
                <strong>{confname}</strong>
                <span>({confname})</span>
              </p>
              <div className="preview-item item-2" style={{ bottom: '0px', right: '0px', border: '2px solid rgb(107, 107, 107)', width: '30%', height: '30%', position: 'absolute' }}>
                <p>
                  <strong>本地</strong>
                  <span>{conftype}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>)
  } else {
    // 开了演示
    return (
    <div className="layout-mode-preview">
    {/* mode = 4 推荐模式 */}
    <div style={{ display: activeIndex == 1 ? 'block' : 'none' }}>
      <div className='preview-box semi'>
        <div className="preview-item" style={{ width: '96%', height: '96%', margin: '9px 9px' }}>
          <p>
            <strong>演示</strong>
          </p>
        </div>
      </div>
      <div className='preview-box semi'>
        <div className="preview-item" style={{ width: '47%', height: '40%', margin: '30% 9px', float: 'left' }}>
          <p>
            <strong>{confname}</strong>
            <span>({confname})</span>
          </p>
        </div>
        <div className="preview-item" style={{ width: '47%', height: '40%', margin: '30% 9px 0 0 ', float: 'right' }}>
          <p>
            <strong>本地</strong>
            <span>{conftype}</span>
          </p>
        </div>
      </div>
    </div>
    {/* mode = 4 等分模式 */}
    <div style={{ display: activeIndex == 2 ? 'block' : 'none' }}>
      <div className='preview-box semi'>
        <div className="preview-item" style={{ width: '96%', height: '96%', margin: '9px 9px' }}>
          <p>
            <strong>演示</strong>
          </p>
        </div>
      </div>
      <div className='preview-box semi'>
        <div className="preview-item" style={{ width: '47%', height: '40%', margin: '30% 9px', float: 'left' }}>
          <p>
            <strong>{confname}</strong>
            <span>({confname})</span>
          </p>
        </div>
        <div className="preview-item" style={{ width: '47%', height: '40%', margin: '30% 9px 0 0 ', float: 'right' }}>
          <p>
            <strong>本地</strong>
            <span>{conftype}</span>
          </p>
        </div>
      </div>
    </div>

    {/* mode = 5 子母模式 */}
    <div style={{ display: activeIndex == 3 ? 'block' : 'none' }}>
      <div className='preview-box semi'>
        <div className="preview-item" style={{ width: '96%', height: '96%', margin: '9px 9px' }}>
          <p>
            <strong>演示</strong>
          </p>
        </div>
      </div>
      <div className='preview-box semi'>
        <div className="preview-item" style={{ width: '61%', height: '50%', margin: '25% 9px', float: 'left' }}>
          <p>
            <strong>{confname}</strong>
            <span>({confname})</span>
          </p>
        </div>
        <div className="preview-item" style={{ width: '32.5%', height: '25%', margin: '40% 9px 0 0 ', float: 'right' }}>
          <p>
            <strong>本地</strong>
            <span>{conftype}</span>
          </p>
        </div>
      </div>
    </div>
    {/* mode = 6 画中画模式*/}

    <div style={{ display: activeIndex == 4 ? 'block' : 'none' }}>
      <div className='preview-box semi'>
        <div className="preview-item" style={{ width: '96%', height: '96%', margin: '9px 9px' }}>
          <p>
            <strong>演示</strong>
          </p>
        </div>
      </div>
      <div className='preview-box semi'>
        <div className="preview-item" style={{ width: '96%', height: '96%', margin: '9px', position: 'relative' }}>
          <p>
            <strong>{confname}</strong>
            <span>({confname})</span>
          </p>
          <div className="preview-item item-2" style={{ bottom: '0px', right: '0px', border: '2px solid rgb(107, 107, 107)', width: '30%', height: '30%', position: 'absolute' }}>
            <p>
              <strong>本地</strong>
              <span>{conftype}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>)
  }
}


export default TwoHDMILayout