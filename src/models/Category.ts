// Category ------------------------------------------------------------------

// Definition of a statistical category for which daily values will be accumulated.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Section from "./Section";
import {
    validateSectionId,
    validateSectionOrdinalUnique
} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";
import Detail from "./Detail";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "categories",
    timestamps: false,
    validate: {
        isSectionIdValid: async function (this: Category): Promise<void> {
            if (!(await validateSectionId(this.sectionId))) {
                throw new BadRequest
                    (`sectionId: Missing Section ${this.sectionId}`);
            }
        },
        isOrdinalUnique: async function(this: Section): Promise<void> {
            if (!(await validateSectionOrdinalUnique(this))) {
                throw new BadRequest
                    (`Ordinal: Ordinal '${this.ordinal}' is already in use in this Section`);
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
                msg: "accumulated: Is required"
            }
        }
    })
    // Should daily values be accumulated on weekly/monthly/annual reports?
    // If false, only the final value will be reported
    accumulated!: boolean;

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
    // Description of this Category
    description?: string;

    @HasMany(() => Detail, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Details that are reported by this Category
    details!: Detail[];

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
        unique: "uniqueOrdinalWithinSection",
        validate: {
            notNull: {
                msg: "ordinal: Is required",
            },
        },
    })
    // Sort ordering for reports (presented in ascending order)
    ordinal!: number;

    @BelongsTo(() => Section, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Section this Category belongs to
    section!: Section;

    @ForeignKey(() => Section)
    @Column({
        allowNull: false,
        field: "section_id",
        type: DataType.INTEGER,
        unique: "uniqueOrdinalWithinSection",
        validate: {
            notNull: {
                msg: "sectionId: Is required",
            },
        },
    })
    // ID of the Section that owns this Category
    sectionId!: number;

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
    // Service name for this Category
    service!: string;

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
    // Abbreviated category description suitable for small input devices
    slug!: string;

}

export default Category;
