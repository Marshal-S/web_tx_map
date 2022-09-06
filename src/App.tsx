import React, { useEffect, useRef } from 'react';

const mapkey = "OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77" //官方案例的key，换成自己的

var TMap: any
var qq: any

const TMapGL = (key: string): Promise<any> => {
  return new Promise(function(resolve, reject) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=' + key
    script.onerror = (err) => reject(err)
    script.onload = (e) => {
      TMap = (window as any).TMap
      resolve(e)
    }
    document.head.appendChild(script)
  })
}

const TLocationGL = (): Promise<any> => {
  return new Promise(function(resolve, reject) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js'
    script.onerror = (err) => reject(err)
    script.onload = (e) => {
      qq = (window as any).qq
      resolve(e)
    }
    document.head.appendChild(script)
  })
}



function App() {
  const myMap = useRef<any>(null)
  const mapLayer = useRef<any>(null)

  useEffect(() => {
    initMap()
    initLocation()
  }, [])

  const initLocation = () => {
    TLocationGL().then(res => {
      console.log('qq', (window as any).qq)
      var geolocation = new qq.maps.Geolocation(mapkey, "web-map-demo");
      geolocation.watchPosition(getPosition);
    }).catch(err => {
      console.log('err', err)
    })
  }

  const getPosition = (position: any) => {
    console.log('position', position)
    myMap.current.setCenter(new TMap.LatLng(position.lat, position.lng))
  }

  const initMap = () => {
    //定义地图中心点坐标
    TMapGL(mapkey).then(() => {
      console.log('TMap', TMap)
      let center = new TMap.LatLng(39.160001, 117.156150)
      let myOptions = {
        zoom: 18,
        center
      };
      let dom = document.getElementById('my-map')
      //创建地图，绑定dom
      let map = new TMap.Map(dom, myOptions);
      //Map实例创建后，通过on方法绑定点击事件
      map.on("click", onClickMap)
      myMap.current = map

      //创建并初始化MultiMarker
      mapLayer.current = new TMap.MultiMarker({
        map: map,  //指定地图容器
        //样式自定义
        styles: {
            //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
            "marker": new TMap.MarkerStyle({ 
                "width": 25,  // 点标记样式宽度（像素）
                "height": 25, // 点标记样式高度（像素）
                "src": `${process.env.PUBLIC_URL}/logo192.png`,  //图片路径，不设置会使用腾讯地图默认的红标
                //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
                "anchor": { x: 16, y: 32 }  
            }) 
        },
        //点标记数据数组
        geometries: [{//第1个点标记
            "id": "0",
            "styleId": 'marker',
            "position": center,
            "properties": {
                "title": "defaultMarker"
            }
        }]
      });
    }).catch(err => {
      console.log('err', err)
    })
  }

  const onClickMap = (e: any) => {
    console.log('click', e)
    // addOnePoint(e)
    addMorePoints(e)
  }

  const addOnePoint = (e: any) => {
    let lat = e.latLng.getLat();
    let lng = e.latLng.getLng();
    console.log("您点击的的坐标是："+ lat + "," + lng);

    let markers = [{
      "id": Math.random() * 100000 % 100000 + '',   //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
      "styleId": 'marker',  //指定样式id
      // "position": new TMap.LatLng(lat + Math.random() / 100, lng + Math.random() / 100),  //点标记坐标位置
      "position": e.latLng,  //点标记坐标位置
      "properties": {
        "title": "defaultMarker"
      }
    }]
    mapLayer.current.add(markers)
  }

  const addMorePoints = (e: any) => {
    let lat = e.latLng.getLat();
    let lng = e.latLng.getLng();
    console.log("您点击的的坐标是："+ lat + "," + lng);

    let markers: any[] = []
    for(let i = 1; i < 1000; i++) {
      markers.push({
        "id": '' + i + '' + lat + '' + lng,   //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
        "styleId": 'marker',  //指定样式id
        "position": new TMap.LatLng(lat + Math.random(), lng + Math.random()),  //点标记坐标位置
      })
      markers.push({
        "id": '' + i + '' + lat + '' + lng,   //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
        "styleId": 'marker',  //指定样式id
        "position": new TMap.LatLng(lat - Math.random(), lng - Math.random()),  //点标记坐标位置
      })
      markers.push({
        "id": '' + i + '' + lat + '' + lng,   //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
        "styleId": 'marker',  //指定样式id
        "position": new TMap.LatLng(lat + Math.random(), lng - Math.random()),  //点标记坐标位置
      })
      markers.push({
        "id": '' + i + '' + lat + '' + lng,   //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
        "styleId": 'marker',  //指定样式id
        "position": new TMap.LatLng(lat - Math.random(), lng + Math.random()),  //点标记坐标位置
      })
    }
    console.log('markers', markers)
    // mapLayer.current.add(markers)
    mapLayer.current.setGeometries(markers)
  }

  return (
    <div id="my-map" style={{width: '100vw', height: '100vh'}}></div>
  );
}

export default App;
