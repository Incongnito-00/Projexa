const express = require("express");
const db = require("../database");

const router = express.Router();

/* ===========================================
   APPLY TO A PROJECT
=========================================== */

router.post("/", (req, res) => {

    const { project_id, applicant_id, proposal } = req.body;

    if (!project_id || !applicant_id || !proposal) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // Prevent duplicate applications
    db.get(
        `SELECT * FROM applications
         WHERE project_id=? AND applicant_id=?`,
        [project_id, applicant_id],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (row) {
                return res.status(400).json({
                    success: false,
                    message: "You have already applied to this project."
                });
            }

            db.run(
                `INSERT INTO applications
                (project_id, applicant_id, proposal)
                VALUES(?,?,?)`,
                [project_id, applicant_id, proposal],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.json({
                        success: true,
                        message: "Application submitted successfully",
                        id: this.lastID
                    });

                }
            );

        }
    );

});


/* ===========================================
   MY APPLICATIONS
=========================================== */

router.get("/user/:id", (req, res) => {

    db.all(

        `SELECT
        applications.*,
        projects.title,
        projects.category,
        projects.budget,
        projects.deadline
        FROM applications
        JOIN projects
        ON projects.id = applications.project_id
        WHERE applicant_id=?`,

        [req.params.id],

        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                applications: rows
            });

        }

    );

});


/* ===========================================
   VIEW APPLICANTS
=========================================== */

router.get("/project/:id", (req, res) => {

    db.all(

        `SELECT
        applications.id,
        applications.proposal,
        applications.status,
        applications.created_at,
        users.id AS user_id,
        users.fullname,
        users.email
        FROM applications
        JOIN users
        ON users.id = applications.applicant_id
        WHERE applications.project_id=?`,

        [req.params.id],

        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                applicants: rows
            });

        }

    );

});


/* ===========================================
   ACCEPT APPLICANT
=========================================== */

router.put("/:id/accept", (req, res) => {

    db.run(

        `UPDATE applications
         SET status='Accepted'
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
                message: "Applicant Accepted"
            });

        }

    );

});


/* ===========================================
   REJECT APPLICANT
=========================================== */

router.put("/:id/reject", (req, res) => {

    db.run(

        `UPDATE applications
         SET status='Rejected'
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
                message: "Applicant Rejected"
            });

        }

    );

});

module.exports = router;