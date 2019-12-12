import React from 'react';
import { observer } from 'mobx-react';

import QuotesStore, { Quote } from './stores/quotes';

@observer
class App extends React.Component<{ quotesList: typeof QuotesStore }> {
  render(): JSX.Element {
    const { quotesList } = this.props;
    return (
      <div>
        <ul>
          {quotesList.quotes.map((quote: Quote) => (
            <li key={quote.id} onClick={(): void => quotesList.setActiveQuote(quote.id)}>
              <div>
                {quote.text}
                {quotesList.activeQuote && quotesList.activeQuote.id === quote.id && (
                  <strong>*</strong>
                )}
              </div>
              <div>
                <strong>{quote.author}</strong>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
