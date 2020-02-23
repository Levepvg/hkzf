/*
  列表找房模块
*/
import React from 'react'
import {Flex} from 'antd-mobile'
import getCurrentCity from '../../utis/location'
import './index.scss'
import Filter from './components/Filter/index'
import request from '../../utis/api'
import {List, AutoSizer ,WindowScroller ,InfiniteLoader } from 'react-virtualized'
import HouseItem from '../../components/HouseItem/index'



class Find extends React.Component {

  state = {
    // 当前城市名称
      currentCity:'',
      //  总长度
      count:0,
      // 列表平数据
      list:[],
      // 筛选条件
      filter: {}
  }
  componentDidMount (){
    getCurrentCity().then( city => {
      this.setState({
        currentCity: city.label
      })
    });
     // 页面首次加载时调用接口
    //  this.onFilter({})
    this.loadMoreRows({
      startIndex: 1,
      stopIndex: 10
    })
  }
  // 数据
  onFilter = async (filter )=>{
    // 调用后台发送请求  
    // let city = await getCurrentCity();
    // let res = await request({
    //   method:'get',
    //   url:'houses',
    //   parmas:{
    //     filter: filter,
    //     cityId : city.value,
    //     start:1,
    //     end:10
    //   }
    // })
    this.setState({
      filter: filter,
      count:0,
      list:[]
    })
        this.loadMoreRows({
          startIndex: 1,
          stopIndex: 10
        })
  }
  // 渲染其中一条模板
  rowRenderer = ({style, key, index})=>{
    // return <div style={style} key={key}>{'测试数据' + index}</div>
    //  获取当前列表数据
    let { list }  = this.state;
    let itemData = list[index];
    // {...itemData} 注入很多属性
    return <HouseItem key={key} style={style} {...itemData} />
  }

  // 用于跟踪列表每一行数据的加载状态
  isRowLoaded =({index}) =>{
      const { list} = this.state;
      return !!list[index]
  }

  // 用于加载下一页数据
  loadMoreRows = async ( { startIndex , stopIndex})=>{
      // 这里负责用后台接口获取分页数据
      // 返回的数据结果需要提供promise 对象
      let city =await getCurrentCity();
      return request({
        method:'get',
        url:'houses',
        params:{
          cityId: city.value,
          ...this.state.filter,
          start: startIndex,
          end : stopIndex
        }
      }).then( res => {
        this.setState({
          count: res.body.count,
          list: [...this.state.list , ...res.body.list]
        })
      } )
  }

  render () {
    return (
     <React.Fragment>

      {/*搜索栏*/}
      <Flex className='header'>
        <i className="iconfont icon-back" />
        <Flex className='search-box searchHeader'>
          {/* 左侧白色区域 */}
          <Flex className="search">
            {/* 位置 */}
            <div className="location" >
              <span className="name">{this.state.currentCity}</span>
              <i className="iconfont icon-arrow" />
            </div>
            {/* 搜索表单 */}
            <div className="form" >
              <i className="iconfont icon-seach" />
              <span className="text">请输入小区或地址</span>
            </div>
          </Flex>
          {/* 右侧地图图标 */}
          <i className="iconfont icon-map" />
        </Flex>
      </Flex>
      {/* 筛选菜单 */}
      <Filter onFilter={ this.onFilter} />
      {/*  长列表内容 */}
      { this.state.list.length >0  && (
        <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={this.state.count}
        >
            { ( {onRowsRendered, registerChild } ) => (
               <WindowScroller>
               {  ({height, isScrolling, onChildScroll, scrollTop }) => (
                  <AutoSizer>
                   {({width}) => {
                      return (
                        <List
                          autoHeight
                          isScrolling={isScrolling}
                          onScroll={onChildScroll}
                          scrollTop={scrollTop}
                          className='houseList'
                          ref={registerChild}
                          onRowsRendered={onRowsRendered}
                          width={width}
                          height={height}
                          rowCount={this.state.list.length}
                          rowHeight={120}
                          rowRenderer={this.rowRenderer}
                        />
                         )
                       }}
                </AutoSizer> 
               )}
            </WindowScroller>
          
            ) }
        </InfiniteLoader>
        )}
     </React.Fragment>
    )
  }
}

export default Find