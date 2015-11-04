/*
* Llena los datos conla configuracion de tu app.
*/

module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || "tokenultrasecreto",
  db_name: process.env.NAME_DB || 'appUnicor',
  db_username: process.env.USERNAME_DB,
  db_password: process.env.PASSWORD_DB,
  facebook_secret: process.env.FACEBOOK_SECRET,
  twitter_key: process.env.TWITTER_KEY,
  twitter_secret: process.env.TWITTER_SECRET,
  instagram_secret: process.env.INSTAGRAM_SECRET,
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  },
  nodemailer: {
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  }
};
