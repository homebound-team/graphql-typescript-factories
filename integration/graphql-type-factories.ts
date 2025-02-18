import {
  Author,
  AuthorSummary,
  Book,
  BookReview,
  BookStatus,
  CalendarInterval,
  Child,
  Maybe,
  Named,
  Parent,
  Popularity,
  PopularityDetail,
  SaveAuthorResult,
  SearchResult,
  SearchResults,
  Working,
  WorkingDetail,
} from "./graphql-types-only";
import { newDate } from "./testData";

const factories: Record<string, Function> = {};
type RequireTypename<T extends { __typename?: string }> = Omit<T, "__typename"> & Required<Pick<T, "__typename">>;
export interface AuthorOptions {
  __typename?: "Author";
  anotherId?: Author["anotherId"];
  birthday?: Author["birthday"];
  bookPopularities?: Array<PopularityDetail | PopularityDetailOptions>;
  books?: Array<Book | BookOptions>;
  id?: Author["id"];
  name?: Author["name"];
  popularity?: PopularityDetailOptions | Popularity;
  summary?: AuthorSummary | AuthorSummaryOptions;
  working?: Author["working"];
  workingDetail?: Array<WorkingDetail | WorkingDetailOptions>;
}

export function newAuthor(options: AuthorOptions = {}, cache: Record<string, any> = {}): Author {
  const o = (options.__typename ? options : cache["Author"] = {}) as Author;
  (cache.all ??= new Set()).add(o);
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
  return o;
}

factories["Author"] = newAuthor;

export interface AuthorSummaryOptions {
  __typename?: "AuthorSummary";
  amountOfSales?: AuthorSummary["amountOfSales"];
  author?: Author | AuthorOptions;
  id?: AuthorSummary["id"];
  numberOfBooks?: AuthorSummary["numberOfBooks"];
}

export function newAuthorSummary(options: AuthorSummaryOptions = {}, cache: Record<string, any> = {}): AuthorSummary {
  const o = (options.__typename ? options : cache["AuthorSummary"] = {}) as AuthorSummary;
  (cache.all ??= new Set()).add(o);
  o.__typename = "AuthorSummary";
  o.amountOfSales = options.amountOfSales ?? null;
  o.author = maybeNew("Author", options.author, cache, options.hasOwnProperty("author"));
  o.id = options.id ?? nextFactoryId("AuthorSummary");
  o.numberOfBooks = options.numberOfBooks ?? 0;
  return o;
}

factories["AuthorSummary"] = newAuthorSummary;

export interface BookOptions {
  __typename?: "Book";
  coauthor?: Author | AuthorOptions | null;
  name?: Book["name"];
  popularity?: PopularityDetailOptions | Popularity | null;
  reviews?: Array<Maybe<BookReview | BookReviewOptions>> | null;
  status?: Book["status"];
}

export function newBook(options: BookOptions = {}, cache: Record<string, any> = {}): Book {
  const o = (options.__typename ? options : cache["Book"] = {}) as Book;
  (cache.all ??= new Set()).add(o);
  o.__typename = "Book";
  o.coauthor = maybeNewOrNull("Author", options.coauthor, cache);
  o.name = options.name ?? "name";
  o.popularity = enumOrDetailOrNullOfPopularity(options.popularity);
  o.reviews = (options.reviews ?? []).map((i) => maybeNewOrNull("BookReview", i, cache));
  o.status = options.status ?? BookStatus.InProgress;
  return o;
}

factories["Book"] = newBook;

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

export interface ChildOptions {
  __typename?: "Child";
  name?: Child["name"];
  parent?: Author | Book | Child | Parent | PopularityDetail | Named | NamedOptions;
}

export function newChild(options: ChildOptions = {}, cache: Record<string, any> = {}): Child {
  const o = (options.__typename ? options : cache["Child"] = {}) as Child;
  (cache.all ??= new Set()).add(o);
  o.__typename = "Child";
  o.name = options.name ?? "name";
  o.parent = maybeNew("Author", options.parent, cache, options.hasOwnProperty("parent"));
  return o;
}

