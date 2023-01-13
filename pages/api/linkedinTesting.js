// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";





async function  shareOnLinkedin(todayArticle) {
    
  
    let headersList = {
        "Authorization": process.env.LINKEDIN_ACCESS_TOKEN,
        "Content-Type": "application/json"
    }

    
          let bodyContent = JSON.stringify({
            "content": {
              "contentEntities": [
                {
                  "entityLocation": "https://www.example.com/content.html",
                  "thumbnails": [
                      {
                          "resolvedUrl": "https://www.example.com/image.jpg"
                      }
                    ]
                }
              ],
              "title": "My unique demo title for posts",
              "description":"My title description is here "
            },
            "distribution": {
              "linkedInDistributionTarget": {}
            },
            "owner": "urn:li:organization:76615898",
            "subject": "My unique subject for subject",
            "text": {
              "text": ` MY title is uniqe and best 
                 For every one is a #react  #javascript
                 How are you new line \n 
                multiple new lines \n \n
                testing 
                 
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
              
              console.log("error is here :", error, " <--- ")
    
              res.status(200).json({ name: 'posts', error })
            }
    
            )
    

      
}





export default async function handler(req, res) {
  let setData = [];
  let todayArticle = [];


  shareOnLinkedin(todayArticle)


  res
  .setHeader('Content-Type', 'text/plain')
  .setHeader(
    'Cache-Control',
    'public, s-maxage=100, stale-while-revalidate=590'
  )
  .status(200)
  .send("every thing fine")}
