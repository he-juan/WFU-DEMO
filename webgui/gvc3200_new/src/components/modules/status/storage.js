import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout, Tooltip, Icon, Tabs } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib//component/legend';

const Content = Layout;
const TabPane = Tabs.TabPane;

class Storage extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount = () => {
        this.props.getStorageInfo();
    }

    showChart = (storageInfo) => {
        let internalPartitionMsg = this.tr("a_4298"),
            sdPartitionMsg = this.tr("a_sd");

        let internalData = [
            {value: storageInfo.InternalFree, name: this.tr("a_available")},
            {value: storageInfo.InternalTotal-storageInfo.InternalFree, name: this.tr("a_used")}
        ]

        let sdData = [
            {value: storageInfo.ExternalFree, name: this.tr("a_available")},
            {value: storageInfo.ExternalTotal-storageInfo.ExternalFree, name: this.tr("a_used")}
        ]

        const internalOption = {
            title: {
                text: internalPartitionMsg,
                x: 'center',
                textStyle: {
                    color: '#000',
                    fontSize: '16',
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color: ['#5093e1', '#9ec1eb'],
            series: [
                {
                    name:this.tr("a_4298"),
                    type:'pie',
                    radius: ['40%', '80%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '18',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:internalData
                }
            ]
        }

        const SDOption = {
            title: {
                text: sdPartitionMsg,
                x: 'center',
                textStyle: {
                    color: '#000',
                    fontSize: '16',
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color: ['#5093e1', '#9ec1eb'],
            series: [
                {
                    name:this.tr("a_sd"),
                    type:'pie',
                    radius: ['40%', '80%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '18',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:sdData
                }
            ]
        }

        var internalPartition = echarts.init(document.getElementById('internalPartition'));
        internalPartition.setOption(internalOption);
        var SDPartition = echarts.init(document.getElementById('SDPartition'));
        SDPartition.setOption(SDOption)
    }

    render() {
        const self = this;
        let storageInfo = this.props.storageInfo;
        let InternalTotal = storageInfo.InternalTotal;
        if (InternalTotal) {
            setTimeout(function() {
                self.showChart(storageInfo)
            },300)
        }
        let InternalFree = storageInfo.InternalFree;
        let InternalUsed = storageInfo.InternalTotal - storageInfo.InternalFree;

        let ExternalFree = storageInfo.ExternalFree;
        let ExternalUsed = storageInfo.ExternalTotal - storageInfo.ExternalFree;

        return (
            <Content className = "content-container config-container">
                <div className = "subpagetitle">{this.tr("status_store")}</div>
                <div style={{margin: "10px 20px 10px 20px","minWidth":"1200px", "background":"#fff", 'minHeight':this.props.mainHeight}}>
                    <div className = "infodiv">
                        <div id="internalPartition" style = {{"height":"340px"}}></div>
                        <div className = "info_storage">
                            <span className="space-used">{this.tr("a_available")+":"+InternalFree + "MB"}</span>
                            <span className="space-used">{this.tr("a_used")+":"+ InternalUsed+ "MB"}</span>
                        </div>
                    </div>
                    <div className = "infodiv">
                        <div id="SDPartition" style = {{"height":"340px"}}></div>
                        <div className = "info_storage">
                            <span className="space-used">{this.tr("a_available")+":"+ExternalFree + "MB"}</span>
                            <span className="space-used">{this.tr("a_used")+":"+ ExternalUsed+ "MB"}</span>
                        </div>
                    </div>
                </div>
            </Content>
        )
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    storageInfo: state.storageInfo
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getStorageInfo: Actions.getStorageInfo
    };
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Storage));
