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

  function postComment() {
    navigator.serviceWorker.ready.then((sw) => {
      return sw.sync.register('post-message')
        .then((args) => {
          appendComment(document.getElementById('comments'), pirateManager.getCommentData());
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  function addListeners() {
    document.getElementById('arrghBtn').addEventListener('click', () => sayArrrgh());
    document.getElementById('ahoyBtn').addEventListener('click', () => sayAhoy());
  }

  function sayArrrgh() {
    pirateManager.setMessageText('Arrrgh!');
    postComment();
  }

  function sayAhoy() {
    pirateManager.setMessageText('Ahoy!');
    postComment();
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