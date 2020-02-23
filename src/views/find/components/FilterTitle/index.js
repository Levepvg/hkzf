import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

export default function FilterTitle(props) {
  const { menuStatus } = props
  let menuTag = titleList.map(item => {
    // 获取当前菜单的高亮状态
    let mstatus = menuStatus[item.type]
    let cls = [styles.dropdown, mstatus? styles.selected: ''].join(' ')
    return (
      <Flex.Item key={item.type} >
        <span className={cls}>
          <span data-type={item.type}>{item.title}</span>
          <i className="iconfont icon-arrow" />
        </span>
      </Flex.Item>
    )
  })
  return (
    <Flex onClick={(e) => {
      // 点击之后，需要知道点击的是哪个菜单
      // 并且需要修改父组件中的状态信息
      props.changeStatus(e.target.dataset.type)
    }} align="center" className={styles.root}>
      {/* 选中类名： selected */}
      {menuTag}
    </Flex>
  )
}
