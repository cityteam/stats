// SectionData ---------------------------------------------------------------

// Fields from a Section that might be visible in an input form.

// Public Objects ------------------------------------------------------------

class SectionData {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.facilityId = data.facilityId ? data.facilityId : -1;
        this.notes = data.notes ? data.notes : null;
        this.ordinal = data.ordinal ? data.ordinal : null;
        this.scope = data.scope ? data.scope : null;
        this.slug = data.slug ? data.slug : null;
        this.title = data.title ? data.title : null;
    }

    id: number;
    active: boolean;
    facilityId: number;
    notes: string;
    ordinal: number;
    scope: string;
    slug: string;
    title: string;

}

export default SectionData;
