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
    // 要素の配列
    datasets: {
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
    }
  },
  data () {
    return {
      data: {
        labels: this.labels,
        datasets: []
      },
      options: {
        title: {
          display: true,
          text: this.title,
          fontSize: 18
        },
        responsive: true,
        legend: {
          display: true
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
    this.datasets.forEach((dataset) => {
      const color = dataset.color
      this.data.datasets.push({
        label: dataset.label,
        data: dataset.elems,
        fill: true,
        backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`,
        borderColor: `rgb(${color.r}, ${color.g}, ${color.b})`
      })
    })
    this.renderChart(this.data, this.options)
  }
}
</script>
