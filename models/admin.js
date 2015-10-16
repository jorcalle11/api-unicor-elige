var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var validateLocalStrategyPassword = function(password) {
  return (password && password.length > 4);
};

var adminSchema = new Schema({
  name: {
    type: String,
    required: 'Por favor escriba su nombre',
    trim: true,
    default: '',
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Por favor escriba su direccion de correo',
    match: [/.+\@.+\..+/, 'Por favor escriba una direccion de correo valida']
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'Su contraseña es muy corta, mínimo 5 caracteres ']
  },
  image: {
    url:{
      type: String
    },
    public_id:{
      type: String
    }
  }
});

adminSchema.pre('save', function(next) {
  if (this.password && this.password.length > 4) {
    this.password = this.generateHash(this.password);
  }
  next();
});

adminSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
};

adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password,this.password);
};

var Admin = mongoose.model('Admin',adminSchema);

module.exports = Admin;
