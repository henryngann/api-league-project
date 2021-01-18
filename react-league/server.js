const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
const axios = require('axios')
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/champions') // Example for postgres
//Setting up database

var utils = require('./util/dbutil').util;
const Champion = sequelize.define('champions', { name: Sequelize.TEXT, title: Sequelize.STRING, championId:Sequelize.INTEGER })

const Skills = sequelize.define('skills', { skillId: Sequelize.TEXT, name: Sequelize.STRING, description: Sequelize.TEXT, tooltip: Sequelize.TEXT,image: Sequelize.STRING,sprite: Sequelize.STRING  , cid: Sequelize.INTEGER});
// ^ creates table and set columns to note text and tag string



//Foreign Key Must Be in Skills.
//
Skills.belongsTo(Champion, {foreignKey: 'cid'})

//
// need notes to match champion dialog




//map routes to postman
app.listen(4040, async function () {
    try {
        await sequelize.authenticate();
        sequelize.sync({ force: false })
            .then(() => {
            })
    } catch (error) {
        process.exit(1);
    }
})


app.get('/champion/:name', async function (req, res) {
    const apiURL = `http://ddragon.leagueoflegends.com/cdn/11.1.1/data/en_US/champion/${req.params.name}.json`
    try {

        const instance = axios.create({});
        //axios is get request, creating an instance to use

        let championInfo = await instance.get(apiURL);
        //this is the fetch
        let annie = championInfo.data.data;
// SUPER IMPORTANT !!!!!!!!!!!!!!
        var firstKey = Object.keys(annie)[0]; //Research Object.keys
        let datum = championInfo.data.data[firstKey]
        //bracket notation vs .notation
        // bracket notation will let the variable resolve
        // . looks for the literal variable name
        console.log(Object.keys(annie))
        utils.saveChampion(datum).then((record)=>{
            //pass datum to savechampion

        })
//

        let build = Champion.build({name:annie.name, title: annie.title});


        build.save()
    }catch (error) {
        console.error(error) // from creation or business logic
    }
})


app.get('/champions/:id/:skill', function (req, res) {

    res.send({skill: 'ethan'})
})



app.get('/champions', async function (req, res) {
    const apiURL = 'http://ddragon.leagueoflegends.com/cdn/11.1.1/data/en_US/champion.json'
    try {
        let dataArray = [];
        const instance = axios.create({});
        let championInfo = await instance.get(apiURL);
        for( const prop in championInfo.data.data){
            dataArray.push(championInfo.data.data[prop])
        }
        for(let i=0;i < dataArray.length;i++){
       utils.saveChampion(dataArray[i]).then((record)=>{


       })
        }

    }catch (error) {
        console.error(error) // from creation or business logic
    }
})

app.get('/champion/:name/spells/save',async function(req,res) {
    const apiURL = `http://ddragon.leagueoflegends.com/cdn/11.1.1/data/en_US/champion/${req.params.name}.json`
    const instance = axios.create({});
    //axios is get request, creating an instance to use

    let championInfo = await instance.get(apiURL);
    //this is the fetch
    let annie = championInfo.data.data;
// SUPER IMPORTANT !!!!!!!!!!!!!!
    var firstKey = Object.keys(annie)[0]; //Research Object.keys
    let datum = championInfo.data.data[firstKey]
    console.log(datum.spells)

    for (let i = 0; i < datum.spells.length; i++) {
        let championSpell = datum.spells[i];

        let build = await Skills.build({
            skillId: championSpell.id,
            name: championSpell.name,
            description: championSpell.description,
            tooltip: championSpell.tooltip,
            image: championSpell.image.full,
            sprite:championSpell.image.sprite,
            cid: datum.key
        });
        let save = await build.save()
        console.log(datum.spells[i])
    }
})

app.get('/champion/:id/spells/',async function(req,res) {
   let skills = await Skills.findOne({ where: {
        cid : req.params.id
        }, include: [Champion]})
    console.log(skills,"this is skills")
})




