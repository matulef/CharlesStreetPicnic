async function loadGuestbook() {
  try {
    const repo = 'YOUR_USER/YOUR_REPO';
    const branch = 'main';
    const path = 'guestbook';
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;

    const list = await fetch(apiUrl).then(r => r.json());
    const entries = await Promise.all(
      list.filter(f => f.type === 'file').map(f => fetch(f.download_url).then(r => r.text()))
    );

    entries.reverse().forEach(text => {
      let data;
      try { data = JSON.parse(text); } catch (_) { data = { name: 'Anonymous', message: text }; }
      const card = document.createElement('div');
      card.className = 'bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-md p-4 shadow-sm';
      card.innerHTML = `<p class='font-semibold mb-1'>${data.name}</p><p>${data.message}</p>`;
      document.getElementById('entries').appendChild(card);
    });
  } catch (err) { console.error('Guestbook load failed', err); }
}
document.addEventListener('DOMContentLoaded', loadGuestbook);
