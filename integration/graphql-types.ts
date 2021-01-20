export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
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
};

export type AuthorSummary = {
  __typename?: 'AuthorSummary';
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

export type SearchResult = Author | Book;

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

export type Mutation = {
  __typename?: 'Mutation';
  saveAuthor: SaveAuthorResult;
};


export type MutationSaveAuthorArgs = {
  input: AuthorInput;
};

export type SaveAuthorResult = {
  __typename?: 'SaveAuthorResult';
  author: Author;
};

export type AuthorInput = {
  name?: Maybe<Scalars['String']>;
};

export type CalendarInterval = {
  __typename?: 'CalendarInterval';
  start: Scalars['Date'];
  end: Scalars['Date'];
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

export type WorkingDetail = {
  __typename?: 'WorkingDetail';
  code: Working;
  name: Scalars['String'];
  extraField: Scalars['Int'];
};

export enum Working {
  Yes = 'YES',
  No = 'NO'
}


export type Named = {
  name: Scalars['String'];
};

export type Child = {
  __typename?: 'Child';
  parent: Named;
};

import { newDate } from "./testData";

export interface AuthorOptions {
  __typename?: "Author";
  id?: Author["id"];
  name?: Author["name"];
  summary?: AuthorSummaryOptions;
  popularity?: PopularityDetailOptions | Popularity;
  workingDetail?: WorkingDetailOptions | Working;
  working?: Author["working"];
  birthday?: Author["birthday"];
  books?: Array<BookOptions>;
}

export function newAuthor(options: AuthorOptions = {}, cache: Record<string, any> = {}): Author {
  const o = (cache["Author"] = {} as Author);
  o.__typename = "Author";
  o.id = options.id ?? nextFactoryId("Author");
  o.name = options.name ?? "name";
  o.summary = maybeNewAuthorSummary(options.summary, cache, options.hasOwnProperty("summary"));
  o.popularity = enumOrDetailOfPopularity(options.popularity);
  o.workingDetail = enumOrDetailOfWorking(options.workingDetail);
  o.working = options.working ?? null;
  o.birthday = options.birthday ?? null;
  o.books = (options.books ?? []).map((i) => maybeNewBook(i, cache, options.hasOwnProperty("books")));
  return o;
}

function maybeNewAuthor(value: AuthorOptions | undefined, cache: Record<string, any>, isSet: boolean = false): Author {
  if (value === undefined) {
    return isSet ? undefined : cache["Author"] || newAuthor({}, cache);
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
export interface AuthorSummaryOptions {
  __typename?: "AuthorSummary";
  author?: AuthorOptions;
  numberOfBooks?: AuthorSummary["numberOfBooks"];
  amountOfSales?: AuthorSummary["amountOfSales"];
}

export function newAuthorSummary(options: AuthorSummaryOptions = {}, cache: Record<string, any> = {}): AuthorSummary {
  const o = (cache["AuthorSummary"] = {} as AuthorSummary);
  o.__typename = "AuthorSummary";
  o.author = maybeNewAuthor(options.author, cache, options.hasOwnProperty("author"));
  o.numberOfBooks = options.numberOfBooks ?? 0;
  o.amountOfSales = options.amountOfSales ?? null;
  return o;
}

function maybeNewAuthorSummary(
  value: AuthorSummaryOptions | undefined,
  cache: Record<string, any>,
  isSet: boolean = false,
): AuthorSummary {
  if (value === undefined) {
    return isSet ? undefined : cache["AuthorSummary"] || newAuthorSummary({}, cache);
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
export interface BookOptions {
  __typename?: "Book";
  name?: Book["name"];
  popularity?: PopularityDetailOptions | Popularity | null;
  coauthor?: AuthorOptions | null;
  reviews?: Array<BookReviewOptions | null> | null;
}

export function newBook(options: BookOptions = {}, cache: Record<string, any> = {}): Book {
  const o = (cache["Book"] = {} as Book);
  o.__typename = "Book";
  o.name = options.name ?? "name";
  o.popularity = enumOrDetailOrNullOfPopularity(options.popularity);
  o.coauthor = maybeNewOrNullAuthor(options.coauthor, cache);
  o.reviews = (options.reviews ?? []).map((i) => maybeNewOrNullBookReview(i, cache));
  return o;
}

function maybeNewBook(value: BookOptions | undefined, cache: Record<string, any>, isSet: boolean = false): Book {
  if (value === undefined) {
    return isSet ? undefined : cache["Book"] || newBook({}, cache);
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
export interface BookReviewOptions {
  __typename?: "BookReview";
  rating?: BookReview["rating"];
}

export function newBookReview(options: BookReviewOptions = {}, cache: Record<string, any> = {}): BookReview {
  const o = (cache["BookReview"] = {} as BookReview);
  o.__typename = "BookReview";
  o.rating = options.rating ?? 0;
  return o;
}

function maybeNewBookReview(
  value: BookReviewOptions | undefined,
  cache: Record<string, any>,
  isSet: boolean = false,
): BookReview {
  if (value === undefined) {
    return isSet ? undefined : cache["BookReview"] || newBookReview({}, cache);
  } else if (value.__typename) {
    return value as BookReview;
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
    return value as BookReview;
  } else {
    return newBookReview(value, cache);
  }
}
export interface SaveAuthorResultOptions {
  __typename?: "SaveAuthorResult";
  author?: AuthorOptions;
}

export function newSaveAuthorResult(
  options: SaveAuthorResultOptions = {},
  cache: Record<string, any> = {},
): SaveAuthorResult {
  const o = (cache["SaveAuthorResult"] = {} as SaveAuthorResult);
  o.__typename = "SaveAuthorResult";
  o.author = maybeNewAuthor(options.author, cache, options.hasOwnProperty("author"));
  return o;
}

function maybeNewSaveAuthorResult(
  value: SaveAuthorResultOptions | undefined,
  cache: Record<string, any>,
  isSet: boolean = false,
): SaveAuthorResult {
  if (value === undefined) {
    return isSet ? undefined : cache["SaveAuthorResult"] || newSaveAuthorResult({}, cache);
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
export interface CalendarIntervalOptions {
  __typename?: "CalendarInterval";
  start?: CalendarInterval["start"];
  end?: CalendarInterval["end"];
}

export function newCalendarInterval(
  options: CalendarIntervalOptions = {},
  cache: Record<string, any> = {},
): CalendarInterval {
  const o = (cache["CalendarInterval"] = {} as CalendarInterval);
  o.__typename = "CalendarInterval";
  o.start = options.start ?? newDate();
  o.end = options.end ?? newDate();
  return o;
}

function maybeNewCalendarInterval(
  value: CalendarIntervalOptions | undefined,
  cache: Record<string, any>,
  isSet: boolean = false,
): CalendarInterval {
  if (value === undefined) {
    return isSet ? undefined : cache["CalendarInterval"] || newCalendarInterval({}, cache);
  } else if (value.__typename) {
    return value as CalendarInterval;
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
    return value as CalendarInterval;
  } else {
    return newCalendarInterval(value, cache);
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
  const o = (cache["PopularityDetail"] = {} as PopularityDetail);
  o.__typename = "PopularityDetail";
  o.code = options.code ?? Popularity.Low;
  o.name = options.name ?? "Low";
  return o;
}
export interface WorkingDetailOptions {
  __typename?: "WorkingDetail";
  code?: WorkingDetail["code"];
  name?: WorkingDetail["name"];
  extraField?: WorkingDetail["extraField"];
}

export function newWorkingDetail(options: WorkingDetailOptions = {}, cache: Record<string, any> = {}): WorkingDetail {
  const o = (cache["WorkingDetail"] = {} as WorkingDetail);
  o.__typename = "WorkingDetail";
  o.code = options.code ?? Working.Yes;
  o.name = options.name ?? "Yes";
  o.extraField = options.extraField ?? 0;
  return o;
}
export interface ChildOptions {
  __typename?: "Child";
  parent?: Child["parent"];
}

export function newChild(options: ChildOptions = {}, cache: Record<string, any> = {}): Child {
  const o = (cache["Child"] = {} as Child);
  o.__typename = "Child";
  o.parent = maybeNewAuthor(options.parent, cache, options.hasOwnProperty("parent"));
  return o;
}

function maybeNewChild(value: ChildOptions | undefined, cache: Record<string, any>, isSet: boolean = false): Child {
  if (value === undefined) {
    return isSet ? undefined : cache["Child"] || newChild({}, cache);
  } else if (value.__typename) {
    return value as Child;
  } else {
    return newChild(value, cache);
  }
}

function maybeNewOrNullChild(value: ChildOptions | undefined | null, cache: Record<string, any>): Child | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return value as Child;
  } else {
    return newChild(value, cache);
  }
}
export type NamedOptions = AuthorOptions | BookOptions | PopularityDetailOptions;

export type NamedType = Author | Book | PopularityDetail;

export type NamedTypeName = "Author" | "Book" | "PopularityDetail";

function maybeNewNamed(value: NamedOptions | undefined, cache: Record<string, any>): NamedType {
  if (value === undefined) {
    return cache["Author"] || newAuthor({}, cache);
  } else if (value.__typename) {
    return value as NamedType;
  } else {
    return newAuthor((value as unknown) as AuthorOptions, cache);
  }
}

function maybeNewOrNullNamed(value: NamedOptions | undefined | null, cache: Record<string, any>): Named | null {
  if (!value) {
    return null;
  } else if (value.__typename) {
    return value as NamedType;
  } else {
    return newAuthor((value as unknown) as AuthorOptions, cache);
  }
}

const enumDetailNameOfPopularity = {
  Low: "Low",
  High: "High",
};

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

const enumDetailNameOfWorking = {
  YES: "Yes",
  NO: "No",
};

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
    return newWorkingDetail({
      code: enumOrDetail as Working,
      name: enumDetailNameOfWorking[enumOrDetail as Working],
    });
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

let nextFactoryIds: Record<string, number> = {};

export function resetFactoryIds() {
  nextFactoryIds = {};
}

function nextFactoryId(objectName: string): string {
  const nextId = nextFactoryIds[objectName] || 1;
  nextFactoryIds[objectName] = nextId + 1;
  return String(nextId);
}
