import * as cheerio from "cheerio";
import { ParseContext } from "./request";
import { isCheerio } from "cheerio/lib/utils";

export default function parse(html: string | cheerio.AnyNode | cheerio.AnyNode[] | Buffer, filter, callback) {
    if ((html as string | null) == null) {
        throw new Error('HTML string required');
    }
    const $ = cheerio.load(html);

    const parseContext = new ParseContext({
        $,
        $container: isCheerio(html) ? html : $.root(),
        filter,
    })
    return !!callback ? parseContext.parse().then(callback) : parseContext.parse();
}