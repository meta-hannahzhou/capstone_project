# Capstone Project

Repository for Meta University Capstone Project. MuSoc: a social media web application for users to share, review, and find songs.

https://user-images.githubusercontent.com/26664975/188182073-36d6b91e-cf7e-4ac3-b0fa-b810bb029474.mp4 

## Table of Contents

1. [Overview](#Overview)
1. [Product Spec](#Product-Spec)
1. [Wireframes](#Wireframes)
1. [Schema](#Schema)

## Overview

Listening to music on streaming platforms and services has become more and more prevalent; however, there is a lack of social interaction between music listeners. This application aims to combat this issue by allowing users to review their music and share with their friends to like or comment on the music.

## Product Spec

### User Roles + Personas

_Most apps classify users into one or more roles. For instance, a tutoring app might have the roles "student" and "tutor." Those roles might have access to different pages or features, and be able to take different actions. Other apps may have only a single user role. And some projects might start with one role and add on more roles later._

_Define the set of roles and give each role a simple and clear name (like "student" and "tutor" from the example above). Include a very brief (one sentence?) description of what defines the role._

_For each of the user roles you defined, create short biographies. These "user personas" should provide some detail into who might use the site and why. Thinking about specific (fictional) people who might use your site helps you focus on what their actual needs are and what features will resonate with them. As you craft personas, think about:_

_Who is the user? What's their name and where are they from?
What is their age and access/sophistication with technology? Do they mainly use a phone, computer, etc? How often might they access your site?
What is their motivation for using the app?
What are potential pain points for this user?_

#### Student: a user who uses Spotify frequently and wants to share music with friends

Bob is a 15-year old high school student from New York who uses Spotify everyday. They are frequently on their phone and computer and also love apps like Instagram and Snapchat. They want to have a way to share their music just like they share other parts of their life with their friends. Bob's favorite artist is Kanye West and he wants to tell all of his friends to listen to his newest album. He loves when his friends like his newest posts and comment about how much they loved the song too. He wishes there was a better way to access the website on his phone/other platforms.

Michelle is a 20-year old college student at UCLA who is always in charge of the music at her friends' parties. She currently lives in LA but is originally from the East Coast and wants to keep in touch with her friends from back home while showing them how much fun she is having. Michelle frequently sends pictures but also wants to share music to better capture the atmosphere of the environment where she is hanging out. She is worried that the website won't have all of the songs she listens to as some of them are more indie and were only just released.

#### Parent: a user who wants to get new music recommendations

Stella is a 45-year old parent who doesn't listen to music very frequently but enjoys listening podcasts on her commute to work. Her friends are always suggesting that she try out listening to new artists or podcasts but she can't keep track of all of their recommendations. She isn't frequently on her phone but does use her computer a lot at work. She wants to use this application to keep up with what her friends are recommending her and have a centralized place so she doesn't forget. Her daughter is also on the website so she is not sure if that will limit the recommendations she can provide.

#### Musician: a user who wants to advertise their music to listeners

Michael is a up and coming rock musician who wants to grow his audience and get the word out about his upcoming performances. He is an average user of technology but is working on learning more about marketing on his computer to grow his brand. He wants to interact directly with his audience and learn what are their favorite songs. He wishes there was some way to limit rude comments or filter comments to see which ones are the most meaningful. One of Michael's pain points is that he can't link his location to where he was playing at venues so his users can understand where his concerts are geographically.

### User Stories

_User stories are short, granular descriptions of how users might interact with your site. User stories help teams chop up work into chunks that can be built in a couple days each while staying focused on delivering value to their users at each phase of the project._

_One common template for creating a user story is the Who, What, Why template: As a [user role], I want to [what], so that [why]_

1. As a student, I want to be able to see what other college students are currently listening to so that we can all talk about our favorite songs together.
2. As a student, I want to comment and like on my friend's posts so that I feel more connected to friends from back home.
3. As a student, I want to make posts for when I find a new favorite song so I can look back on my favorite college memories.
4. As a student, I want to see aesthetic graphs/diagrams of my most frequently listened to music so that I can share on other social media platforms.
5. As a parent, I want to read descriptive reviews for song albums so that I don't have to spend as much time looking for new music.
6. As a parent, I want to add music from the application directly to Spotify so I can listen to new recommendations on my commute to work.
7. As a parent, I want to see audiobook and podcast recommendations from coworkers so I have more knowledge to make educated decisions at work.
8. As a musician, I want to link my concert venue to each post so that my listeners know where to buy tickets for my next concert.
9. As a musician, I want to be able to reply to comments so that my audience knows I care about them.
10. As a musician, I want users to be able to listen to a small snippet of my song when I recommend it so they don't have to listen to the whole song and can get excited about new releases.

## Wireframes

![official_final_capstone](https://user-images.githubusercontent.com/26664975/177595125-8d4a0c48-e23c-4979-a0ed-441b2ff020a8.png)

## Schema

### Models

#### Posts

| Property   | Type   | Description                                        |
| ---------- | ------ | -------------------------------------------------- |
| objectId   | String | unique id for the user post (default field)        |
| createdAt  | Date   | (default auto generated field)                     |
| updatedAt  | Date   | (default auto generated field)                     |
| songId     | String | unique song id from Spotify                        |
| mood       | String | user inputted mood                                 |
| review     | String | user inputted review for the song                  |
| rating     | String | user inputted rating for the song (1-5)            |
| userId     | String | users unique Spotify username                      |
| likes      | Array  | array of Like objectIds that have been posted      |
| comments   | Array  | array of Comment objectIds that have been posted   |
| score      | Number | score for feed ranking based on HackerNews Ranking |
| tfIdfScore | Number | score based on tf-idf for all comments on a post   |

#### Comments

| Property  | Type    | Description                                                                      |
| --------- | ------- | -------------------------------------------------------------------------------- |
| objectId  | String  | unique id for the user post (default field)                                      |
| createdAt | Date    | (default auto generated field)                                                   |
| updatedAt | Date    | (default auto generated field)                                                   |
| comment   | String  | user inputted comment for each post                                              |
| songId    | String  | unique song id from Spotify                                                      |
| postId    | Pointer | pointer to unique id for the user post                                           |
| userId    | String  | object id for user who commented on the post                                     |
| sentiment | number  | value from -5 (negative) to 5 (positive) reflecting sentiment of current comment |

#### Likes

| Property  | Type    | Description                                 |
| --------- | ------- | ------------------------------------------- |
| objectId  | String  | unique id for the user post (default field) |
| createdAt | Date    | (default auto generated field)              |
| updatedAt | Date    | (default auto generated field)              |
| songId    | String  | unique song id from Spotify                 |
| postId    | Pointer | pointer to unique id for the user post      |
| userId    | String  | object id for user who liked the post       |

#### Login

| Property  | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| objectId  | String | unique id for the user post (default field) |
| createdAt | Date   | (default auto generated field)              |
| updatedAt | Date   | (default auto generated field)              |
| userId    | String | users unique Spotify username               |

#### Songs

| Property          | Type   | Description                                                                                                           |
| ----------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| objectId          | String | unique id for the user post (default field)                                                                           |
| createdAt         | Date   | (default auto generated field)                                                                                        |
| updatedAt         | Date   | (default auto generated field)                                                                                        |
| songId            | String | unique song id from Spotify                                                                                           |
| selectedSongUrl   | String | song image URL from api search call                                                                                   |
| selectedSongName  | String | song title from api search                                                                                            |
| likes             | Array  | array of Likes objectIds for all posts made for selected song                                                         |
| comments          | Array  | array of Comments objectIds for all posts made for selected song                                                      |
| avgRating         | Number | average rating across all reviews                                                                                     |
| quantity          | Number | number of reviews made for certain song                                                                               |
| genres            | Array  | array of all genres associated with the specific song                                                                 |
| score             | Number | score that accounts for quantity, avgRating, number of likes, and number of comments                                  |
| views             | Number | number of views for music video associated with that song                                                             |
| youtubeStatistics | Object | dictionary containing num views, num comments, and num likes on the youtube music video associated with specific song |

#### Recommendations

| Property        | Type   | Description                                                                                       |
| --------------- | ------ | ------------------------------------------------------------------------------------------------- |
| objectId        | String | unique id for the user post (default field)                                                       |
| createdAt       | Date   | (default auto generated field)                                                                    |
| updatedAt       | Date   | (default auto generated field)                                                                    |
| userId          | String | users unique Spotify username                                                                     |
| postedGenres    | Object | dictionary with the quantity of each genre user posted about                                      |
| commentedGenres | Object | dictionary with the quantity of each genre user commented on                                      |
| likedGenres     | Object | dictionary with the quantity of each genre user liked                                             |
| topGenres       | Object | dictionary with scaled aggregation of posted (0.5), commented (0.25), and liked (0.25) genres     |
| acoust          | Number | sum of all acoustic values for every song user has posted                                         |
| live            | Number | sum of all liveness values for every song user has posted                                         |
| dance           | Number | sum of all dance values for every song user has posted                                            |
| max1            | String | audio feature with max sum                                                                        |
| max2            | String | audio feature with second greatest sum                                                            |
| mlModel         | Object | trained network for specific user saved in JSON format                                            |
| topMLSong       | Object | dictionary containing current ml predicted songId with the highest rating and the rating          |
| topTFSong       | Object | dictionary containing current tf-idf predicted songId with the highest score and the actual score |

#### TopGenres

| Property  | Type   | Description                                                                                                        |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| objectId  | String | unique id for the user post (default field)                                                                        |
| createdAt | Date   | (default auto generated field)                                                                                     |
| updatedAt | Date   | (default auto generated field)                                                                                     |
| userId    | String | users unique Spotify username                                                                                      |
| folk      | Object | dictionary containing top folk song id and top score for that song                                                 |
| pop       | Object | dictionary containing top pop song id and top score for that song                                                  |
| \_\_\_\_  | Object | dictionary containing top \_\_ song id and top score for that song (could be many of these as num genres increase) |
| topGenre  | Object | dictionary containing users top genre, songId, and the top score                                                   |

### Networking

#### List of network requests by screen

- Post
  - (Read/GET) Query all posts in database (sort/filter by time created, comments, likes, views)
  - (Read/GET) Query specific post by id
  - (Create/POST) Create a new like in Likes
  - (Update/PUT) Update likes array on a Post and in Songs
  - (Delete) Delete existing like
  - (Create/POST) Create a new comment in Comments
  - (Update/PUT) Update comments array on a Post and in Songs
  - (Delete) Delete existing comment
  - (Create/POST) Create a new post to add to Posts and check if song has been posted about already, post to Songs accordingly
  - (Update/PUT) Update score for feed ranking
- Profile
  - (Read/GET) Query all posts user has liked
  - (Read/GET) Query all posts user has commented on
  - (Read/GET) Query all posts user has made
  - (Read/GET) Query basic profile information about user (Spotify API)
- Recommendations
  - (Read/GET) Query for most liked song across all posts
  - (Read/GET) Query for most commented on song across all posts
  - (Read/GET) Query for highest rated song across all posts
  - (Read/GET) Query for user's top genre based on Rec table
  - (Read/GET) Query for most relevant song based on aggregate score from Songs
- Statistics
  - (Read/GET) Query moods of songs from specific user and all users
  - (Read/GET) Spotify API (/top/tracks)

#### [OPTIONAL:] Existing API Endpoints

##### Spotify API

- Base URL - [https://api.spotify.com/v1/](https://api.spotify.com/v1/)
  HTTP Verb | Endpoint | Description
  ----------|----------|------------
  `GET` | /top/tracks | gets users top tracks
  `GET` | /me | gets all information from profile
  `GET` | /search/?type=type&q=q&limit=limit | search for albums, artists, or tracks that match keyword string
