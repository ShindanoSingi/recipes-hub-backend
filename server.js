const express = require('express');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { Strategy: GitHubStrategy } = require('passport-github2');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const User = require('./models/userModel');
const db = require('./config/dbconfig');

// Connect to MongoDB
const usersRoute = require('./routes/userRoutes');

app.use(express.json());
app.use(cors());

const server = require('http').createServer(app);

  passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, callback, req, res) {
      // console.log('profile', profile)
      try {
        const user = await User.findOne({
          accountId: profile.id,
          provider: 'google',
        });
        if(user){
          console.log('user exists', user)
          return callback(null, profile)
        }

        if (!user) {
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            provider: profile.provider,
            accountId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            username: profile.name.givenName,
          })
          await newUser.save();
          console.log('Adding a new user:', newUser);
          return callback(null, profile.name)
        }
      } catch (error) {
        return callback(null, profile)
      }
    })
  )

  passport.use(
    new FacebookStrategy({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['emails', 'displayName', 'name', 'picture']
    },

      async function (accessToken, refreshToken, profile, callback, res, req) {
        console.log('profile', profile)
        try {
          const user = await User.findOne({
            accountId: profile.id,
            provider: 'facebook',
          });

          console.log('user', user)

          if (!user) {
            const newUser = new User({
              name: profile.displayName,
              // email: profile.emails[0].value,
              picture: profile.photos[0].value,
              provider: profile.provider,
              accountId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              username: profile.name.givenName,
            })
            await newUser.save();
            console.log(`Added new user ${newUser}`)
            return callback(null, profile)
          }
        } catch (error) {
          return callback(null, profile)
        }
      }))

      // passport.use(
      //   new GitHubStrategy({
      //   clientID: process.env.GITHUB_CLIENT_ID,
      //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
      //   callbackURL: process.env.GITHUB_CALLBACK_URL,
      // },
      // async function(accessToken, refreshToken, profile, callback ){
      //   console.log('profile', profile)
      //   try {
      //     const user = await User.findOne({
      //       accountId: profile.id,
      //       provider: 'facebook',
      //     });

      //     console.log('user', user)

      //     if (!user) {
      //       const newUser = new User({
      //         name: profile.displayName,
      //         picture: profile.photos[0].value,
      //         provider: profile.provider,
      //         accountId: profile.id,
      //         firstName: profile.displayName.split(' ')[0],
      //         lastName: profile.displayName.split(' ')[1],
      //         username: profile.displayName.split(' ')[0],
      //       })
      //       await newUser.save();
      //       console.log('newUser', newUser);
      //       return callback(null, profile)
      //     }
      //   } catch (error) {
      //     return callback(null, profile)
      //   }
      // }
      // ))

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

app.use('/api/users', usersRoute);

// Define routes for login
app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/login/github', passport.authenticate('github', { scope: ['email']}));

// Define routes for callback
app.get('/google', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});
app.get('/facebook', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/');
})
app.get('/github', passport.authenticate('github'), (req, res) => {
  res.redirect('/');
})

// Logout
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  })
});

// Default routes
app.get('/', (req, res) => {
  res.send(req.user ? req.user : 'Not logged in; login with Google, Facebook or Linkedin')
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
