<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'LineGraph',
  extends: Line,
  props: {
    // グラフタイトル。
    title: {
      type: String,
      required: true
    },
    // 要素
    elems: {
      type: Array,
      required: true
    },
    rgb: {
      type: Array,
      required: true
    },
    // 点を打ちたい数値
    point: {
      type: Number,
      required: false,
      default: null
    }
  },
  data () {
    return {
      data: {
        labels: this.elems,
        datasets: [
          {
            data: [],
            fill: false,
            pointStyle: 'rectRot',
            pointRadius: 10,
            pointBackgroundColor: 'yellow',
            pointBorderColor: 'rgb(0, 0, 0, 0.6)',
            showLine: false
          },
          {
            data: this.elems,
            pointRadius: 0,
            pointHitRadius: 0, // マウスカーソルを当てても何もしない
            pointHoverRadius: 0, // マウスカーソルを当てても何もしない
            fill: true,
            backgroundColor: `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 0.3)`,
            borderColor: `rgb(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]})`
          }]
      },
      options: {
        title: {
          display: true,
          text: this.title,
          fontSize: 14
        },
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 150
            }
          }],
          xAxes: [
            {
              display: false,
              gridLines: {
                display: false
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            title: (tooltipItems, data) => {
              return data.labels[tooltipItems[0].index]
            },
            label: (tooltipItems, data) => {
              return `${this.elems.length - (tooltipItems.index * 1)}/${this.elems.length}位`
            }
          }
        }
      }
    }
  },
  mounted () {
    const arr = []
    let flg = false
    for (const i in this.elems) {
      // 点を打ちたい要素に値を設定する。（chart.jsでは、nullを設定すると点が打たれない。）
      let val = null
      if (this.elems[i] === this.point && !flg) {
        val = this.point
        flg = true
      }
      arr.push(val)
    }
    this.data.datasets[0].data = arr

    // 描画
    this.renderChart(this.data, this.options)
  }
}
</script>
