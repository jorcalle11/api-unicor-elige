var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var validateLocalStrategyPassword = function(password) {
  return (password && password.length > 4);
};

var userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: 'Por favor escriba su nombre',
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  displayName: {
    type: String,
    trim: true,
    default: ''
  },
  identification: {
    type: {
      type: String,
      trim: true,
      enum: ['TI', 'CC','CE'],
      default:'CC'
    },
    number: {
      type: String,
      trim: true,
      unique: true,
      required: 'Por favor escriba su número de identificación'
    }
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Por favor escriba su email',
    match: [/.+\@.+\..+/, 'Por favor escriba una direccion de correo valida']
  },
  password: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyPassword, 'Su contraseña es muy corta, mínimo 5 caracteres ']
  },
  faculty: {
    type: String,
    enum: ['Ingenierías','Medicina Veterinaria y Zootecnia','Ciencias Básicas','Ciencias Agrícolas','Educación y Ciencias Humanas','Ciencias Económicas, Jurídicas y Administrativas','Ciencias de la Salud'],
    trim: true,
    default: 'Ingenierías'
  },
  program: {
    type: String,
    trim: true,
    enum: ['Ingeniería de Alimentos','Ingeniería Ambiental','Ingeniería Industrial','Ingeniería Mecánica','Ingeniería de Sistemas','Medicina Veterinaria y Zootecnia','Acuicultura','Biología','Estadistícas','Física','Geografía','Matemáticas','Química','Ingeniería Agronómica','Licenciatura en Educación Básica con Énfasis en Humanidades-Lengua Castellana','Licenciatura en Educación Física, Recreacíon y Deportes','Licenciatura en Informática y Medios Audiovisuales','Licenciatura en Educación Básica con Énfasis en Humanidades-Inglés','Licenciatura en Educación Básica con Énfasis en Ciencias Sociales','Licenciatura en Educación Básica con Énfasis en Educación Artística-Música','Licenciatura en Ciencias Naturales y Educación Ambiental','Administración en Finanzas y Negocios Internacionales','Administración en Salud','Bacteriología','Enfermería','Tecnología en Regencia y Farmacia'],
    default: 'Ingeniería de Alimentos'
  },
  semester: {
    type: String,
    trim: true,
    enum: ['1','2','3','4','5','6','7','8','9','10'],
    default: '1'
  },
  roles: {
    type: [{
      type: String,
      enum: ['estudiante', 'candidato']
    }],
    default: ['estudiante']
  },
  image: {
    url : {
      type: String
    },
    public_id:{
      type: String
    }
  },
  votation: {
    type: Boolean,
    default: false
  }
});

userSchema.pre('save', function(next) {
  if (this.password && this.password.length > 4) {
    this.password = this.generateHash(this.password);
  }
  next();
});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password,this.password);
};

userSchema.plugin(uniqueValidator,{ message: 'Error, {VALUE} ya esta en uso.' });

var User = mongoose.model('User',userSchema);

module.exports = User;
