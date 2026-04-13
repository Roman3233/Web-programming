document.addEventListener('DOMContentLoaded', () => {
  const heading = document.querySelector('h1');

  if (heading) {
    heading.classList.add('js-ready');
  }
});
