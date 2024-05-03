function getMoviesContainer() {
  return document.getElementById('movies')
}

const playWhenIntersectingOtherwisePause = (entries, _observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.play()
    } else {
      entry.target.pause()
    }
  })
}

export function initiateVideoControllingObservers() {
  const viewPortHeight = window.getComputedStyle(getMoviesContainer()).height
  
  const playAndPauseObserver = new IntersectionObserver(playWhenIntersectingOtherwisePause, {
    root: null,
    rootMargin: `${viewPortHeight} 0px`,
    threshold: 0
  })

  return target => {
    const video = target.querySelector('video')
    if (video) {
      playAndPauseObserver.observe(video)
      return video
    }

    return null
  }
}
