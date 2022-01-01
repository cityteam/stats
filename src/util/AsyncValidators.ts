// AsyncValidators -----------------------------------------------------------

// Custom (to this application) validation methods that can only be used by
// server side applications, because they interact directly with the database.
// while "false" means it is not.  If a field is required, that must be
// validated separately.

// External Modules ----------------------------------------------------------

import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Category from "../models/Category";
import Facility from "../models/Facility";
import RefreshToken from "../models/RefreshToken";
import Section from "../models/Section";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const validateAccessTokenTokenUnique
    = async (accessToken: AccessToken): Promise<boolean> =>
{
    if (accessToken && accessToken.token) {
        let options: any = {
            where: {
                token: accessToken.token,
            }
        }
        if (accessToken.id && (accessToken.id > 0)) {
            options.where.id = { [Op.ne]: accessToken.id }
        }
        const results = await AccessToken.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateCategoryId = async (categoryId: number): Promise<boolean> => {
    if (categoryId) {
        const category = await Category.findByPk(categoryId);
        return (category !== null);
    } else {
        return true;
    }
}

export const validateCategoryOrdinalUnique
    = async (category: Category): Promise<boolean> =>
{
    if (category && category.sectionId && category.ordinal) {
        let options: any = {
            where: {
                ordinal: category.ordinal,
                sectionId: category.sectionId,
            }
        }
        if (category.id && (category.id > 0)) {
            options.where.id = { [Op.ne]: category.id }
        }
        const results = await Category.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateFacilityId = async (facilityId: number): Promise<boolean> => {
    if (facilityId) {
        const facility = await Facility.findByPk(facilityId);
        return (facility !== null);
    } else {
        return true;
    }
}

export const validateFacilityNameUnique
    = async (facility: Facility): Promise<boolean> =>
{
    if (facility && facility.name) {
        let options: any = {
            where: {
                name: facility.name,
            }
        }
        if (facility.id && (facility.id > 0)) {
            options.where.id = { [Op.ne]: facility.id }
        }
        const results = await Facility.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateFacilityScopeUnique
    = async (facility: Facility): Promise<boolean> =>
{
    if (facility && facility.scope) {
        let options: any = {
            where: {
                scope: facility.scope,
            }
        }
        if (facility.id && (facility.id > 0)) {
            options.where.id = { [Op.ne]: facility.id }
        }
        const results = await Facility.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateRefreshTokenTokenUnique
    = async (refreshToken: RefreshToken): Promise<boolean> =>
{
    if (refreshToken && refreshToken.token) {
        let options: any = {
            where: {
                token: refreshToken.token,
            }
        }
        if (refreshToken.id && (refreshToken.id > 0)) {
            options.where.id = { [Op.ne]: refreshToken.id }
        }
        const results = await RefreshToken.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateSectionId = async (sectionId: number): Promise<boolean> => {
    if (sectionId) {
        const section = await Section.findByPk(sectionId);
        return (section !== null);
    } else {
        return true;
    }
}

export const validateSectionOrdinalUnique
    = async (section: Section): Promise<boolean> =>
{
    if (section && section.facilityId && section.ordinal) {
        let options: any = {
            where: {
                facilityId: section.facilityId,
                ordinal: section.ordinal,
            }
        }
        if (section.id && (section.id > 0)) {
            options.where.id = { [Op.ne]: section.id }
        }
        const results = await Section.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateUserUsernameUnique
    = async (user: User): Promise<boolean> =>
{
    if (user && user.username) {
        let options = {};
        if (user.id && (user.id > 0)) {
            options = {
                where: {
                    id: {[Op.ne]: user.id},
                    username: user.username
                }
            }
        } else {
            options = {
                where: {
                    username: user.username
                }
            }
        }
        let results = await User.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

