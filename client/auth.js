let auth0 = null;
const configureClient = async() => {
    auth0 = await createAuth0Client({
        domain: "dev-2ww2gna5.eu.auth0.com",
        client_id: "nUmJe8gbEWzV1XpTdNDI5ZBW7t8RFgkd"
    });
};

window.onload = async() => {
    await configureClient()
    updateUI();

    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        // show the gated content
        return;
    }

    // NEW - check for the code and state parameters
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {

        // Process the login state
        try {
            await auth0.handleRedirectCallback();
        } catch (error) {
            console.log(error)
        }


        updateUI();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/");
    }
}

const login = async() => {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.origin
    });
}

const logout = async() => {
    auth0.logout({
        returnTo: window.location.origin
    });
}

const fullName = document.getElementById('full-name');
const avatar = document.getElementById('avatar');


const updateUI = async() => {
    const isAuthenticated = await auth0.isAuthenticated();

    document.getElementById("btn-login").style.visibility = isAuthenticated ? 'hidden' : 'visible';
    document.getElementById("btn-logout").style.visibility = isAuthenticated ? 'visible' : 'hidden';

    const { nickname, picture } = await auth0.getUser();
    if (nickname && picture) {
        fullName.innerHTML = nickname;
        avatar.src = picture;
        fullName.style.visibility = 'visible';
        avatar.style.visibility = 'visible';
    }
};