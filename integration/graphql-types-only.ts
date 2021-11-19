export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Author = Named & {
  __typename?: 'Author';
  id: Scalars['ID'];
  name: Scalars['String'];
  summary: AuthorSummary;
  popularity: PopularityDetail;
  workingDetail: WorkingDetail;
  working?: Maybe<Working>;
  birthday?: Maybe<Scalars['Date']>;
  books: Array<Book>;
  bookPopularities: Array<PopularityDetail>;
};

export type AuthorInput = {
  name?: Maybe<Scalars['String']>;
};

export type AuthorSummary = {
  __typename?: 'AuthorSummary';
  id: Scalars['ID'];
  author: Author;
  numberOfBooks: Scalars['Int'];
  amountOfSales?: Maybe<Scalars['Float']>;
};

export type Book = Named & {
  __typename?: 'Book';
  name: Scalars['String'];
  popularity?: Maybe<PopularityDetail>;
  coauthor?: Maybe<Author>;
  reviews?: Maybe<Array<Maybe<BookReview>>>;
};

export type BookReview = {
  __typename?: 'BookReview';
  rating: Scalars['Int'];
};

export type CalendarInterval = {
  __typename?: 'CalendarInterval';
  start: Scalars['Date'];
  end: Scalars['Date'];
};

export type Child = {
  __typename?: 'Child';
  parent: Named;
};


export type Mutation = {
  __typename?: 'Mutation';
  saveAuthor: SaveAuthorResult;
};


export type MutationSaveAuthorArgs = {
  input: AuthorInput;
};

export type Named = {
  name: Scalars['String'];
};

export enum Popularity {
  Low = 'Low',
  High = 'High'
}

export type PopularityDetail = Named & {
  __typename?: 'PopularityDetail';
  code: Popularity;
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  authors: Array<Author>;
  authorSummaries: Array<AuthorSummary>;
  search: Array<SearchResult>;
};


export type QueryAuthorsArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};

export type SaveAuthorResult = {
  __typename?: 'SaveAuthorResult';
  author: Author;
};

export type SearchResult = Author | Book;

export type SearchResults = {
  __typename?: 'SearchResults';
  result1?: Maybe<SearchResult>;
  result2?: Maybe<Named>;
  result3?: Maybe<Author>;
};

export enum Working {
  Yes = 'YES',
  No = 'NO'
}

export type WorkingDetail = {
  __typename?: 'WorkingDetail';
  code: Working;
  name: Scalars['String'];
  extraField: Scalars['Int'];
};
