// App -----------------------------------------------------------------------

// Overall implementation of the entire client application.

// External Modules ----------------------------------------------------------

import React, {lazy, Suspense} from 'react';
import {isMobile, useMobileOrientation} from "react-device-detect";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Internal Modules ----------------------------------------------------------

import CategorySegment from "./components/categories/CategorySegment";
import EntriesView from "./components/entries/EntriesView";
import ExportView from "./components/reports/ExportView";
import FacilitySegment from "./components/facilities/FacilitySegment";
import HomeView from "./components/general/HomeView";
import Navigation from "./components/general/Navigation";
import ConfigurationReport from "./components/reports/ConfigurationReport";
import MonthlyReport from "./components/reports/MonthlyReport";
import YearlyReport from "./components/reports/YearlyReport";
import SectionSegment from "./components/sections/SectionSegment";
import UserSegment from "./components/users/UserSegment";
import {FacilityContextProvider} from "./components/facilities/FacilityContext";
import {LoginContextProvider} from "./components/login/LoginContext";
import logger from "./util/ClientLogger";

// Apache ECharts is a pure ESM module, which Jest has problems with,
// so do not import the modules using it when in test mode.
const MonthlyChart = lazy(() => import("./components/reports/MonthlyChart"));
const YearlyChart = lazy(() => import("./components/reports/YearlyChart"));
const notTestMode = "test" !== process.env.NODE_ENV;

function App () {

    const {isLandscape} = useMobileOrientation();
    logger.info({
        context: "App.index",
        isLandscape: isLandscape,
        isMobile: isMobile,
        userAgent: window.navigator.userAgent,
    });

    return (
      <>
          <ToastContainer
              autoClose={5000}
              closeOnClick={true}
              draggable={false}
              hideProgressBar={false}
              newestOnTop={false}
              position="top-right"
              theme="colored"
          />
          <LoginContextProvider>
              <FacilityContextProvider>
                  <Router>
                      <Routes>
                          <Route path="/" element={<Navigation/>}>
                              <Route path="admin-categories" element={<CategorySegment/>}/>
                              <Route path="admin-facilities" element={<FacilitySegment/>}/>
                              <Route path="admin-sections" element={<SectionSegment/>}/>
                              <Route path="admin-users" element={<UserSegment/>}/>
                              <Route path="entries" element={<EntriesView/>}/>
                              <Route path="export" element={<ExportView/>}/>
                              {(notTestMode) ? (
                                  <Route path="chart-month" element={
                                      <Suspense fallback={<div>Loading MonthlyChart</div>}>
                                        <MonthlyChart/>
                                      </Suspense>
                                  }/>
                              ) : null }
                              {(notTestMode) ? (
                                  <Route path="chart-year" element={
                                      <Suspense fallback={<div>Loading YearlyChart</div>}>
                                          <YearlyChart/>
                                      </Suspense>
                                  }/>
                              ) : null }
                              <Route path="report-configuration" element={<ConfigurationReport/>}/>
                              <Route path="report-month" element={<MonthlyReport/>}/>
                              <Route path="report-year" element={<YearlyReport/>}/>
                              <Route path="" element={<HomeView/>}/>
                          </Route>
                      </Routes>
                  </Router>
              </FacilityContextProvider>
          </LoginContextProvider>
      </>
  );
}

export default App;
