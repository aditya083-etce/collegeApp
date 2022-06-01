const User = require("../model/user")
const bcrypt = require("bcrypt")

exports.logout = async (req, res) => {
    await req.session.destroy();
    res.redirect("/");
}

exports.postSignUp = async (req, res) => {
    try {
        let { fullName, email, password } = req.body;

        let username = email.split("@")[0]

        let hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: fullName,
            email: email,
            password: hashedPassword,
            admin: false,
            username: username,
            posts: [{}]
        })

        req.session.isLoggedIn = true;
        req.session.user = user;
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
}

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email: email });
        console.log(user)

        if (user) {
            let hashedPassword = user.password

            const result = await bcrypt.compare(password, hashedPassword);

            if (result) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                res.redirect("/");
            } else {
                await req.flash('message', "Invalid email or password ")
                res.redirect("/login")
            }
        } else {
            await req.flash('message', "Invalid email or password ")
            res.redirect("/login")
        }
    } catch (err) {
        console.log(err)
    }
}

exports.getLogin = async (req, res) => { // res.setHeader('Set-Cookie','isLogged=True')
    const message = await req.consumeFlash('message')
    res.render("register/login", { message: message[0] });
}

exports.getSignUp = (req, res) => {
    res.render("register/signup");
}
