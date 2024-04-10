const allowedOrigins = require('./AllowedOrigins');

// const CorsOptions = {
//     origin: (origin, callback) => {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 200
// }


const CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

module.exports = CorsOptions;