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
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  ON_HOLD = 'ON_HOLD'
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
  NO = 'NO',
  YES = 'YES'
}

export type WorkingDetail = {
  __typename?: 'WorkingDetail';
  code: Working;
  extraField: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

import { newDate } from "./testData";

const factories: Record<string, Function> = {};
export interface AuthorOptions {
  __typename?: "Author";
  birthday?: Author["birthday"];
  bookPopularities?: Array<PopularityDetailOptions>;
  books?: Array<BookOptions>;
  id?: Author["id"];
  name?: Author["name"];
  popularity?: PopularityDetailOptions | Popularity;
  summary?: AuthorSummaryOptions;
  working?: Author["working"];
  workingDetail?: Array<WorkingDetailOptions>;
}

export function newAuthor(options: AuthorOptions = {}, cache: Record<string, any> = {}): Author {
  const o = (options.__typename ? options : cache["Author"] = {}) as Author;
  (cache.all ??= new Set()).add(o);
  o.__typename = "Author";
  o.birthday = options.birthday ?? null;
  o.bookPopularities = (options.bookPopularities ?? []).map((i) => enumOrDetailOfPopularity(i));
  o.books = (options.books ?? []).map((i) => maybeNewBook(i, cache, options.hasOwnProperty("books")));
  o.id = options.id ?? nextFactoryId("Author");
  o.name = options.name ?? "name";
  o.popularity = enumOrDetailOfPopularity(options.popularity);
  o.summary = maybeNewAuthorSummary(options.summary, cache, options.hasOwnProperty("summary"));
  o.working = options.working ?? null;
  o.workingDetail = (options.workingDetail ?? []).map((i) => enumOrDetailOfWorking(i));
  return o;
}

factories["Author"] = newAuthor;

function maybeNewAuthor(value: AuthorOptions | undefined, cache: Record<string, any>, isSet: boolean = false): Author {
  if (value === undefined) {
    return isSet ? undefined : cache["Author"] || newAuthor({}, cache);
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newAuthor(value, cache);
  }
}

function maybeNewOrNullAuthor(value: AuthorOptions | undefined | null, cache: Record<string, any>): Author | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newAuthor(value, cache);
  }
}
export interface AuthorSummaryOptions {
  __typename?: "AuthorSummary";
  amountOfSales?: AuthorSummary["amountOfSales"];
  author?: AuthorOptions;
  id?: AuthorSummary["id"];
  numberOfBooks?: AuthorSummary["numberOfBooks"];
}

export function newAuthorSummary(options: AuthorSummaryOptions = {}, cache: Record<string, any> = {}): AuthorSummary {
  const o = (options.__typename ? options : cache["AuthorSummary"] = {}) as AuthorSummary;
  (cache.all ??= new Set()).add(o);
  o.__typename = "AuthorSummary";
  o.amountOfSales = options.amountOfSales ?? null;
  o.author = maybeNewAuthor(options.author, cache, options.hasOwnProperty("author"));
  o.id = options.id ?? nextFactoryId("AuthorSummary");
  o.numberOfBooks = options.numberOfBooks ?? 0;
  return o;
}

factories["AuthorSummary"] = newAuthorSummary;

function maybeNewAuthorSummary(
  value: AuthorSummaryOptions | undefined,
  cache: Record<string, any>,
  isSet: boolean = false,
): AuthorSummary {
  if (value === undefined) {
    return isSet ? undefined : cache["AuthorSummary"] || newAuthorSummary({}, cache);
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
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
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newAuthorSummary(value, cache);
  }
}
export interface BookOptions {
  __typename?: "Book";
  coauthor?: AuthorOptions | null;
  name?: Book["name"];
  popularity?: PopularityDetailOptions | Popularity | null;
  reviews?: Array<BookReviewOptions | null> | null;
  status?: Book["status"];
}

export function newBook(options: BookOptions = {}, cache: Record<string, any> = {}): Book {
  const o = (options.__typename ? options : cache["Book"] = {}) as Book;
  (cache.all ??= new Set()).add(o);
  o.__typename = "Book";
  o.coauthor = maybeNewOrNullAuthor(options.coauthor, cache);
  o.name = options.name ?? "name";
  o.popularity = enumOrDetailOrNullOfPopularity(options.popularity);
  o.reviews = (options.reviews ?? []).map((i) => maybeNewOrNullBookReview(i, cache));
  o.status = options.status ?? BookStatus.IN_PROGRESS;
  return o;
}

factories["Book"] = newBook;

function maybeNewBook(value: BookOptions | undefined, cache: Record<string, any>, isSet: boolean = false): Book {
  if (value === undefined) {
    return isSet ? undefined : cache["Book"] || newBook({}, cache);
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newBook(value, cache);
  }
}

function maybeNewOrNullBook(value: BookOptions | undefined | null, cache: Record<string, any>): Book | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newBook(value, cache);
  }
}
export interface BookReviewOptions {
  __typename?: "BookReview";
  rating?: BookReview["rating"];
}

