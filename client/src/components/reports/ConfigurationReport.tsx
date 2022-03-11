// ConfigurationReport -------------------------------------------------------

// Report configuration of Sections and Categories for the current Facility.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import FacilityContext from "../facilities/FacilityContext";
import useFetchSections from "../../hooks/useFetchSections";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Component Details --------------------------------------------------------

const ConfigurationReport = () => {

    const facilityContext = useContext(FacilityContext);

    const fetchSections = useFetchSections({
        withCategories: true,
    });

    useEffect(() => {

        logger.debug({
            context: "ConfigurationReport.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
        });

    }, [facilityContext.facility]);

    return (
        <Container fluid id="ConfigurationReport">

            <Row className="mb-4 ms-1 me-1">
                <Col className="text-start">
                    <span><strong>Configuration Report for Facility:&nbsp;</strong></span>
                    <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                </Col>
                <Col className="text-end">
                    <span><strong>Report Date:&nbsp;</strong></span>
                    <span className="text-info">
                        <strong>{(new Date()).toLocaleString()}</strong>
                    </span>
                </Col>
            </Row>

            <Table
                bordered={true}
                size="sm"
            >

                <thead>
                    <tr className="table-dark">
                        <th className="text-center" colSpan={4}>SECTION</th>
                        <th className="text-center" colSpan={3}>CATEGORY</th>
                    </tr>
                    <tr className="table-secondary">
                        <th>Ordinal</th>
                        <th>Active</th>
                        <th>Slug</th>
                        <th>Scope</th>
                        <th>Ordinal</th>
                        <th>Active</th>
                        <th>Slug</th>
                    </tr>
                </thead>

                <tbody>
                {fetchSections.sections.map((section, si) => (
                    <>
                        {section.categories.map((category, ci) => (
                            <tr
                                className="table-default"
                                key={`CR-S${section.id}-C${category.id}-row`}
                            >
                                {(ci === 0) ? (
                                    <>
                                        <td
                                            key={`CR-S${section.id}-C${category.id}-sordinal`}
                                            rowSpan={section.categories.length}
                                        >
                                            {section.ordinal}
                                        </td>
                                        <td
                                            key={`CR-S${section.id}-C${category.id}-sactive`}
                                            rowSpan={section.categories.length}
                                        >
                                            {listValue(section.active)}
                                        </td>
                                        <td
                                            key={`CR-S${section.id}-C${category.id}-sslug`}
                                            rowSpan={section.categories.length}
                                        >
                                            {section.slug}
                                        </td>
                                        <td
                                            key={`CR-S${section.id}-C${category.id}-sscope`}
                                            rowSpan={section.categories.length}
                                        >
                                            {section.scope}
                                        </td>
                                    </>
                                ) : null }
                                <td key={`CR-S${section.id}-C${category.id}-cordinal`}>
                                    {category.ordinal}
                                </td>
                                <td key={`CR-S${section.id}-C${category.id}-cactive`}>
                                    {listValue(category.active)}
                                </td>
                                <td key={`CR-S${section.id}-C${category.id}-cslug`}>
                                    {category.slug}
                                </td>
                            </tr>
                        ))}
                    </>
                ))}
                </tbody>


            </Table>

        </Container>
    )


}

export default ConfigurationReport;
