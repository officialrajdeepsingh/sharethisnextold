import axios from "axios";
import { supabase } from '../supabase';

async function supabaseAnalytic(item) {

  await supabase
  .from('analytic')
  .upsert(
      {
        title: item.content.title,
        isPublish: true,
      }, 
      {
        onConflict: "title", 
        ignoreDuplicates: false
      }
    )
  .select()
  
}

async function publishSupabaseItem(item) {
  
  await supabase
    .from('publish')
    .upsert(

        {
          title: item.content.title,
          isPublish: true,
        }, 

        { 
          onConflict: "title", 
          ignoreDuplicates: false 
        }

      )
    .select()
}

async function deleteLinkedinItem(id) {

  await supabase
    .from('list')
    .delete()
    .eq('guid', id)
}

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
               
              "text": ` ${post.title} 
                    
                        ${post.description }
          
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
        .then( async function (response) {

             await supabaseAnalytic(response.data)

             await deleteLinkedinItem(post.guid)

             await publishSupabaseItem(response.data)

          }

        )
        .catch(
          function error(error) {
            console.log(error);
          }
      )
    }
  )
}

async function shareSupabase(item) {

  try {

      await supabase
      .from('list')
      .upsert(
        {

          title: item.title,
          description: item.description,
          link: item.link,
          image: item.image,
          guid: item.guid,
          categories: item.categories,
          hashTags: item.hashTags,
          author: item.author,
          date: item.date

        }, 
        {
          onConflict: "guid",
          ignoreDuplicates: false
        }
      )
      .select()

  } catch (error) {
    console.log(error);
  }


}

export { shareOnLinkedin, shareSupabase}