const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch (e) { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } } };
// Demo account so login can be tested straight away
const users = () => ({ "demo@flowpilot.com": { name: "Demo User", pass: "demo1234" }, ...store.get('fp_users', {}) });
const session = () => store.get('fp_session', null);
// Mobile menu
const burger = $('.burger'), links = $('#links');
burger.addEventListener('click', () => { const o = links.classList.toggle('open'); burger.setAttribute('aria-expanded', o) });
// Nav state: logged in or out
const s = session(), slot = $('#auth-links');
if (s) {
    slot.innerHTML = '<a class="btn ghost" href="dashboard.html">Dashboard</a><a class="btn" href="#" id="logout">Log out</a>';
    $('#logout').addEventListener('click', e => { e.preventDefault(); localStorage.removeItem('fp_session'); location.href = 'index.html' })
}
// Highlight current page
$$('.links a').forEach(a => { if (a.getAttribute('href') === location.pathname.split('/').pop() || (a.getAttribute('href') === 'index.html' && !location.pathname.split('/').pop())) a.classList.add('on') });
// Forms
const f = (id) => document.getElementById(id);
const show = (form, msg, ok) => { const m = $('.err,.msg', form); m.className = ok ? 'msg' : 'err'; m.textContent = msg };
f('login-form')?.addEventListener('submit', e => {
    e.preventDefault(); const em = f('email').value.trim().toLowerCase(), pw = f('pass').value, u = users()[em];
    if (!u) return show(e.target, 'No account found for this email. Sign up first.');
    if (u.pass !== pw) return show(e.target, 'Wrong password. Try again.');
    store.set('fp_session', { email: em, name: u.name }); location.href = 'dashboard.html'
});
f('signup-form')?.addEventListener('submit', e => {
    e.preventDefault(); const em = f('email').value.trim().toLowerCase(), pw = f('pass').value, nm = f('name').value.trim();
    if (pw.length < 6) return show(e.target, 'Password must be at least 6 characters.');
    if (users()[em]) return show(e.target, 'This email is already registered. Log in instead.');
    const all = store.get('fp_users', {}); all[em] = { name: nm, pass: pw }; store.set('fp_users', all); store.set('fp_session', { email: em, name: nm }); location.href = 'dashboard.html'
});
f('contact-form')?.addEventListener('submit', e => { e.preventDefault(); show(e.target, "Message sent. We'll reply within one working day.", true); e.target.reset() });
$$('.cta-form').forEach(x => x.addEventListener('submit', e => { e.preventDefault(); location.href = 'signup.html?email=' + encodeURIComponent($('input', x).value) }));
if (f('signup-form')) { const q = new URLSearchParams(location.search).get('email'); if (q) f('email').value = q }
// Dashboard (login required)
if (document.body.dataset.private) {
    if (!s) location.replace('login.html'); else {
        $('#hello').textContent = 'Good morning, ' + s.name.split(' ')[0];
        $('#today').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        $$('.tasks li').forEach(li => li.addEventListener('click', () => li.classList.toggle('done')))
    }
}
