import { observable, computed, action } from 'mobx';

export interface Quote {
  id: string;
  text: string;
  author: string;
}

class Quotes {
  @observable quotes: Quote[] = [];

  @observable active: string | null = null;

  @computed get activeQuote(): Quote | null {
    return this.quotes.find((quote: Quote) => quote.id === this.active) || null;
  }

  @action
  setActiveQuote(id: string): void {
    if (!this.quotes.find((quote: Quote) => quote.id === id)) {
      throw new Error('Quote does not exist');
    }

    this.active = id;
  }

  @action
  addQuote(quote: Quote): void {
    if (this.quotes.find((existingQuote: Quote) => existingQuote.id === quote.id)) {
      throw new Error('Quote already exists');
    }

    this.quotes.push(quote);

    if (this.quotes.length === 1) {
      this.setActiveQuote(quote.id);
    }
  }
}

const list = new Quotes();

export default list;
