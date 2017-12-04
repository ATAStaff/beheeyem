const request = require('request'),
    requireFromUrl = require('require-from-url/sync'),
    dexEntries = require("../data/flavorText.json"),
    abilities = require("../data/abilities.js").BattleAbilities,
    Matcher = require('did-you-mean'),
    url = require('url'),
    http = require('https'),
    sizeOf = require('image-size'),
    footers = require('../data/footers.js');
let dex,
    aliases,
    match,
    tFooter;

var embedColours = {
    Red: 16724530,
    Blue: 2456831,
    Yellow: 16773977,
    Green: 4128590,
    Black: 3289650,
    Brown: 10702874,
    Purple: 10894824,
    Gray: 9868950,
    White: 14803425,
    Pink: 16737701
};

request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/pokedex.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        dex = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/pokedex.js').BattlePokedex;
    } else {
        console.log('Error fetching Showdown dex; Switching to local dex...');
        dex = require('../data/pokedex.js').BattlePokedex;
    }
    match = new Matcher(Object.keys(dex).join(' '));
});
request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/aliases.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        aliases = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/aliases.js').BattleAliases;
    } else {
        console.log('Error fetching Showdown aliases; Switching to local aliases...');
        aliases = require('../data/aliases.js').BattleAliases;
    }
});
exports.action = (msg, args) => {
    var poke = args.toLowerCase();

    if (aliases[poke]) {
        poke = aliases[poke];
    }
    poke = poke.toLowerCase();
    if (poke.split(" ")[0] == "mega") {
        poke = poke.substring(poke.split(" ")[0].length + 1) + "mega";
    }
    var pokeEntry = dex[poke];
    if (!pokeEntry) {
        for (var i = 0; i < Object.keys(dex).length; i++) {
            if (dex[Object.keys(dex)[i]].num == Number(poke)) {
                poke = dex[Object.keys(dex)[i]].species.toLowerCase();
                pokeEntry = dex[poke];
                break;
            }
        }
    }
    if (!pokeEntry) {
        for (var i = 0; i < Object.keys(dex).length; i++) {
            if (dex[Object.keys(dex)[i]].species.toLowerCase() == poke) {
                pokeEntry = dex[Object.keys(dex)[i]];
                break;
            }
        }
    }
    if (pokeEntry) {
        let imgDimensions = {};

        poke = pokeEntry.species;
        var evoLine = "**" + capitalizeFirstLetter(poke) + "**",
            preEvos = "";
        if (pokeEntry.prevo) {
            preEvos = preEvos + capitalizeFirstLetter(pokeEntry.prevo) + " > ";
            var preEntry = dex[pokeEntry.prevo];
            if (preEntry.prevo) {
                preEvos = capitalizeFirstLetter(preEntry.prevo) + " > " + preEvos;
            }
            evoLine = preEvos + evoLine;
        }
        var evos = ""
        if (pokeEntry.evos) {
            evos = evos + " > " + pokeEntry.evos.map(entry => capitalizeFirstLetter(entry)).join(", ");
            if (pokeEntry.evos.length < 2) {
                var evoEntry = dex[pokeEntry.evos[0]];
                if (evoEntry.evos) {
                    evos = evos + " > " + evoEntry.evos.map(entry => capitalizeFirstLetter(entry)).join(", ");
                }
            }
            evoLine = evoLine + evos;
        }
        if (!pokeEntry.prevo && !pokeEntry.evos) {
            evoLine = evoLine + " (No Evolutions)";
        }
        var typestring = "Type";
        if (pokeEntry.types.length > 1) {
            typestring += "s";
        }
        var abilityString = pokeEntry.abilities[0];
        for (var i = 1; i < Object.keys(pokeEntry.abilities).length; i++) {
            if (Object.keys(pokeEntry.abilities)[i] == 'H') {
                abilityString = abilityString + ", *" + pokeEntry.abilities['H'] + "*";
            } else {
                abilityString = abilityString + ", " + pokeEntry.abilities[i];
            }
        }
        var imagefetch = pokeEntry.num;
        if (imagefetch < 100) {
            imagefetch = "0" + imagefetch;
        }
        if (imagefetch < 10) {
            imagefetch = "0" + imagefetch;
        }
        imagefetch = imagefetch + capitalizeFirstLetter(poke) + ".png";

        let imageURL = 'https://cdn.rawgit.com/110Percent/beheeyem-data/44795927/webp/' + poke.toLowerCase().replace(" ", "_") + ".webp";

        for (var i = dexEntries.length - 1; i > -1; i--) {
            if (dexEntries[i].species_id == pokeEntry.num && dexEntries[i].language_id == 9) {
                var pokedexEntry = "*" + dexEntries[i].flavor_text + "*";
                break;
            }
        }
        if (!pokedexEntry) {
            var pokedexEntry = "*An unknown error occurred.*";
        }
        tFooter = Math.floor(Math.random() * 15) == 0 ? {
            text: footers[Math.floor(Math.random() * footers.length)],
            icon_url: 'https://cdn.rawgit.com/110Percent/beheeyem/gh-pages/include/favicon.png'
        } : {
            text: "#" + pokeEntry.num,
            icon_url: "https://cdn.rawgit.com/msikma/pokesprite/master/icons/pokemon/regular/" + poke.replace(" ", "_").toLowerCase() + ".png"
        };
        var dexEmbed = {
            color: embedColours[pokeEntry.color],
            fields: [{
                    name: typestring,
                    value: pokeEntry.types.join(", "),
                    inline: true
                },
                {
                    name: "Abilities",
                    value: abilityString,
                    inline: true
                },
                {
                    name: "Evolutionary Line",
                    value: evoLine,
                    inline: false
                },
                {
                    name: "Base Stats",
                    value: Object.keys(pokeEntry.baseStats).map(i => i.toUpperCase() + ": **" + pokeEntry.baseStats[i] + "**").join(", ")
                },
                {
                    name: "Height",
                    value: pokeEntry.heightm + "m",
                    inline: true
                },
                {
                    name: "Weight",
                    value: pokeEntry.weightkg + "kg",
                    inline: true
                },
                {
                    name: "Egg Groups",
                    value: pokeEntry.eggGroups.join(", ")
                },
                {
                    name: "Dex Entry (Sun/Moon)",
                    value: pokedexEntry
                },
                {
                    name: "External Resources",
                    value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + capitalizeFirstLetter(poke).replace(" ", "_") + "_(Pokémon\\))  |  [Smogon](http://www.smogon.com/dex/sm/pokemon/" + poke.replace(" ", "_") + ")  |  [PokémonDB](http://pokemondb.net/pokedex/" + poke.replace(" ", "-") + ")"
                }
            ],
            image: {
                url: imageURL,

                width: 80
            },
            footer: tFooter
        };
        msg.channel.send("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(poke) + "**", {
                embed: dexEmbed
            })
            .catch(console.error);
    } else {
        let dym = match.get(args);
        let dymString;
        if (dym == null) {
            dymString = 'Maybe you misspelt the Pokémon\'s name?';
        } else {
            dymString = `Did you mean \`${dym}\`?`;
        }
        msg.channel.send("⚠ Dex entry not found! " + dymString);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}