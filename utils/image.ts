interface IimageExtended {}

export class ImageExtended {
  static async preLoadImage(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image()

      function onLoaded() {
        resolve(true)
        cleanup()
      }

      function onerror(e: any) {
        console.log('IMAGE PRE-CACHED ERROR', e)
        reject(false)
      }

      function cleanup() {
        img.removeEventListener('load', onLoaded, false)
        img.removeEventListener('error', onerror, false)
        img.remove()
      }

      img.addEventListener('load', onLoaded)
      img.addEventListener('error', onerror)
      img.src = url
    })
  }

  static getBackgroundImagesURL(elem: Element) {
    const reURL = /url\((['"])?(.*?)\1\)/gi
    let style = getComputedStyle(elem)
    // Firefox returns null if in a hidden iframe https://bugzil.la/548397
    if (!style) return ''

    // get url inside url("...")
    let matches = reURL.exec(style.backgroundImage)
    while (matches !== null) {
      let url = matches && matches[2]
      if (url) {
        return url
      }
      matches = reURL.exec(style.backgroundImage)
    }
    return ''
  }
}
