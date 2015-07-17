var roboDAO = require('../Daos/roboDao');

module.exports = function (app, passport) {

    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', isLoggedIn, function (req, res) {
        res.render('index');
    });

    app.get('/adm', function (req, res) {
        res.render('adm');
    });
    
    
    //Robo//
    app.get('/cadastrarrobo', function (req, res) {
        res.render('cadastrarrobo');
    });
    
    app.post('/cadastrarrobo', function (req, res) {        
        var retorno = roboDAO.cadastrar(req);
        console.log(retorno);
        res.render('cadastrarrobo');
    });
    
    
    app.get('/listarrobos', function (req, res) {
        var robos = roboDAO.listarRobos(function (robos) {
            console.log(robos);
            //console.log(robos)
            // res.render('listarrobos', { robo : robos })
           // req.flash('info', 'Flash is back!')
            // res.render('listarrobos.ejs', { message : req.flash('info') });
            //res.json({ {"message" : "legal"});
            //var resultado = { robos : robos };
            //res.send(resut)
            //res.render('listarrobos.ejs', robos)
            //res.render('listarrobos.ejs', resultado);
           // res.setHeader("Content-Type", "application/json");
           // res.write(JSN.stringify(robos));
           // res.end();
            //console.log("teste");
            // var message = 'message';
            res.render('listarrobos.ejs', { dados : robos })            
            

            ///res.render('listarrobos.ejs', 'message' );
            //res.render('listarrobos.ejs');
        });
        /*var drinks = [
            { name: 'Bloody Mary', drunkness: 3 },
            { name: 'Martini', drunkness: 5 },
            { name: 'Scotch', drunkness: 10 }
        ];
        var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
        console.log(drinks);
        res.render('listarrobos.ejs', { drinks : drinks });
        //console.log(robos);
        //res.render('listarrobos', { "robos" : robos });
       */
    });

    app.get('/signup', function (req, res) {
        res.render('signup', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });

    // show the login form
    app.get('/login', function (req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));



    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/login');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}
