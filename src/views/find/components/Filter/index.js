import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

import request from '../../../../utis/api'
import getCurrentCity from '../../../../utis/location'
export default class Filter extends Component {

  state = {
    // 保存 选中 的所有的条件
    menuValue:{
        area: null,
        mode: null,
        price: null,
        more: null
    },
    // 菜单高亮控制
    menuStatus: {
      area: false,
      mode: false,
      price: false,
      more: false
    },
    // 表示当前打开的菜单类型
    openType: '',
    FilterDate: [] ,//  筛选条件数据
  }
    //  获取数据
   loadDate = async()=>{
     let city = await getCurrentCity();
     let res = await request({
          method :'get',
          url:'/houses/condition',
          params: {
            id: city.value
          }
        })
        console.log(res);
        this.setState({
          FilterDate: res.body
        });
        
    }

    componentDidMount(){
      this.loadDate();
    }

  // 修改高亮状态
  changeStatus = (type) => {
    if (!type) {
      return
    }
    // let newMenuStatus = {...this.state.menuStatus}
    // // 把对应菜单修改为高亮状态
    // newMenuStatus[type] = !newMenuStatus[type]
    // this.setState({
    //   menuStatus: newMenuStatus
    // })
    // -----------------------------
    // 判断菜单是否高亮 
    const { menuStatus , menuValue , openType} = this.state;
    // 复制 一份状态 
    const newMenuStatus= {...menuStatus };
    // Object.keys方法会返回一个由一个给定对象的自身可枚举属性组成的数组，
    //数组中属性名的排列顺序和使用 for...in 
    //循环遍历该对象时返回的顺序一
     Object.keys(newMenuStatus).forEach(item => {
        // 判断四个菜单是否高亮
      if( item === type) {
        // 当前点击的菜单
        newMenuStatus[item] = true;
      } else if ( item === 'area'&& menuValue.area && menuValue.area.length === 3){
        // 判断区域高亮
        newMenuStatus[item] = true;
      } else if ( item === 'mode' && menuValue.mode && menuValue.mode.length === 1 && menuValue.mode[0] !== 'null' ){
        // 判断租房高亮
        newMenuStatus[item] = true;
      } else if ( item === 'price' && menuValue.price && menuValue.price.length === 1 && menuValue.price[0] !== 'null' ){
        // 判断价格高亮
        newMenuStatus[item] = true;
      } else if (item === 'more' && menuValue.more && menuValue.more.length  > 0 ) {
         newMenuStatus[item] = true;
      } else {
        // 其他状态不高亮
        newMenuStatus[item] = false;
      }
     })

    // 方法二：实现状态更新
    this.setState({
      menuStatus: newMenuStatus,
      openType: type
    })
  }

  // 关闭下拉列表
  onCancel = () => {

    let { menuValue, menuStatus, openType } = this.state
    let newMenuStatus = {...menuStatus}
    // 获取当前条件的值
    let v = menuValue[openType]
    if (v && v.length > 0 && v[0] !== 'null') {
      // 已经选中了值，高亮
      newMenuStatus[openType] = true
    } else {
      newMenuStatus[openType] = false
    }

    this.setState({
      menuStatus: newMenuStatus,
      openType: ''
    })
  }
  //  获取下拉窗口并隐藏窗口
  onSave = (type, value) => {
      // 控制点击确定按钮控制菜单高亮
    // 点击确定按钮控制菜单高亮
    const { menuValue, menuStatus } = this.state;
    let newMenuStatus = {...menuStatus}
    // 判断是否选中了值
    if (value && value.length > 0 && value[0] !== 'null') {
      // 已经选中
      newMenuStatus[type] = true
    } else {
      // 没有选中
      newMenuStatus[type] = false
    }
    this.setState({
      openType: '',
      menuStatus: newMenuStatus,
      menuValue: {
        ...this.state.menuValue,
        [type]: value
      }
    }, ()=>{
      // console.log(this.state.menuValue);
      // 根据后台接口查询参数的要求组合
      const { menuValue  } = this.state
      let filter =[] ;
      // 1 区域筛选条件
      // 1.1 如果仅仅选择了区域,但是没有选择第二项和第三项
      // 1.2 如果选择了第一项,第二项,第三没有选择,那么 有效的是第二项
      // 1.3 如果三项都选择了,那么有效值是第三项
      if( menuValue.area && menuValue.area.length === 3 ){
        //有效数据
        let keyName = menuValue.area[0] // 取值只能是area 或者subway
        let keyValue = menuValue.area
        if ( keyValue[2] === 'null' ){
          // 选择了两项
          filter[keyName] = keyValue[1];
        } else {
          //  选择了三项
          filter[keyName] = keyValue[2];
        }
      } 
      //  2. 出租方式
      if (menuValue.mode && menuValue.mode.length ===1 && menuValue.mode[0] !== 'null'){
           filter.rentType = menuValue.mode[0]
      }    
      // 3. 房屋租金 
      if (menuValue.price && menuValue.price.length ===1 && menuValue.price[0] !== 'null'){
          filter.price = menuValue.price[0]
      }  
      // 4. 筛选更多条件
      if (menuValue.more && menuValue.more.length > 0 ){
        filter.more = menuValue.more.join(',');
      } 
      // 将组合好的参数 传递到父组件
        this.props.onFilter(filter);
    });
  }

  // 渲染 FilterPicker 方法
  renderFilterPicker = () => { 
    // (openType === 'area' || openType === 'mode' || openType === 'price') && <FilterPicker 
    // onSave= {this.onSave} onCancel={this.onCancel}/>
    const { openType,
            menuValue,
            FilterDate: {  area, subway, rentType, price } // 结构
          } = this.state;
    if ( !(openType === 'area' || openType === 'mode' || openType === 'price')  ) {
      // 条件不成立就不渲染
      return null
    };
    // 根据当前点击的菜单,渲染不同的数据
    let pickerData = [];
    let  cols = 3;  
    // 获取原来选择的值(默认值)
    let defaultValue =  menuValue[openType];
    switch(openType){
       case 'area' :
          // 支持区域找房和地铁找房 
        pickerData = [area , subway];
        cols = 3;
       break
       case 'mode':
         // 支持区域找房和地铁找房 
       pickerData = rentType;
       cols = 1;
       break
       case 'price':
        pickerData = price;
        cols = 1;
        break
      default:
      break; 
    };

  return <FilterPicker key={openType} defaultValue={defaultValue} openType={openType} cols={cols} 
   data={ pickerData} onSave= {this.onSave}  onCancel={this.onCancel}/>
  }
  //  渲染 renderFilterMore 
  renderFilterMore = () =>{
    const { openType,
      menuValue,
      FilterDate: { roomType , oriented , floor , characteristic }
    } = this.state;

    if (openType !== 'more'  ) {
      return null 
    }

    let moreData = { roomType , oriented , floor , characteristic }
    // 获取 之前选择的默认值 \
    let defaultValue = menuValue[openType]
    return  <FilterMore defaultValue={defaultValue } onCancel={this.onCancel} openType={openType} onSave={ this.onSave} data= { moreData } />
  };

  render() {
    const { openType } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {(openType === 'area' || openType === 'mode' || openType === 'price') && <div className={styles.mask} />}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle changeStatus={this.changeStatus} menuStatus={this.state.menuStatus}/>

          {/* 前三个菜单对应的内容：下拉列表 */}
          { this.renderFilterPicker() }
          {/* 最后一个菜单对应的内容： */}
          { this.renderFilterMore() }
        </div>
      </div>
    )
  }
}
