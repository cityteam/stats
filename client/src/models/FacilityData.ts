// FacilityData --------------------------------------------------------------

// Fields rom a Facility that might be visible in an input form.

// Public Objects ------------------------------------------------------------

class FacilityData {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.address1 = data.address1 ? data.address1 : null;
        this.address2 = data.address2 ? data.address2 : null;
        this.city = data.city ? data.city : null;
        this.email = data.email ? data.email : null;
        this.name = data.name ? data.name : null;
        this.phone = data.phone ? data.phone : null;
        this.scope = data.scope ? data.scope : null;
        this.state = data.state ? data.state : null;
        this.zipCode = data.zipCode ? data.zipCode : null;
    }

    id: number;
    active: boolean;
    address1: string;
    address2: string;
    city: string;
    email: string;
    name: string;
    phone: string;
    scope: string;
    state: string;
    zipCode: string;

}

export default FacilityData;
