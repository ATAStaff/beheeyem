let aDefault = {
    'ho-oh': 'hooh',
    'bounty': 'porygonz-shiny',
    'tech': 'vileplume',
    'lectro': 'noivern',
    'ngb': 'ampharos',
    'amph': 'ampharos-mega',
    'fable': 'flygon-shiny',
    'thane': 'absol',
    'semper': 'flygon',
    'monk': 'weavile',
    'baru': 'arcanine',
    'ace': 'suicune',
    'quote': 'sableye',
    'stall': 'sableye-mega',
    'surv': 'zorua-shiny',
    'josh': 'staraptor',
    'luc': 'lucario',
    'flare': 'flareon',
    'fluffy': 'leafeon',
    'fug': 'rayquaza',
    'sol': 'solrock',
    'cell': 'gengar',
    'dom': 'charizard',
    'hiccup': 'spinda',
    'runtime': 'lapras',
    'curtis': 'reuniclus',
    'type: null': 'typenull',
    'type null': 'typenull',
    'mr. mime': 'mrmime',
    'mr mime': 'mrmime',
    'mime jr.': 'mimejr',
    'mime jr': 'mimejr',
    'tapu koko': 'tapukoko',
    'tapu lele': 'tapulele',
    'tapu bulu': 'tapubulu',
    'tapu fini': 'tapufini'
}

let custom = {
    'matt': 'meowstic',
    'erebus': 'meowstic',
    'blue': 'popplio',
    'emily': 'luxio',
    'hound': 'houndoom',
    'zytom': 'lurantis',
    'jenn': 'bellossom',
    'skul': 'totodile',
    'orn': 'decidueye-shiny',
    'jordan': 'dewott',
    'mene': 'cosmog',
    'minty': 'archeops',
    'sapph': 'glaceon',
    'swed': 'vaporeon',
    'pally': 'lilligant',
    'thirst': 'lilligant'
}

exports.aliases = (id) => {
    if (id == 111504456838819840) {
        return toReturn;
    } else {
        return Object.assign(aDefault, custom);
    }
}