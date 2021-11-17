// FacilityServices ----------------------------------------------------------

// Services implementation for Facility models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import BaseParentServices from "./BaseParentServices";
import Category from "../models/Category";
import Facility from "../models/Facility";
import Section from "../models/Section";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";
import {NotFound} from "../util/HttpErrors";
import StandardCategories from "../util/StandardCategories.json";
import StandardSections from "../util/StandardSections.json";
import SectionServices from "./SectionServices";

// Public Classes ------------------------------------------------------------

class FacilityServices extends BaseParentServices<Facility> {

    constructor () {
        super(Facility, SortOrder.FACILITIES, [
            "active",
            "address1",
            "address2",
            "city",
            "email",
            "name",
            "phone",
            "scope",
            "state",
            "zipCode",
        ]);
    }

    // Model-Specific Methods ------------------------------------------------

    public async exact(name: string, query?: any): Promise<Facility> {
        const options: FindOptions = this.appendIncludeOptions({
            where: { name: name }
        }, query);
        const result = await Facility.findOne(options);
        if (result) {
            return result;
        } else {
            throw new NotFound(
                `name: Missing Facility '${name}'`,
                "FacilityServices.exact");
        }
    }

    // Populate Sections and Categories for this Facility (MUST have none first)
    public async populate(facilityId: number): Promise<Category[]> {

        // Populate Sections and save Section IDs
        const sectionsIn: Partial<Section>[] = [];
        StandardSections.forEach(standardSection => {
            sectionsIn.push({
                ...standardSection,
                facilityId: facilityId,
            });
        });
        const sectionsOut = await Section.bulkCreate(sectionsIn as Section[]);
        const sectionIds: Map<number, number> = new Map<number, number>(); // ordinal->id
        sectionsOut.forEach(section => {
            sectionIds.set(section.ordinal, section.id);
        });

        // Populate Categories and set Section IDs
        const categoriesIn: Partial<Category>[] = [];
        StandardCategories.forEach(standardCategory => {
            categoriesIn.push({
                ...standardCategory,
                sectionId: sectionIds.get(standardCategory.sectionId)
            });
        });
        const categoriesOut = await Category.bulkCreate(categoriesIn as Category[]);
        return categoriesOut;

    }

    public async sections(facilityId: number, query?: any): Promise<Section[]> {
        const facility = await this.read("FacilityServices.sections", facilityId);
        const options: FindOptions = SectionServices.appendMatchOptions({
            order: SortOrder.SECTIONS,
        }, query);
        return await facility.$get("sections", options);
    }

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withSections                   Include child Sections
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withSections) {
            include.push(Section);
        }
        if (include.length > 0) {
            options.include = include;
        };
        return options;
    }

    /**
     * Support match query parameters:
     * * active                         Select active Facilities
     * * name={wildcard}                Select Facilities with name matching {wildcard}
     * * scope={scope}                  Select Facilities with scope equalling {scope}
     */
    public appendMatchOptions(options: FindOptions, query?: any): FindOptions {
        options = this.appendIncludeOptions(options, query);
        if (!query) {
            return options;
        }
        const where: any = options.where ? options.where : {};
        if ("" === query.active) {
            where.active = true
        }
        if (query.name) {
            where.name = { [Op.iLike]: `%${query.name}'`};
        }
        if (query.scope) {
            where.scope = query.scope;
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }
}

export default new FacilityServices();
