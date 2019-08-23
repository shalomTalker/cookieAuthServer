const createError = require('http-errors');

module.exports = {
    notFoundRoute: (req, res, next) => {
        next(createError(404,'this page is not found , try again!'));
    },
    errorHandler: (err, req, res, next) => {
        if (err.isJoi) {
            err = createError(400, err.details[0].message)
            // res.status(400).json(err.details);
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            
            // // render the error page
            res.status(err.status || 500);
            res.render('error');
            return;
        }
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    },
    // middleware function to check for logged-in users
    sessionChecker: (req, res, next) => {
        if (!req.session.user && !req.cookies.user_sid) {
            return next(createError(401, 'Please login to view this page.'))
        }
        next();
    },
    checkRemainsCookies: (req, res, next) => {
        if (req.cookies.user_sid && !req.session.user) {
            res.clearCookie('user_sid');
        }
        next();
    }
}