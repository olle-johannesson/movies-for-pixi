import articleManifest from '../movies/a-*.html'

document.addEventListener('DOMContentLoaded', () => {
  const PREFETCH_N = 6
  const allArticles = Object.values(articleManifest).map(source => source.slice(source.lastIndexOf('/'))).sort(() => Math.random() - 0.5)
  const articlesContainer = document.getElementById('movies') 
  const observer = new IntersectionObserver(onIntersection, {
    rootMargin: '0%',
    threshold: 0.1,
  })

  addNextN(observer).then(() => {
    if (window.location.hash) {
      const articleToScrollTo = document.querySelector(window.location.hash);
      if (window.location.hash === '#title') {
        return
      } else if (articleToScrollTo) {
        articleToScrollTo.scrollIntoView();
      } else {
        addThis(window.location.hash.slice(1), observer)
      }
    }
  })
    
  function addNextN(obs) {
    return Promise
      .all(allArticles.splice(0, PREFETCH_N).map(fetchElement))
      .then(articles => addArticles(articles, articlesContainer, obs))
  }

  function addThis(name, obs) {
    const r = new RegExp(`^\/a-${name}\..*\.html`)
    const i = allArticles.findIndex(article => r.test(article))
    
    return i >= 0 && Promise
      .all(allArticles.splice(i, 1).map(fetchElement))
      .then(articles => addArticles(articles, articlesContainer, obs))
      .then(articles => articles[0].scrollIntoView('smooth'))
  }

  function addArticles(articles, container, obs) {
    try {
      container.append(...articles)
    } catch (error) {
      console.error('Error adding article:', error)
    } 
    
    if (articles[0] && allArticles.length) {
      obs.observe(articles[0])
    }

    return articles
  }

  function fetchElement(url) {
    return fetch(url)
      .then(r => r.text())
      .then(htmlToElement) 
  }

  function htmlToElement(html) {
    const tmp = document.createElement('div') 
    tmp.innerHTML = html.trim()
    return tmp.firstChild
  }

  function onIntersection(entries, obs) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        obs.unobserve(entry.target)
        addNextN(obs)
      }
    }) 
  }
}) 