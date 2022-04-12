//try catch ghuma ke krenge
module.exports = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
};