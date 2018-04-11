const express = require('express');
const router = express.Router();
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['127.0.0.1']});

//client.connect()

router.get('/', function (req, res, next) {
    const query = "SELECT * FROM findadoc.doctors";
    client.execute(query)
        .then(result => {
            const doctors = result.rows;
            res.render('doctors', {doctors});
        })
        .catch(err => {
            console.log(err);
            res.status(404).send({msg: err})
        });
});

router.get('/add', function (req, res, next) {
    res.render('add-doctor');
});

router.get('/details/:id', function (req, res, next) {
    const query = "SELECT * FROM findadoc.doctors WHERE doc_id = ?";
    client.execute(query, [req.params.id])
        .then(result => {
            const doctor = result.rows[0];
            res.render('details', {doctor});
        })
        .catch(err => {
            res.status(404).send({msg: err})
        });

});

router.get('/category/:name', function (req, res, next) {
    const query = "SELECT * FROM findadoc.doctors WHERE category = ?";
    client.execute(query, [req.params.name])
        .then(result => {
            const doctors = result.rows;
            res.render('doctors', {doctors});
        })
        .catch(err => {
            res.status(404).send({msg: err})
        });

});

router.post('/add', function (req, res, next) {
const doc_id = cassandra.types.uuid();
    console.log(doc_id);

    res.render('add-doctor');
});

module.exports = router;
