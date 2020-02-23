import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  // 组件模板必须有唯一的跟节点
  // <React.Fragment>可以作为组件的跟节点，但是它本身不会渲染出来
  // <React.Fragment></React.Fragment>可以简写为 <></>
  state = {
    value: this.props.defaultValue ? this.props.defaultValue: []
  }
  // 表单值的处理 
  handleChange = (value) => {
    this.setState({
      value
    })
  } 

  componentDidMount () {

  }
  // 类似于Vue中的 <template></template>
  render() {
    return (
      <React.Fragment>
        {/* 选择器组件：下拉列表 */}
        <PickerView data={ this.props.data  }   onChange={this.handleChange}
        value={ this.state.value} cols={ this.props.cols } />

        {/* 底部两个按钮 */}
        <FilterFooter onSave={ () => {
          this.props.onSave(this.props.openType , this.state.value)
        } } onCancel={this.props.onCancel}/>
      </React.Fragment>
    )
  }
}
