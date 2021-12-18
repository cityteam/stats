// Daily ---------------------------------------------------------------------

// Each row represents the daily data entries for each section, with arrays
// representing the corresponding category IDs and entered values (values
// might be null to indicate "no entry").

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Section from "./Section";
import {validateSectionId} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "dailies",
    timestamps: false,
    validate: {
        isSectionIdValid: async function (this: Daily): Promise<void> {
            if (!(await validateSectionId(this.sectionId))) {
                throw new BadRequest
                    (`sectionId: Missing Section ${this.sectionId}`)
            }
        },
        // TODO - Postgres does not allow declaring each categoryIds entry as an FK
    }
})
class Daily extends Model<Daily> {

    @Column({
        allowNull: false,
        field: "category_ids",
        type: DataType.ARRAY(DataType.INTEGER),
    })
    // Category IDs (within this Section) for recorded values
    categoryIds!: number[];

    @Column({
        allowNull: true,
        field: "category_values",
        type: DataType.ARRAY(DataType.NUMBER),
    })
    // Values (may be null) for each corresponding Category ID
    categoryValues!: (number | null)[];

    @Column({
        allowNull: false,
        field: "date",
        primaryKey: true,
        type: DataType.DATE,
        validate: {
            notNull: {
                msg: "date: Is required",
            }
        }
    })
    // Date for which these Category IDs and values are recorded
    date!: Date;

    @BelongsTo(() => Section, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Section this Daily entry belongs to
    section!: Section;

    @ForeignKey(() => Section)
    @Column({
        allowNull: false,
        field: "section_id",
        primaryKey: true,
        type: DataType.INTEGER,
        validate: {
            notNull: {
                msg: "sectionId: Is required",
            }
        }
    })
    // Section ID for which these Category IDs and values are recorded
    sectionId!: number;

}

export default Daily;
