// import * as htmlToJson from 'html-to-json';
import { writeFileSync } from 'fs';
import { readFile } from 'fs';
import { from } from 'rxjs';
import { groupBy, switchMap, mergeMap, reduce, toArray} from 'rxjs/operators';

const a11yParser = htmlToJson.createParser(['section>ol>.item', {
    'url': function($doc) { return $doc.find('li.url').text().replace(/\d+\.檢測網址/, ''); },
    'errors': [
      'li.url+ol.upper-roman>li, li.url+ol.upper-roman>li+ul',{
        'errorDesc': function($doc) {return $doc.find('a').text();},
        'context': function($doc) {return $doc.find('li').text();}
      }, function(items) {
        return items.reduce((prev, curr, index) => {
          if (index % 2 === 0) {
            return prev.concat({
              ...curr, context: items[index + 1]?.context || ''
            });
          }
          return prev;
        }, [])
      }
    ]
  }])
  
  const flattenedPromise = readFile('./ntcri20240624164402.htm', 'utf8').then((text) => {
    const uglifyText = text.replace(/^\s+|\n/gm, '');
    const wrapItem = uglifyText.replace(/(<li class="url">.*?<\/li>\s*<ol class="upper-roman">[\s\S]*?<\/ol>)/g, '<div class="item">$1</div>').replace(/_ngcontent-serverapp-c\d+=""/g, '');
    
    
    
    return new Promise<Array<any>>((resolve) => {
      a11yParser.parse(wrapItem).done(function (errorsArr) {
      const flattened = errorsArr.reduce((prev, curr) => {
        return prev.concat(curr.errors.map(v => ({...v, url: curr.url})));
      }, [])
      resolve(flattened);
    })
    })
  });
  
  from(flattenedPromise).pipe(
    switchMap(flattenArray => from(flattenArray).pipe(
      groupBy(v => v.errorDesc),
      mergeMap(errorDescGroup$ => errorDescGroup$.pipe(
        groupBy(v => v.context),
        mergeMap(contexts$ => contexts$.pipe(
          reduce((prev, curr) => {
            return {...prev, urls: prev.urls.concat(curr.url)}
          }, {context: contexts$.key, urls: [] as string[]})
        )),      
        reduce((prev, curr) => {
          return {...prev, items: prev.items.concat(curr)}
        }, {errorDesc: errorDescGroup$.key, items: [] as any[]})
      )),
      toArray(),
    ))
  ).subscribe((v) => {
    const output = join(process.cwd(), 'output.json');
    writeFileSync(output, JSON.stringify(v, null, 2));
  });