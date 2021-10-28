// ApplicationValidators -----------------------------------------------------

// Application-specific validators that can be used in both client and server
// environments.  In all cases, a "true" return indicates that the proposed
// value is valid, while "false" means it is not.  If a field is required, that
// must be validated separately.

// Public Objects -----------------------------------------------------------

export const validateCategoryType = (type: string | null | undefined): boolean => {
    if (!type) {
        return true;
    } else {
        return VALID_CATEGORY_TYPES.has(type);
    }
}

export const VALID_CATEGORY_TYPES: Map<string, string> = new Map();
VALID_CATEGORY_TYPES.set("Detail",      "Detail line with values");
VALID_CATEGORY_TYPES.set("Header",      "Header line for a set of details");

