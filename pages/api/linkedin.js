// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Parser from 'rss-parser';
import { format } from 'date-fns';
import Nodeparser from 'node-html-parser';
import medium from '../../feed/medium.json';
import axios from "axios";




let parser = new Parser(
  {
    customFields: {
      item: [["content:encoded", "content"], ["dc:creator", "creator"]]
    }
  }
);



async function shareOnLinkedin(todayArticle) {
    
    let headersList = {
      "Authorization": process.env.LINKEDIN_ACCESS_TOKEN,
      "Content-Type": "application/json"
    }
    
     await todayArticle.map(
        post => {
    
          let bodyContent = JSON.stringify({
            "content": {
              "contentEntities": [
                {
                  "entityLocation": post.link,
                  "thumbnails": [
                    {
                      "resolvedUrl": post.image
                    }
                  ]
                }
              ],
              "title": post.title,
              "description": post.description ? post.description : ""
            },
            "distribution": {
              "linkedInDistributionTarget": {}
            },
            "owner": "urn:li:organization:76615898",
            "subject": post.description ? post.description : post.title,
            "text": {
              "text": `${post.title} 
              
              ${post.description}

               Publish By ${post.author}

               ${post.hashTags}
              `
            }
          });
    
          let reqOptions = {
            url: "https://api.linkedin.com/v2/shares",
            method: "POST",
            headers: headersList,
            data: bodyContent,
          }
    
    
         axios.request(reqOptions)
            .then(function (response) {
              console.log(response.data);
            })
            .catch(function error(error) {
              console.log(error);

            }
    
            )
    
    
        }
      )
}





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


          let convertIntoHashTags = item.categories.map(item => `#${item}`)

          setData.push({
            title: item.title,
            link: urlparts[0],
            image: htmlImage(item.content),
            date: item.pubDate,
            description: description(item.content),
            author: item.creator,
            categories: item.categories,
            hashTags: convertIntoHashTags.join().replaceAll(",", " "),
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


  res
  .setHeader('Content-Type', 'text/plain')
  .setHeader(
    'Cache-Control',
    'public, s-maxage=100, stale-while-revalidate=590'
  )
  .status(200)
  .send("every thing fine")}
