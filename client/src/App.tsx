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

import CategoryView from "./components/categories/CategoryView";
import EntriesView from "./components/entries/EntriesView";
import ExportView from "./components/reports/ExportView";
import FacilityView from "./components/facilities/FacilityView";
import HelpAdminCategories from "./components/help/HelpAdminCategories";
import HelpAdminFacilities from "./components/help/HelpAdminFacilities";
import HelpAdminSections from "./components/help/HelpAdminSections";
import HelpAdminUsers from "./components/help/HelpAdminUsers";
import HelpEnteringData from "./components/help/HelpEnteringData";
import HelpGettingStarted from "./components/help/HelpGettingStarted";
import HelpLoggingIn from "./components/help/HelpLoggingIn";
import HelpWelcome from "./components/help/HelpWelcome";
import HomeView from "./components/general/HomeView";
import Navigation from "./components/general/Navigation";
import ConfigurationReport from "./components/reports/ConfigurationReport";
import MonthlyReport from "./components/reports/MonthlyReport";
import YearlyReport from "./components/reports/YearlyReport";
import SectionView from "./components/sections/SectionView";
import UserView from "./components/users/UserView";
import {FacilityContextProvider} from "./components/facilities/FacilityContext";
import {LoginContextProvider} from "./components/login/LoginContext";
import logger from "./util/ClientLogger";
import HelpAdminOverview from "./components/help/HelpAdminOverview";

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
                              <Route path="admin-categories" element={<CategoryView/>}/>
                              <Route path="admin-facilities" element={<FacilityView/>}/>
                              <Route path="admin-sections" element={<SectionView/>}/>
                              <Route path="admin-users" element={<UserView/>}/>
                              <Route path="entries" element={<EntriesView/>}/>
                              <Route path="export" element={<ExportView/>}/>
                              <Route path="help" element={<HelpWelcome/>}/>
                              <Route path="help-admin-categories" element={<HelpAdminCategories/>}/>
                              <Route path="help-admin-facilities" element={<HelpAdminFacilities/>}/>
                              <Route path="help-admin-overview" element={<HelpAdminOverview/>}/>
                              <Route path="help-admin-sections" element={<HelpAdminSections/>}/>
                              <Route path="help-admin-users" element={<HelpAdminUsers/>}/>
                              <Route path="help-entering-data" element={<HelpEnteringData/>}/>
                              <Route path="help-getting-started" element={<HelpGettingStarted/>}/>
                              <Route path="help-logging-in" element={<HelpLoggingIn/>}/>
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
