document.documentElement.classList.add('js');

const WHATS = '5586995413300';
const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

function reanima(el, classe) {
  if (reduz) return;
  el.classList.remove(classe);
  void el.offsetWidth;
  el.classList.add(classe);
}

/* Topo e barra fixa do celular */
const topo = document.querySelector('[data-topo]');
const barra = document.querySelector('[data-barra]');
const hero = document.querySelector('[data-hero]');
function aoRolar() {
  const y = window.scrollY;
  if (topo) topo.classList.toggle('rolou', y > 8);
  if (barra && hero) barra.classList.toggle('visivel', y > hero.offsetHeight * 0.6);
}
addEventListener('scroll', aoRolar, { passive: true });
aoRolar();

/* Pingos de chocolate */
function sorteio(semente) {
  let s = semente;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}
const observaPingos = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('caindo');
      observaPingos.unobserve(e.target);
    }
  });
}, { rootMargin: '0px 0px -12% 0px' });

document.querySelectorAll('[data-pingos]').forEach((el, i) => {
  const r = sorteio(11 + i * 17);
  let x = 1 + r() * 3;
  while (x < 97) {
    const p = document.createElement('span');
    p.className = 'pingo';
    p.style.setProperty('--x', x.toFixed(2) + '%');
    p.style.setProperty('--w', Math.round(14 + r() * 20) + 'px');
    p.style.setProperty('--h', Math.round(16 + r() * 54) + 'px');
    p.style.setProperty('--atraso', (r() * 0.7).toFixed(2) + 's');
    el.appendChild(p);
    x += 5 + r() * 8;
  }
  if (reduz) el.classList.add('caindo');
  else observaPingos.observe(el);
});

/* Picolés flutuando no topo */
const palitos = document.querySelector('[data-palitos]');
if (palitos && !reduz) {
  const janelas = [...palitos.querySelectorAll('.janela-mover')];
  const area = palitos.closest('section');
  let alvoX = 0, alvoY = 0, x = 0, y = 0, visivel = true;
  area.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = area.getBoundingClientRect();
    alvoX = (e.clientX - r.left) / r.width - 0.5;
    alvoY = (e.clientY - r.top) / r.height - 0.5;
  });
  area.addEventListener('pointerleave', () => { alvoX = 0; alvoY = 0; });
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }).observe(palitos);
  const inicio = performance.now();
  const quadro = (t) => {
    if (visivel) {
      x += (alvoX - x) * 0.06;
      y += (alvoY - y) * 0.06;
      const seg = (t - inicio) / 1000;
      janelas.forEach((j, i) => {
        const d = Number(j.dataset.d) || 1;
        const flutua = Math.sin(seg * 0.9 + i * 1.9) * 7;
        j.style.setProperty('--tx', (x * d * 30).toFixed(2) + 'px');
        j.style.setProperty('--ty', (y * d * 24 + flutua).toFixed(2) + 'px');
      });
    }
    requestAnimationFrame(quadro);
  };
  requestAnimationFrame(quadro);
}