factories["Child"] = newChild;

export interface ParentOptions {
  __typename?: "Parent";
  children?: Array<Author | Book | Child | Parent | PopularityDetail | Named | NamedOptions>;
  name?: Parent["name"];
}

export function newParent(options: ParentOptions = {}, cache: Record<string, any> = {}): Parent {
  const o = (options.__typename ? options : cache["Parent"] = {}) as Parent;
  (cache.all ??= new Set()).add(o);
  o.__typename = "Parent";
  o.children = (options.children ?? []).map((i) => maybeNew("Named", i, cache, options.hasOwnProperty("children")));
  o.name = options.name ?? "name";
  return o;
}

factories["Parent"] = newParent;

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
  author?: Author | AuthorOptions;
}

export function newSaveAuthorResult(
  options: SaveAuthorResultOptions = {},
  cache: Record<string, any> = {},
): SaveAuthorResult {
  const o = (options.__typename ? options : cache["SaveAuthorResult"] = {}) as SaveAuthorResult;
  (cache.all ??= new Set()).add(o);
  o.__typename = "SaveAuthorResult";
  o.author = maybeNew("Author", options.author, cache, options.hasOwnProperty("author"));
  return o;
}

factories["SaveAuthorResult"] = newSaveAuthorResult;

export interface SearchResultsOptions {
  __typename?: "SearchResults";
  result1?: SearchResult | AuthorOptions | RequireTypename<BookOptions> | null;
  result2?: Author | Book | Child | Parent | PopularityDetail | Named | NamedOptions | null;
  result3?: Author | AuthorOptions | null;
}

export function newSearchResults(options: SearchResultsOptions = {}, cache: Record<string, any> = {}): SearchResults {
  const o = (options.__typename ? options : cache["SearchResults"] = {}) as SearchResults;
  (cache.all ??= new Set()).add(o);
  o.__typename = "SearchResults";
  o.result1 = maybeNewOrNull(options.result1?.__typename ?? "Author", options.result1, cache);
  o.result2 = maybeNewOrNull("Named", options.result2, cache);
  o.result3 = maybeNewOrNull("Author", options.result3, cache);
  return o;
}

factories["SearchResults"] = newSearchResults;

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
  o.code = options.code ?? Working.No;
  o.extraField = options.extraField ?? 0;
  o.name = options.name ?? "No";
  return o;
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

export function newNamed(): Author;
export function newNamed(options: AuthorOptions, cache?: Record<string, any>): Author;
export function newNamed(options: RequireTypename<BookOptions>, cache?: Record<string, any>): Book;
export function newNamed(options: RequireTypename<ChildOptions>, cache?: Record<string, any>): Child;
export function newNamed(options: RequireTypename<ParentOptions>, cache?: Record<string, any>): Parent;
export function newNamed(
  options: RequireTypename<PopularityDetailOptions>,
  cache?: Record<string, any>,
): PopularityDetail;
export function newNamed(options: NamedOptions = {}, cache: Record<string, any> = {}): NamedType {
  const { __typename = "Author" } = options;
  return factories[__typename](options, cache);
}

factories["Named"] = newNamed;

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

function maybeNew(
  type: string,
  value: { __typename?: string } | object | undefined,
  cache: Record<string, any>,
  isSet: boolean = false,
): any {
  if (value === undefined) {
    return isSet ? undefined : cache[type] || factories[type]({}, cache);
  } else if ("__typename" in value && value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return factories[type](value, cache);
  }
}

function maybeNewOrNull(
  type: string,
  value: { __typename?: string } | object | undefined | null,
  cache: Record<string, any>,
): any {
  if (!value) {
    return null;
  } else if ("__typename" in value && value.__typename) {
    return cache.all?.has(value) ? value : factories[value.__typename](value, cache);
  } else {
    return factories[type](value, cache);
  }
}
