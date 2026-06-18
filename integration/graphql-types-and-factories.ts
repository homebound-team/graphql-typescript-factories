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
  Date: { input: Date; output: Date; }
};

export type Author = Named & {
  __typename?: 'Author';
  anotherId: Scalars['ID']['output'];
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

export type Child = Named & {
  __typename?: 'Child';
  name: Scalars['String']['output'];
  parent: Named;
};

export type Market = Project & {
  __typename?: 'Market';
  children: Array<Project>;
  name: Scalars['String']['output'];
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

export type Parent = Named & {
  __typename?: 'Parent';
  children: Array<Named>;
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

export type Project = {
  children: Array<Project>;
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

export type Region = Project & {
  __typename?: 'Region';
  children: Array<Market>;
  name: Scalars['String']['output'];
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

export type SearchResultsDetailsFragment = { __typename?: 'SearchResults', result1?: { __typename: 'Author', id: string, name: string } | { __typename: 'Book', name: string } | null };

export type AuthorBooksDetailsFragment = { __typename?: 'Author', books: Array<{ __typename: 'Book', name: string }> };

export type RegionChildrenDetailsFragment = { __typename?: 'Region', children: Array<{ __typename: 'Market', name: string }> };

import { newDate } from "./testData";

const factories: Record<string, Function> = {};
export interface FactoryOptions {
  avoidCycles?: boolean;
}
type RequireTypename<T extends { __typename?: string }> = Omit<T, "__typename"> & Required<Pick<T, "__typename">>;
/**
 * Mirrors factory runtime behavior by requiring __typename on factory-created object results.
 *
 * GraphQL Codegen's base schema types correctly keep __typename optional because raw GraphQL
 * objects only include it when an operation selects it or a client adds it. Operation and
 * fragment result types can require __typename when it is selected. Factory results are a
 * separate case: these factories always assign __typename recursively at runtime, so their
 * public return type should expose that stronger shape without changing the base schema types.
 */
type FactoryResult<T> = T extends ReadonlyArray<infer U> ? Array<FactoryResult<U>>
  : T extends object
    ? "__typename" extends keyof T
      ? T & Omit<{ [K in keyof T]: FactoryResult<T[K]> }, "__typename"> & {
        __typename: NonNullable<T extends { __typename?: infer N } ? N : never>;
      }
    : T
  : T;

type FactoryInput<T, TOptions> = T | FactoryResult<T> | TOptions;
type FactoryCache = Record<string, any> & { active?: Set<object>; all?: Set<object>; avoidCycles?: boolean };
export interface AuthorOptions {
  __typename?: "Author";
  anotherId?: Author["anotherId"];
  birthday?: Author["birthday"];
  bookPopularities?: Array<FactoryInput<PopularityDetail, PopularityDetailOptions>>;
  books?: Array<FactoryInput<Book, BookOptions>>;
  id?: Author["id"];
  name?: Author["name"];
  popularity?: PopularityDetailOptions | Popularity;
  summary?: FactoryInput<AuthorSummary, AuthorSummaryOptions>;
  working?: Author["working"];
  workingDetail?: Array<FactoryInput<WorkingDetail, WorkingDetailOptions>>;
}

export function newAuthor(options?: AuthorOptions, factoryOptions?: FactoryOptions): FactoryResult<Author>;
export function newAuthor(
  options: AuthorOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<Author> {
  const o = (options.__typename ? options : cache["Author"] = {}) as Author;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "Author";
    o.anotherId = options.anotherId ?? "anotherId";
    o.birthday = options.birthday ?? null;
    o.bookPopularities = (options.bookPopularities ?? []).map((i) => enumOrDetailOfPopularity(i));
    o.books = (options.books ?? []).map((i) => maybeNew("Book", i, cache, options.hasOwnProperty("books")));
    o.id = options.id ?? nextFactoryId("Author");
    o.name = options.name ?? "name";
    o.popularity = enumOrDetailOfPopularity(options.popularity);
    o.summary = maybeNew("AuthorSummary", options.summary, cache, options.hasOwnProperty("summary"));
    o.working = options.working ?? null;
    o.workingDetail = (options.workingDetail ?? []).map((i) => enumOrDetailOfWorking(i));
    return o as FactoryResult<Author>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["Author"] = newAuthor;

export interface AuthorSummaryOptions {
  __typename?: "AuthorSummary";
  amountOfSales?: AuthorSummary["amountOfSales"];
  author?: FactoryInput<Author, AuthorOptions>;
  id?: AuthorSummary["id"];
  numberOfBooks?: AuthorSummary["numberOfBooks"];
}

export function newAuthorSummary(
  options?: AuthorSummaryOptions,
  factoryOptions?: FactoryOptions,
): FactoryResult<AuthorSummary>;
export function newAuthorSummary(
  options: AuthorSummaryOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<AuthorSummary> {
  const o = (options.__typename ? options : cache["AuthorSummary"] = {}) as AuthorSummary;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "AuthorSummary";
    o.amountOfSales = options.amountOfSales ?? null;
    o.author = maybeNew("Author", options.author, cache, options.hasOwnProperty("author"));
    o.id = options.id ?? nextFactoryId("AuthorSummary");
    o.numberOfBooks = options.numberOfBooks ?? 0;
    return o as FactoryResult<AuthorSummary>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["AuthorSummary"] = newAuthorSummary;

export interface BookOptions {
  __typename?: "Book";
  coauthor?: FactoryInput<Author, AuthorOptions> | null;
  name?: Book["name"];
  popularity?: PopularityDetailOptions | Popularity | null;
  reviews?: Array<Maybe<FactoryInput<BookReview, BookReviewOptions>>> | null;
  status?: Book["status"];
}

export function newBook(options?: BookOptions, factoryOptions?: FactoryOptions): FactoryResult<Book>;
export function newBook(
  options: BookOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<Book> {
  const o = (options.__typename ? options : cache["Book"] = {}) as Book;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "Book";
    o.coauthor = maybeNewOrNull("Author", options.coauthor, cache);
    o.name = options.name ?? "name";
    o.popularity = enumOrDetailOrNullOfPopularity(options.popularity);
    o.reviews = (options.reviews ?? []).map((i) => maybeNewOrNull("BookReview", i, cache));
    o.status = options.status ?? BookStatus.InProgress;
    return o as FactoryResult<Book>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["Book"] = newBook;

export interface BookReviewOptions {
  __typename?: "BookReview";
  rating?: BookReview["rating"];
}

export function newBookReview(options?: BookReviewOptions, factoryOptions?: FactoryOptions): FactoryResult<BookReview>;
export function newBookReview(
  options: BookReviewOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<BookReview> {
  const o = (options.__typename ? options : cache["BookReview"] = {}) as BookReview;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "BookReview";
    o.rating = options.rating ?? 0;
    return o as FactoryResult<BookReview>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["BookReview"] = newBookReview;

export interface CalendarIntervalOptions {
  __typename?: "CalendarInterval";
  end?: CalendarInterval["end"];
  start?: CalendarInterval["start"];
}

export function newCalendarInterval(
  options?: CalendarIntervalOptions,
  factoryOptions?: FactoryOptions,
): FactoryResult<CalendarInterval>;
export function newCalendarInterval(
  options: CalendarIntervalOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<CalendarInterval> {
  const o = (options.__typename ? options : cache["CalendarInterval"] = {}) as CalendarInterval;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "CalendarInterval";
    o.end = options.end ?? newDate();
    o.start = options.start ?? newDate();
    return o as FactoryResult<CalendarInterval>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["CalendarInterval"] = newCalendarInterval;

export interface ChildOptions {
  __typename?: "Child";
  name?: Child["name"];
  parent?: Named | FactoryResult<NamedType> | NamedOptions;
}

export function newChild(options?: ChildOptions, factoryOptions?: FactoryOptions): FactoryResult<Child>;
export function newChild(
  options: ChildOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<Child> {
  const o = (options.__typename ? options : cache["Child"] = {}) as Child;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "Child";
    o.name = options.name ?? "name";
    o.parent = maybeNew("Named", options.parent, cache, options.hasOwnProperty("parent"));
    return o as FactoryResult<Child>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["Child"] = newChild;

export interface MarketOptions {
  __typename?: "Market";
  children?: Array<Project | FactoryResult<ProjectType> | ProjectOptions>;
  name?: Market["name"];
}

export function newMarket(options?: MarketOptions, factoryOptions?: FactoryOptions): FactoryResult<Market>;
export function newMarket(
  options: MarketOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<Market> {
  const o = (options.__typename ? options : cache["Market"] = {}) as Market;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "Market";
    o.children = (options.children ?? []).map((i) => maybeNew("Project", i, cache, options.hasOwnProperty("children")));
    o.name = options.name ?? "name";
    return o as FactoryResult<Market>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["Market"] = newMarket;

export interface ParentOptions {
  __typename?: "Parent";
  children?: Array<Named | FactoryResult<NamedType> | NamedOptions>;
  name?: Parent["name"];
}

export function newParent(options?: ParentOptions, factoryOptions?: FactoryOptions): FactoryResult<Parent>;
export function newParent(
  options: ParentOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<Parent> {
  const o = (options.__typename ? options : cache["Parent"] = {}) as Parent;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "Parent";
    o.children = (options.children ?? []).map((i) => maybeNew("Named", i, cache, options.hasOwnProperty("children")));
    o.name = options.name ?? "name";
    return o as FactoryResult<Parent>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["Parent"] = newParent;

export interface PopularityDetailOptions {
  __typename?: "PopularityDetail";
  code?: PopularityDetail["code"];
  name?: PopularityDetail["name"];
}

export function newPopularityDetail(
  options?: PopularityDetailOptions,
  factoryOptions?: FactoryOptions,
): FactoryResult<PopularityDetail>;
export function newPopularityDetail(
  options: PopularityDetailOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<PopularityDetail> {
  const o = (options.__typename ? options : cache["PopularityDetail"] = {}) as PopularityDetail;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "PopularityDetail";
    o.code = options.code ?? Popularity.High;
    o.name = options.name ?? "High";
    return o as FactoryResult<PopularityDetail>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["PopularityDetail"] = newPopularityDetail;

export interface RegionOptions {
  __typename?: "Region";
  children?: Array<FactoryInput<Market, MarketOptions>>;
  name?: Region["name"];
}

export function newRegion(options?: RegionOptions, factoryOptions?: FactoryOptions): FactoryResult<Region>;
export function newRegion(
  options: RegionOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<Region> {
  const o = (options.__typename ? options : cache["Region"] = {}) as Region;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "Region";
    o.children = (options.children ?? []).map((i) => maybeNew("Market", i, cache, options.hasOwnProperty("children")));
    o.name = options.name ?? "name";
    return o as FactoryResult<Region>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["Region"] = newRegion;

export interface SaveAuthorResultOptions {
  __typename?: "SaveAuthorResult";
  author?: FactoryInput<Author, AuthorOptions>;
}

export function newSaveAuthorResult(
  options?: SaveAuthorResultOptions,
  factoryOptions?: FactoryOptions,
): FactoryResult<SaveAuthorResult>;
export function newSaveAuthorResult(
  options: SaveAuthorResultOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<SaveAuthorResult> {
  const o = (options.__typename ? options : cache["SaveAuthorResult"] = {}) as SaveAuthorResult;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "SaveAuthorResult";
    o.author = maybeNew("Author", options.author, cache, options.hasOwnProperty("author"));
    return o as FactoryResult<SaveAuthorResult>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["SaveAuthorResult"] = newSaveAuthorResult;

export interface SearchResultsOptions {
  __typename?: "SearchResults";
  result1?: SearchResult | FactoryResult<SearchResult> | AuthorOptions | RequireTypename<BookOptions> | null;
  result2?: Named | FactoryResult<NamedType> | NamedOptions | null;
  result3?: FactoryInput<Author, AuthorOptions> | null;
}

export function newSearchResults(
  options?: SearchResultsOptions,
  factoryOptions?: FactoryOptions,
): FactoryResult<SearchResults>;
export function newSearchResults(
  options: SearchResultsOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<SearchResults> {
  const o = (options.__typename ? options : cache["SearchResults"] = {}) as SearchResults;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "SearchResults";
    o.result1 = maybeNewOrNull(options.result1?.__typename ?? "Author", options.result1, cache);
    o.result2 = maybeNewOrNull("Named", options.result2, cache);
    o.result3 = maybeNewOrNull("Author", options.result3, cache);
    return o as FactoryResult<SearchResults>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["SearchResults"] = newSearchResults;

export interface WorkingDetailOptions {
  __typename?: "WorkingDetail";
  code?: WorkingDetail["code"];
  extraField?: WorkingDetail["extraField"];
  name?: WorkingDetail["name"];
}

export function newWorkingDetail(
  options?: WorkingDetailOptions,
  factoryOptions?: FactoryOptions,
): FactoryResult<WorkingDetail>;
export function newWorkingDetail(
  options: WorkingDetailOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<WorkingDetail> {
  const o = (options.__typename ? options : cache["WorkingDetail"] = {}) as WorkingDetail;
  (cache.all ??= new Set()).add(o);
  (cache.active ??= new Set()).add(o);
  try {
    o.__typename = "WorkingDetail";
    o.code = options.code ?? Working.No;
    o.extraField = options.extraField ?? 0;
    o.name = options.name ?? "No";
    return o as FactoryResult<WorkingDetail>;
  } finally {
    cache.active?.delete(o);
  }
}

factories["WorkingDetail"] = newWorkingDetail;

export type NamedOptions =
  | AuthorOptions
  | RequireTypename<BookOptions>
  | RequireTypename<ChildOptions>
  | RequireTypename<ParentOptions>
  | RequireTypename<PopularityDetailOptions>;

export type NamedType = Author | Book | Child | Parent | PopularityDetail;

export type NamedTypeName = "Author" | "Book" | "Child" | "Parent" | "PopularityDetail";

export function newNamed(): FactoryResult<Author>;
export function newNamed(options: AuthorOptions, factoryOptions?: FactoryOptions): FactoryResult<Author>;
export function newNamed(options: RequireTypename<BookOptions>, factoryOptions?: FactoryOptions): FactoryResult<Book>;
export function newNamed(options: RequireTypename<ChildOptions>, factoryOptions?: FactoryOptions): FactoryResult<Child>;
export function newNamed(
  options: RequireTypename<ParentOptions>,
  factoryOptions?: FactoryOptions,
): FactoryResult<Parent>;
export function newNamed(
  options: RequireTypename<PopularityDetailOptions>,
  factoryOptions?: FactoryOptions,
): FactoryResult<PopularityDetail>;
export function newNamed(
  options: NamedOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<NamedType> {
  const { __typename = "Author" } = options ?? {};
  const shouldUseCache = Object.keys(options).length === 0;
  const maybeCached = shouldUseCache ? getCachedValue(__typename, cache) : undefined;
  if (maybeCached !== undefined) {
    return maybeCached;
  }
  if (shouldUseCache && hasActiveCachedValue(__typename, cache)) {
    return undefined as any;
  }
  return maybeNew(__typename, options ?? {}, cache);
}

factories["Named"] = newNamed;

export type ProjectOptions = MarketOptions | RequireTypename<RegionOptions>;

export type ProjectType = Market | Region;

export type ProjectTypeName = "Market" | "Region";

export function newProject(): FactoryResult<Market>;
export function newProject(options: MarketOptions, factoryOptions?: FactoryOptions): FactoryResult<Market>;
export function newProject(
  options: RequireTypename<RegionOptions>,
  factoryOptions?: FactoryOptions,
): FactoryResult<Region>;
export function newProject(
  options: ProjectOptions = {},
  factoryOptions: FactoryOptions = {},
  cache: FactoryCache = newFactoryCache(factoryOptions),
): FactoryResult<ProjectType> {
  const { __typename = "Market" } = options ?? {};
  const shouldUseCache = Object.keys(options).length === 0;
  const maybeCached = shouldUseCache ? getCachedValue(__typename, cache) : undefined;
  if (maybeCached !== undefined) {
    return maybeCached;
  }
  if (shouldUseCache && hasActiveCachedValue(__typename, cache)) {
    return undefined as any;
  }
  return maybeNew(__typename, options ?? {}, cache);
}

factories["Project"] = newProject;

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

function newFactoryCache(factoryOptions: FactoryOptions = {}): FactoryCache {
  return { avoidCycles: factoryOptions.avoidCycles === true };
}

function reuseWouldCreateCycle(cache: FactoryCache, value: object): boolean {
  return cache.avoidCycles === true && cache.active?.has(value) === true;
}

function getCachedValue(type: string, cache: FactoryCache): any {
  const cachedValue = cache[type];
  if (cachedValue === undefined) {
    return undefined;
  }
  return reuseWouldCreateCycle(cache, cachedValue) ? undefined : cachedValue;
}

function hasActiveCachedValue(type: string, cache: FactoryCache): boolean {
  const cachedValue = cache[type];
  return cachedValue !== undefined && reuseWouldCreateCycle(cache, cachedValue);
}

function maybeNew(
  type: string,
  value: { __typename?: string } | object | undefined,
  cache: FactoryCache,
  isSet: boolean = false,
): any {
  if (value === undefined) {
    const cachedValue = getCachedValue(type, cache);
    if (cachedValue !== undefined || isSet || hasActiveCachedValue(type, cache)) {
      return cachedValue;
    }
    return factories[type]({}, undefined, cache);
  } else if ("__typename" in value && value.__typename) {
    if (cache.all?.has(value)) {
      return reuseWouldCreateCycle(cache, value) ? undefined : value;
    }
    return factories[value.__typename](value, undefined, cache);
  } else {
    return factories[type](value, undefined, cache);
  }
}

function maybeNewOrNull(
  type: string,
  value: { __typename?: string } | object | undefined | null,
  cache: FactoryCache,
): any {
  if (!value) {
    return null;
  } else if ("__typename" in value && value.__typename) {
    if (cache.all?.has(value)) {
      return reuseWouldCreateCycle(cache, value) ? undefined : value;
    }
    return factories[value.__typename](value, undefined, cache);
  } else {
    return factories[type](value, undefined, cache);
  }
}
