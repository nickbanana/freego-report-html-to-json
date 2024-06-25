import { Cheerio } from "cheerio";

export default class ParseContext {
    $container: Cheerio<Document>;
    filter: Array<any>;
    
    constructor(options) {

    }

    parse(callback) {

    }

    map(selector, filter) {
        
    }

    get(key) {

    }

    private filterWithFunction() {

    }

    private filterWithObject() {

    }

    private filterWithArray() {
        const [selector, eachFilter, afterFilter] = this.filter;
        const result = this.map(selector, eachFilter);
        return !!afterFilter ? result.then(afterFilter) : result;
    }

    private filterWithConstant() {
        return new Promise((resolve) => {
            resolve(this.filter);
        })
    }
}