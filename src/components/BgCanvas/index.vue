<template>
  <div class="bg_canvas">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
  import Curve from '@/utils/curve'
  export default {
    name: 'BgCanvas',
    props: {},
    data() {
      return {
        canvas: null,
        width: 0,
        height: 0,
        animator: () => {},
      }
    },
    mounted() {
      this.start()
      this.resize()
      this.animator = this.animation()
      this.actions()
      window.addEventListener(
        'resize',
        () => {
          requestAnimationFrame(this.actions)
        },
        { passive: true }
      )
    },
    beforeDestroy() {
      window.removeEventListener('resize')
    },
    methods: {
      start() {
        this.canvas = document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')
      },
      resize() {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.canvas.width = this.width
        this.canvas.height = this.height
      },
      animation() {
        let id
        return function updater(fn) {
          if (id) {
            cancelAnimationFrame(id)
            id = null
          }
          id = requestAnimationFrame(function () {
            fn().update(id)
            updater(fn)
          })
        }
      },
      fader() {
        let gradient = this.ctx.createRadialGradient(
          this.width / 2,
          this.height / 2,
          0,
          this.width / 2,
          this.height / 2,
          Math.max(this.width / 2, this.height / 2)
        )

        gradient.addColorStop(0, `hsla(220deg, 35%, 15%, 0.2)`)
        gradient.addColorStop(1, `hsla(220deg, 35%, 15%, 0.02)`)

        this.ctx.fillStyle = gradient
        this.ctx.fillRect(0, 0, this.width, this.height)
      },
      actions() {
        let that = this
        this.resize()
        const c = []
        for (let i = 0; i < 30; i += 1) {
          c.push(
            new Curve({
              color: { h: 340, s: 100, l: 50, a: 1 },
              ctx: this.ctx,
              width: this.width,
              height: this.height,
            }).draw()
          )
        }
        this.animator(function () {
          return {
            update: (frameId) => {
              if (!(frameId % 4)) {
                that.fader()
              }
              c.forEach((d) => d.update().draw())
            },
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .bg_canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: hsla(220deg, 35%, 10%, 1);
    #canvas {
      width: 100%;
      height: 100%;
    }
  }
</style>
