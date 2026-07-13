const express = require("express");
const db = require("../database");

const router = express.Router();

/* ==========================================
   CREATE PROJECT
========================================== */

router.post("/", (req, res) => {

    const {
        title,
        description,
        category,
        budget,
        deadline,
        owner
    } = req.body;

    if (!title || !description || !category) {

        return res.status(400).json({
            success: false,
            message: "Please fill all required fields"
        });

    }

    db.run(

        `INSERT INTO projects
        (title,description,category,budget,deadline,owner)
        VALUES(?,?,?,?,?,?)`,

        [
            title,
            description,
            category,
            budget || "",
            deadline || "",
            owner || null
        ],

        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({
                success: true,
                message: "Project Created Successfully",
                projectId: this.lastID
            });

        }

    );

});


/* ==========================================
   GET ALL PROJECTS
========================================== */

router.get("/", (req, res) => {

    db.all(

        `SELECT *
         FROM projects
         ORDER BY created_at DESC`,

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({
                success: true,
                projects: rows
            });

        }

    );

});


/* ==========================================
   MY PROJECTS
========================================== */

router.get("/owner/:ownerId", (req, res) => {

    db.all(

        `SELECT *
         FROM projects
         WHERE owner=?
         ORDER BY created_at DESC`,

        [req.params.ownerId],

        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({
                success: true,
                projects: rows
            });

        }

    );

});


/* ==========================================
   GET SINGLE PROJECT
========================================== */

router.get("/:id", (req, res) => {

    db.get(

        `SELECT *
         FROM projects
         WHERE id=?`,

        [req.params.id],

        (err, row) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (!row) {

                return res.status(404).json({
                    success: false,
                    message: "Project Not Found"
                });

            }

            res.json({
                success: true,
                project: row
            });

        }

    );

});


/* ==========================================
   UPDATE PROJECT
========================================== */

router.put("/:id", (req, res) => {

    const {

        title,
        description,
        category,
        budget,
        deadline

    } = req.body;

    db.run(

        `UPDATE projects
         SET
         title=?,
         description=?,
         category=?,
         budget=?,
         deadline=?
         WHERE id=?`,

        [

            title,
            description,
            category,
            budget,
            deadline,
            req.params.id

        ],

        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({

                success: true,
                message: "Project Updated"

            });

        }

    );

});


/* ==========================================
   DELETE PROJECT
========================================== */

router.delete("/:id", (req, res) => {

    db.run(

        `DELETE FROM projects
         WHERE id=?`,

        [req.params.id],

        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({

                success: true,
                message: "Project Deleted"

            });

        }

    );

});


module.exports = router;