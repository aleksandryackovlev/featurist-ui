import React from 'react';
import ReactDOM from 'react-dom';

import quotesStore from './stores/quotes';

import App from './app';

const rootElement = document.getElementById('root')!;

ReactDOM.render(<App quotesList={quotesStore} />, rootElement);

quotesStore.addQuote({
  id: 'id1',
  text: 'Lorem ipsum dolor amed',
  author: 'John Smith',
});

setTimeout(() => {
  quotesStore.addQuote({
    id: 'id2',
    text: 'Lorem ipsum dolor amed 1',
    author: 'Joe Doe',
  });
}, 1000);
