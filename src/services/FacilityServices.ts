// FacilityServices ----------------------------------------------------------

// Services implementation for Facility models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import BaseParentServices from "./BaseParentServices";
import Category from "../models/Category";
import Facility from "../models/Facility";
import Section from "../models/Section";
import User from "../models/User";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";
import {NotFound} from "../util/HttpErrors";
import StandardCategories from "../util/StandardCategories.json";
import StandardSections from "../util/StandardSections.json";
import SectionServices from "./SectionServices";
import UserServices from "./UserServices";

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
        return Category.bulkCreate(categoriesIn as Category[]);

    }

    public async sections(facilityId: number, query?: any): Promise<Section[]> {
        const facility = await this.read("FacilityServices.sections", facilityId);
        const options: FindOptions = SectionServices.appendMatchOptions({
            order: SortOrder.SECTIONS,
        }, query);
        return facility.$get("sections", options);
    }

    /**
     * Return all users whose scope includes a scope value that starts with
     * the scope prefix for this Facility.
     *
     * @param facilityId                ID of this Facility
     * @param query                     Optional query options
     */
    public async users(facilityId: number, query?: any): Promise<User[]> {
        const facility = await this.read("FacilityServices.users", facilityId);
        const pattern = `${facility.scope}`;
        const results = await UserServices.all();
        const users: User[] = [];
        results.forEach(result => {
            let match = false;
            const alloweds = result.scope.split(" ");
            alloweds.forEach(allowed => {
                if (allowed.startsWith(pattern)) {
                    match = true;
                }
            });
            if (match) {
                users.push(result);
            }
        })
        return users;
    }

    public async usersExact(facilityId: number, username: string, query?: any): Promise<User> {
        await this.read("FacilityServices.usersExact", facilityId);
        return UserServices.exact(username, query);
    }

    public async usersInsert(facilityId: number, user: User): Promise<User> {
        await this.read("FacilityServices.usersInsert", facilityId);
        return await UserServices.insert(user);
    }

    public async usersRemove(facilityId: number, userId: number): Promise<User> {
        await this.read("FacilityServices.usersRemove", facilityId);
        return await UserServices.remove(userId);
    }

    public async usersUpdate(facilityId: number, userId: number, user: User): Promise<User> {
        await this.read("FacilityServices.usersUpdate", facilityId);
        return await UserServices.update(userId, user);
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
        }
        return options;
    }

    /**
     * Support match query parameters:
     * * active                         Select active Facilities
     * * facilityIds                    Comma-delimited list of Facility IDs to select
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
        if (query.facilityIds && (query.facilityIds.length > 0)) {
            console.log("FACILITY IDS:", query.facilityIds);
            const facilityIds: string[] = query.facilityIds.split(",");
            where.id = { [Op.in]: facilityIds }
        }
        if (query.name) {
            where.name = { [Op.iLike]: `%${query.name}%` };
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
