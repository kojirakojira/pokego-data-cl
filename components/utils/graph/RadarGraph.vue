<script>
import { Radar } from 'vue-chartjs'

export default {
  name: 'RardarGraph',
  extends: Radar,
  props: {
    // グラフタイトル。
    title: {
      type: String,
      required: true
    },
    // 要素ラベル
    labels: {
      type: Array,
      required: true
    },
    // 要素
    elems: {
      type: Array,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    rgb: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      data: {
        labels: this.labels,
        datasets: [{
          data: this.elems,
          fill: true,
          backgroundColor: `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 0.5)`,
          borderColor: `rgb(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]})`
        }]
      },
      options: {
        title: {
          display: true,
          text: this.title,
          fontSize: 18
        },
        responsive: true,
        legend: {
          display: false
        },
        scale: {
          ticks: {
            min: this.min,
            max: this.max,
            stepSize: (this.max - this.min) / 4,
            display: false,
            userCallback: (val) => {
              return this.max + 1 - val
            }
          }
        },
        tooltips: {
          callbacks: {
            title: (tooltipItems, data) => {
              return data.labels[tooltipItems[0].index]
            },
            label: (tooltipItems, data) => {
              return `${this.max - (tooltipItems.value * 1) + 1}/${this.max}位`
            }
          }
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
