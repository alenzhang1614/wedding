(function (w) {
    var myMap = {
        map:function(element){
            var chart = echarts.init(element);


            /*
                图中相关城市经纬度,根据你的需求添加数据
                关于国家的经纬度，可以用首都的经纬度或者其他城市的经纬度
            */
            var geoCoordMap = {
                '深圳': [114.124343,22.53724],

                '芬兰': [24.909912, 60.169095],
                '毛里求斯': [ 57.29,-20.09],
                '巴厘岛': [115.19113540649414, -8.723151523802366],
                '湄洲岛': [126.979208, 37.53875],
                '普吉岛': [ 98.3307468, 7.9843109],
                '东南亚': [117.53244, 5.300343],
                '澳大利亚': [135.193845, -25.304039],

                '伦敦': [-0.126608, 51.208425],
                '马尔代夫': [73.5, -4.2],
                '黄石公园':[-110.3,44.36],


            };

            /*
                记录下起点城市和终点城市的名称，以及权重
                数组第一位为终点城市，数组第二位为起点城市，以及该城市的权重，就是图上圆圈的大小
             */

// 深圳
            var CQData = [
                [ {name: '深圳'} ,{name: "芬兰",value: 60}],
                [{name: '深圳'} ,{name: "德国",value: 180}],
                [{name: '深圳'}, {name: "伦敦",value: 60}],
                [{name: '深圳'}, {name: "湄洲岛",value: 60}],
                [{name: '深圳'}, {name: "东南亚",value: 60}],
                [{name: '深圳'}, {name: "马尔代夫",value: 60}],
                [{name: '深圳'}, {name: "毛里求斯",value: 200}],
                [{name: '深圳'}, {name: "澳大利亚",value: 180}],
                [{name: '深圳'}, {name: "普吉岛",value: 60}],
                [{name: '深圳'}, {name: "巴厘岛",value: 60}],
                [{name: '深圳'}, {name: "黄石公园",value: 60}],

            ];


// 小飞机的图标，可以用其他图形替换
            var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

// 获取地图中起点和终点的坐标，以数组形式保存下来
            var convertData = function(data) {
                var res = [];
                for(var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    var fromCoord = geoCoordMap[dataItem[0].name];
                    var toCoord = geoCoordMap[dataItem[1].name];
                    if(fromCoord && toCoord) {
                        res.push([{
                            coord: fromCoord // 起点坐标
                        }, {
                            coord: toCoord // 终点坐标
                        }])
                    }
                }
                return res;
            }

            var color  = ['#eee', '#aaa'];	// 自定义图中要用到的颜色
            var series = [];						// 用来存储地图数据

            /*
                图中一共用到三种效果，分别为航线特效图、飞机航线图以及城市图标涟漪图。
                要用到setOption中的series属性，并且对每个城市都要进行三次设置。
            */

            [['深圳', CQData]].forEach(function(item, i) {
                series.push({
                    // 白色航线特效图
                    type: 'lines',
                    zlevel: 1,                    // 用于分层，z-index的效果
                    effect: {
                        show: true,               // 动效是否显示
                        period: 6,                // 特效动画时间
                        trailLength: 0.7,         // 特效尾迹的长度
                        color: '#eee',            // 特效颜色
                        symbolSize: 3             // 特效大小
                    },
                    lineStyle: {
                        normal: {                 // 正常情况下的线条样式
                            color: color[0],
                            width:1,             // 因为是叠加效果，要是有宽度，线条会变粗，白色航线特效不明显
                            curveness: -0.2       // 线条曲度
                        }
                    },
                    data: convertData(item[1])    // 特效的起始、终点位置
                }, {  // 小飞机航线效果
                    type: 'lines',
                    zlevel: 2,
                    //symbol: ['none', 'arrow'],   // 用于设置箭头
                    symbolSize: 10,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: planePath,         // 特效形状，可以用其他svg pathdata路径代替
                        symbolSize: 15
                    },
                    lineStyle: {
                        normal: {
                            color: "#ee0055",
                            width: 1,
                            opacity: 0.6,
                            curveness: -0.2
                        }
                    },
                    data: convertData(item[1])     // 特效的起始、终点位置，一个二维数组，相当于coords: convertData(item[1])
                }, { // 散点效果
                    type: 'effectScatter',
                    coordinateSystem: 'geo',       // 表示使用的坐标系为地理坐标系
                    zlevel: 3,
                    rippleEffect: {
                        brushType: 'stroke'        // 波纹绘制效果
                    },
                    label: {
                        normal: {                  // 默认的文本标签显示样式
                            show: true,
                            position: 'left',      // 标签显示的位置
                            formatter: '{b}'       // 标签内容格式器
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.5,
                                colorStops: [{
                                    offset: 0, color: '#ee0055' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#fff' // 100% 处的颜色
                                }],
                                global: false // 缺省为 false
                            }
                        }
                    },
                    data: item[1].map(function(dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: geoCoordMap[dataItem[1].name],  // 起点的位置
                            symbolSize: dataItem[1].value / 8,  // 散点的大小，通过之前设置的权重来计算，val的值来自data返回的value
                        };
                    })
                });
            });

// 显示终点位置,类似于上面最后一个效果，放在外面写，是为了防止被循环执行多次
            series.push({
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 3,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'left',
                        formatter: '{b}'
                    }
                },
                symbolSize: function(val) {

                    return val[2] / 8;

                },
                itemStyle: {
                    normal: {
                        color: color[1]
                    }
                },
                // layoutCenter:['30%','30%'],
                // layoutSize: 100,

                data: [{
                    // 这里面的数据，由于一开始就知道终点位置是什么，所以直接写死，如果通过ajax来获取数据的话，还要进行相应的处理
                    name: "深圳",
                    value: [114.124343,22.53724],
                    label: {
                        normal: {
                            position: 'top'
                        }
                    }
                }]
            });


// 最后初始化世界地图中的相关数据
            chart.setOption({
                title: {
                    text: 'LOCATION',
                    textStyle: {
                        color: '#fff',
                        fontSize: 40,
                      //  textAlign:center,
                    },
                    top: '10px',
                    left: '10px'
                },
                geo: {
                    map: 'world',       // 与引用进来的地图js名字一致
                    // left:"20%",
                    // top:"20%",
                    // bottom:"20%",
                    // right:"20%",
                   roam: false,
                    // 禁止缩放平移
                    // center:[116.20,39.56],
                    // boundingCoords:[
                    //     [-50,90],[180,-90]
                    // ],
                    itemStyle: {        // 每个区域的样式
                        normal: {
                            areaColor: '#FFF9d9',
                            borderWidth:1,
                            borderColor:'#FFF9d9'
                        },
                        emphasis: {
                            areaColor: '#FFF9a0'
                        }
                    },
                    regions: [{        // 选中的区域
                        name: 'China',
                        selected: true,
                        itemStyle: {   // 高亮时候的样式
                            emphasis: {
                                areaColor: '#FFF959'
                            }
                        },
                        label: {    // 高亮的时候不显示标签
                            emphasis: {
                                show: false
                            }
                        }
                    }]
                },

                series: series,   // 将之前处理的数据放到这里
                textStyle: {
                    fontSize: 12
                }
            });

           w.addEventListener("resize", function (){
               chart.resize({width:element.offsetWidth})
           })
        }
    }
    w.myMap  = myMap;
})(window)

