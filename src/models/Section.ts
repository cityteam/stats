// Section -------------------------------------------------------------------

// Grouping of Categories that are presented separately, underneath the
// Section title.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import Daily from "./Daily";
import Facility from "./Facility";
import {validateFacilityId, validateSectionOrdinalUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "sections",
    timestamps: false,
    validate: {
        isFacilityIdValid: async function (this: Section): Promise<void> {
            if (!(await validateFacilityId(this.facilityId))) {
                throw new BadRequest
                (`facilityId: Missing Facility ${this.facilityId}`);
            }
        },
        isOrdinalUnique: async function(this: Section): Promise<void> {
            if (!(await validateSectionOrdinalUnique(this))) {
                throw new BadRequest
                (`ordinal: Ordinal '${this.ordinal}' is already in use in this Facility`);
            }
        }
    },
    version: false,
})
class Section extends Model<Section> {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER
    })
    // Primary key for this Section
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
    // Is this Section active?
    active!: boolean;

    @HasMany(() => Category)
    // Categories that are reported in this Section
    categories!: Category[];

    @HasMany(() => Daily)
    // Dailies reported for this Section
    dailies!: Daily[];

    @BelongsTo(() => Facility, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Facility this Section belongs to
    facility!: Facility;

    @ForeignKey(() => Facility)
    @Column({
        allowNull: false,
        field: "facility_id",
        type: DataType.INTEGER,
        unique: "uniqueOrdinalWithinFacility",
        validate: {
            notNull: {
                msg: "facilityId: Is required",
            },
        },
    })
    // ID of the Facility that owns this Section
    facilityId!: number;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.TEXT
    })
    // General notes about this Section
    notes?: string;

    @Column({
        allowNull: false,
        field: "ordinal",
        type: DataType.INTEGER,
        unique: "uniqueOrdinalWithinFacility",
        validate: {
            notNull: {
                msg: "ordinal: Is required",
            },
        },
    })
    // Sort ordering for reports (presented in ascending order)
    ordinal!: number;

    @Column({
        allowNull: false,
        defaultValue: "regular",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "scope: Is required",
            },
        },
    })
    // Permission scope suffix for this Section
    scope!: string;

    @Column({
        allowNull: false,
        field: "slug",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "slug: Is required",
            },
        },
    })
    // Abbreviated title suitable for small input devices
    slug!: string;

    @Column({
        allowNull: false,
        field: "title",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "title: Is required",
            },
        },
    })
    // Formal title of this Section
    title!: string;

}

export default Section;
