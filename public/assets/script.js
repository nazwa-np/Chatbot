function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML += `<div class="message user">${escapeHtml(msg)}</div>`;
  input.value = "";
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  const typingIndicator = document.createElement('div');
  typingIndicator.id = 'typing-indicator';
  typingIndicator.style.display = 'block';
  typingIndicator.innerHTML = '<span></span><span></span><span></span>';
  messagesDiv.appendChild(typingIndicator);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    const reply = data.reply || "⚠️ Tidak ada respon dari AI";
    
    typingIndicator.remove();
    
    messagesDiv.innerHTML += `<div class="message bot">${escapeHtml(reply)}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (error) {
    typingIndicator.remove();
    messagesDiv.innerHTML += `<div class="message bot">⚠️ Terjadi kesalahan koneksi. Pastikan server berjalan di localhost:5000</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}