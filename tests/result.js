const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const ResultSchema = Schema({
      _id: Number,
      name : String,
      email_u: String,
      email_d: String,
      address: String,
      bioquimica: Object,
      eye: Object,
      code: Object
  });

module.exports = mongoose.model('Result', ResultSchema);
