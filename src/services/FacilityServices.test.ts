// FacilityServices.test -----------------------------------------------------

// Functional tests for FacilityServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import FacilityServices from "./FacilityServices";
import Facility from "../models/Facility";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

const UTILS = new ServicesUtils();

// Test Specifications -------------------------------------------------------

describe("FacilityServices Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withFacilities: true,
        });
    });

    // Test Methods ----------------------------------------------------------

    describe("FacilityServices.all()", () => {

        it("should pass on active Facilities", async () => {

            const FACILITIES = await FacilityServices.all({active: "" });

            FACILITIES.forEach(facility => {
                expect(facility.active).to.be.true;
            });

        });

        it("should pass on all Facilities", async () => {

            const FACILITIES = await FacilityServices.all();

            expect(FACILITIES.length).to.equal(SeedData.FACILITIES.length);

        });

        it("should pass on included children", async () => {

            const FACILITIES = await FacilityServices.all({
                withSections: "",
            });

            FACILITIES.forEach(facility => {
                expect(facility.sections).to.exist;
// TODO                expect(facility.sections.length).to.be.greaterThan(0);
                facility.sections.forEach(section => {
                    expect(section.facilityId).to.equal(facility.id);
                });
            });

        })

        it("should pass on named Facilities", async () => {

            const PATTERN = "IR"; // Should match "First" and "Third"
            const FACILITIES = await FacilityServices.all({name: PATTERN});

            expect(FACILITIES.length).to.be.greaterThan(0);
            expect(FACILITIES.length).to.be.lessThan(SeedData.FACILITIES.length);
            FACILITIES.forEach(facility => {
                expect(facility.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            });

        });

        it("should pass on paginated Facilities", async () => {

            const LIMIT = 2;
            const OFFSET = 1;
            const INPUTS = await FacilityServices.all();

            const OUTPUTS = await FacilityServices.all({
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.equal(LIMIT);
            OUTPUTS.forEach((OUTPUT, index) => {
                compareFacilityOld(OUTPUT, INPUTS[index + OFFSET]);
            });

        });

        it("should pass on scoped Facilities", async () => {

            const SCOPE = SeedData.FACILITY_SCOPE_SECOND;
            const FACILITIES = await FacilityServices.all({scope: SCOPE});

            expect(FACILITIES.length).to.be.greaterThan(0);
            expect(FACILITIES.length).to.be.lessThan(SeedData.FACILITIES.length);
            FACILITIES.forEach(facility => {
                expect(facility.scope).to.equal(SCOPE);
            })

        });

    });

    describe("FacilityServices.exact()", () => {

        it("should fail on invalid name", async () => {

            const INVALID_NAME = "abra cadabra";

            try {
                await FacilityServices.exact(INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`name: Missing Facility '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on included children", async () => {

            const NAME = SeedData.FACILITY_NAME_THIRD;

            try {
                const OUTPUT = await FacilityServices.exact(NAME, {
                    withSections: "",
                });
                expect(OUTPUT.sections).to.exist;
                OUTPUT.sections.forEach(section => {
                    expect(section.facilityId).to.equal(OUTPUT.id);
                });
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }

        });

        it("should pass on valid names", async () => {

            const INPUTS = await FacilityServices.all();

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await FacilityServices.exact(INPUT.name);
                compareFacilityOld(OUTPUT, INPUT);
            });


        });

    });

    describe("FacilityServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const INVALID_ID = -1;

            try {
                await FacilityServices.find(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`facilityId: Missing Facility ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on included children", async () => {

            const INPUTS = await FacilityServices.all({
                withSections: "",
            });

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await FacilityServices.find(INPUT.id);
                expect(OUTPUT.sections).to.exist;
                OUTPUT.sections.forEach(section => {
                    expect(section.facilityId).to.equal(INPUT.id);
                });
            });

        });

        it("should pass on valid IDs", async () => {

            const INPUTS = await FacilityServices.all();

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await FacilityServices.find(INPUT.id);
                compareFacilityOld(OUTPUT, INPUT);
            });

        });

    });

    describe("FacilityServices.insert()", () => {

        it("should fail on duplicate name", async () => {

            const FACILITY = await FacilityServices.exact(SeedData.FACILITY_NAME_SECOND);
            const INPUT = {
                name: FACILITY.name,
                scope: "newscope",
            }

            try {
                await FacilityServices.insert(INPUT);
                expect.fail(`Should have thrown BadRequst`);
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("is already in use");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on duplicate scope", async () => {

            const FACILITY = await FacilityServices.exact(SeedData.FACILITY_NAME_THIRD);
            const INPUT = {
                name: "New Name",
                scope: FACILITY.scope,
            }

            try {
                await FacilityServices.insert(INPUT);
                expect.fail(`Should have thrown BadRequst`);
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("is already in use");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid input data", async () => {

            const INPUT = {};

            try {
                await FacilityServices.insert(INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("Is required");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }

            }

        });

        it("should pass on valid input data", async () => {

            const INPUT = {
                active: false,
                city: "Shangri",
                name: "Shangri La",
                scope: "sla",
                state: "LA",
            }

            const OUTPUT = await FacilityServices.insert(INPUT);
            expect(OUTPUT.id).to.exist;
            compareFacilityNew(OUTPUT, INPUT);

        });

    });

    describe("FacilityServices.remove()", () => {

        it("should fail on invalid ID", async () => {

            const INVALID_ID = -1;

            try {
                await FacilityServices.remove(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`facilityId: Missing Facility ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid ID", async () => {

            const INPUT = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const OUTPUT = await FacilityServices.remove(INPUT.id);
            expect(OUTPUT.id).to.equal(INPUT.id);

            try {
                await FacilityServices.remove(INPUT.id);
                expect.fail(`Should have thrown NotFound after remove`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`facilityId: Missing Facility ${INPUT.id}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

    })

    describe("FacilityServices.sections()", () => {

        it("should pass on all Sections", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);

            const SECTIONS = await FacilityServices.sections(FACILITY.id);
            SECTIONS.forEach(section => {
                expect(section.facilityId).to.equal(FACILITY.id);
            });

        });


    });

    describe("FacilityServices.update()", () => {

        it("should fail on duplicate name", async () => {

            const ORIGINAL = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const INPUT = {
                name: SeedData.FACILITY_NAME_SECOND,
            }

            try {
                await FacilityServices.update(ORIGINAL.id, INPUT);
                expect.fail(`Should have thrown BadRequest`);
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include(`name: Name '${INPUT.name}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on duplicate scope", async () => {

            const INPUTS = await FacilityServices.all();
            const INPUT = {
                id: INPUTS[1].id,
                scope: INPUTS[0].scope,
            }

            try {
                await FacilityServices.update(INPUT.id, INPUT);
                expect.fail(`Should have thrown BadRequest`);
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include(`scope: Scope '${INPUT.scope}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid ID", async () => {

            const INVALID_ID = -1;
            const ORIGINAL = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const INPUT = {
                name: ORIGINAL.name + " UPDATED",
                scope: ORIGINAL.scope + " UPDATED",
            }

            try {
                await FacilityServices.update(INVALID_ID, INPUT);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`facilityId: Missing Facility ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on no changed data", async () => {

            const ORIGINAL = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const INPUT = {
                id: ORIGINAL.id,
                active: ORIGINAL.active,
                address1: ORIGINAL.address1,
                address2: ORIGINAL.address2,
                city: ORIGINAL.city,
                email: ORIGINAL.email,
                name: ORIGINAL.name,
                phone: ORIGINAL.phone,
                scope: ORIGINAL.scope,
                state: ORIGINAL.state,
                zipCode: ORIGINAL.zipCode,
            }

            const OUTPUT = await FacilityServices.update(ORIGINAL.id, INPUT);
            compareFacilityOld(OUTPUT, INPUT);
            const UPDATED = await FacilityServices.find(ORIGINAL.id);
            compareFacilityOld(UPDATED, OUTPUT);

        });

        it("should pass on no updated data", async () => {

            const ORIGINAL = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const INPUT = {};

            const OUTPUT = await FacilityServices.update(ORIGINAL.id, INPUT);
            compareFacilityOld(OUTPUT, ORIGINAL);
            const UPDATED = await FacilityServices.find(ORIGINAL.id);
            compareFacilityOld(UPDATED, OUTPUT);

        });

        it("should pass on valid updated data", async () => {

            const ORIGINAL = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const INPUT = {
                id: ORIGINAL.id,
                active: !ORIGINAL.active,
                address1: "New address1",
                scope: ORIGINAL.scope + "updated",
            }

            const OUTPUT = await FacilityServices.update(ORIGINAL.id, INPUT);
            compareFacilityOld(OUTPUT, INPUT);
            const UPDATED = await FacilityServices.find(ORIGINAL.id);
            compareFacilityOld(UPDATED, OUTPUT);

        });

    });

});

// Helper Objects ------------------------------------------------------------

export function compareFacilityNew(OUTPUT: Partial<Facility>, INPUT: Partial<Facility>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.address1).to.equal(INPUT.address1 ? INPUT.address1 : null);
    expect(OUTPUT.address2).to.equal(INPUT.address2 ? INPUT.address2 : null);
    expect(OUTPUT.city).to.equal(INPUT.city ? INPUT.city : null);
    expect(OUTPUT.email).to.equal(INPUT.email ? INPUT.email : null);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.phone).to.equal(INPUT.phone ? INPUT.phone : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope);
    expect(OUTPUT.state).to.equal(INPUT.state ? INPUT.state : null);
    expect(OUTPUT.zipCode).to.equal(INPUT.zipCode ? INPUT.zipCode : null);
}

export function compareFacilityOld(OUTPUT: Partial<Facility>, INPUT: Partial<Facility>) {
    expect(OUTPUT.id).to.equal(INPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.address1).to.equal(INPUT.address1 ? INPUT.address1 : null);
    expect(OUTPUT.address2).to.equal(INPUT.address2 ? INPUT.address2 : null);
    expect(OUTPUT.city).to.equal(INPUT.city ? INPUT.city : null);
    expect(OUTPUT.email).to.equal(INPUT.email ? INPUT.email : null);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.phone).to.equal(INPUT.phone ? INPUT.phone : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
    expect(OUTPUT.state).to.equal(INPUT.state ? INPUT.state : null);
    expect(OUTPUT.zipCode).to.equal(INPUT.zipCode ? INPUT.zipCode : null);
}
