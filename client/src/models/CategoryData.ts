// CategoryData --------------------------------------------------------------

// Fields from a Category that might be visible in an input form.

// Public Objects ------------------------------------------------------------

class CategoryData {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : -1;
        this.accumulated = (data.accumulated !== undefined) ? data.accumulated : true;
        this.active = (data.active !== undefined) ? data.active : true;
        this.description = data.description ? data.description : null;
        this.notes = data.notes ? data.notes : null;
        this.ordinal = data.ordinal ? data.ordinal : null;
        this.sectionId = data.sectionId ? data.sectionId : -1;
        this.service = data.service ? data.service : null;
        this.scope = data.scope ? data.scope : null;
        this.slug = data.slug ? data.slug : null;
    }

    id: number;
    accumulated: boolean;
    active: boolean;
    description: string;
    notes: string;
    ordinal: number;
    sectionId: number;
    service: string;
    scope: string;
    slug: string;

}

export default CategoryData;