export function newBookReview(options: BookReviewOptions = {}, cache: Record<string, any> = {}): BookReview {
  const o = (options.__typename ? options : cache["BookReview"] = {}) as BookReview;
  (cache.all ??= new Set()).add(o);
  o.__typename = "BookReview";
  o.rating = options.rating ?? 0;
  return o;
}

factories["BookReview"] = newBookReview;

function maybeNewBookReview(
  value: BookReviewOptions | undefined,
  cache: Record<string, any>,
  isSet: boolean = false,
): BookReview {
  if (value === undefined) {
    return isSet ? undefined : cache["BookReview"] || newBookReview({}, cache);
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newBookReview(value, cache);
  }
}

function maybeNewOrNullBookReview(
  value: BookReviewOptions | undefined | null,
  cache: Record<string, any>,
): BookReview | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newBookReview(value, cache);
  }
}
export interface CalendarIntervalOptions {
  __typename?: "CalendarInterval";
  end?: CalendarInterval["end"];
  start?: CalendarInterval["start"];
}

export function newCalendarInterval(
  options: CalendarIntervalOptions = {},
  cache: Record<string, any> = {},
): CalendarInterval {
  const o = (options.__typename ? options : cache["CalendarInterval"] = {}) as CalendarInterval;
  (cache.all ??= new Set()).add(o);
  o.__typename = "CalendarInterval";
  o.end = options.end ?? newDate();
  o.start = options.start ?? newDate();
  return o;
}

factories["CalendarInterval"] = newCalendarInterval;

function maybeNewCalendarInterval(
  value: CalendarIntervalOptions | undefined,
  cache: Record<string, any>,
  isSet: boolean = false,
): CalendarInterval {
  if (value === undefined) {
    return isSet ? undefined : cache["CalendarInterval"] || newCalendarInterval({}, cache);
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newCalendarInterval(value, cache);
  }
}

function maybeNewOrNullCalendarInterval(
  value: CalendarIntervalOptions | undefined | null,
  cache: Record<string, any>,
): CalendarInterval | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newCalendarInterval(value, cache);
  }
}
export interface ChildOptions {
  __typename?: "Child";
  parent?: Child["parent"];
}

export function newChild(options: ChildOptions = {}, cache: Record<string, any> = {}): Child {
  const o = (options.__typename ? options : cache["Child"] = {}) as Child;
  (cache.all ??= new Set()).add(o);
  o.__typename = "Child";
  o.parent = maybeNewAuthor(options.parent, cache, options.hasOwnProperty("parent"));
  return o;
}

factories["Child"] = newChild;

function maybeNewChild(value: ChildOptions | undefined, cache: Record<string, any>, isSet: boolean = false): Child {
  if (value === undefined) {
    return isSet ? undefined : cache["Child"] || newChild({}, cache);
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newChild(value, cache);
  }
}

function maybeNewOrNullChild(value: ChildOptions | undefined | null, cache: Record<string, any>): Child | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newChild(value, cache);
  }
}
export interface PopularityDetailOptions {
  __typename?: "PopularityDetail";
  code?: PopularityDetail["code"];
  name?: PopularityDetail["name"];
}

export function newPopularityDetail(
  options: PopularityDetailOptions = {},
  cache: Record<string, any> = {},
): PopularityDetail {
  const o = (options.__typename ? options : cache["PopularityDetail"] = {}) as PopularityDetail;
  (cache.all ??= new Set()).add(o);
  o.__typename = "PopularityDetail";
  o.code = options.code ?? Popularity.High;
  o.name = options.name ?? "High";
  return o;
}

factories["PopularityDetail"] = newPopularityDetail;

export interface SaveAuthorResultOptions {
  __typename?: "SaveAuthorResult";
  author?: AuthorOptions;
}

export function newSaveAuthorResult(
  options: SaveAuthorResultOptions = {},
  cache: Record<string, any> = {},
): SaveAuthorResult {
  const o = (options.__typename ? options : cache["SaveAuthorResult"] = {}) as SaveAuthorResult;
  (cache.all ??= new Set()).add(o);
  o.__typename = "SaveAuthorResult";
  o.author = maybeNewAuthor(options.author, cache, options.hasOwnProperty("author"));
  return o;
}

factories["SaveAuthorResult"] = newSaveAuthorResult;

function maybeNewSaveAuthorResult(
  value: SaveAuthorResultOptions | undefined,
  cache: Record<string, any>,
  isSet: boolean = false,
): SaveAuthorResult {
  if (value === undefined) {
    return isSet ? undefined : cache["SaveAuthorResult"] || newSaveAuthorResult({}, cache);
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
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
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newSaveAuthorResult(value, cache);
  }
}
export interface SearchResultsOptions {
  __typename?: "SearchResults";
  result1?: SearchResults["result1"];
  result2?: SearchResults["result2"];
  result3?: AuthorOptions | null;
}

