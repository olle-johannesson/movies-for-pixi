const filterFunctions = {
  title: byTitle,
  year: byReleaseYear
}

function byTitle(partialTitle) {
  return element => sanitizeString(element.innerText).includes(sanitizeString(partialTitle))
}

function byReleaseYear(earliestReleaseYear) {
  return element => parseInt(element.dataset.year) > earliestReleaseYear
}

function sanitizeString(string) {
  return string.normalize('NFC').trim().toLowerCase();
}

function getAllMovies() {
  return [...document.getElementById('movie-list').querySelectorAll('li')]
}

function getSearchForm() {
  return document.getElementById('search')
}

function getYearSlider() {
  return document.getElementById('year')
}

function initYearSlider() {
  const slider = getYearSlider()
  slider.max = (new Date()).getFullYear()
  slider.value = slider.min
  const updateValue = value => document.getElementById('year-value').textContent = value
  updateValue(slider.min)
  slider.addEventListener('input', e => updateValue(e.target.value))
}

function getFormDataEntries() {
  const formData = new FormData(getSearchForm());
  return [...formData.entries()]
}

function searchFormEntryToPredicate([filterName, filterValue]) {
  return filterFunctions[filterName](filterValue)
}

function andExpr(predicates) {
  return x => predicates.every(predicate => predicate(x))
}

function showElementIf(predicate) {
  return (element) => element.style.display = predicate(element) ? null : 'none'
}

function filterMovies() {
  const dataEnteredIntoSearchForm = getFormDataEntries()
  const filterPredicates = dataEnteredIntoSearchForm.map(searchFormEntryToPredicate)
  const allFiltersApply = andExpr(filterPredicates)
  getAllMovies().forEach(showElementIf(allFiltersApply))
}

initYearSlider()
getSearchForm().addEventListener('input', filterMovies)
