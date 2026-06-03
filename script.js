(function () {
  var DURATION = 1800;
  var CHARS = '0123456789';

  function easeOutExpo(t) {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function countUp(el, target) {
    el.textContent = '0';
    var start = performance.now();
    function tick(now) {
      var t = Math.min((now - start) / DURATION, 1);
      el.textContent = Math.round(easeOutExpo(t) * target);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  function scramble(el, final) {
    var start = performance.now();
    var len = final.length;
    function tick(now) {
      var t = Math.min((now - start) / DURATION, 1);
      var revealed = Math.floor(Math.min(t * 1.5, 1) * len);
      el.textContent = final.split('').map(function (ch, i) {
        if (i < revealed) return ch;
        if (!/\d/.test(ch)) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = final;
    }
    requestAnimationFrame(tick);
  }

  var row = document.querySelector('.metrics-row');
  if (!row) return;

  var fired = false;
  var obs = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting || fired) return;
    fired = true;
    obs.disconnect();
    row.querySelectorAll('[data-count]').forEach(function (el) {
      countUp(el, parseInt(el.dataset.count, 10));
    });
    row.querySelectorAll('[data-scramble]').forEach(function (el) {
      scramble(el, el.dataset.scramble);
    });
  }, { threshold: 0.4 });

  obs.observe(row);
})();
