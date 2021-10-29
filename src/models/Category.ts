// Category ------------------------------------------------------------------

// Category ("Header" or "Detail") defining a row of statistics for the
// specified Facility, and (for detail rows) the specified Date.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Detail from "./Detail";
import Facility from "./Facility";
import {validateCategoryType} from "../util/ApplicationValidators";
import {validateCategoryOrdinalUnique, validateFacilityId} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "categories",
    timestamps: false,
    validate: {
        isFacilityIdValid: async function (this: Category): Promise<void> {
            if (!(await validateFacilityId(this.facilityId))) {
                throw new BadRequest
                    (`facilityId: Missing Facility ${this.facilityId}`);
            }
        },
        isOrdinalUnique: async function(this: Category): Promise<void> {
            if (!(await validateCategoryOrdinalUnique(this))) {
                throw new BadRequest
                    (`Ordinal: Ordinal '${this.ordinal}' is already in use in this Facility`);
            }
        }
    },
    version: false,
})
class Category extends Model<Category> {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER
    })
    // Primary key for this Category
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
    // Is this Category active?
    active!: boolean;

    @Column({
        allowNull: true,
        field: "description",
        type: DataType.TEXT,
    })
    // Description of this Category (required when type === "Detail")
    description?: string;

    @HasMany(() => Detail)
    details!: Detail[];

    @BelongsTo(() => Facility, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Facility this Category belongs to
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
    // ID of the Facility that owns this Category
    facilityId!: number;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.TEXT
    })
    // General notes about this Category
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
        field: "service",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "service: Is required",
            },
        },
    })
    // Header (for type==="Header") or service description (for type==="Detail")
    service!: string;

    @Column({
        allowNull: true,
        field: "slug",
        type: DataType.TEXT,
    })
    // Abbreviated category description suitable for small input devices
    slug!: string;

    @Column({
        allowNull: false,
        field: "type",
        type: DataType.TEXT,
        validate: {
            isValidType: function (value: string): void {
                if (!validateCategoryType(value)) {
                    throw new BadRequest(`type: Invalid type '${value}'`);
                }
            },
            notNull: {
                msg: "type: Is required",
            },
        },
    })
    // Category row type ("Header" or "Detail")
    type!: string;

}

export default Category;
