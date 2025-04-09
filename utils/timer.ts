export class Timer {
  startTime = NaN
  endTime = NaN

  constructor() {
    this.startTimer = this.startTimer.bind(this)
    this.endTimer = this.endTimer.bind(this)
  }

  startTimer() {
    this.startTime = performance.now()
    console.log('Timer - startTimer', this.startTime)
  }

  endTimer() {
    console.log('Timer - endTimer', this.startTime)
    this.endTime = performance.now()
    return this.endTime - this.startTime
  }
}
