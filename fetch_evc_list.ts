interface LooseObject {
    [key: string]: any
}

function xmlStrToObj(str: string): object {
    let items: LooseObject[] = [];
    let item: LooseObject = {};
    let i = str.indexOf("<item>");
    let beg: number;
    let end: number;
    let tagName: string = "dummy";
L1:
    while (true) {
        if (str[i] === "<") {
            beg = i+1;
            end = str.indexOf(">", beg);
            i = end+1;
            tagName = str.substring(beg, end);
            switch (tagName) {
                case "/items":
                    break L1;
                case "item":
                    item = {};
                    break;
                case "/item":
                    items.push(item);
                    break;
                defaut:
                    break;
            }
        } else {
            beg = i;
            end = str.indexOf("<", beg);
            i = str.indexOf("<", end+1);
            const text: string = str.substring(beg, end);
            let val: any;
            switch (tagName) {
                case "lat": case "lng": case "longi":
                    val = parseFloat(text);
                    break;
                default:
                    val = text;
                    break;
            }
            item[tagName] = val;
        }
    }
    return items;
}

async function fetchXml(url: string): Promise<object> {
    let res =  await fetch(url);
    if (!res.ok)
        throw new Error(`HTTP Error! status: ${res.status}`);
    else
        return res.text().then(str => xmlStrToObj(str)); 
}

function writeJson(path: string, data: object): string {
    try {
        Deno.writeTextFileSync(path, JSON.stringify(data, null, "\t"));
        return "Written to " + path;
    } catch (e) {
        return e.message;
    }
}

function fetchXmlAndMakeJson(url: string, path: string): void {
    fetchXml(url).then(data => {
        console.log(writeJson(path, data)); 
    })
    .catch(e => {
        console.log(`An error occurs "${url}": ` + e.message);
    })
    .finally(() => {
        console.log(`Fetch attempt for "${url}" finished.`);
    });
}

import { openapi_key } from "./keys.ts"
const pages = 1;
const rows = 8192;
const keco_url = 'http://open.ev.or.kr:8080/openapi/services/rest/EvChargerService';
const kepco_url = 'http://openapi.kepco.co.kr/service/EvInfoServiceV2/getEvSearchList';

let keco_query = '?' + encodeURIComponent('serviceKey') + '=' + openapi_key;
let kepco_query = '?' + encodeURIComponent('serviceKey') + '=' + openapi_key;
kepco_query += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(pages);
kepco_query += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(rows);

fetchXmlAndMakeJson(kepco_url+kepco_query, "./kepco.json");
fetchXmlAndMakeJson(keco_url+keco_query, "./keco.json");

/*
const xmlStr = Deno.readTextFile("./test_evc_list.xml");
xmlStr.then(str => {
    console.log(str);
    console.log(xmlStrToObj(str));
});
*/
