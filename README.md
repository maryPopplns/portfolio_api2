# Blog API

REST API for my portfolio sites blog.

<br>
## Environment Variables

| Variable | Description |
| :------- | :---------- |
| `ENV`    | prod / dev  |

| Variable | Description |
| :------- | :---------- |
| `PORT`   | 5050        |

| Variable   | Description       |
| :--------- | :---------------- |
| `ATLAS_DB` | MongoDB Atlas url |

| Variable     | Description    |
| :----------- | :------------- |
| `JWT_SECRET` | UUID generated |

| Variable     | Description      |
| :----------- | :--------------- |
| `FROM_EMAIL` | my email address |

| Variable   | Description      |
| :--------- | :--------------- |
| `TO_EMAIL` | my email address |

| Variable         | Description              |
| :--------------- | :----------------------- |
| `EMAIL_PASSWORD` | yahoo generated password |

| Variable         | Description        |
| :--------------- | :----------------- |
| `TEXT_GEARS_API` | text gears api key |

| Variable          | Description          |
| :---------------- | :------------------- |
| `TEXT_2_DATA_API` | text to data api key |

<br>
## API Reference

#### Homepage

```http
  GET /
```

#### get posts

```http
  GET /post
```

#### create post

```http
  POST /post
```

#### edit post

```http
  PUT /post/:postID
```

| Parameter | Type     | Description             |
| :-------- | :------- | :---------------------- |
| `postID`  | `string` | Id of blog post to edit |

#### delete post

```http
  DELETE /post/:postID
```

| Parameter | Type     | Description               |
| :-------- | :------- | :------------------------ |
| `postID`  | `string` | Id of blog post to delete |

#### comment post

```http
  POST /post/comment/:postID
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `postID`  | `string` | Id of blog post to comment on |

#### delete post comment

```http
  DELETE /post/comment/:postID/:commentID
```

| Parameter   | Type     | Description             |
| :---------- | :------- | :---------------------- |
| `postID`    | `string` | Id of blog post         |
| :---------- | :------- | :---------------------- |
| `commentID` | `string` | Id of comment to delete |

#### user login

```http
  POST /user/login
```

#### create user

```http
  POST /user/create
```

#### client

```http
  GET /client
```

#### contact

```http
  POST /contact
```

#### grammar

```http
  POST /grammar
```

<br>
## Authentication

## Tech Stack

**API:** Node, Express, MongoDB. Tested with jest, supertest, nock.

// TODO push to heroku. new UI
