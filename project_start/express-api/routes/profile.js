// const express = require('express')
// const router = express.Router()

// const Parse = require('parse/node');
// // Will later store these as environment variables for much strong security
// Parse.initialize("01pRqpOPIL2CPOmyCXOdjQM81JoDXgHXyEYvC8xa", "OBHnma2duz3UjloQLiuD9dIMi4qLKeEMdurNgQ58")
// Parse.serverURL = "https://parseapi.back4app.com/"


// router.post("/new-post", async (req, res, next) => {
//     try {
//         const { selectedSongId, selectedSongUrl, selectedSongName, review, mood, rating } = req.body
//         const Posts = Parse.Object.extend("Posts");
//         const post = new Posts();
    
//         post.set({
//           "selectedSongId": selectedSongId,
//           "selectedSongUrl": selectedSongUrl,
//           "selectedSongName": selectedSongName,
//           "review": review, 
//           "mood": mood, 
//           "rating": rating,
//           "userId": req.app.get('userId'),
//           "likes": 0,
//           "comments": []
//         })
    
//         post.save()

//         const Songs = Parse.Object.extend("Songs");
//         const query = new Parse.Query(Songs)
//         query.equalTo("selectedSongId", selectedSongId)
//         const foundSong = await query.find()
//         console.log(foundSong)
//         if (foundSong.length == 0) {
//             console.log("inside")
//             const song = new Songs();
//             song.set({
//                 "selectedSongId": selectedSongId,
//                 "likes": 0,
//                 "comments": 0,
//                 "avgRating": parseInt(rating),
//                 "quantity": 1
//             })
//             console.log("here again")
//             song.save()
//         } else {
//             const currSong = foundSong[0]
//             currSong.set("avgRating", (currSong.get("avgRating") * currSong.get("quantity") + parseInt(rating))/(currSong.get("quantity") + 1))
//             currSong.increment("quantity")
//             currSong.save()
//         }
//         // console.log(query.exists(""))
        

//         res.send({"post completed": "success"})
//       } catch (err) {
//         next(err)
//       }
// })

// // Get info for specific post from id
// router.get("/:postId", getCurrPost, async (req, res, next) => {
//     try {
//         res.status(200).json(res.post);
//         next();
//     } catch (err) {
//       next(err)
//     }
// })

// router.get("/:postId/comments", getCurrPost, async (req, res, next) => {
//     try {
//         const Comments = Parse.Object.extend("Comments");
//         const commentQuery = new Parse.Query(Comments)
        
//         commentQuery.equalTo("postId", res.post)
//         const results = await commentQuery.find()
//         res.status(200).json(results)
//         next()
//     } catch (err) {
//       next(err)
//     }
// })

// router.put('/:postId/update-post', getCurrPost, async (req, res, next) => {
    
//     let currComments = await res.post.get("comments")
//     currComments.push(req.body.commentId)
//     res.post.set("comments", currComments)
//     res.post.save()
//     res.status(200).json(currComments)
//   })

// router.post('/:postId/new-comment', getCurrPost, async (req, res, next) => {
//     try {
//     // Adding new comment to Comments database
//         const { selectedSongId, comment} = req.body
//         const Comments = Parse.Object.extend("Comments");
//         const currComment = new Comments();
//         currComment.set({
//             "comment": comment,
//             "selectedSongId": selectedSongId,
//     })
        
//         // Updating Posts database and appending comment id to commments field

//         currComment.set("postId", res.post)
//         const savedComment = await currComment.save()
        
//         res.status(200).json(savedComment)
        
//     } catch (err) {
//         next(err)
//     }
// })



// module.exports = router;
