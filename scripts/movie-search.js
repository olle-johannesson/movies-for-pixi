const filterFunctions = {
  title: byTitle
}

function getAllMovies() {
  return [...document.getElementById('movie-list').querySelectorAll('li')]
}

function getSearchForm() {
  return document.getElementById('search')
}

function getFormDataEntries() {
  const formData = new FormData(getSearchForm());
  return [...formData.entries()]
}

function byTitle(partialTitle) {
  return element => sanitizeString(element.innerText).includes(sanitizeString(partialTitle))
}

function sanitizeString(string) {
  return string.normalize('NFC').trim().toLowerCase();
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

getSearchForm().addEventListener('input', filterMovies)
