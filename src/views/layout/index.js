import React from 'react';
import { Route , Switch , Redirect } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import './index.css';
import Index from '../index/index.js';
import Find from '../find/index.js';
import Info from '../info/index.js';
import My from '../my/index.js';


export default class Layout extends React.Component {
    state = {
        // 控制菜单的切换
        selectedTab: 'index'
      }

      componentDidMount () {
        // 获取当前路由的路径
        let path =this.props.location.pathname;
        // 截取 二级路由的路径
        let index = path.lastIndexOf('/');
        if (index !== -1 && index !== 0 ) {

          let menu = path.substr(index + 1 ) 
          let menus = ['index','find','info','my'];
          if(!menus.includes(menu)){
              //  indcludes 检测是否包含
              menu = 'index'
          }
          //   substr 截取指定字符串下标开始的指定数目的的字符
          this.setState({
            selectedTab : menu 
          })
        }  
      }
      handerMenuItems = () => {
        const menuDate = [{
            id: 'index',
            mtitle: '主页',
            icon: 'icon-house'
          }, {
            id: 'find',
            mtitle: '找房',
            icon: 'icon-findHouse'
          }, {
            id: 'info',
            mtitle: '资讯',
            icon: 'icon-myinfo'
          }, {
            id: 'my',
            mtitle: '我的',
            icon: 'icon-my'
          }]
        return menuDate.map(item =>(
       <TabBar.Item
            title= {item.mtitle}
            key={item.id}
            icon={ <i className={`iconfont ${item.icon}`} /> }
            selectedIcon={ <i className={`iconfont ${item.icon}`}  /> }
            selected={ this.state.selectedTab === item.id }
            onPress={() => {
              // 菜单点击触发的事件
              this.setState({
                selectedTab: item.id,
              });
              // 控制路由
              this.props.history.push('/home/' + item.id )
            }}
          >
         <div> { item.mtitle } </div>
          </TabBar.Item>
          ) ) 
        }

      render () {
          return (
       <React.Fragment>
             <Switch>
                 <Redirect exact  from='/home' to='/home/index' />
                 <Route path='/home/index' component={Index} />
                 <Route path='/home/info' component={Info} />
                 <Route path='/home/find' component={Find} />
                 <Route path='/home/my' component={My} />
             </Switch>

               <TabBar
                 unselectedTintColor="#949494"
                 tintColor="#33A3F4"
                 noRenderContent={true}
                 barTintColor="white"
               >
                   { this.handerMenuItems()}
                 </TabBar>
        </React.Fragment>
          )
      }
    
};