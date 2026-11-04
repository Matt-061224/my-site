const quotes = [
            "The only way to do great work is to love what you do. — Steve Jobs",
            "Life is what happens when you're busy making other plans. — John Lennon",
            "Be yourself; everyone else is already taken. — Oscar Wilde",
            "In the middle of difficulty lies opportunity. — Albert Einstein",
            "It does not matter how slowly you go as long as you do not stop. — Confucius",
            "You miss 100% of the shots you don’t take. — Wayne Gretzky",
            "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
            "If you look at what you have in life, you'll always have more. — Oprah Winfrey",
            "Nothing is impossible, the word itself says ‘I’m possible’! — Audrey Hepburn",
            "I have not failed. I've just found 10,000 ways that won't work. — Thomas Edison",
            "Stay hungry, stay foolish. — Steve Jobs",
            "We accept the love we think we deserve. — Stephen Chbosky",
            "It is during our darkest moments that we must focus to see the light. — Aristotle",
            "The best time to plant a tree was 20 years ago. The second best time is now. — Chinese Proverb",
            "You only live once, but if you do it right, once is enough. — Mae West"
        ];
const list = document.getElementById('all-quotes');
quotes.forEach((quote, index) => {
  const item = document.createElement('li');
  const number = document.createElement('span'); number.className = 'quote-number'; number.textContent = String(index + 1).padStart(2, '0');
  const text = document.createElement('p'); text.textContent = quote;
  item.append(number, text); list.append(item);
});
let lastQuote = -1;
function randomQuote() {
  let index;
  do { index = Math.floor(Math.random() * quotes.length); } while (index === lastQuote);
  lastQuote = index;
  const split = quotes[index].lastIndexOf(' — ');
  document.getElementById('featured-quote').textContent = quotes[index].slice(0, split);
  document.getElementById('quote-author').textContent = quotes[index].slice(split + 3);
}
document.getElementById('shuffle-quote').addEventListener('click', randomQuote);
randomQuote();
