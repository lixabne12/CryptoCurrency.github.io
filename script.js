
const searchInput = document.getElementById('search-input');
const cryptocurrencyList = document.getElementById('cryptocurrency-list');
const loadingIndicator = document.getElementById('loading-indicator');
const endNotification = document.getElementById('end-notification');
let page = 1;

function fetchCryptocurrencyRates() {
  // Display loading indicator
  loadingIndicator.classList.remove('hidden');

  // Fetch data from the API
  fetch(`https://api.coingecko.com/api/v3/exchange_rates?page=${page}`)
    .then(response => response.json())
    .then(data => {
      const rates = data.rates;

      // Check if there are more records
      if (Object.keys(rates).length === 0) {
        endNotification.classList.remove('hidden');
        loadingIndicator.classList.add('hidden');
        return;
      }

      // Create list items for each cryptocurrency rate
      Object.keys(rates).forEach(currency => {
        const listItem = document.createElement('li');
        listItem.textContent = `${currency}: ${rates[currency].value}`;
        cryptocurrencyList.appendChild(listItem);
      });

      // Increment page number for lazy loading
      page++;

      // Hide loading indicator
      loadingIndicator.classList.add('hidden');
    })
    .catch(error => {
      console.error('Error fetching cryptocurrency rates:', error);
      loadingIndicator.classList.add('hidden');
    });
}

function searchCryptocurrencyRates() {
  const searchText = searchInput.value.toLowerCase();
  const listItems = cryptocurrencyList.getElementsByTagName('li');

  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    const text = listItem.textContent.toLowerCase();

    if (text.includes(searchText)) {
      listItem.style.display = 'block';
    } else {
      listItem.style.display = 'none';
    }
  }
}

// Load initial data
fetchCryptocurrencyRates();

// Lazy load more data as the user scrolls down
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    fetchCryptocurrencyRates();
  }
});

// Handle search input
searchInput.addEventListener('input', searchCryptocurrencyRates);

