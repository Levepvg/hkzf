/*
  列表找房模块
*/
import React from 'react';
import { NavBar, Icon, Toast } from 'antd-mobile';
import request from '../../utis/api.js';
import {List, AutoSizer } from 'react-virtualized'
import './index.scss'

import getCurrentCity from '../../utis/location'
// 测试数据
// let list = Array.from(new Array(50)).map((item, index) => (
//   <div>第{index}行列表数据</div>
// ))

class CityList extends React.Component {
  state = {
    cityList: {},
    activeIndex: 2 
  }
  // 创建一个列表组件的索引
  listRef = React.createRef()
 //  数据重组
 formatCityDate = list => {
  let result ={};
  let Index =[];
  list.forEach(item => {
    let firstLetter = item.short.substr(0,1);
      if(result.hasOwnProperty(firstLetter)){
        // 如果存在 就直接添加刀片数据中
        result[firstLetter].push(item)
      } else {
        // 如果不存在, 初始化数据
        result[firstLetter] = [item]
      }
  })
  // 对数据进行索引排开
  Index = Object.keys(result).sort();
  return{
    cityList: result,
    cityIndex: Index
  }
} 
 

  //  获取城市列表数据 
  loadDate = async () =>{
   
    const res = await request({
        method: 'get',
        url: '/area/city',
        params:{
          level: 1
        }
    });
    let ret =  this.formatCityDate(res.body);
    // console.log(ret);
    // 获取热点城市
    let hot = await request({
      method:'get',
      url:'/area/hot'
    });
      ret.cityIndex.unshift('hot')
      ret.cityList.hot = hot.body 
      Toast.hide();
      //  通过地理定位获取当前城市名称
      let ccity =await getCurrentCity()
      ret.cityIndex.unshift('#')    
      ret.cityList['#'] = [ccity]  
      this.setState({
        cityList : ret
      });
    //   ret.cityIndex.unshift('#')
    //   ret.cityList['#'] = [{label:'北京',value:'221  aedgadf' }]
    // this.setState({
    //   cityList: ret
    // })

    // let myCity = new window.BMap.LocalCity();
    //   myCity.get(async (result) => {
    //   const ccity = await request({
    //     method:'get',
    //     url:'/area/info',
    //     params:{
    //       name: result.name === '全国'?'北京' : result.name
    //     }
    //   })
    //   // 添加当前城市 (地理定位)
    //   ret.cityIndex.unshift('#')
    //   ret.cityList['#'] = [ccity.body]
    //   this.setState({
    //   cityList: ret
    // })
    // })
  }
  componentDidMount (){
    this.loadDate();
    Toast.loading('正在加载...' , 0, null, false);
  }
 
  renderCityList= ()=>{
    let { cityList, cityIndex } = this.state.cityList
    console.log(cityList);
    console.log(cityIndex);
    
    let cityTag = []
     cityIndex &&  cityIndex.forEach(k =>{
        cityTag.push( <div key={k}>  {k} </div> )
        let city = cityList[k]
        city.forEach( c => {
          cityTag.push( <div key={c.value}> {c.label} </div>)
        });
    });
    return cityTag;
    
  }
  

    // 渲染每一个列表条目
  rowRenderer = ({key, style, index})=>{

    const { cityIndex ,cityList } = this.state.cityList

    let firstLetter = cityIndex[index]

    let cities = cityList[firstLetter]
    // 城市列表的模板
    const cityTag = cities.map(item =>(
      <div className='name' key={item.value} 
      // 选中城市并且返回首页
      onClick={ ()=> {
        if(['北京','上海','深圳','广州'].includes(item.label) ){
            // 选中该城市
            // Toast.info( item.label,1 )
            // window.localStorage.setItem('hkzf_city',JSON.stringify(item))
            // this.props.history.push('/home')

            let geo = new window.BMap.Geocoder()
            // 根据城市名称查询对应的经纬度数据
            /*
              参数一：表示要查询的城市名称
              参数二：回调函数，获取经纬度结果
              参数三：固定为：中国（表示从哪个国家查询城市信息）
            */
           geo.getPoint(item.label, (data)=> {
             let info ={
              label: item.label,
              value: item.value,
              lng: data && data.lng,
              lat : data && data.lat
             }
             window.localStorage.setItem('hkzf_city',JSON.stringify(info))
             this.props.history.push('/home')
           } ,'中国')
        } else {
          // 提示
          Toast.info('只支持一线城市',1 )
        }
      } }
      >
          {item.label}
      </div>
    ))
    return  (
      <div key={key} style={style} className="row-city">
        <div className="title">{firstLetter.toUpperCase()}</div>
        {cityTag}
      </div>

    )
  }
  // 动态填充右侧索引
  renderRightIndex = ()=>{
    const { cityIndex } = this.state.cityList;
    const { activeIndex } = this.state;

    return cityIndex && cityIndex.map( (item,index) => (
      <li className="city-index-item"
        onClick={ ()=> {
          // 控制上下滑动
          this.listRef.current.scrollToRow(index)
          console.log(index);
        }}
        key={index}
      >
      <span className={ activeIndex === index ?'index-active' :'' } >
        { item ==='hot' ? '热' : item.toUpperCase() }
      </span>
    </li>
    ));
  }
  // 监听列表的滚动行为
  onRowsRendered = ( {startIndex} )=>{
    console.log(startIndex )
    if(this.state.activeIndex !== startIndex ){
      // if(startIndex === 19){
      //   startIndex = 20
      // }
      this.setState({
        activeIndex: startIndex 
      })
    }
  }

  // 计算每一行的高度
  calcRowHeight =( {index} )=> {
    const { cityIndex ,cityList } = this.state.cityList
    let firstLetter = cityIndex[index]
    // 根据标题索引获取当前行的城市列表
    let cities = cityList[firstLetter]
    //  标题的高度 + 每个城市的高度 * 城市的数目 
    return 36 + 50 * cities.length
  }

  // rowRenderer =({index ,style , key}) =>{
  //   return (
  //     <div key={key} style={style}>
  //       {list[index]}
  //     </div>
  //   )
  // }
  render () {
    const { cityIndex , cityList } = this.state.cityList
    return (
    <div style={ {height: "100%" }}>
     <NavBar 
           className="navbar"
           mdoe="light"
           icon={ <Icon type="left" /> }
           onLeftClick= { ()=> {
             this.props.history.go(-1)
           }} >
               城市选择
     </NavBar>
          {
            cityIndex &&  <AutoSizer>
             {({height, width}) => (
               <List
                ref={this.listRef}
                className='city'
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment='start'
                width={ width }
                height={height }
                rowCount={ cityIndex.length}
                rowHeight={this.calcRowHeight}
                // rowHeight={ 20 }
                rowRenderer={this.rowRenderer}
              />
            )} 
          </AutoSizer> 
          }

           <ul className="city-index">
              {this.renderRightIndex()}
          </ul>
      </div>
    )
  }
}

export default CityList;