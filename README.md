# Quoted (Web)

Project hosted [here](http://quoted-1b.web.app) with firebase

## Introduction

"Quoted" is web application that allows users to view, upvote, and share quotes. It is built on Cloud Firestore(Firebase).
For more information about Firestore visit [the docs](https://firebase.google.com/docs/firestore).

This project is built inline with the [Cloud Firestore Web Codelab](https://firebase.google.com/codelabs/firestore-web#0), which shows how to build and run the applications step-by-step. 

### Features in MVP:
1. View a quote on home page
    - Uses firestore: read ('get' function).
    - The logic promotes normalising view count for each quote and shows the most upvoted quote in that range using composite indexing. 
2. Upvote the displayed quote (once per page load) 
    - Uses firestore: update documents within transaction.
3. See realtime upvote and view count for the displayed quote
    - Uses firestore: watch for listens to realtime document updates.
4. Share your quotes
    - Uses firestore: write ('add' function).
    - New quotes are added with a relative view count(the then least relative view count) to align with the normalised viewing logic on page reset. This allows the new quote to be displayed without repetition. 
5. Anonymous user authentication and authorization
    - Uses firebase auth and firestore rules for respective purposes.

### DB model:

Collection(or kind): Quotes
= Collection of Documents (or entities) comprising of the following Fields (or properties): 
- quote_id: auto
- quote: string
- submitted_by: string
- upvotes: int
- views: int
- relative_views: int
- upvote_info: collection

Sub-Collection: Upvote_info (for a quote (document))
= Collection of Documents comprising of the following Fields: 
- id: auto
- upvoted_at: timestamp
- upvoted_by: string
