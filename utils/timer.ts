import { log } from "@/lib/logger";

export class Timer {
  startTime = NaN
  endTime = NaN

  constructor() {
    this.startTimer = this.startTimer.bind(this)
    this.endTimer = this.endTimer.bind(this)
  }

  startTimer() {
    this.startTime = performance.now()
    log.timer.debug('startTimer', this.startTime)
  }

  endTimer() {
    log.timer.debug('endTimer', this.startTime)
    this.endTime = performance.now()
    return this.endTime - this.startTime
  }
}
