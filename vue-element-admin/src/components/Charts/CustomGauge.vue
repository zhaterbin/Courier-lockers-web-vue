<template>
  <div class="chart-container">
    <div id="main" class="chart"></div>
  </div>
</template>

<script>
import * as echarts  from 'echarts';

export default {
  data() {
    return {
      ROOT_PATH: 'https://echarts.apache.org/examples',
      chart: null,
      panelImageURL: null,
      animationDuration: 1000,
      animationDurationUpdate: 1000,
      animationEasingUpdate: 'quarticInOut',
      valOnRadianMax: 200,
      outerRadius: 200,
      innerRadius: 170,
      pointerInnerRadius: 40,
      insidePanelRadius: 140,
      currentDataIndex: 0
    };
  },
  mounted() {
    this.initChart();
    setInterval(this.updateData, 3000);
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById('main'));

      this.panelImageURL = this.ROOT_PATH + '/data/asset/img/custom-gauge-panel.png';

      this.chart.setOption(this.generateOption());
    },
    generateOption() {
      return {
        animationEasing: this.animationEasingUpdate,
        animationDuration: this.animationDuration,
        animationDurationUpdate: this.animationDurationUpdate,
        animationEasingUpdate: this.animationEasingUpdate,
        dataset: {
          source: [[1, 156]]
        },
        tooltip: {},
        angleAxis: {
          type: 'value',
          startAngle: 0,
          show: false,
          min: 0,
          max: this.valOnRadianMax
        },
        radiusAxis: {
          type: 'value',
          show: false
        },
        polar: {},
        series: [
          {
            type: 'custom',
            coordinateSystem: 'polar',
            renderItem: this.renderItem
          }
        ]
      };
    },
    renderItem(params, api) {
      var valOnRadian = api.value(1);
      var coords = api.coord([api.value(0), valOnRadian]);
      var polarEndRadian = coords[3];
      var imageStyle = {
        image: this.panelImageURL,
        x: params.coordSys.cx - this.outerRadius,
        y: params.coordSys.cy - this.outerRadius,
        width: this.outerRadius * 2,
        height: this.outerRadius * 2
      };
      return {
        type: 'group',
        children: [
          {
            type: 'image',
            style: imageStyle,
            clipPath: {
              type: 'sector',
              shape: {
                cx: params.coordSys.cx,
                cy: params.coordSys.cy,
                r: this.outerRadius,
                r0: this.innerRadius,
                startAngle: 0,
                endAngle: -polarEndRadian,
                transition: 'endAngle',
                enterFrom: { endAngle: 0 }
              }
            }
          },
          // 其他组件的渲染
        ]
      };
    },
    updateData() {
      var nextSource = [[1, Math.round(Math.random() * this.valOnRadianMax)]];
      this.chart.setOption({
        dataset: {
          source: nextSource
        }
      });
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 600px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>