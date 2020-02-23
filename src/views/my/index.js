/*
  列表找房模块
*/
import React from 'react'

import axios from 'axios'

import {List, AutoSizer} from 'react-virtualized'

// 测试数据
let list = Array.from(new Array(50)).map((item, index) => (
  <div>第{index}行列表数据</div>
))

class My extends React.Component {
  ClickDate =  async () =>{
     const res = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0" -H "accept: application/json')
     console.log(res);
     
  }
  rowRenderer =({index ,style , key}) =>{
    return (
      <div key={key} style={style}>
        {list[index]}
      </div>
    )
  }
  render () {
    return (
      <div>
        我的 <button onClick={this.ClickDate}>andsa ad</button>

        <AutoSizer>
          {/*height和width表示父容器，也就是city这个div的高度和宽度*/}
          {({height, width}) => (
            <List
              width={width}
              height={height + 200}
              rowCount={ list.length}
              rowHeight={ 50 }
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}

export default My