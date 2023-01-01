// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Parser from 'rss-parser';
import { format } from 'date-fns';
import Nodeparser from 'node-html-parser';
import medium from '../../feed/medium.json';




let parser = new Parser(
  {
    customFields: {
      item: [["content:encoded", "content"], ["dc:creator", "creator"]]
    }
  }
);




export default async  function handler( req, res) {
  let setData  = [];
  let todayArticle  = [];

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


         let convertIntoHashTags= item.categories.map(item=> `#${item}`)



          setData.push({
            title: item.title,
            link: urlparts[0],
            image: htmlImage(item.content),
            date: item.pubDate,
            description: description(item.content),
            author: item.creator,
            categories: item.categories,
            hashTags: convertIntoHashTags.join().replaceAll("," ," "),
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

  let  baseUrl= '/'


  const item = todayArticle.map(

    (data) => `<item>
    <title><![CDATA[${data.title}]]> </title>
      <description> <![CDATA[ ${data.description} ]]> </description>
      <link> <![CDATA[ ${data.link} ]]> </link>
      <image> <![CDATA[ ${data.image} ]]></image>
      <guid> <![CDATA[ ${data.guid} ]]></guid>
      <categories> <![CDATA[${data.categories} ]]></categories>
      <hashtags> <![CDATA[${data.hashTags} ]]></hashtags>
      <author> <![CDATA[${data.author} ]]></author>
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
