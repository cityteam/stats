// EChart --------------------------------------------------------------------

// React component that wraps an Apache Echarts chart instance.

// Based on this article:
//   https://dev.to/maneetgoyal/using-apache-echarts-with-react-and-typescript-optimizing-bundle-size-29l8

// External Modules ----------------------------------------------------------

import React, {CSSProperties, useEffect, useRef} from "react";
import Container from "react-bootstrap/Container";

// ----- Required EChart Components ------------------------------------------

import { CanvasRenderer } from "echarts/renderers";
import { init, getInstanceByDom, use } from "echarts/core";
import { /*HeatmapChart,*/ ScatterChart, LineChart, /*GraphChart,*/ BarChart } from "echarts/charts";
import {
    LegendComponent,
    GridComponent,
    TooltipComponent,
    ToolboxComponent,
    //VisualMapComponent,
    TitleComponent,
    DataZoomComponent,
} from "echarts/components";
import type { ECharts, ComposeOption, SetOptionOpts } from "echarts/core";
import type {
    BarSeriesOption,
    LineSeriesOption,
    ScatterSeriesOption,
} from "echarts/charts";
import type { TitleComponentOption, GridComponentOption } from "echarts/components";

// ----- Register EChart Components ------------------------------------------

use([
    LegendComponent,
    ScatterChart,
    LineChart,
    BarChart,
    GridComponent,
    TooltipComponent,
    TitleComponent,
    ToolboxComponent, // A group of utility tools, which includes export, data view, dynamic type switching, data area zooming, and reset.
    DataZoomComponent, // Used in Line Graph Charts
    CanvasRenderer, // If you only need to use the canvas rendering mode, the bundle will not include the SVGRenderer module, which is not needed.
]);

// ----- Create Combined Option Type -----------------------------------------

export type EChartsOption = ComposeOption<
    | BarSeriesOption
    | LineSeriesOption
    | TitleComponentOption
    | GridComponentOption
    | ScatterSeriesOption
    >;

// Incoming Properties -------------------------------------------------------

export interface Props {
    option: EChartsOption;
    style?: CSSProperties;
    settings?: SetOptionOpts;
    loading?: boolean;
    theme?: "light" | "dark";
}

// Component Details ---------------------------------------------------------

const EChart = (props: Props) => {

    const chartRef = useRef<HTMLDivElement>(null);
/*
    const style: CSSProperties = props.style
        ? props.style
        : {width: "100%", height: "600px"};
*/

    useEffect(() => {
        // Initialize chart
        let chart: ECharts | undefined;
        if (chartRef.current !== null) {
            chart = init(chartRef.current, props.theme);
        }

        // Add chart resize listener
        // ResizeObserver is leading to a bit janky UX
        function resizeChart() {
            chart?.resize();
        }
        window.addEventListener("resize", resizeChart);

        // Return cleanup function
        return () => {
            chart?.dispose();
            window.removeEventListener("resize", resizeChart);
        };
    }, [props.theme]);

    useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            chart?.setOption(props.option, props.settings);
        }
    }, [props.option, props.settings, props.theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

    useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            props.loading === true ? chart?.showLoading() : chart?.hideLoading();
        }
    }, [props.loading, props.theme]);

    return (
        <Container fluid>
            <div ref={chartRef} style={{ width: "100%", ...props.style }}/>
        </Container>
    )

}

export default EChart;
