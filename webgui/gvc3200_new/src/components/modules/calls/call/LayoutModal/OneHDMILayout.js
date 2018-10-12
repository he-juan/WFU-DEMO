import React, { Component } from 'react';

const OneHDMILayout = ({ activeIndex, confname, conftype, presentation }) => {
  // presentation 标注是否在演示 
  if (!presentation) {
    //  未开演示
    return (
      <div className="layout-mode-preview">
        {/* mode = 4 推荐模式 */}
        <div className='preview-box sysrcmd-preview' style={{ display: activeIndex == 1 ? 'block' : 'none' }}>
          <div className="preview-item" style={{ width: '97%', height: '95%', margin: '12px' }}>
            <p>
              <strong>{confname}</strong>
              <span>({confname})</span>
            </p>
          </div>
        </div>
        {/* mode = 4 等分模式 */}
        <div className='preview-box overlap-preview' style={{ display: activeIndex == 2 ? 'block' : 'none' }}>
          <div className="preview-item " style={{ height: '50%', width: '47.5%', margin: '17% 0 0 1.7%' }}>
            <p>
              <strong>{confname}</strong>
              <span>({confname})</span>
            </p>
          </div>
          <div className="preview-item" style={{ height: '50%', width: '47.5%', margin: '17% 0 0 1.7%' }}>
            <p>
              <strong>本地</strong>
              <span>{conftype}</span>
            </p>
          </div>
        </div>

        {/* mode = 5 子母模式 */}
        <div className='preview-box' style={{ display: activeIndex == 3 ? 'block' : 'none' }}>
          <div className="preview-item" style={{ width: '65%', height: '65%', margin: '12% 0px 0px 13px' }}>
            <p>
              <strong>{confname}</strong>
              <span>({confname})</span>
            </p>
          </div>
          <div className="preview-item" style={{ width: '30%', height: '30%', margin: '23% 13px 0px 0px', float: 'right' }}>
            <p>
              <strong>本地</strong>
              <span>{conftype}</span>
            </p>
          </div>
        </div>
        {/* mode = 6 画中画模式*/}
        <div className='preview-box pop-preview' style={{ display: activeIndex == 4 ? 'block' : 'none' }}>
          <div className="preview-item" style={{ width: '97%', height: '95%', margin: '12px', position: 'relative' }}>
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
      </div>)
  } else {
    // 开了演示
    return (
      <div className="layout-mode-preview">
        {/* mode = 4 推荐模式 */}
        <div className='preview-box sysrcmd-preview' style={{ display: activeIndex == 1 ? 'block' : 'none' }}>
          <div className="preview-item" style={{ width: '97%', height: '95%', margin: '12px' }}>
            <p>
              <strong>{'演示'}</strong>
            </p>
          </div>
        </div>
        {/* mode = 4 等分模式 */}
        <div className='preview-box overlap-preview' style={{ display: activeIndex == 2 ? 'block' : 'none' }}>
          <div className="preview-item " style={{margin: '10px 0px 0px 26%', width: '47.5%', height: '46%' }}>
            <p>
              <strong>演示</strong>
              <span>({confname})</span>
            </p>
          </div>
          <div className="preview-item " style={{ height: '47.5%', width: '47.5%', margin: '10px 0 0 1.7%' }}>
            <p>
              <strong>{confname}</strong>
              <span>({confname})</span>
            </p>
          </div>
          <div className="preview-item" style={{ height: '47.5%', width: '47.5%', margin: '10px 0 0 1.7%' }}>
            <p>
              <strong>本地</strong>
              <span>{conftype}</span>
            </p>
          </div>
        </div>

        {/* mode = 5 子母模式 */}
        <div className='preview-box' style={{ display: activeIndex == 3 ? 'block' : 'none' }}>
          <div className="preview-item" style={{ width: '65%', height: '65%', margin: '12% 0px 0px 13px' }}>
            <p>
              <strong>{'演示'}</strong>
            </p>
          </div>
          <div className="preview-item" style={{ width: '30%', height: '31%', margin: '12% 13px 0px 0px', float: 'right' }}>
            <p>
              <strong>{confname}</strong>
              <span>({confname})</span>
            </p>
          </div>
          <div className="preview-item" style={{ width: '30%', height: '31%', margin: '13px 13px 0px 0px', float: 'right' }}>
            <p>
              <strong>本地</strong>
              <span>{conftype}</span>
            </p>
          </div>
        </div>
        {/* mode = 6 画中画模式*/}
        <div className='preview-box pop-preview' style={{ display: activeIndex == 4 ? 'block' : 'none' }}>
          <div className="preview-item" style={{ width: '97%', height: '95%', margin: '12px', position: 'relative' }}>
            <p>
              <strong>演示</strong>
            </p>
            <div className="preview-item" style={{ bottom: '0px', left: '0px', border: '2px solid rgb(107, 107, 107)', width: '30%', height: '30%', position: 'absolute' }}>
              <p>
                <strong>本地</strong>
                <span>{conftype}</span>
              </p>
            </div>
            <div className="preview-item" style={{ bottom: '0px', right: '0px', border: '2px solid rgb(107, 107, 107)', width: '30%', height: '30%', position: 'absolute' }}>
              <p>
                <strong>{confname}</strong>
                <span>({confname})</span>
              </p>
            </div>
          </div>
        </div>
      </div>)
  }






}


export default OneHDMILayout