export default class Curve {
  constructor(params) {
    let ctx = params.ctx
    let color = params.color
    this.width = params.width
    this.height = params.height

    this.ctx = ctx
    this.color = color
    this.path = this.generatePath()
    this.scale = { x: this.randomRange(-1, 1), y: this.randomRange(-1, 1) }
    this.alpha = 0
    this.hue = color.h
    this.rangeX = this.randomRange(0.99, 1.01) ** 9
    this.rangeY = this.randomRange(0.9, 1.1) ** 9
    this.translate = {
      tx: this.randomRange(-0.2, 0.5),
      ty: this.randomRange(-0.2, 0.5),
    }
    this.translateRange = {
      rx: this.randomRange(-0.5, 0.5),
      ry: this.randomRange(-0.5, 0.5),
    }
    this.t = 0
    this.tIncrement = this.randomRange(0.0001, 0.00001)
    this.alphaOffset = this.randomRange(0.2, 0.8)
    this.alphaSpeed = this.randomRange(400, 1000)
  }
  getColorString() {
    return `hsla(${this.hue}deg,${this.color.s}%,${this.color.l}%,${this.alpha})`
  }
  updateTranslate() {
    this.translate.x += 10 * this.translateRange.rx
    this.translate.y += 10 * this.translateRange.ry
  }
  resetScale() {
    this.rangeX = this.randomRange(0.99, 1.01) ** 9
    this.rangeY = this.randomRange(0.99, 1.01) ** 9
    this.scale = { x: this.randomRange(-1, 1), y: this.randomRange(-1, 1) }
  }
  updateScale() {
    this.scale.x += 0.001 * this.rangeX + this.t
    this.scale.y += 0.001 * this.rangeY + this.t
  }
  updateHue() {
    this.hue += Math.sin(this.t * 1000)
  }
  resetHue() {
    this.hue = this.color.h
  }
  updateAlpha() {
    this.alpha =
      this.alphaOffset * Math.sin(this.t * this.alphaSpeed + 0.1) ** 2
  }
  resetAlpha() {
    this.alpha = 0
    this.alphaOffset = this.randomRange(0.1, 0.6)
    this.alphaSpeed = this.randomRange(300, 1000)
  }
  updateT() {
    this.t += this.tIncrement
  }
  resetT() {
    if (Math.random() < 0.9) {
      this.t = 0
    }
  }
  rotate() {
    this.rotation += this.t
  }
  update() {
    this.updateT()
    this.updateScale()
    this.updateHue()
    this.rotate()
    this.alpha <= 1 && this.updateAlpha()
    if (this.alpha < 0.001) {
      this.resetHue()
      this.path = this.generatePath()
      this.resetAlpha()
      this.resetScale()
      this.resetT()
    }
    return this
  }
  randomRange(min, max) {
    return min + Math.random() * (max - min)
  }
  yCoord(index, partSize) {
    return (this.height / 2 + this.randomRange(-1, 1)).toFixed(0)
  }
  xCoord(index, partSize) {
    return (
      index * partSize +
      this.randomRange(-partSize / 8, partSize / 8)
    ).toFixed(0)
  }
  randomControlPoint(partSize, index) {
    const controlPoint = {
      x: this.randomRange(-partSize * index, partSize * index),
      y: this.randomRange(-partSize, partSize),
    }
    const magnitude = Math.hypot(controlPoint.x, controlPoint.y)
    return {
      x: controlPoint.x.toFixed(0),
      y: controlPoint.y.toFixed(0),
    }
  }
  generatePath() {
    const partitions = Math.floor(this.randomRange(3, 5))
    const partSize = this.width / partitions
    const positionVectors = []
    for (let index = 0; index <= partitions; index += 1) {
      let controlPoint = this.randomControlPoint(partSize, index)
      positionVectors.push({
        dx: controlPoint.x,
        dy: controlPoint.y,
        x: this.xCoord(index, partSize),
        y: this.yCoord(index, partSize),
      })
    }
    const path = positionVectors.reduce(this.reducePathVectors(), '')
    return path
  }
  reducePathVectors() {
    return function (p, v, idx) {
      if (idx === 0) {
        p = `M${v.x},${v.y}`
        return p
      }
      if (idx === 1) {
        p += `Q${v.dx},${v.dy},${v.x},${v.y}`
        return p
      }
      p += `T${v.x},${v.y}`
      return p
    }
  }
  draw() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.strokeStyle = this.getColorString()
    this.ctx.rotate(this.rotation)
    this.ctx.translate(this.width / 2, this.height / 2)
    this.ctx.scale(this.scale.x, this.scale.y)
    this.ctx.stroke(new Path2D(this.path))
    this.ctx.restore()
    return this
  }
}
