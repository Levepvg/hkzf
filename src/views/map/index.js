/*
     地图
*/
import React from 'react'
import { NavBar, Icon } from 'antd-mobile';
import getCurrentCity from '../../utis/location'
import './index.scss'
import request from '../../utis/api'
import{ IMG_BASE_URL} from '../../utis/config'

export default class TestMap extends React.Component {
     state = {
       mapData: [],
       // 房源列表数据
       houseList:[],
       isShow:false
       }

 loadDate = async () => {
      let city = await getCurrentCity()
      let res = await request({
        method:'get',
        url:'/area/map',
        params:{
          id: city.value
        }
      })
      this.setState({
        mapData: res.body
      })
      console.log(res.body);
      
 }
//  封装获取房源信息列表的方法
getHouseList = async (id)=>{
  let res = await request({
    method:"get",
    url:'houses',
    params:{
      cityId: id
    }
  })
  console.log(res.body.list);
  
  this.setState({
    houseList: res.body.list,
  
  })
}

//  封装单个的覆盖的方法
drawSingleOverlay= (data,map , type)=>{
  let point = new window.BMap.Point(data.coord.longitude, data.coord.latitude)
  let opts={
    //  表示覆盖物绘制的坐标
    position: point,
    // 覆盖中心点的偏移点
    offset : new window.BMap.Size(-30,-30)
  }
  let overInfo =  `
  <div class="map-overlay ${ type==='second' ? 'map-overlay-second': ''}">
    <div>${data.label} </div>
    <div>${data.count}套</div>
  </div>
  `   
  if ( type === 'third'){
    // 三级覆盖物
    overInfo = `
    <div class="map-overlay-area"> ${data.label}(${data.count}) </div>
    `
  }
  let label = new window.BMap.Label( overInfo, opts)
  // 给label 注册点击事件
  label.addEventListener('click', (e)=> {
    if( type === 'first') {
      // 点击一级覆盖物,就会绘制二级绘制物
      this.drawSecondOverlay(data, point ,map)
    } else if ( type ==='second') {
      // 点击二级覆盖物,就会绘制三级绘制物
      this.drawThirdOverlay(data, point , map)
    } else if ( type ==='third'){
      // console.log('list');\
      this.getHouseList(data.value)
      let x0 = window.innerWidth / 2 ;
      let y0 = window.innerHeight / 2;
      let x1 = e.changedTouches[0].clientX;
      let y1 = e.changedTouches[0].clienty;
      map.panBy( x0 - x1 , y0 - y1 )
      this.setState({
        isShow:true  
      })
    }
  }) 

  // 调整默认的覆盖物样式
  label.setStyle({
    border: 0,
    background: 'rgba(0,0,0,0)'
  })
  // 把地图覆盖物添加到地图中
  map.addOverlay(label)
}

// 封装绘制一级覆盖函数
drawFirstOverlay= (point,map)=>{
  map.centerAndZoom(point, 11)
  this.state.mapData.forEach(item => {
    // 绘制单个覆盖物
    this.drawSingleOverlay(item,map,'first')
  })
}
// 封装二级覆盖函数
drawSecondOverlay = async (data,point ,map) => {
  // 点击之后会放大
  map.centerAndZoom(point,13)
  // 清空一级的绘制物
  setTimeout( ()=>{
    map.clearOverlays()
  },0)
  let res = await request({
    method:'get',
    url:'/area/map',
    params:{
      id: data.value
    }
  })
  res.body.forEach( item=> {
    this.drawSingleOverlay(item , map, 'second')
  })
}

// 封装三级覆盖函数
drawThirdOverlay = async (data, point ,map) => {
   // 点击之后会放大
   map.centerAndZoom(point,15)
   // 清空一级的绘制物
   setTimeout( ()=>{
     map.clearOverlays()
   },0)
   let res = await request({
     method:'get',
     url:'/area/map',
     params:{
       id: data.value
     }
   })
   res.body.forEach( item=> {
     this.drawSingleOverlay(item , map, 'third')
   })
}


  // 初始化地图
  initMao = async ()=>{
          // 初始化地图功能
          // 创建地图实例
          let map =new window.BMap.Map('mymap');
          // 获取地图的定位信息
          let myCity = new window.BMap.LocalCity();
          // 获取当前城市的数据
          let city = await getCurrentCity();
          // 创建坐标点
          let point = new window.BMap.Point(city.lng, city.lat);
          // 初始化地图, 设置中心点坐标和地图缩放级别
          // map.centerAndZoom(point ,12 );

          // this.state.mapData.forEach( item => {
          //   this.drawSingleOverlay(item, map)
          // })
          this.drawFirstOverlay(point,map)
          // myCity.get( (info)=>{
          //   console.log(info);
          //   const {lng , lat} = info.center
          //   let point = new window.BMap.Point(lng ,lat)
          //   map.centerAndZoom(point, 15);
          // })
          // 添加地图覆盖物
          // let opts={
          //   //  表示覆盖物绘制的坐标
          //   position: point,
          //   // 覆盖中心点的偏移点
          //   offset : new window.BMap.Size(-30,-30)
          // }
          // let overInfo =  `
          // <div class="map-overlay">
          //   <div>海淀</div>
          //   <div>122套</div>
          // </div>
          // `   
          // let label = new window.BMap.Label( overInfo, opts)
          // // 调整默认的覆盖物样式
          // label.setStyle({
          //   border: 0,
          //   background: 'rgba(0,0,0,0)'
          // })
          // // 把地图覆盖物添加到地图中
          // map.addOverlay(label)
        
  }

  async componentDidMount () {
    await this.loadDate()
      this.initMao()
     
    }

    // 封装渲染房源列表的方法
    renderHouseList =()=>{
        const listTag = this.state.houseList.map(item => (
          <div key={item.houseCode} className="house">
              <div className="img-wrap">
                 <img className="img" src={IMG_BASE_URL + item.houseImg}  alt="" /> 
              </div>
              <div className="content"> 
                  <h3 className="content">{item.title}</h3>
                  <div className="desc">{item.desc} </div>
          <div>
               { item.tags.map( (item , index) => {
                let tagCls = 'tag' + (index + 1)
                return (
                  <span className={['tag', tagCls].join(' ')}>
                      {item}
                  </span>
                )
              }) }
          </div>
            <div className="price"> 
              <span className="price-num">{item.price} </span> 元/月
            </div>
           </div>
         </div>
        ))
        return (
          <div className={ ['house-list',this.state.isShow?'show' :''].join(' ')}>
              <div className="titile-wrap">
                  <h1 className="list-title"> 房屋列表信息 </h1>
                  <a className="title-more" href="/house/list">
                    更多房源
                  </a>
              </div>
              <div className="house-items">
                {listTag}
              </div>
          </div>
        )
    }

  render () {
    return (
        <div style={{height: '100%', background: '#eee'}}>
             <NavBar 
           className="navbar"
           mdoe="light"
           icon={ <Icon type="left" /> }
           onLeftClick= { ()=> {
             this.props.history.go(-1)
           }} >
               地图找房
     </NavBar>
           <div style={{height: '100%'}} id="mymap"></div> 

           {/* 房源列表信息 */}
            { this.renderHouseList()}
      </div>
    )
  }
}
