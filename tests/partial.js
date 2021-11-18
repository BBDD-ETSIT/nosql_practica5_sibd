const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const PartialSchema = Schema({
      _id: Number,
      mediagrises : Number,
      HDLbajo: Number,
      MinHierro: Number,
      muestras: Array,
      hematocritos: Number      
  });

module.exports = mongoose.model('Partial', PartialSchema);
