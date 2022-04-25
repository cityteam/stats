// SectionServices.test ------------------------------------------------------

// Functional tests for SectionServices.

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import SectionServices from "./SectionServices";
import Section from "../models/Section";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

const UTILS = new ServicesUtils();

// Test Specifications -------------------------------------------------------

describe('SectionServices Functional Tests', function () {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withFacilities: true,
            withSections: true,
        });
    });

    // Test Methods ----------------------------------------------------------

    describe("SectionServices.all()", () => {

        it("should pass on active Sections", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const OUTPUTS = await SectionServices.all(
                FACILITY.id,
                { active: "" },
            );

            expect(OUTPUTS.length).to.be.greaterThan(0);
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.facilityId).to.equal(FACILITY.id);
                expect(OUTPUT.active).to.be.true;
            });

        });

        it("should pass on all Sections", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const OUTPUTS = await SectionServices.all(FACILITY.id);

            expect(OUTPUTS.length).to.equal(SeedData.SECTIONS.length);
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.facilityId).to.equal(FACILITY.id);
            });

        });

        it("should pass on included parent", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const OUTPUTS = await SectionServices.all(FACILITY.id, {
                withFacility: "",
            });

            expect(OUTPUTS.length).to.equal(SeedData.SECTIONS.length);
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.facility).to.exist;
                expect(OUTPUT.facility.id).to.equal(FACILITY.id);
            });

        });

        it("should pass on ordinaled Sections", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const ORDINAL = SeedData.SECTIONS[0].ordinal;
            const OUTPUTS = await SectionServices.all(FACILITY.id, {
                ordinal: ORDINAL,
            });

            expect(OUTPUTS.length).to.equal(1);
            expect(OUTPUTS[0].facilityId).to.equal(FACILITY.id);
            expect(OUTPUTS[0].ordinal).to.equal(ORDINAL);

        });

        it("should pass on paginated Sections", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const LIMIT = 1;
            const OFFSET = 1;
            const OUTPUTS = await SectionServices.all(FACILITY.id, {
                limit: LIMIT,
                offset: OFFSET,
            });

            expect(OUTPUTS.length).to.equal(LIMIT);

        });

    });

    xdescribe("SectionServices.categories()", () => { // TODO
    });

    describe("SectionServices.exact()", () => {

        it("should fail on invalid facility ID", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const INVALID_FACILITY_ID = -1;

            try {
                await SectionServices.exact(INVALID_FACILITY_ID, -1);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`facilityId: Missing Facility ${INVALID_FACILITY_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid ordinal", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const INVALID_ORDINAL = 1234;

            try {
                await SectionServices.exact(FACILITY.id, INVALID_ORDINAL);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`ordinal: Missing Section ${INVALID_ORDINAL}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on included parent", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const INPUTS = await SectionServices.all(FACILITY.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await SectionServices.exact(FACILITY.id, INPUT.ordinal, {
                    withFacility: "",
                });
                expect(OUTPUT.facility).to.exist;
                expect(OUTPUT.facility.id).to.equal(FACILITY.id);
            });

        });

        it("should pass on valid ordinals", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const INPUTS = await SectionServices.all(FACILITY.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await SectionServices.exact(FACILITY.id, INPUT.ordinal);
                compareSectionOld(OUTPUT, INPUT);
                expect(OUTPUT.facilityId).to.equal(INPUT.facilityId);
            })

        });

    });

    describe("SectionServices.find()", () => {

        it("should fail on invalid facility ID", async () => {

            const INVALID_FACILITY_ID = -1;

            try {
                await SectionServices.find(INVALID_FACILITY_ID, -1);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`facilityId: Missing Facility ${INVALID_FACILITY_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid section ID", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const INVALID_SECTION_ID = -1;

            try {
                await SectionServices.find(FACILITY.id, INVALID_SECTION_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`sectionId: Missing Section ${INVALID_SECTION_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on included parent", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const INPUTS = await SectionServices.all(FACILITY.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await SectionServices.find(FACILITY.id, INPUT.id, {
                    withFacility: "",
                });
                expect(OUTPUT.facility).to.exist;
                expect(OUTPUT.facility.id).to.equal(FACILITY.id);
            });

        });

        it("should pass on valid IDs", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const INPUTS = await SectionServices.all(FACILITY.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await SectionServices.find(FACILITY.id, INPUT.id);
                compareSectionOld(OUTPUT, INPUT);
            });

        });

    });

    describe("SectionServices.insert()", () => {

        it("should fail on duplicate ordinal", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const INPUTS = await SectionServices.all(FACILITY.id);
            const INPUT = {
                ordinal: INPUTS[0].ordinal,
            }

            try {
                await SectionServices.insert(FACILITY.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("is already in use");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on empty input data", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const INPUT = {};

            try {
                await SectionServices.insert(FACILITY.id, INPUT);
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

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const INPUT = {
                ordinal: 9999,
                scope: "newscope",
                slug: "New Slug",
                title: "New Title",
            }

            const OUTPUT = await SectionServices.insert(FACILITY.id, INPUT);
            compareSectionNew(OUTPUT, INPUT);

        });

    });

    describe("SectionServices.remove()", () => {

        it("should fail on invalid facility ID", async () => {

            const INVALID_FACILITY_ID = -1;

            try {
                await SectionServices.remove(INVALID_FACILITY_ID, -1);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`facilityId: Missing Facility ${INVALID_FACILITY_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid section ID", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const INVALID_SECTION_ID = -1;

            try {
                await SectionServices.remove(FACILITY.id, INVALID_SECTION_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`sectionId: Missing Section ${INVALID_SECTION_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid section ID", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const INPUTS = await SectionServices.all(FACILITY.id);
            await SectionServices.remove(FACILITY.id, INPUTS[0].id);

            try {
                await SectionServices.remove(FACILITY.id, INPUTS[0].id);
                expect(`Should have thrown NotFound after remove`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`sectionId: Missing Section ${INPUTS[0].id}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

    });

    describe("SectionServices.update()", () => {

        it("should fail on duplicate ordinal", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const INPUTS = await SectionServices.all(FACILITY.id);
            const INPUT = {
                ordinal: INPUTS[1].ordinal,
            }

            try {
                await SectionServices.update(FACILITY.id, INPUTS[0].id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("is already in use");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid facility ID", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const INPUTS = await SectionServices.all(FACILITY.id);
            const INPUT = INPUTS[0];
            const INVALID_FACILITY_ID = -1;

            try {
                await SectionServices.update(INVALID_FACILITY_ID, INPUT.id, INPUT);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`facilityId: Missing Facility ${INVALID_FACILITY_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid section ID", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const INPUTS = await SectionServices.all(FACILITY.id);
            const INPUT = INPUTS[0];
            const INVALID_SECTION_ID = -1;

            try {
                await SectionServices.update(FACILITY.id, INVALID_SECTION_ID, INPUT);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`sectionId: Missing Section ${INVALID_SECTION_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on no changed data", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const INPUTS = await SectionServices.all(FACILITY.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await SectionServices.update(FACILITY.id, INPUT.id, INPUT);
                compareSectionOld(OUTPUT, INPUT);
            });

        });

        it("should pass on no updated data", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const INPUTS = await SectionServices.all(FACILITY.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await SectionServices.update(FACILITY.id, INPUT.id, {});
                compareSectionOld(OUTPUT, INPUT);
            });

        });

        it("should pass on valid updated data", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const INPUTS = await SectionServices.all(FACILITY.id);
            const INPUT = {
                active: !INPUTS[0].active,
                slug: "Updated Slug",
            }

            const OUTPUT = await SectionServices.update(FACILITY.id, INPUTS[0].id, INPUT);
            compareSectionOld(OUTPUT, INPUT);

        });


    });


});

// Helper Objects ------------------------------------------------------------

export function compareSectionNew(OUTPUT: Partial<Section>, INPUT: Partial<Section>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.facilityId).to.exist;
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.ordinal).to.equal(INPUT.ordinal ? INPUT.ordinal : OUTPUT.ordinal);
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
    expect(OUTPUT.slug).to.equal(INPUT.slug ? INPUT.slug : OUTPUT.slug);
    expect(OUTPUT.title).to.equal(INPUT.title ? INPUT.title : OUTPUT.title);
}

export function compareSectionOld(OUTPUT: Partial<Section>, INPUT: Partial<Section>) {
    expect(OUTPUT.id).to.equal(INPUT.id !== undefined ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.facilityId).to.exist;
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.ordinal).to.equal(INPUT.ordinal ? INPUT.ordinal : OUTPUT.ordinal);
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
    expect(OUTPUT.slug).to.equal(INPUT.slug ? INPUT.slug : OUTPUT.slug);
    expect(OUTPUT.title).to.equal(INPUT.title ? INPUT.title : OUTPUT.title);
}
