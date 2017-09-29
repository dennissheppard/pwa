var pirateManager = (() => {
    return {
        getComments: getComments,
        postComment: postComment,
        setupCommentData: setupCommentData
    };

    function getComments() {
        return fetch('https://pirates-b74f7.firebaseio.com/commentList.json')
            .then((response) => response.json())
            .then((data) => {
                this.commentList = data;
                return this.commentList;
            });
    }

    function postComment(commentData) {
        let data = JSON.stringify(commentData);

        return fetch("https://pirates-b74f7.firebaseio.com/commentList.json",
            {
                method: "POST",
                body: data
            })
            .then((response) => {
                response.json();
            });
    }

    function setupCommentData(comment) {
        const d = new Date();
        const date = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

        const data = {
            commentText: comment,
            date: date
        };
        return data;
    }

})();