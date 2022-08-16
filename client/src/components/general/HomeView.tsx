// HomeView ------------------------------------------------------------------

// Welcome page view.

// External Modules ----------------------------------------------------------

import React, {useContext} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";

// Component Details ---------------------------------------------------------

const HomeView = () => {

    const loginContext = useContext(LoginContext);

    return (
        <Container fluid id="HomeView">
            <p><strong>Welcome to the CityTeam Statistics Entry App!</strong></p>
            {(loginContext.data.loggedIn) ? (
                <>
                    <p>Welcome user <strong>{loginContext.data.username}</strong>!</p>
                    <p>Select the <strong>Entries</strong> link on the Navigation Bar
                        above to begin recording statistics.
                    </p>
                </>
            ) : (
                <p>Click the&nbsp;
                    <img src="/helptext/button-login-top.png" alt="Login Button"/>
                    &nbsp;button and fill in your username and password, to start.
                </p>
            )}
        </Container>
    )

}

export default HomeView;
