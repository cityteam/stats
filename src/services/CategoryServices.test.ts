// CategoryServices.test -----------------------------------------------------

// Functional tests for CategoryServices.

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import CategoryServices from "./CategoryServices";
import Category from "../models/Category";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

const UTILS = new ServicesUtils();

// Test Specifications -------------------------------------------------------

describe("CategoryServices Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withCategories: true,
            withFacilities: true,
            withSections: true,
        });
    });

    // Test Methods ----------------------------------------------------------

    describe("CategoryServices.all()", () => {

        it("should pass on active Categories", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_SECOND);
            const OUTPUTS = await CategoryServices.all(SECTION.id, {
                active: "",
                sectionId: SECTION.id,
            });

            expect(OUTPUTS.length).to.be.greaterThan(0);
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.sectionId).to.equal(SECTION.id);
                expect(OUTPUT.active).to.be.true;
            });

        });

        it("should pass on all Categories", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_THIRD);
            const OUTPUTS = await CategoryServices.all(SECTION.id);

            expect(OUTPUTS.length).to.equal(SeedData.CATEGORIES.length);
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.sectionId).to.equal(SECTION.id);
            });

        });

        it("should pass on included parent", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_FIRST);
            const OUTPUTS = await CategoryServices.all(SECTION.id, {
                withSection: "",
            });

            expect(OUTPUTS.length).to.equal(SeedData.CATEGORIES.length);
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.section).to.exist;
                expect(OUTPUT.section.id).to.equal(SECTION.id);
            })

        });

        it("should pass on ordinaled Categories", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_SECOND);
            const ORDINAL = SeedData.CATEGORIES[0].ordinal;
            const OUTPUTS = await CategoryServices.all(SECTION.id, {
                ordinal: ORDINAL,
            });

            expect(OUTPUTS.length).to.equal(1)
            expect(OUTPUTS[0].ordinal).to.equal(ORDINAL);
            expect(OUTPUTS[0].sectionId).to.equal(SECTION.id);

        });

        it("should pass on paginated Categories", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_FIRST);
            const LIMIT = 1;
            const OFFSET = 1;
            const OUTPUTS = await CategoryServices.all(SECTION.id, {
                limit: LIMIT,
                offset: OFFSET,
            });

            expect(OUTPUTS.length).to.equal(LIMIT);

        });

    });

    describe("CategoryServices.exact", () => {

        it("should fail on invalid ordinal", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_SECOND);
            const INVALID_ORDINAL = 1234;

            try {
                await CategoryServices.exact(FACILITY.id, SECTION.id, INVALID_ORDINAL);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`ordinal: Missing Category ${INVALID_ORDINAL}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid section ID", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const INVALID_SECTION_ID = -1;

            try {
                await CategoryServices.exact(FACILITY.id, INVALID_SECTION_ID, -1);
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

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_SECOND);
            const INPUTS = await CategoryServices.all(SECTION.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await CategoryServices.exact(FACILITY.id, SECTION.id, INPUT.ordinal, {
                    withSection: "",
                });
                expect(OUTPUT.section).to.exist;
                expect(OUTPUT.section.id).to.equal(SECTION.id);
            });

        });

        it("should pass on valid ordinals", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_THIRD);
            const INPUTS = await CategoryServices.all(SECTION.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await CategoryServices.exact(FACILITY.id, SECTION.id, INPUT.ordinal);
                compareCategoryOld(OUTPUT, INPUT);
                expect(OUTPUT.sectionId).to.equal(INPUT.sectionId);
            });

        });

    });

    describe("CategoryServices.find()", () => {

        it("should fail on invalid category ID", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_SECOND);
            const INVALID_CATEGORY_ID = -1;

            try {
                await CategoryServices.find(SECTION.id, INVALID_CATEGORY_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`categoryId: Missing Category ${INVALID_CATEGORY_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid section ID", async () => {

            const INVALID_SECTION_ID = -1;

            try {
                await CategoryServices.find(INVALID_SECTION_ID, -1);
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
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_SECOND);
            const INPUTS = await CategoryServices.all(SECTION.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await CategoryServices.find(SECTION.id, INPUT.ordinal, {
                    withSection: "",
                });
                expect(OUTPUT.section).to.exist;
                expect(OUTPUT.section.id).to.equal(SECTION.id);
            });

        });

        it("should pass on valid IDs", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_SECOND);
            const INPUTS = await CategoryServices.all(SECTION.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await CategoryServices.find(SECTION.id, INPUT.ordinal);
                compareCategoryOld(OUTPUT, INPUT);
            });

        });

    });

});

// Helper Objects ------------------------------------------------------------

export function compareCategoryNew(OUTPUT: Partial<Category>, INPUT: Partial<Category>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.accumulated).to.equal(INPUT.accumulated !== undefined ? INPUT.accumulated : OUTPUT.accumulated);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.description).to.equal(INPUT.description ? INPUT.description : OUTPUT.description);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.ordinal).to.equal(INPUT.ordinal ? INPUT.ordinal : OUTPUT.ordinal);
    expect(OUTPUT.sectionId).to.exist;
    expect(OUTPUT.service).to.equal(INPUT.service ? INPUT.service : OUTPUT.service);
    expect(OUTPUT.slug).to.equal(INPUT.slug ? INPUT.slug : OUTPUT.slug);
}

export function compareCategoryOld(OUTPUT: Partial<Category>, INPUT: Partial<Category>) {
    expect(OUTPUT.id).to.equal(INPUT.id !== undefined ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.accumulated).to.equal(INPUT.accumulated !== undefined ? INPUT.accumulated : OUTPUT.accumulated);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.description).to.equal(INPUT.description ? INPUT.description : OUTPUT.description);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.ordinal).to.equal(INPUT.ordinal ? INPUT.ordinal : OUTPUT.ordinal);
    expect(OUTPUT.sectionId).to.exist;
    expect(OUTPUT.service).to.equal(INPUT.service ? INPUT.service : OUTPUT.service);
    expect(OUTPUT.slug).to.equal(INPUT.slug ? INPUT.slug : OUTPUT.slug);
}

