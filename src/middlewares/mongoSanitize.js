/**
 * Custom Mongo Sanitize middleware for Express 5 compatibility.
 * Recursively removes keys starting with $ to prevent NoSQL injection.
 */
const sanitize = (obj) => {
    if (obj instanceof Object) {
        for (const key in obj) {
            if (key.startsWith('$')) {
                delete obj[key];
            } else if (obj[key] instanceof Object) {
                sanitize(obj[key]);
            }
        }
    }
    return obj;
};

const mongoSanitize = (req, res, next) => {
    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);
    if (req.query) sanitize(req.query);
    if (req.headers) sanitize(req.headers);
    next();
};

module.exports = mongoSanitize;
