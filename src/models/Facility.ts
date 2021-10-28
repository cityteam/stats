// Facility ------------------------------------------------------------------

// A CityTeam facility with statistics collected by this application.

// External Modules ----------------------------------------------------------

import {Column, DataType, HasMany, Model, Table}
    from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import {
    validateFacilityNameUnique,
    validateFacilityScopeUnique
} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "facilities",
    timestamps: false,
    validate: {
        isNameUnique: async function(this: Facility): Promise<void> {
            if (!(await validateFacilityNameUnique(this))) {
                throw new BadRequest(`name: Name '${this.name}' is already in use`);
            }
        },
        isScopeUnique: async function(this: Facility): Promise<void> {
            if (!(await validateFacilityScopeUnique(this))) {
                throw new BadRequest(`scope: Scope '${this.scope}' is already in use`);
            }
        },
    },
    version: false,
})
class Facility extends Model<Facility> {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER
    })
    // Primary key for this Facility
    id!: number;

    @Column({
        allowNull: false,
        defaultValue: true,
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "active: Is required"
            }
        }
    })
    // Is this Facility active?
    active!: boolean;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    // First line of Facility address
    address1?: string;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    // Second line of Facility address
    address2?: string;

    @HasMany(() => Category, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    // Defined Categories for this Facility
    categories!: Category[];

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    // City for this Facility
    city?: string;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    // Email address for this Facility
    email?: string;

    @Column({
        allowNull: false,
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "name: Is required",
            }
        }
    })
    // Globally unique name of this Facility
    name!: string;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    phone?: string;

    @Column({
        allowNull: false,
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "scope: Is required",
            }
        }
    })
    // Permission scope prefix for this Facility
    scope!: string;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    // State for this Facility
    state?: string;

    @Column({
        allowNull: true,
        field: "zipcode",
        type: DataType.TEXT,
    })
    // Zip Code for this Facility
    zipCode?: string;

}

export default Facility;
