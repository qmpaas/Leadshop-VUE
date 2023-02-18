/*
 * @Description:
 * @Author: fjt
 * @Date: 2021-06-17 15:29:48
 * @LastEditTime: 2021-06-17 16:18:32
 * @LastEditors: fjt
 */
import * as echarts from 'echarts';

class Echart {
  myChart;
  constructor(id, name) {
    this.init(id, name);
  }
  init(id, name) {
    let chartDom = document.getElementById(id);
    this.myChart = echarts.init(chartDom);
    let option;
    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '5%',
        left: 'center'
      },
      series: [
        {
          name: name,
          type: 'pie',
          radius: ['30%', '60%'],
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: false,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          center: ['50%', '45%'],
          data: []
        }
      ]
    };
    this.myChart.setOption(option);
    window.onresize = () => {
      this.myChart.resize();
    };
  }
  setOptions(data) {
    this.myChart.setOption({
      series: [
        {
          data: data
        }
      ]
    });
  }
}

export default Echart;
