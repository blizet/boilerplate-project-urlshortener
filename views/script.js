const urlInput = document.getElementById('url_input');
const shortenedUrlContainer = document.getElementById('shortened-url-container');
const shortenedUrl = document.getElementById('shortened-url');
const errorMessage = document.getElementById('error-message');
const form = document.getElementById('url-shortener-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  const url = urlInput.value.trim();

  if (!url) {
    errorMessage.textContent = 'Please enter a valid URL.';
    errorMessage.style.display = 'block';
    return;
  }

  try {
    const response = await fetch('/api/shorturl', {
      method: 'POST',
      body: JSON.stringify({ url }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    shortenedUrl.href = data.short_url;
    shortenedUrl.textContent = data.short_url;
    shortenedUrlContainer.style.display = 'block';
    urlInput.value = '';
    errorMessage.style.display = 'none';
  } catch (error) {
    errorMessage.textContent = `Error: ${error.message}`;
    errorMessage.style.display = 'block';
  }
});
