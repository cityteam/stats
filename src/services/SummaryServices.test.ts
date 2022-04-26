// SummaryServices.test ------------------------------------------------------

// Functional Tests for SummaryServices.

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;
import {Months} from "@craigmcc/shared-utils";

// Internal Modules ----------------------------------------------------------

import SectionServices from "./SectionServices";
import SummaryServices from "./SummaryServices";
import Summary from "../models/Summary";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";

const UTILS = new ServicesUtils();

// Test Specifications -------------------------------------------------------

describe("SummaryServices Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withCategories: true,
            withFacilities: true,
            withSections: true,
        });
    });

    // Test Methods ----------------------------------------------------------

    describe("SummaryServices.dailies()", () => {

        it("can record and receive daily Summaries", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_THIRD);
            const CATEGORIES = await SectionServices.categories(FACILITY.id, SECTION.id);
            const DATE1 = "2020-07-04";
            const DATE2 = "2020-07-05";
            const DATE_FROM = Months.start("2020-07");
            const DATE_TO = Months.end("2020-07");
            const INPUTS: Map<string, Summary> = new Map();
            INPUTS.set(DATE1, {
                date: DATE1,
                sectionId: SECTION.id,
                values: {
                    [CATEGORIES[0].id]: 11,
                    [CATEGORIES[1].id]: 22,
                    [CATEGORIES[2].id]: 33,
                },
            });
            INPUTS.set(DATE2, {
                date: DATE2,
                sectionId: SECTION.id,
                values: {
                    [CATEGORIES[0].id]: 44,
                    [CATEGORIES[1].id]: 55,
                    [CATEGORIES[2].id]: 66,
                },
            });
            for (const INPUT of INPUTS.values()) {
                await SummaryServices.write(FACILITY.id, SECTION.id, INPUT.date, INPUT);
            }

            const OUTPUTS = await SummaryServices.dailies(FACILITY.id, DATE_FROM, DATE_TO, false);
            expect(OUTPUTS.length).to.equal(INPUTS.size);
            OUTPUTS.forEach(OUTPUT => {
                const INPUT = INPUTS.get(OUTPUT.date);
                if (INPUT) {
                    compareSummary(OUTPUT, INPUT);
                } else {
                    expect.fail(`Could not find INPUT for date '${OUTPUT.date}'`);
                }
            });

        });

    });

    describe("SummaryServices.monthlies()", () => {

        it("can record and receive monthly Summaries", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_SECOND);
            const CATEGORIES = await SectionServices.categories(FACILITY.id, SECTION.id);
            const DATE1 = "2020-07-04";
            const DATE2 = "2020-07-05";
            const DATE_FROM = Months.start("2020-07");
            const DATE_TO = Months.end("2020-07");
            const INPUTS: Map<string, Summary> = new Map();
            INPUTS.set(DATE1, {
                date: DATE1,
                sectionId: SECTION.id,
                values: {
                    [CATEGORIES[0].id]: 11,
                    [CATEGORIES[1].id]: 22,
                    [CATEGORIES[2].id]: 33,
                },
            });
            INPUTS.set(DATE2, {
                date: DATE2,
                sectionId: SECTION.id,
                values: {
                    [CATEGORIES[0].id]: 44,
                    [CATEGORIES[1].id]: 55,
                    [CATEGORIES[2].id]: 66,
                },
            });
            for (const INPUT of INPUTS.values()) {
                await SummaryServices.write(FACILITY.id, SECTION.id, INPUT.date, INPUT);
            }

            const OUTPUTS = await SummaryServices.monthlies(FACILITY.id, DATE_FROM, DATE_TO, false);
            expect(OUTPUTS.length).to.equal(1);
            const INPUT: Summary = {
                date: DATE_FROM,
                sectionId: SECTION.id,
                values: {
                    [CATEGORIES[0].id]: 11 + 44,
                    [CATEGORIES[1].id]: 22 + 55,
                    [CATEGORIES[2].id]: 33 + 66,
                }
            }
            compareSummary(OUTPUTS[0], INPUT);

        });

    });

    describe("SummaryServices.write()", () => {

        it("can overwrite a previous Summary", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_THIRD);
            const CATEGORIES = await SectionServices.categories(FACILITY.id, SECTION.id);
            const INPUT1: Summary = {
                date: "2020-07-04",
                sectionId: SECTION.id,
                values: {
                    [CATEGORIES[0].id]: 11,
                    [CATEGORIES[1].id]: null,
                    [CATEGORIES[2].id]: 33,
                }
            }
            const OUTPUT1 = await SummaryServices.write(FACILITY.id, SECTION.id, INPUT1.date, INPUT1);
            compareSummary(OUTPUT1, INPUT1);

            const INPUT2: Summary = {
                date: INPUT1.date,
                sectionId: INPUT1.sectionId,
                values: {
                    [CATEGORIES[0].id]: 44,
                    [CATEGORIES[1].id]: 55,
                    [CATEGORIES[2].id]: 66,
                }
            }
            const OUTPUT2 = await SummaryServices.write(FACILITY.id, SECTION.id, INPUT2.date, INPUT2);
            compareSummary(OUTPUT2, INPUT2);

        });

        it("can write a particular Summary", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_FIRST);
            const CATEGORIES = await SectionServices.categories(FACILITY.id, SECTION.id);
            const INPUT: Summary = {
                date: "2020-07-04",
                sectionId: SECTION.id,
                values: {
                    [CATEGORIES[0].id]: 11,
                    [CATEGORIES[1].id]: null,
                    [CATEGORIES[2].id]: 33,
                }
            }

            const OUTPUT = await SummaryServices.write(FACILITY.id, SECTION.id, INPUT.date, INPUT);
            compareSummary(OUTPUT, INPUT);

        });

        it("can write and then read a particular Summary", async () => {

            const FACILITY = await UTILS.lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const SECTION = await UTILS.lookupSection(FACILITY, SeedData.SECTION_ORDINAL_SECOND);
            const CATEGORIES = await SectionServices.categories(FACILITY.id, SECTION.id);
            const INPUT: Summary = {
                date: "2020-07-04",
                sectionId: SECTION.id,
                values: {
                    [CATEGORIES[0].id]: 44,
                    [CATEGORIES[1].id]: null,
                    [CATEGORIES[2].id]: 66,
                }
            }

            await SummaryServices.write(FACILITY.id, SECTION.id, INPUT.date, INPUT);
            const OUTPUT = await SummaryServices.read(FACILITY.id, SECTION.id, INPUT.date);
            compareSummary(OUTPUT, INPUT);

        });

    });

});

// Helper Objects ------------------------------------------------------------

export function compareSummary(OUTPUT: Partial<Summary>, INPUT: Partial<Summary>) {
    expect(OUTPUT.date).to.equal(INPUT.date);
    expect(OUTPUT.sectionId).to.equal(INPUT.sectionId);
    // For some reason, Sequelize is return output values as number:string|null
    // instead of the input values which are number:number|null.  Compare manually.
    // @ts-ignore
    if (INPUT.values) {
        for (const [key] of Object.entries(INPUT.values)) {
            // @ts-ignore
            const inputValue = INPUT.values[key];
            // @ts-ignore
            let outputValue = OUTPUT.values[key];
            if (outputValue && (typeof outputValue === "string")) {
                outputValue = Number(outputValue);
            }
            expect(outputValue).to.equal(inputValue);
        }
    }
}

