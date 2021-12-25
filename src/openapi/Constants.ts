// Constants -----------------------------------------------------------------

// Shared constants for this application.

// HTTP Response Status Codes ------------------------------------------------

export const OK = "200";
export const CREATED = "201";
export const BAD_REQUEST = "400";
export const UNAUTHORIZED = "401";
export const FORBIDDEN = "403";
export const NOT_FOUND = "404";
export const NOT_UNIQUE = "409";
export const SERVER_ERROR = "500";

// Parameter Names (Includes) ------------------------------------------------

export const WITH_CATEGORIES = "withCategories";
export const WITH_DAILIES = "withDailies";
export const WITH_FACILITY = "withFacility";
export const WITH_SECTION = "withSection";
export const WITH_SECTIONS = "withSections";

// Parameter Names (Matches) -------------------------------------------------

export const MATCH_ACTIVE = "active";
export const MATCH_NAME = "name";
export const MATCH_ORDINAL = "ordinal";
export const MATCH_SCOPE = "scope";

// Parameter Names (Pagination) ----------------------------------------------

export const LIMIT = "limit";
export const OFFSET = "offset";

// Parameter Names (Path) ----------------------------------------------------

export const CATEGORY_ID = "categoryId";
export const DATE = "date";
export const DATE_FROM = "dateFrom";
export const DATE_TO = "dateTo";
export const FACILITY_ID = "facilityId";
export const NAME_PATH = "namePath"; // Special case since also a query parameter
export const SECTION_ID = "sectionId";

// Property Names ------------------------------------------------------------

export const ACCUMULATED = "accumulated";
export const ACTIVE = "active";
export const ADDRESS1 = "address1";
export const ADDRESS2 = "address2";
export const CATEGORIES = "categories";
export const CITY = "city";
export const DESCRIPTION = "description";
export const EMAIL = "email";
export const ID = "id";
export const NAME = "name";
export const NOTES = "notes";
export const ORDINAL = "ordinal";
export const PHONE = "phone";
export const SCOPE = "scope";
export const SECTIONS = "sections";
export const SERVICE = "service";
export const SLUG = "slug";
export const STATE = "state";
export const TITLE = "title";
export const VALUES = "values";
export const ZIPCODE = "zipCode";

// Tag Names -----------------------------------------------------------------

export const REQUIRE_ADMIN = "requireAdmin";
export const REQUIRE_ANY = "requireAny";
export const REQUIRE_REGULAR = "requireRegular";
export const REQUIRE_SUPERUSER = "requireSuperuser";

