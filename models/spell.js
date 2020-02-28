const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spellSchema = new Schema({
    name: String,
    higherLevel: String,
    components: String,
    description: String,
    duration: String,
    level: String,
    range: String,
    page: String,
    material: String,
    ritual: String,
    concentration: String,
    castingTime: String,
    school: String,
    class: String,
    archetype: String,
    domains: String,
    patrons: String,
    oaths: String
});

module.exports = mongoose.model('Spell', spellSchema);