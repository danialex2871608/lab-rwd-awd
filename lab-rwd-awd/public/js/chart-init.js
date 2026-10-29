/* Gráfico de comparativa (rendimiento vs eficiencia). Solo se carga donde hay gráfico. */
(function () {
  var canvas = document.getElementById('compare-chart');
  var dataEl = document.getElementById('chart-data');
  if (!canvas || !dataEl || typeof Chart === 'undefined') return;

  var data = JSON.parse(dataEl.textContent);
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: data.map(function (d) { return d.name; }),
      datasets: [
        { label: 'Rendimiento', data: data.map(function (d) { return d.perf; }), backgroundColor: '#38bdf8' },
        { label: 'Eficiencia',  data: data.map(function (d) { return d.eff; }),  backgroundColor: '#a78bfa' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { ticks: { color: '#94a3b8', maxRotation: 70, font: { size: 9 } } },
        y: { ticks: { color: '#94a3b8' }, beginAtZero: true, max: 100 }
      },
      plugins: { legend: { labels: { color: '#e2e8f0' } } }
    }
  });
})();
