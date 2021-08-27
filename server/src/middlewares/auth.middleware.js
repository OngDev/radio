const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

const checkJwt = jwt({
	// Dynamically provide a signing key
	// based on the kid in the header and
	// the signing keys provided by the JWKS endpoint.
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://YOUR_DOMAIN/.well-known/jwks.json`,
	}),

	// Validate the audience and the issuer.
	audience: 'YOUR_API_IDENTIFIER',
	issuer: [`https://YOUR_DOMAIN/`],
	algorithms: ['RS256'],
});

const checkScopes = jwtAuthz(['read:messages']);

module.exports = { checkJwt, checkScopes };
