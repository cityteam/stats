// ApplicationValidators -----------------------------------------------------

// Custom (to this application) validation methods that can be used by both
// backend database interactions and frontend UI components.  In all cases,
// a "true" return indicates that the proposed value is valid, while "false"
// means it is not.  If a field is required, that must be validated separately.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const validateCategoryOrdinal = (ordinal: number | undefined): boolean => {
    if (ordinal) {
        return (ordinal > 0);
    } else {
        return true;
    }
}

export const validateSectionOrdinal = (ordinal: number | undefined): boolean => {
    if (ordinal) {
        return (ordinal > 0);
    } else {
        return true;
    }
}

