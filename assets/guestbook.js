async function loadGuestbook() {
  try {
    const repo = 'YOUR_USER/YOUR_REPO';
    const branch = 'main';
    const path = 'guestbook';
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;

    const list = await fetch(apiUrl).then(async res => {
      if (!res.ok) {
        throw new Error(`GitHub API request failed: ${res.status}`);
      }
      return res.json();
    });

    if (!Array.isArray(list)) {
      console.error('Unexpected API response', list);
      return;
    }

    const entries = await Promise.all(
      list
        .filter(f => f.type === 'file')
        .map(async f => {
          const res = await fetch(f.download_url);
          if (!res.ok) throw new Error(`Failed to fetch entry: ${res.status}`);
          return res.text();
        })
    );

    entries.reverse().forEach(text => {
      let data;
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = { name: 'Anonymous', message: text };
      }
      const card = document.createElement('div');
      card.className =
        'bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-md p-4 shadow-sm';
      card.innerHTML = `<p class='font-semibold mb-1'>${data.name}</p><p>${data.message}</p>`;
      document.getElementById('entries').appendChild(card);
    });
  } catch (err) {
    console.error('Guestbook load failed', err);
  }
}

document.addEventListener('DOMContentLoaded', loadGuestbook);
