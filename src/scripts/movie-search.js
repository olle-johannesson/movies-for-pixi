const DATA_KEY = 'movieFilter'

const filterFunctions = {
  title: byTitle,
  year: byReleaseYear
}

function debounce(fn, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), timeout);
  };
}

async function saveToSessionStorage(data) {
  window.sessionStorage.setItem(DATA_KEY, JSON.stringify(data))
}

function saveFormData() {
  saveToSessionStorage(Object.fromEntries(getFormDataEntries()))
}

function getSessionStorageData() {
  const data = window.sessionStorage.getItem(DATA_KEY)
  return JSON.parse(data)
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

function updateYearInSliderLabel(year) {
  document.getElementById('year-value').textContent = year
}

function initYearSlider() {
  const slider = getYearSlider()
  slider.max = (new Date()).getFullYear()
  slider.value = slider.min
  updateYearInSliderLabel(slider.min)
  slider.addEventListener('input', e => updateYearInSliderLabel(e.target.value))
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

function setFromEntry(obj) {
  return ([key, value]) => obj[key] = value
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


function restoreSession() {
  const form = getSearchForm()
  const storedData = getSessionStorageData()
  if (!storedData) return

  const hasDetailedFilter = Object.keys(storedData).filter(k => k !== 'title').length > 0
  const yearMoreThanMin = Boolean(storedData?.year > getYearSlider().min)
  const hasMoreFiltersThanYear = yearMoreThanMin && hasDetailedFilter

  Object.entries(storedData)
    .filter(([key]) => key in form.elements)
    .forEach(([key, value]) => form.elements[key].value = value)  
  
  updateYearInSliderLabel(getYearSlider().value)
  document.getElementById('more-filters').open = hasDetailedFilter && hasMoreFiltersThanYear

  filterMovies()
}

function resetLinks() {
  document.querySelectorAll('[data-jse]').forEach(element => element.href = element.dataset.jse)
}

initYearSlider()
restoreSession()
resetLinks()
getSearchForm().addEventListener('input', filterMovies)
getSearchForm().addEventListener('input', debounce(saveFormData))
