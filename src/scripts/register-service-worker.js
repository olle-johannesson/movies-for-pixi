
window.addEventListener('load', () => {
navigator?.serviceWorker?.register?.(
  new URL('./service-worker.js', import.meta.url),
  {type: 'module', scope: '/'}
)});
