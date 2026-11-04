function loadNav() {
  const skip = document.createElement('a'); skip.href = '#main-content'; skip.className = 'skip-link'; skip.textContent = 'Skip to content'; document.body.prepend(skip);
  const header = document.querySelector('#site-header');
  const navigation = `<nav aria-label="Main navigation"><a class="wordmark" href="index.html" aria-label="Learning home">learning<span aria-hidden="true">.</span></a><div class="nav-links"><a href="index.html">Home</a><a href="project.html">Projects</a><a href="quotes.html">Quotes</a><a href="machine.html">Playground</a></div></nav>`;
  function renderNavigation(html) {
    header.innerHTML = html;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    header.querySelectorAll('.nav-links a').forEach(function (link) {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }
  renderNavigation(navigation);
  const footer = document.querySelector('#site-footer');
  if (footer) footer.innerHTML = '<div class="footer-inner"><a class="wordmark" href="index.html">learning.</a><p>Always curious. Always learning.</p><span>A personal frontend journey.</span></div>';
}
loadNav();