/* Seletor de sabores */
const vitrine = document.querySelector('[data-vitrine]');
if (vitrine) {
  const picole = vitrine.querySelector('.picole');
  const info = vitrine.querySelector('.vitrine-info');
  const nome = vitrine.querySelector('[data-nome]');
  const desc = vitrine.querySelector('[data-desc]');
  const cat = vitrine.querySelector('[data-cat]');
  const botoes = [...document.querySelectorAll('[data-sabor]')];
  const escolhe = (b) => {
    if (b.getAttribute('aria-pressed') === 'true') return;
    botoes.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const d = b.dataset;
    picole.style.setProperty('--coat', d.coat);
    picole.style.setProperty('--base', d.base);
    picole.style.setProperty('--fill', d.fill);
    if (d.top) picole.style.setProperty('--top', d.top);
    picole.classList.toggle('sem-cobertura', !d.top);
    nome.textContent = b.textContent.trim();
    desc.textContent = d.desc;
    cat.textContent = 'Linha ' + d.cat;
    reanima(picole, 'mexe');
    if (!reduz) {
      info.animate(
        [{ opacity: 0.2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
        { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' }
      );
    }
  };
  botoes.forEach((b) => b.addEventListener('click', () => escolhe(b)));
}

/* Abas de tipo de evento */
const abas = [...document.querySelectorAll('[role="tab"]')];
if (abas.length) {
  const ativa = (aba, foco) => {
    abas.forEach((a) => {
      const sel = a === aba;
      a.setAttribute('aria-selected', String(sel));
      a.tabIndex = sel ? 0 : -1;
      const painel = document.getElementById(a.getAttribute('aria-controls'));
      painel.hidden = !sel;
      if (sel && !reduz) {
        painel.animate(
          [{ opacity: 0.25, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
          { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)' }
        );
      }
    });
    if (foco) aba.focus();
  };
  abas.forEach((a, i) => {
    a.addEventListener('click', () => ativa(a));
    a.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const passo = e.key === 'ArrowRight' ? 1 : -1;
      ativa(abas[(i + passo + abas.length) % abas.length], true);
    });
  });
  abas.forEach((a) => {
    document.getElementById(a.getAttribute('aria-controls')).hidden = a.getAttribute('aria-selected') !== 'true';
  });
  const deHash = () => {
    const alvo = abas.find((a) => a.getAttribute('aria-controls') === location.hash.slice(1));
    if (!alvo) return;
    ativa(alvo);
    document.getElementById('para-quem').scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' });
  };
  addEventListener('hashchange', deHash);
  if (location.hash) requestAnimationFrame(deHash);
}

/* Montador de orçamento */
const form = document.querySelector('[data-orcamento]');
if (form) {
  const enviar = form.querySelector('[data-enviar]');
  const erro = form.querySelector('[data-erro]');
  const saidaConv = form.querySelector('[data-conv]');
  const data = form.querySelector('[name="data"]');
  const hoje = new Date();
  data.min = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  const ler = () => {
    const fd = new FormData(form);
    const d = fd.get('data');
    return {
      tipo: fd.get('tipo') || '',
      data: d ? d.split('-').reverse().join('/') : '',
      conv: fd.get('convidados'),
      sabores: fd.getAll('sabores'),
      nome: String(fd.get('nome') || '').trim(),
      local: String(fd.get('local') || '').trim(),
    };
  };

  const mensagem = (v) => {
    const l = ['Olá, Belly Cream! Vim pelo site e quero um orçamento para evento.', ''];
    l.push('Tipo de evento: ' + (v.tipo || 'a definir'));
    if (v.data) l.push('Data: ' + v.data);
    l.push('Convidados: cerca de ' + v.conv);
    if (v.sabores.length) l.push('Sabores de interesse: ' + v.sabores.join(', '));
    if (v.local) l.push('Bairro ou local: ' + v.local);
    if (v.nome) l.push('Meu nome: ' + v.nome);
    return l.join('\n');
  };

  const escreve = (chave, valor, anima) => {
    const dd = form.querySelector('[data-saida="' + chave + '"]');
    const texto = valor || 'a definir';
    if (dd.textContent === texto) return;
    dd.textContent = texto;
    dd.classList.toggle('vazio', !valor);
    if (anima) reanima(dd.parentElement, 'mudou');
  };

  const atualiza = (anima = true) => {
    const v = ler();
    saidaConv.textContent = v.conv;
    escreve('tipo', v.tipo, anima);
    escreve('data', v.data, anima);
    escreve('conv', 'cerca de ' + v.conv + ' pessoas', anima);
    escreve('sabores', v.sabores.join(', '), anima);
    escreve('nome', v.nome, anima);
    escreve('local', v.local, anima);
    if (v.tipo) erro.hidden = true;
    enviar.href = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(mensagem(v));
  };

  form.addEventListener('input', () => atualiza());
  form.addEventListener('change', () => atualiza());
  form.addEventListener('submit', (e) => { e.preventDefault(); enviar.click(); });
  enviar.addEventListener('click', (e) => {
    if (ler().tipo) return;
    e.preventDefault();
    erro.hidden = false;
    form.querySelector('[name="tipo"]').focus();
  });

  document.querySelectorAll('[data-tipo]').forEach((link) => {
    link.addEventListener('click', () => {
      const radio = form.querySelector('[name="tipo"][value="' + link.dataset.tipo + '"]');
      if (radio) { radio.checked = true; atualiza(); }
    });
  });

  atualiza(false);
}
