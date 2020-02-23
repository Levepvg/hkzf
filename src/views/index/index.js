import React from 'react'
import { Carousel , Flex , Grid, WingBlank, NavBar, Icon  } from 'antd-mobile'
import './index.scss'

// import axios from 'axios'

import nav1 from '../../assets/imgs/nav-1.png';
import nav2 from '../../assets/imgs/nav-2.png';
import nav3 from '../../assets/imgs/nav-3.png';
import nav4 from '../../assets/imgs/nav-4.png';

import { IMG_BASE_URL} from '../../utis/config.js'

// axios.defaults.baseURL = 'http://localhost:8080';
import request from '../../utis/api.js'

import getCurrentCity from '../../utis/location'

export default class Index extends React.Component {
    state = {
        swiperData: [],
        groupData: [], // 租房小组
        isLoaded : false,
        newsData: [],
        currentCity:''
      }
    // 获取轮播图数据
    loadSwiper = async ()=> {
      // let res = await axios.get('/home/swiper')
      // this.setState({
      //   swiperData: res.data.body
      // })
      let res = await request({
        method:'get',
        url:'/home/swiper'
      })
      this.setState({
        swiperData: res.body
      })
    }
    // 获取租房小组数据
    loadGroup = async ()=> {
      // let res = await axios.get('/home/groups')
      // this.setState({
      //   groupData: res.data.body
      // })
      let res = await request({
        method:'get',
        url:'/home/groups'
      })
      this.setState({
        groupData: res.body
      })
    }
    //   获取最新资讯数据
    lodaNewS = async ()=> {
      let res = await request({
        method:'get',
        url:'/home/news'
      });
      this.setState({
        newsData:res.body
      })
      // console.log(res.body);
      
    }
    componentDidMount () {
      this.loadSwiper();
      this.loadGroup();
      this.lodaNewS();
      // let city = localStorage.getItem('hkzf_city')
      // console.log(city);
      // if (city) {
      //   city =JSON.parse(city)
      //   this.setState({
      //     currentCity : city.label
      //   })
      // }
      getCurrentCity().then( city =>{
        this.setState({
          currentCity: city.label
        })
      })
    }
    //  渲染顶部导航
    renderNavbar = () =>{
        return (
          <NavBar mode="dark" icon={ this.state.currentCity }
          onLeftClick={ ()=>{
            this.props.history.push('/citylist')
          }}
          rightContent={ [
            <Icon key='1' type="ellipsis" 
            onClick={ ()=>{
              this.props.history.push('/map')
            }}/>,
          ]}
          >
              主页
          </NavBar>
        )
    }

    // 轮播图数据渲染
   renderSwiper = () =>{
    const swiperTag = this.state.swiperData.map( (item ) => (
          <img 
          onLoad={ () => {
            // 窗口尺寸变化时=> 触发resize 事件=> 重新设置动态高度
            window.dispatchEvent(new Event('resize'))
            // dispatchEvent  自定义事件
            this.setState({
              isLoaded: true
            })
          }}
          src={`${IMG_BASE_URL}${item.imgSrc}`} alt="" key={item.id}/>
        ))
        return (
          <Carousel 
          autoplay={ this.state.isLoaded}
          autoplayInterval={2000}
          infinite={true}
          >
            { swiperTag }
          </Carousel>
        )
    }
    // nav 栏宣渲染
   renderNav = () => {
    const navs =[
        {
        id:1,
        img: nav1,
        title:'整租',
      }, {
        id:2,
        img: nav2,
        title:'合租',
      }, {
        id:3,
        img: nav3,
        title:'地图找房',
      }, {
        id:4,
        img: nav4,
        title:'去出租',
      },
    ]
   const menuTag = navs.map( item => (
        <Flex.Item key={item.id}>
         <img src={ item.img } alt=''  />
        <p> {item.title} </p>   
        </Flex.Item>
      ) )
    return (
      <Flex>
        {menuTag}
      </Flex>
    )
    }
    // 租房小组 渲染
    renderGroup =() => {
      return (
        <div className="group" >
          <Flex className="group-title" justify="between">
          <h3>租房小组</h3>
          <span>更多</span>
        </Flex>
        <Grid
          data={this.state.groupData}
          columnNum={2}
          square={false} 
          renderItem={item => (
            <Flex className="grid-item" justify="between">
              <div className="desc">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
            </Flex>
          )}
        />
        </div>
      )
    }
    //  最新资讯 渲染
    renderNews = () =>{
      const newsTag = this.state.newsData.map( item => (
        <div className="news-item" key={item.id}>
        <div className="imgwrap"> 
            <img className="img" src={`${IMG_BASE_URL}${item.imgSrc}`} alt='' />
        </div>
        <Flex className="content" direction="column" justify="between">
            <h3 className="title">{item.title} </h3>
              <Flex className="info" justify='between'>
                 <span>{ item.from }</span>
                 <span>{ item.date }</span>
              </Flex>
        </Flex>
      </div>
      ))
      return (
        <div className="news">
            <h3 className="group-title">最新资讯</h3>
            <WingBlank> {newsTag} </WingBlank>
        </div>
      )
    }
    render() {
        return (
            <div className="menu">
                {/*  顶部渲染 */}
                { this.renderNavbar()}
                {/* 轮播图 */}
                { this.renderSwiper()}
                {/* 导航菜单 */}
                { this.renderNav()}
                {/*  租房小组 */}
                { this.renderGroup()}
                {/* 资讯 */}
                { this.renderNews()}
              
            </div>
        )
    }
}