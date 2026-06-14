const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  consultoria: { type: String, required: true },
  name: { type: String, default: '' },
  passwordHash: { type: String, required: true }, // senha criptografada
  isValidated: { type: Boolean, default: false }, // cliente validado pela consultoria
  // outros campos podem ser adicionados aqui
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
