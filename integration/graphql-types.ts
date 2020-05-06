export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

/** An entity that will be a mapped typed */
export type Author = {
   __typename?: 'Author';
  name: Scalars['String'];
  summary: AuthorSummary;
  popularity: PopularityDetail;
  working?: Maybe<Working>;
  birthday?: Maybe<Scalars['Date']>;
  books: Array<Book>;
};

export type AuthorInput = {
  name?: Maybe<Scalars['String']>;
};

/** A DTO that is just some fields */
export type AuthorSummary = {
   __typename?: 'AuthorSummary';
  author: Author;
  numberOfBooks: Scalars['Int'];
  amountOfSales?: Maybe<Scalars['Float']>;
};

export type Book = {
   __typename?: 'Book';
  name: Scalars['String'];
};


export type Mutation = {
   __typename?: 'Mutation';
  saveAuthor: SaveAuthorResult;
};


export type MutationSaveAuthorArgs = {
  input: AuthorInput;
};

export enum Popularity {
  Low = 'Low',
  High = 'High'
}

export type PopularityDetail = {
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

export enum Working {
  Yes = 'YES',
  No = 'NO'
}


export type AuthorOptions = DeepPartial<Omit<Author, "popularity"> & { popularity: Popularity | PopularityDetail }>;

export function newAuthor(options: AuthorOptions = {}, cache: Record<string, any> = {}): Author {
  const o = (cache["Author"] = {} as Author);
  o.__typename = "Author";
  o.name = options.name ?? "name";
  o.summary = maybeNewAuthorSummary(options.summary, cache);
  o.popularity = enumOrDetailOfPopularity(options.popularity);
  o.working = options.working ?? null;
  o.birthday = options.birthday ?? null;
  o.books = (options.books ?? []).map(i => maybeNewBook(i, cache));
  return o;
}

function maybeNewAuthor(value: AuthorOptions | undefined, cache: Record<string, any>): Author {
  if (value === undefined) {
    return (cache["Author"] as Author) ?? newAuthor({}, cache);
  } else if (value.__typename) {
    return value as Author;
  } else {
    return newAuthor(value, cache);
  }
}

function maybeNewOrNullAuthor(value: AuthorOptions | undefined | null, cache: Record<string, any>): Author | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return value as Author;
  } else {
    return newAuthor(value, cache);
  }
}

export type AuthorSummaryOptions = DeepPartial<AuthorSummary>;

export function newAuthorSummary(options: AuthorSummaryOptions = {}, cache: Record<string, any> = {}): AuthorSummary {
  const o = (cache["AuthorSummary"] = {} as AuthorSummary);
  o.__typename = "AuthorSummary";
  o.author = maybeNewAuthor(options.author, cache);
  o.numberOfBooks = options.numberOfBooks ?? 0;
  o.amountOfSales = options.amountOfSales ?? null;
  return o;
}

function maybeNewAuthorSummary(value: AuthorSummaryOptions | undefined, cache: Record<string, any>): AuthorSummary {
  if (value === undefined) {
    return (cache["AuthorSummary"] as AuthorSummary) ?? newAuthorSummary({}, cache);
  } else if (value.__typename) {
    return value as AuthorSummary;
  } else {
    return newAuthorSummary(value, cache);
  }
}

function maybeNewOrNullAuthorSummary(
  value: AuthorSummaryOptions | undefined | null,
  cache: Record<string, any>,
): AuthorSummary | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return value as AuthorSummary;
  } else {
    return newAuthorSummary(value, cache);
  }
}

export type PopularityDetailOptions = DeepPartial<PopularityDetail>;

export function newPopularityDetail(
  options: PopularityDetailOptions = {},
  cache: Record<string, any> = {},
): PopularityDetail {
  const o = (cache["PopularityDetail"] = {} as PopularityDetail);
  o.__typename = "PopularityDetail";
  o.code = options.code ?? Popularity.Low;
  o.name = options.name ?? "Low";
  return o;
}

function maybeNewPopularityDetail(
  value: PopularityDetailOptions | undefined,
  cache: Record<string, any>,
): PopularityDetail {
  if (value === undefined) {
    return (cache["PopularityDetail"] as PopularityDetail) ?? newPopularityDetail({}, cache);
  } else if (value.__typename) {
    return value as PopularityDetail;
  } else {
    return newPopularityDetail(value, cache);
  }
}

function maybeNewOrNullPopularityDetail(
  value: PopularityDetailOptions | undefined | null,
  cache: Record<string, any>,
): PopularityDetail | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return value as PopularityDetail;
  } else {
    return newPopularityDetail(value, cache);
  }
}

export type BookOptions = DeepPartial<Book>;

export function newBook(options: BookOptions = {}, cache: Record<string, any> = {}): Book {
  const o = (cache["Book"] = {} as Book);
  o.__typename = "Book";
  o.name = options.name ?? "name";
  return o;
}

function maybeNewBook(value: BookOptions | undefined, cache: Record<string, any>): Book {
  if (value === undefined) {
    return (cache["Book"] as Book) ?? newBook({}, cache);
  } else if (value.__typename) {
    return value as Book;
  } else {
    return newBook(value, cache);
  }
}

function maybeNewOrNullBook(value: BookOptions | undefined | null, cache: Record<string, any>): Book | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return value as Book;
  } else {
    return newBook(value, cache);
  }
}

export type SaveAuthorResultOptions = DeepPartial<SaveAuthorResult>;

export function newSaveAuthorResult(
  options: SaveAuthorResultOptions = {},
  cache: Record<string, any> = {},
): SaveAuthorResult {
  const o = (cache["SaveAuthorResult"] = {} as SaveAuthorResult);
  o.__typename = "SaveAuthorResult";
  o.author = maybeNewAuthor(options.author, cache);
  return o;
}

function maybeNewSaveAuthorResult(
  value: SaveAuthorResultOptions | undefined,
  cache: Record<string, any>,
): SaveAuthorResult {
  if (value === undefined) {
    return (cache["SaveAuthorResult"] as SaveAuthorResult) ?? newSaveAuthorResult({}, cache);
  } else if (value.__typename) {
    return value as SaveAuthorResult;
  } else {
    return newSaveAuthorResult(value, cache);
  }
}

function maybeNewOrNullSaveAuthorResult(
  value: SaveAuthorResultOptions | undefined | null,
  cache: Record<string, any>,
): SaveAuthorResult | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return value as SaveAuthorResult;
  } else {
    return newSaveAuthorResult(value, cache);
  }
}

const enumDetailNameOfPopularity = {
  Low: "Low",
  High: "High",
};

function enumOrDetailOfPopularity(enumOrDetail: Partial<PopularityDetail> | Popularity | undefined): PopularityDetail {
  if (enumOrDetail === undefined) {
    return newPopularityDetail();
  } else if (Object.keys(enumOrDetail).includes("code")) {
    return enumOrDetail as PopularityDetail;
  } else {
    return newPopularityDetail({
      code: enumOrDetail as Popularity,
      name: enumDetailNameOfPopularity[enumOrDetail as Popularity],
    });
  }
}

type Builtin = Date | Function | Uint8Array | string | number | undefined;
type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
