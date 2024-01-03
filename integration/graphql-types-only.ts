export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Author = Named & {
  __typename?: 'Author';
  birthday?: Maybe<Scalars['Date']['output']>;
  bookPopularities: Array<PopularityDetail>;
  books: Array<Book>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  popularity: PopularityDetail;
  summary: AuthorSummary;
  working?: Maybe<Working>;
  workingDetail: Array<WorkingDetail>;
};

export type AuthorInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type AuthorSummary = {
  __typename?: 'AuthorSummary';
  amountOfSales?: Maybe<Scalars['Float']['output']>;
  author: Author;
  id: Scalars['ID']['output'];
  numberOfBooks: Scalars['Int']['output'];
};

export type Book = Named & {
  __typename?: 'Book';
  coauthor?: Maybe<Author>;
  name: Scalars['String']['output'];
  popularity?: Maybe<PopularityDetail>;
  reviews?: Maybe<Array<Maybe<BookReview>>>;
  status: BookStatus;
};

export type BookReview = {
  __typename?: 'BookReview';
  rating: Scalars['Int']['output'];
};

export enum BookStatus {
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED',
  OnHold = 'ON_HOLD'
}

export type CalendarInterval = {
  __typename?: 'CalendarInterval';
  end: Scalars['Date']['output'];
  start: Scalars['Date']['output'];
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
  name: Scalars['String']['output'];
};

export enum Popularity {
  High = 'High',
  Low = 'Low'
}

export type PopularityDetail = Named & {
  __typename?: 'PopularityDetail';
  code: Popularity;
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  authorSummaries: Array<AuthorSummary>;
  authors: Array<Author>;
  search: Array<SearchResult>;
};


export type QueryAuthorsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerySearchArgs = {
  query: Scalars['String']['input'];
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
  No = 'NO',
  Yes = 'YES'
}

export type WorkingDetail = {
  __typename?: 'WorkingDetail';
  code: Working;
  extraField: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};
