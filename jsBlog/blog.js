(function () {
    'use strict';

    const mainDiv = document.querySelector('#div1');
    const returnToHomeBtn = document.createElement('button');
    returnToHomeBtn.innerText = 'Return to Home Page';
    returnToHomeBtn.addEventListener('click', () => {
        mainDiv.innerHTML = '';
        layout();
    });

    //load any page
    async function loadPage(page) {
        let loaded;
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/${page}`);
            if (!response.ok) {
                console.log(`${response.status} - ${response.statusText}`);
            }
            loaded = await response.json();
        } catch (e) {
            console.error(e);
        }
        return loaded;
    }

    //create main page/blog div
    function allPurpose(buttonText, divClass, obj, html, callback) {
        const allPurposeDiv = document.createElement('div');
        const allPurposeButton = document.createElement('button');
        allPurposeButton.innerText = buttonText;
        allPurposeDiv.className = divClass;
        allPurposeDiv.id = obj.id;
        allPurposeDiv.innerHTML = html;
        allPurposeButton.addEventListener('click', callback);
        allPurposeDiv.appendChild(allPurposeButton);
        mainDiv.appendChild(allPurposeDiv);
    }

    async function layout() {
        const userFile = await loadPage('users');
        
        userFile.forEach(user => {
            const userString = `<h3>${user.username}</h3> ${user.website} <h3>${user.company.name}</h3> 
                                a <p>${user.company.catchPhrase}</p> <p> where we  </p> <p>${user.company.bs}</p>`;
            allPurpose('Load posts', 'singleDiv', user, userString, loadPosts);
        });

    }

    async function loadPosts(e) {
        const posts = await loadPage(`posts?userId=${e.target.parentElement.id}`);
        mainDiv.innerHTML = '';
        mainDiv.appendChild(returnToHomeBtn);
        mainDiv.scroll(0, 0);
        posts.forEach(post => {
            const postString = `<h4>${post.title}</h4> <p>${post.body}</p>`;
            allPurpose('Show Comments', 'postDiv', post, postString, loadComments);
        });
    }

    async function loadComments(e) {
        const mainCommentDiv = document.createElement('div');
        if (e.target.className === '') {
            console.log(e.target.className);
            const comments = await loadPage(`comments?postId=${e.target.parentElement.id}`);
            mainCommentDiv.className = 'comments';
            e.target.parentElement.appendChild(mainCommentDiv);
            e.target.innerText = 'Hide Comments';
            e.target.className === 'targetButton';

            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.innerHTML = `<h4>${comment.name}</h4> <p>${comment.email}<p> <p>${comment.body}</p>`;
                mainCommentDiv.appendChild(commentDiv);
            });
            e.target.removeEventListener('click', loadComments);
            e.target.addEventListener('click', hideAndShow/* (r) => {
                if (mainCommentDiv.className === 'hidden') {
                    r.target.innerText = 'Hide Comments';
                    mainCommentDiv.className = 'comments';
                } else {
                    r.target.innerText = 'Show Comments';
                    mainCommentDiv.className = 'hidden';
                }
            }*/);
        }

        function hideAndShow(e) {
            if (mainCommentDiv.className === 'hidden') {
                e.target.innerText = 'Hide Comments';
                mainCommentDiv.className = 'comments';
            } else {
                e.target.innerText = 'Show Comments';
                mainCommentDiv.className = 'hidden';
            }
        }
    }
    layout();
}());