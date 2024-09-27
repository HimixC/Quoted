'use strict';

Quoted.prototype.getHomeQuote = async function() {
  //get documents that match lowest view count sorted by number of upvotes
  try {
    const querySnapshot = 
      await globalThis.quotesRef.orderBy('relative_views', 'asc').orderBy('upvotes', 'desc').limit(1).get();
    querySnapshot.forEach((doc) => {
      globalThis.quoteId = doc.id;

      const doc_data = doc.data();
      this.submitted_by = doc_data['submitted_by'];
      this.quote = doc_data['quote'];
      this.upvotes = doc_data['upvotes'];
      this.views = doc_data['views']+1;
      this.relative_views = doc_data['relative_views']+1;
      globalThis.leastRelViewCnt = doc_data['relative_views'];
    })
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }

  //Update the view counts
  try {
    const quoteRef = globalThis.quotesRef.doc(globalThis.quoteId);
    //update its view count
    const viewInfo = {views: this.views, relative_views: this.relative_views};
    await quoteRef.update(viewInfo);
    console.log("View count updated!");
  } catch (e) {
    console.log('Unable to update view count:', e);
  }

  //set listener to update its upvotes and views each time the value is changed
  globalThis.quotesRef.doc(globalThis.quoteId).onSnapshot(doc => {
    if (doc.exists) {
      const doc_data = doc.data();
      console.log("New upvote count is: ", doc_data['upvotes']);
      document.getElementById('upvote-count').textContent = doc_data['upvotes'];
      console.log("New view count is: ", doc_data['views']);
      document.getElementById('view-count').textContent = doc_data['views'];
    } else {
      console.log("No such document!");
    }
  });
  //return the quote in the document
  return;
}


Quoted.prototype.upvoteHomeQuote = async function() {
  const now = Date.now();
  if(globalThis.last_upvote_details) {
    /*
      Todo: Update condition wrt user login/userUUID. 
    */
    if (globalThis.last_upvote_details['quoteId']==globalThis.quoteId) {
      if (window.confirm("Your upvote has already been recorded... Do you wish to revert your [+1]?")) {
        await revertUpvoteHomeQuote();
      } else {
        console.log('No action needed.');
      }
    }
  } else {
    await upvoteQuote(now);
  }
  return;
}

Quoted.prototype.submitNewQuote = async function(data) {
  try {
    let new_quote = document.getElementById('new-quote');
    let new_submitter = document.getElementById('new-quote-submitter');
    if (new_quote.value.length == 0 || new_submitter.value.length == 0) { 
        alert("Pls enter alphanumeric value in fields.");  	
        return; 
    } 
    const new_quote_document = {
      quote: new_quote.value,
      submitted_by: new_submitter.value,
      views: 0,
      relative_views: globalThis.leastRelViewCnt,
      upvotes: 0
    }
    console.log("New quote: " + new_quote.value + " by " + new_submitter.value + " at rel view count " + globalThis.leastRelViewCnt);
    const newQuoteId = await globalThis.quotesRef.add(new_quote_document);
    //await globalThis.quotesRef.doc(newQuoteId).collection('upvote_info').add({});
    console.log("Submitted as: " + newQuoteId);
    //Reset form
    document.getElementById("new-quote-form").reset();
  } catch (error) {
    console.error("Error in submitting new quote:", error);
    throw error;
  }
}

async function upvoteQuote(now) {
  try {
    await globalThis.db.runTransaction(async (t) => {
      const quoteRef = globalThis.quotesRef.doc(globalThis.quoteId);
      //Add upvote information
      const upvote_info = { upvoted_at: now, upvoted_by: "Anonymous" };
      const upvoteInfoRef = await quoteRef.collection('upvote_info').add(upvote_info);
      /*
        Todo: Replace "Anonymous" with user name once login feature is added.
      */
      console.log("Added upvote info!");

      const doc = await quoteRef.get();
      const doc_data = doc.data();
      //update upvote count
      await quoteRef.update({ upvotes: doc_data['upvotes'] + 1 });
      console.log("Upvote count updated!");

      //record upvote details
      globalThis.last_upvote_details = { 'upvote_info_id': upvoteInfoRef.id, 'quoteId': globalThis.quoteId, 'sessionId': document.location.href };
      console.log(globalThis.last_upvote_details);
    });
    console.log('Upvote Transaction success!');
  } catch (e) {
    console.log('Upvote quote transaction failure:', e);
    throw e;
  }
}

async function revertUpvoteHomeQuote() {
  try {
    await globalThis.db.runTransaction(async (t) => {
      const quoteRef = globalThis.quotesRef.doc(globalThis.quoteId);
      //Remove upvote details
      const upvoteInfoID = globalThis.last_upvote_details['upvote_info_id'];
      console.log(upvoteInfoID);
      await quoteRef.collection('upvote_info').doc(upvoteInfoID).delete();
      console.log("Deleted upvote info!");
      const doc = await quoteRef.get();
      const doc_data = doc.data();
      //update upvote count
      await quoteRef.update({upvotes: doc_data['upvotes']-1});
      console.log("Upvote count updated!");

      //record upvote details
      globalThis.last_upvote_details = null;
      console.log('Last upvote detail cleared');
    });
    console.log('Revert upvote transaction success!');
  } catch (e) {
    console.log('Revert upvote transaction failure:', e);
    throw e;
  }
}

