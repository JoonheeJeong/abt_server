function xmlStrToObj(str: string): object {}

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
