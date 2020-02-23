import  request from './api'

export default () =>{
    return new Promise((resolve , reject) =>{
        let city = window.localStorage.getItem('hkzf_city');
        if(city) {
            return resolve(JSON.parse(city))
        }
        let myCity =new window.BMap.LocalCity();
        myCity.get( async (result) => {
            // 根据地理定位获取当前城市的详细信息 
            const ccity = await request({
                method: 'get',
                url: '/area/info',
                params: {
                  name: result.name === '全国'? '北京': result.name
                }
            })
            let lng = result.center.lng;
            let lat = result.center.lat;
            if ( result.name === '全国'){
                 // 默认设置为北京
                 lng = '116.404'
                 lat = '39.915'
            }
            let info = {
                label: ccity.body.label,
                value : ccity.body.value,
                lng : lng,
                lat : lat
            }
            resolve(info)
        })
    })
}