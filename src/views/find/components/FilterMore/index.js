import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter/index.js'

import styles from './index.module.css'

export default class FilterMore extends Component {

  state ={
    // 从父组件传递过来的初始化默认状态
    selectedValues: this.props.defaultValue ? this.props.defaultValue :[]
  }

  // 渲染标签
  renderFilters( list ) {
    // 高亮类名： styles.tagActive
    // <span className={[styles.tag, styles.tagActive].join(' ')}>东北</span>
    const { selectedValues } = this.state
    return (
        list.map( item => (
          <span data-id={item.value} key={item.value} className={[styles.tag, selectedValues.includes(item.value) ? styles.tagActive : ''   ].join(' ')}> {item.label} </span>
        ))
      )
  }
  // toggleChangle 控制标签的选中与反选
  toggleChangle= (e)=>{
      let id = e.target.dataset.id;
      // console.log(id);
      
      // 控制id 添加与删除
      // 判断数值是否包含id
      let arr = [ ...this.state.selectedValues];
      if ( arr.includes(id) ){
          // 如果包含,删除
          let index = arr.findIndex( item => {
            return item === id
          })
          if( index !== -1) {
            arr.splice(index, 1)
          }
        }  else {
            // 添加id
          arr.push(id);
      }
      this.setState({
          selectedValues: arr
      }, ()=>{
        // console.log(this.state.selectedValues);
      })
  }

  render() {
    const { roomType , oriented , floor , characteristic } = this.props.data;
     return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl onClick={ this.toggleChangle }  className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter onCancel={ ()=>{
          // 删除所选中的标签 
          this.setState({
            selectedValues: []
           })
          //  this.props.onCancel()
        }} onSave={ ()=> {
          this.props.onSave(this.props.openType , this.state.selectedValues)
        }} className={styles.footer} />
      </div>
    )
  }
}
