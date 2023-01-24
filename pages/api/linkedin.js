import Parser from 'rss-parser';
import { format } from 'date-fns';
import Nodeparser from 'node-html-parser';
import medium from '../../feed/medium.json';
import  { shareOnLinkedin, shareSupabase} from '../../utility/utility';

let parser = new Parser({
    customFields: {
      item: [["content:encoded", "content"], ["dc:creator", "creator"]]
    }
});

export default async function handler(req, res) {
  
  let setData = [];

  let todayArticle = [];

  function htmlImage(params) {

    let img = Nodeparser.parse(params).querySelector('img')?.getAttribute('src')

    return img;
  }

  function description(params) {

    let text = Nodeparser.parse(params).querySelector('p')?.innerText

    return text;
  }

  for (let index = 0; index < medium.length; index++) {
    const url = medium[index]
    let feed = await parser.parseURL(url)
      .then((feed) => {

        feed.items.forEach((item) => {


          var urlparts = item.link?.split("?");

          let convertIntoHashTags = item.categories?.map(item => `#${item}`)

          setData.push({
            title: item.title,
            link: urlparts[0],
            image: htmlImage(item.content),
            date: item.pubDate,
            description: description(item.content),
            author: item.creator,
            categories: item.categories,
            hashTags: convertIntoHashTags? convertIntoHashTags.join().replaceAll(",", " "): null,
            guid: item.guid
          });

        });

      });

  }

  if (setData) {

    for (let index = 0; index < setData.length; index++) {

      const todayFormat = format(new Date(), "yyyy-MM-dd");

      const articleDataFormat = format(new Date(setData[index].date), "yyyy-MM-dd");

      if (todayFormat === articleDataFormat) {
        todayArticle.push(setData[index])
      }

    }

  }

  shareOnLinkedin(todayArticle)

  for (let index = 0; index < todayArticle.length; index++) {
    shareSupabase(todayArticle[index])
  }

  res
    .setHeader('Content-Type', 'text/plain')
    .setHeader(
      'Cache-Control',
      'public, s-maxage=900, stale-while-revalidate=590'
    )
    .status(200)
    .send("every thing fine is here ")
}
