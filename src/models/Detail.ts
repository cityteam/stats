// Detail --------------------------------------------------------------------

// Detail statistic for a specific Category (and its associated Section
// and Facility) on a specific date.

// External Modules ---------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import {validateCategoryId} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

// TODO - uniqueness on categoryId + date???

@Table({
    tableName: "details",
    timestamps: false,
    validate: {
        isCategoryIdValid: async function (this: Detail): Promise<void> {
            if (!(await validateCategoryId(this.categoryId))) {
                throw new BadRequest
                    (`categoryId: Missing Category ${this.categoryId}`);
            }
        }
    }
})
class Detail extends Model<Detail> {

    id!: number;

    @BelongsTo(() => Category, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Category this Detail belongs to
    category!: Category;

    @ForeignKey(() => Category)
    @Column({
        allowNull: false,
        field: "category_id",
        type: DataType.INTEGER,
        validate: {
            notNull: {
                msg: "categoryId: Is required",
            },
        },
    })
    // ID of the Category this value was recorded for
    categoryId!: number;

    @Column({
        allowNull: false,
        field: "date",
        type: DataType.DATE,
        validate: {
            notNull: {
                msg: "date: Is required",
            },
        },
    })
    // Date (YYYY-MM-DD) this value was recorded for
    date!: Date;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.TEXT,
    })
    // Miscellaneous notes about this Detail
    notes?: string;

    @Column({
       allowNull: true,
       field: "value",
       type: DataType.NUMBER,
    })
    // Recorded value for this Category (and Facility) on this date
    value?: number;

}

export default Detail;