export function newSearchResults(options: SearchResultsOptions = {}, cache: Record<string, any> = {}): SearchResults {
  const o = (options.__typename ? options : cache["SearchResults"] = {}) as SearchResults;
  (cache.all ??= new Set()).add(o);
  o.__typename = "SearchResults";
  o.result1 = options.result1 ?? null;
  o.result2 = options.result2 ?? null;
  o.result3 = maybeNewOrNullAuthor(options.result3, cache);
  return o;
}

factories["SearchResults"] = newSearchResults;

function maybeNewSearchResults(
  value: SearchResultsOptions | undefined,
  cache: Record<string, any>,
  isSet: boolean = false,
): SearchResults {
  if (value === undefined) {
    return isSet ? undefined : cache["SearchResults"] || newSearchResults({}, cache);
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newSearchResults(value, cache);
  }
}

function maybeNewOrNullSearchResults(
  value: SearchResultsOptions | undefined | null,
  cache: Record<string, any>,
): SearchResults | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return newSearchResults(value, cache);
  }
}
export interface WorkingDetailOptions {
  __typename?: "WorkingDetail";
  code?: WorkingDetail["code"];
  extraField?: WorkingDetail["extraField"];
  name?: WorkingDetail["name"];
}

export function newWorkingDetail(options: WorkingDetailOptions = {}, cache: Record<string, any> = {}): WorkingDetail {
  const o = (options.__typename ? options : cache["WorkingDetail"] = {}) as WorkingDetail;
  (cache.all ??= new Set()).add(o);
  o.__typename = "WorkingDetail";
  o.code = options.code ?? Working.NO;
  o.extraField = options.extraField ?? 0;
  o.name = options.name ?? "No";
  return o;
}

factories["WorkingDetail"] = newWorkingDetail;

export type NamedOptions = AuthorOptions | BookOptions | PopularityDetailOptions;

export type NamedType = Author | Book | PopularityDetail;

export type NamedTypeName = "Author" | "Book" | "PopularityDetail";

function maybeNewNamed(value: NamedOptions | undefined, cache: Record<string, any>): NamedType {
  if (value === undefined) {
    return cache["Author"] || newAuthor({}, cache);
  } else if (value.__typename) {
    return value as NamedType;
  } else {
    return newAuthor(value as unknown as AuthorOptions, cache);
  }
}

function maybeNewOrNullNamed(value: NamedOptions | undefined | null, cache: Record<string, any>): Named | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return value as NamedType;
  } else {
    return newAuthor(value as unknown as AuthorOptions, cache);
  }
}

const enumDetailNameOfPopularity = { High: "High", Low: "Low" };

function enumOrDetailOfPopularity(enumOrDetail: PopularityDetailOptions | Popularity | undefined): PopularityDetail {
  if (enumOrDetail === undefined) {
    return newPopularityDetail();
  } else if (typeof enumOrDetail === "object" && "code" in enumOrDetail) {
    return {
      __typename: "PopularityDetail",
      code: enumOrDetail.code!,
      name: enumDetailNameOfPopularity[enumOrDetail.code!],
      ...enumOrDetail,
    } as PopularityDetail;
  } else {
    return newPopularityDetail({
      code: enumOrDetail as Popularity,
      name: enumDetailNameOfPopularity[enumOrDetail as Popularity],
    });
  }
}

function enumOrDetailOrNullOfPopularity(
  enumOrDetail: PopularityDetailOptions | Popularity | undefined | null,
): PopularityDetail | null {
  if (enumOrDetail === null) {
    return null;
  }
  return enumOrDetailOfPopularity(enumOrDetail);
}

const enumDetailNameOfWorking = { NO: "No", YES: "Yes" };

function enumOrDetailOfWorking(enumOrDetail: WorkingDetailOptions | Working | undefined): WorkingDetail {
  if (enumOrDetail === undefined) {
    return newWorkingDetail();
  } else if (typeof enumOrDetail === "object" && "code" in enumOrDetail) {
    return {
      __typename: "WorkingDetail",
      code: enumOrDetail.code!,
      name: enumDetailNameOfWorking[enumOrDetail.code!],
      ...enumOrDetail,
    } as WorkingDetail;
  } else {
    return newWorkingDetail({ code: enumOrDetail as Working, name: enumDetailNameOfWorking[enumOrDetail as Working] });
  }
}

function enumOrDetailOrNullOfWorking(
  enumOrDetail: WorkingDetailOptions | Working | undefined | null,
): WorkingDetail | null {
  if (enumOrDetail === null) {
    return null;
  }
  return enumOrDetailOfWorking(enumOrDetail);
}

const taggedIds: Record<string, string> = { "AuthorSummary": "summary" };
let nextFactoryIds: Record<string, number> = {};

export function resetFactoryIds() {
  nextFactoryIds = {};
}

function nextFactoryId(objectName: string): string {
  const nextId = nextFactoryIds[objectName] || 1;
  nextFactoryIds[objectName] = nextId + 1;
  const tag = taggedIds[objectName] ?? objectName.replace(/[a-z]/g, "").toLowerCase();
  return tag + ":" + nextId;
}
