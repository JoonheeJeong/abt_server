interface LooseObject {
    [key: string]: any
}

let items: LooseObject[] = [];

function getTotalCount(str: string): number {
    const beg = str.indexOf("<totalCount>") + 12;
    const end = str.indexOf("<", beg);
    return parseInt(str.substring(beg, end));
}

function xmlStrToObj(str: string): void {
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
}

async function fetchXml(url: string, pageNo = 1, end = 2) {
    if (pageNo === end) {
        console.log("fetchXml end");
        return;
    }
    const complete_url = url + encodeURIComponent(pageNo);
    let res =  await fetch(complete_url);
    console.log(`Fetch attempt for "${complete_url}" finished.`);
    if (!res.ok)
        throw new Error(`HTTP Error! status: ${res.status}`);
    let str = await res.text();
    if (pageNo == 1) {
        const totalCount = getTotalCount(str);
        end += Math.floor(totalCount / pageSize);
        if (totalCount % pageSize == 0)
            end--;
    }
    xmlStrToObj(str);
    await fetchXml(url, pageNo+1, end);
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
    fetchXml(url).then(() => {
        console.log(`items.length: ${items.length}`);
        console.log(writeJson(path, items)); 
    })
    .catch(e => {
        console.log(`An error occurs "${url}": ` + e.message);
    })
    .finally(() => {
        console.log("All attempts to fetch and write finished.");
    });
}

import { openapi_key } from "./private/keys.ts"
const pageSize = 2000;
const keco_url = 'http://open.ev.or.kr:8080/openapi/services/EvCharger/getChargerInfo';

let keco_query = '?' + encodeURIComponent('serviceKey') + '=' + openapi_key;
keco_query += '&' + encodeURIComponent('pageSize') + '=' + encodeURIComponent(pageSize);
keco_query += '&' + encodeURIComponent('pageNo') + '=';

fetchXmlAndMakeJson(keco_url+keco_query, "./keco.json");

/*
const xmlStr = Deno.readTextFile("./test_evc_list.xml");
xmlStr.then(str => {
    console.log(str);
    console.log(xmlStrToObj(str));
});
*/
