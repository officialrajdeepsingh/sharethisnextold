// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


import Parser from 'rss-parser';
import { format } from 'date-fns';
import Nodeparser from 'node-html-parser';

const result = ["https://medium.com/feed/frontendweb", "https://medium.com/feed/nextjs"]



let parser = new Parser(
  {
    customFields: {
      item: [["content:encoded", "content"], ["dc:creator", "creator"]]
    }
  }
);




export default async  function handler( req: NextApiRequest, res: NextApiResponse<Data>) {
  let setData:object[] = [];
  let todayArticle:object[] = [];

  function htmlImage(params:string) {

    let img = Nodeparser.parse(params).querySelector('img')?.getAttribute('src')

    return img;
  }

  function description(params:string) {

    let text = Nodeparser.parse(params).querySelector('p')?.innerText

    return text;
  }

  for (let index = 0; index < result.length; index++) {
    const url = result[index]
    let feed = await parser.parseURL(url)
      .then((feed) => {

        feed.items.forEach((item) => {


          var urlparts:[] = item.link?.split("?");

          setData.push({
            title: item.title,
            link: urlparts[0],
            image: htmlImage(item.content),
            date: item.pubDate,
            description: description(item.content),
            author: item.creator,
            categories: item.categories,
            guid: item.guid
          });
        });

      });

  }



  if (setData) {

    for (let index = 0; index < setData.length; index++) {

      const todayFormat = format(new Date(), "yyyy-MM-dd");

      const articleDataFormat = format(new Date(setData[index].date), "yyyy-MM-dd");


      if (todayFormat !== articleDataFormat) {
        todayArticle.push(setData[index])
      }

    }

  }

  let  baseUrl= '/'


  // res.status(200).json({ articles: todayArticle })

  const item = todayArticle.map(
    (data) => `<item>
      <title> ${data.title}</title>
      <description> ${data.description}</description>
      <link> ${data.link} </link>
      <image> ${data.image}</image>
      <guid isPermaLink="false">${data.guid}</guid>
      <categories>${data.categories}</categories>
      <author>${data.author}</author>
      <date>${data.date}</date>
    </item>`
  )
    .join('')

  res
    .setHeader('Content-Type', 'text/xml')
    .setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    )
    .status(200)
    .send(`<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
            
           <title>my title</title>
            <description>my description </description>
            <link>${baseUrl}</link>

            ${item}
                
        </channel>
</rss>`)



}
