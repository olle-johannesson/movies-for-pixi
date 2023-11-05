const years = [...new Array(Math.ceil((new Date().getFullYear() - 1900) / 10))].map((_, i) => 1900 + i * 10)

const slider = document.querySelector('#yearslider')

slider.max = Math.max(years)
slider.min = Math.min(years)