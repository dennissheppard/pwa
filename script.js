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
                }, function (err) {
                    console.log(err);
                });
            });
        } else {
            console.log('No service worker support in this browser');
        }
    }

    function getComments() {
        return pirateManager.getComments()
            .then((commentList) => commentList);
    }

    function postComment(comment) {
        const data = setupCommentData(comment);
        if (navigator.serviceWorker) {
            navigator.serviceWorker.ready.then((sw) => {
                return sw.sync.register(comment)
                    .then((args) => {
                        appendComment(document.getElementById('comments'), data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        } else {
            pirateManager.postComment(data).then(() => appendComment(document.getElementById('comments'), data));
        }
    }

    function addListeners() {
        document.getElementById('arrghBtn').addEventListener('click', () => postComment('Arrrgh!'));
        document.getElementById('ahoyBtn').addEventListener('click', () => postComment('Ahoy!'));
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