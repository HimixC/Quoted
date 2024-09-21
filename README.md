# FriendlyEats (Web)

## Introduction

"Quoted" is web application that allows users to view, upvte, and share quotes. It is built on Cloud Firestore(Firebase).
For more information about Firestore visit [the docs][firestore-docs].

This project is built inline with the [Cloud Firestore Web Codelab][codelab], which shows how to build and run the applications step-by-step. 

Features in MVP:
1. View a quote with minimum (relative) views and maximum upvotes so far 
    - Uses firestore: read based on composite indexing.
2. Upvote the displayed quote (once per page load) 
    - Uses firestore: update within transaction.
3. View realtime upvote count for the displayed quote
    - Uses firestore: watch for listens to realtime document updates.
4. Share your quotes
    - Uses firestore: write.


The DB structure is as follows:

Collection(or kind): Quotes
= Collection of Documents( or entities) comprising of Fields( or properties): 
- quote_id: <auto>
- quote: <string>
- submitted_by: <string>
- upvotes: <int> 
- views: <int>
- relative_views: <int>
- upvote_info: <collection>

Sub-Collection: Upvote_info (for a quote (document))
= Collection of Documents( or entities) comprising of Fields( or properties): 
- id: <auto>
- upvoted_at: <timestamp> 
- upvoted_by: <string>
