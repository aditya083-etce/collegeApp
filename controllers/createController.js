const Post = require("../model/post");

exports.getInputForm = (req, res) => {
    res.render("create-post.ejs");
}

exports.createPost = async (req, res) => {
    let {content, title} = req.body;

    let hashTags = content.split(" ").filter(st => st.startsWith("#"));
    console.log(hashTags);

    // let arr = content.split(" ");
    // for(let i= 0; i<arr.length;i++){
    //     if(arr[i][0] == "#"){
    //         hashTags.push(arr[i]);
    //     }
    // }

    try {
        const post = await Post.create({
            title,
            content,
            type: "Blog",
            author: req.session.user.username,
            date: new Date(),
            upvote: 0,
            hashTags: hashTags,
            upvoteLists : []
        })
        const posts = await Post.find({});
        res.render("posts.ejs", {posts: posts});
    } catch (err) {
        console.log(err)
    }
}
