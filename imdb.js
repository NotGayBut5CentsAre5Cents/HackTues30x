const fs = require('fs')

var scraperjs = require('scraperjs');
let promises = [];
let padTo7 = number => number <= 9999999 ? ("000000" + number).slice(-7) : number;
let done = 0

function getsumsyn($) {
    let s = $("html").text()
    if ($("html").text().includes("Panther")) {
        console.log("ASd")
    }
    return {
        sum: $("[id^=summary-ps] > p").map((i, e) => $(e).text()).get(),
        syn: $("[id^=synopsis-py]").map((i, e) => $(e).text()).get()
    };
};

function log(m) {
    if (done % 100 == 0)
        console.log(`Done: ${done++}`)
    if (m.sum.length != 0 && m.syn.length != 0)
        console.log(m)
}
for (let i = 0; i < 1825684; i++) {
    console.log(`https://www.imdb.com/title/tt${padTo7(i)}/synopsis`)
    scraperjs.StaticScraper.create(`https://www.imdb.com/title/tt${padTo7(i)}/synopsis`)
        .scrape(getsumsyn).then(log)
}