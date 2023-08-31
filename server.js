import  express  from 'express';
import passport  from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import expressSession from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

passport.use(
  new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/google',
  }, (accessToken, refreshToken, profile, callback) => {
    callback(null, profile)
  })),

  passport.use(
    new FacebookStrategy({
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: '/facebook',
      profileFields: ['email', 'displayName', 'name', 'picture' ]
    }, (accessToken, refreshToken, profile, callback) => {
      callback(null, profile)
    }),
  )

  passport.serializeUser((user, callback) => {
    callback(null, user)
  })

  passport.deserializeUser((user, callback) => {
    callback(null, user)
  })

  app.use(expressSession({
    secret: 'recipeshub',
    resave: true,
    saveUninitialized: true,
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  // Define routes for login
  app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

  app.get('/google', passport.authenticate('google'), (req, res) => {
    res.redirect('/');
  });

  app.get('/facebook', passport.authenticate('facebook'), (req, res) => {
    res.redirect('/');
  })

  // Logout
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // Default routes
  app.get('/', (req, res) => {
    res.send(req.user ? req.user : 'Not logged in; login with Google, Facebook or Linkedin')
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
