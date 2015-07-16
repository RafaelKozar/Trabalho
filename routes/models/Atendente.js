var mongoose = require('mongoose');

var atendenteSchema = mongoose.Schema({
    loca : {
        nome : String,
        telefone : String,
        password : String
        //especializacao : {"psicólogo", "fonodiólogo", "fisioterapeuta", "médico"}
    }
});

atendenteSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
atendenteSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('Atendente', atendeSchema);