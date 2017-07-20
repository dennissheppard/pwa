(() => {
  document.addEventListener('DOMContentLoaded', init, false);

  function init() {
    registerServiceWorker();
    addListeners();
    getComments().then((commentList) => renderComments(commentList));
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').then((registration) => {
        console.log(registration);
      }, function(err) {
          console.log(err);
        });
      });
    } else {
      alert('No service worker support in this browser');
    }
  }

  function getComments() {
    return pirateManager.getComments()
    .then((commentList) => commentList);
  }
  var timeout;

  function postComment() {
    document.getElementById('commentBtn').innerHTML = "Posting...";
    localforage.setItem('comment', document.getElementById('comment-text').value);
    navigator.serviceWorker.ready.then((sw) => {
      return sw.sync.register('post-comment')
        .then((args) => {
          timeout = setTimeout(() => {
            localforage.getItem('comment').then((val) => {
              if(val) {
                document.getElementById('no-connection-message').style.display = "block";
                document.getElementById('commentBtn').innerHTML = "Leave a comment";
                document.getElementById('comment-text').value = "";
              } else {
                clearTimeout(timeout);
              }
            });
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  function addListeners() {
    document.getElementById('commentBtn').addEventListener('click', () => postComment());
    navigator.serviceWorker.addEventListener('message', (event) => {
      clearTimeout(timeout);
      document.getElementById('comment-text').value = "";
      document.getElementById('commentBtn').innerHTML = "Leave a comment";
      document.getElementById('no-connection-message').style.display = "none";
      appendComment(document.getElementById('comments'), event.data);
    });
  }

  function resetElements() {
    let comments = document.getElementById('comments');
    comments.innerHTML = "";
  }

  function renderComments(commentList) {
    resetElements();
    let comments = document.getElementById('comments');
    Object.keys(commentList).forEach((key) => {
      let comment = commentList[key];
      appendComment(comments, comment);
    });
  }

  function appendComment(commentsEl, comment) {
    let commentElement = document.createElement('p');
    commentElement.innerHTML = comment.commentText + " - " + comment.date;
    commentsEl.appendChild(commentElement);
    let hrElement = document.createElement('hr');
    commentsEl.appendChild(hrElement);
  }

})();
