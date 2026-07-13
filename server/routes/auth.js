const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "projexa_secret_key";

/* ==========================================
   REGISTER
========================================== */

router.post("/register", async (req, res) => {

    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {

        return res.status(400).json({
            success: false,
            message: "Please fill all fields"
        });

    }

    db.get(

        "SELECT * FROM users WHERE email=?",

        [email],

        async (err, user) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (user) {

                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                });

            }

            try {

                const hashedPassword = await bcrypt.hash(password, 10);

                db.run(

                    `INSERT INTO users
                    (fullname,email,password)
                    VALUES(?,?,?)`,

                    [

                        fullname,
                        email,
                        hashedPassword

                    ],

                    function (err) {

                        if (err) {

                            return res.status(500).json({

                                success: false,
                                message: err.message

                            });

                        }

                        res.status(201).json({

                            success: true,
                            message: "Registration Successful",
                            userId: this.lastID

                        });

                    }

                );

            }

            catch (error) {

                res.status(500).json({

                    success: false,
                    message: error.message

                });

            }

        }

    );

});


/* ==========================================
   LOGIN
========================================== */

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({

            success: false,
            message: "Email and Password are required"

        });

    }

    db.get(

        "SELECT * FROM users WHERE email=?",

        [email],

        async (err, user) => {

            if (err) {

                return res.status(500).json({

                    success: false,
                    message: err.message

                });

            }

            if (!user) {

                return res.status(401).json({

                    success: false,
                    message: "Invalid email or password"

                });

            }

            try {

                const validPassword = await bcrypt.compare(

                    password,

                    user.password

                );

                if (!validPassword) {

                    return res.status(401).json({

                        success: false,
                        message: "Invalid email or password"

                    });

                }

                const token = jwt.sign(

                    {

                        id: user.id,

                        email: user.email

                    },

                    JWT_SECRET,

                    {

                        expiresIn: "7d"

                    }

                );

                res.json({

                    success: true,

                    message: "Login Successful",

                    token,

                    user: {

                        id: user.id,

                        fullname: user.fullname,

                        email: user.email

                    }

                });

            }

            catch (error) {

                res.status(500).json({

                    success: false,
                    message: error.message

                });

            }

        }

    );

});


/* ==========================================
   GET USER PROFILE
========================================== */

router.get("/user/:id", (req, res) => {

    db.get(

        `SELECT
        id,
        fullname,
        email,
        created_at
        FROM users
        WHERE id=?`,

        [req.params.id],

        (err, user) => {

            if (err) {

                return res.status(500).json({

                    success: false,
                    message: err.message

                });

            }

            if (!user) {

                return res.status(404).json({

                    success: false,
                    message: "User not found"

                });

            }

            res.json({

                success: true,
                user

            });

        }

    );

});

module.exports = router;