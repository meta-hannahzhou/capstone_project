# Capstone Project - Spec File

Repository for MetaU capstone project. This README is a shortened version of the broader README that only contains specific information about the table schemas/API requests.

## Table of Contents

1. [Models](#Models)
1. [Networking](#Networking)

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
  - (Read/GET) Query for ML-based song recommendation
  - (Read/GET) Query for TF-IDF based song recommendation
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

##### YouTube API

- Base URL - [https://developers.google.com/apis-explorer/#p/youtube/v3/](https://developers.google.com/apis-explorer/#p/youtube/v3/)

  | HTTP Verb | Endpoint             | Description                                                           |
  | --------- | -------------------- | --------------------------------------------------------------------- |
  | `GET`     | /youtube.search.list | get a list of videos that match a certain query (general information) |
  | `GET`     | /youtube.videos.list | get specific information about avideo based on video id               |
