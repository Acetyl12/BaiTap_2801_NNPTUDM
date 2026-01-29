async function LoadData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        let body = document.getElementById("table-body");
        body.innerHTML = "";
        for (const post of posts) {
            let rowClass = post.isDeleted ? "deleted" : "";
            body.innerHTML += `<tr class="${rowClass}">
                <td>${post.id || ""}</td>
                <td>${post.title || ""}</td>
                <td>${post.views || ""}</td>
                <td><input type='submit' value='delete' onclick='DeletePost("${post.id}")'/></td>
            </tr>`;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

async function Save() {
    let idInput = document.getElementById("id_txt");
    let id = idInput.value.trim();
    let title = document.getElementById("title_txt").value.trim();
    let views = document.getElementById("view_txt").value.trim();
    try {
        if (id === "") {
            let resList = await fetch('http://localhost:3000/posts');
            let posts = await resList.json();
            let maxId = 0;
            for (const post of posts) {
                let numericId = parseInt(post.id, 10);
                if (!Number.isNaN(numericId) && numericId > maxId) {
                    maxId = numericId;
                }
            }
            id = String(maxId + 1);
            let res = await fetch('http://localhost:3000/posts',
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            id: id,
                            title: title,
                            views: views,
                            isDeleted: false
                        }
                    )
                });
            if (res.ok) {
                console.log("them du lieu thanh cong");
            }
        } else {
            let getItem = await fetch("http://localhost:3000/posts/" + id);
            if (getItem.ok) {
                let existing = await getItem.json();
                let res = await fetch('http://localhost:3000/posts/' + id,
                    {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(
                            {
                                ...existing,
                                title: title,
                                views: views
                            }
                        )
                    });
                if (res.ok) {
                    console.log("edit du lieu thanh cong");
                }
            } else {
                let res = await fetch('http://localhost:3000/posts',
                    {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(
                            {
                                id: id,
                                title: title,
                                views: views,
                                isDeleted: false
                            }
                        )
                    });
                if (res.ok) {
                    console.log("them du lieu thanh cong");
                }
            }
        }
        LoadData();
    } catch (error) {
        console.log(error);
    }
}

async function DeletePost(id) {
    try {
        let getItem = await fetch('http://localhost:3000/posts/' + id);
        if (!getItem.ok) {
            return;
        }
        let post = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: true
            })
        });
        if (res.ok) {
            console.log("xoa mem thanh cong");
        }
        LoadData();
    } catch (error) {
        console.log(error);
    }
}

async function LoadComments() {
    try {
        let res = await fetch('http://localhost:3000/comments');
        let comments = await res.json();
        let body = document.getElementById("comments-body");
        if (!body) {
            return;
        }
        body.innerHTML = "";
        for (const comment of comments) {
            body.innerHTML += `<tr>
                <td>${comment.id || ""}</td>
                <td>${comment.postId || ""}</td>
                <td>${comment.text || ""}</td>
                <td><input type='submit' value='delete' onclick='DeleteComment("${comment.id}")'/></td>
            </tr>`;
        }
    } catch (error) {
        console.log(error);
    }
}

async function SaveComment() {
    let idInput = document.getElementById("comment_id_txt");
    let id = idInput.value.trim();
    let postId = document.getElementById("comment_postId_txt").value.trim();
    let text = document.getElementById("comment_text_txt").value.trim();
    try {
        let errorEl = document.getElementById("comment_error");
        if (errorEl) {
            errorEl.textContent = "";
        }
        if (postId === "") {
            if (errorEl) {
                errorEl.textContent = "Vui lòng nhập Post ID cho comment";
            }
            return;
        }
        if (id === "") {
            let resList = await fetch('http://localhost:3000/comments');
            let comments = await resList.json();
            let maxId = 0;
            for (const comment of comments) {
                let numericId = parseInt(comment.id, 10);
                if (!Number.isNaN(numericId) && numericId > maxId) {
                    maxId = numericId;
                }
            }
            id = String(maxId + 1);
            let res = await fetch('http://localhost:3000/comments',
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            id: id,
                            postId: postId,
                            text: text
                        }
                    )
                });
            if (res.ok) {
                console.log("them comment thanh cong");
            }
        } else {
            let getItem = await fetch("http://localhost:3000/comments/" + id);
            if (getItem.ok) {
                let existing = await getItem.json();
                let res = await fetch('http://localhost:3000/comments/' + id,
                    {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(
                            {
                                ...existing,
                                postId: postId,
                                text: text
                            }
                        )
                    });
                if (res.ok) {
                    console.log("edit comment thanh cong");
                }
            } else {
                let res = await fetch('http://localhost:3000/comments',
                    {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(
                            {
                                id: id,
                                postId: postId,
                                text: text
                            }
                        )
                    });
                if (res.ok) {
                    console.log("them comment thanh cong");
                }
            }
        }
        LoadComments();
    } catch (error) {
        console.log(error);
    }
}

async function DeleteComment(id) {
    try {
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: 'DELETE'
        });
        if (res.ok) {
            console.log("xoa comment thanh cong");
        }
        LoadComments();
    } catch (error) {
        console.log(error);
    }
}

LoadData();
LoadComments();
