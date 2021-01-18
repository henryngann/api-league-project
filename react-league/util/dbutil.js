const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/champions') // Example for postgres
const Champion = sequelize.define('champions', { name: Sequelize.TEXT, title: Sequelize.STRING, championId:Sequelize.INTEGER});



var util = {
    saveChampion:async (championInfo) => {
        console.log(championInfo.key,"this is champion key")
        let build = await Champion.build({name:championInfo.name, title: championInfo.title, championId:championInfo.key});
        let save = await build.save()
        return save;
    }
}


module.exports.util = util;