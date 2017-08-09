(() => {
  document.addEventListener('DOMContentLoaded', init, false);

  var newCommentTemplate =
    `<div id="new-comment" class="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
        <div class="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-cell--12-col-desktop">
          <div class="mdl-card__supporting-text mdl-color-text--grey-600">
            <button id="new-comment-post" class="mdl-button" style="background-color: #263238; color: white;">
                Post Comment
            </button>


          </div>
          <div class="mdl-card__actions mdl-card--border">
            <textarea id="comment-text" style="border: none; width: 100%; height: 100px;"></textarea>
          </div>
        </div>
        <div class="demo-separator mdl-cell--1-col"></div>
      </div>`;

  function init() {
    pirateManager.registerServiceWorker();
    addListeners();
    getComments().then((commentList) => renderComments(commentList));
  }

  function getComments() {
    return pirateManager.getComments()
    .then((commentList) => commentList);
  }
  var timeout;

  function showCommentBox() {
    document.getElementById('comments').insertAdjacentHTML('afterbegin', newCommentTemplate);
    document.getElementById('comment-text').focus();
    document.getElementById('new-comment-post').addEventListener('click', () => postComment());
  }

  function postComment() {
    document.getElementById('commentBtn').innerHTML = "<h3>Posting...</h3>";
    localforage.setItem('comment', document.getElementById('comment-text').value).then(() => registerSync());

  }

  function registerSync() {
    navigator.serviceWorker.ready.then((sw) => {
      return sw.sync.register('post-comment')
        .then((args) => {
          timeout = setTimeout(() => {
            localforage.getItem('comment').then((val) => {
              if(val) {
                document.getElementById('no-connection-message').style.display = "block";
                document.getElementById('commentBtn').innerHTML = "<h3>Leave a comment</h3>";
                document.getElementById('comment-text').value = "";
                document.getElementById('new-comment').style.display = "none";
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
    document.getElementById('commentBtn').addEventListener('click', () => showCommentBox());
    navigator.serviceWorker.addEventListener('message', (event) => {
      clearTimeout(timeout);
      document.getElementById('comment-text').value = "";
      document.getElementById('commentBtn').innerHTML = "<h3>Leave a comment</h3>";
      document.getElementById('no-connection-message').style.display = "none";
      document.getElementById('new-comment').style.display = "none";
      appendComment(document.getElementById('comments'), event.data);
    });
    var deferredPrompt;
    window.addEventListener('beforeinstallprompt', (event) => {
      event.userChoice.then((result) => {
        console.log(result.outcome);
        if(result.outcome === 'dismissed') {
          console.log('The app was not added to the home screen');
        } else {
          console.log('The app was added to home screen');
        }
      });
      event.preventDefault();
      deferredPrompt = event;
    });

    // if we wanted to defer the prompt
    // document.getElementById('install-to-home-screen').addEventListener('click', () => {
    //   if(deferredPrompt) {
    //     deferredPrompt.prompt();
    //     deferredPrompt.userChoice.then((result) => {
    //       console.log(result.outcome);
    //       if(result.outcome === 'dismissed') {
    //         console.log('The app was not added to the home screen');
    //       } else {
    //         console.log('The app was added to home screen');
    //       }
    //     });
    //     delete deferredPrompt;
    //   }
    // });
  }

  function resetElements() {
    let comments = document.getElementById('comments');
    comments.innerHTML = "";
  }

  function renderComments(commentList) {
    // resetElements();
    let comments = document.getElementById('comments');
    Object.keys(commentList).forEach((key) => {
      let comment = commentList[key];
      appendComment(comments, comment);
    });
  }

  function appendComment(commentsElement, comment) {
    let commentsEl = commentsElement || document.getElementById('comments');
    const commentHTML =
`
<div class="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
  <div class="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-cell--12-col-desktop">
    <div class="mdl-card__supporting-text mdl-color-text--grey-600">
      ${comment.date}


    </div>
    <div class="mdl-card__actions mdl-card--border">
      <span class="comment-text">
          ${comment.commentText}
      </span>
    </div>
  </div>
  <div class="demo-separator mdl-cell--1-col"></div>
</div>
`;

    commentsEl.insertAdjacentHTML('afterbegin', commentHTML);
  }

})();
