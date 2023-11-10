import articleManifest from '../movies/article-*.html'

document.addEventListener('DOMContentLoaded', () => {
  const allArticles = Object.values(articleManifest)
  const articlesContainer = document.getElementById('movies') 
  const observer = new IntersectionObserver(onIntersection, {
    rootMargin: '100%',
    threshold: 0.1,
  })

  function* loader(sources) {
    const slugs = sources.map(source => source.slice(source.lastIndexOf('/')))
    for (const slug of slugs) {
      yield fetchElement(slug)
    }
  }

  const loadArticle = loader(allArticles)

  function addNextThree(obs) {
    addArticle(loadArticle.next(), articlesContainer, obs)
    addArticle(loadArticle.next(), articlesContainer, obs)
    addArticle(loadArticle.next(), articlesContainer, obs)
  }

  addNextThree(observer)

  function onIntersection(entries, obs) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        addNextThree(observer)
        obs.unobserve(entry.target) 
      }
    }) 
  }

  function addArticle(article, container, obs) {
    if (article.done) return

    article.value
      .then(fetchedArticle => container.appendChild(fetchedArticle))
      .catch(error => console.error('Error adding article:', error))
      .finally(() => {
        if (container.childElementCount < allArticles.length) {
          obs.observe(container.lastChild)
        }
      })
  }

  function fetchElement(url) {
    return fetch(url)
      .then(response => response.text())
      .then(html => {
        const tmp = document.createElement('div') 
        tmp.innerHTML = html.trim()
        return tmp.firstChild
      }) 
  }
}) 