'use strict'
const subject = require('../model/subjectModel')
const mark = require('../model/markModel');
var ObjectId = require('mongodb').ObjectID;


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var data = {};
var subjectDetails = {};
var sub = {};

module.exports = {


    async subCreate(req, h) {

        subject.create({
            subject: req.payload.subject

        }, (err, saveUser) => {
            if (err) {
                return reply(err).code(500);
            }
            return saveUser
        });
        await MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("exam_3");

            dbo.collection("subjects").find({}).toArray(function (err, result) {
                data = result;
                if (err) throw err;
                db.close();
            });

        });

        return h.view('addSubject', { data })

    },
    async findOneSubject(req, reply) {
        console.log(req.params.id)
        await subject.findById(req.params.id, (err, person) => {
            if (err) {
                return reply(err).code(404);
            }
            subjectDetails = person;

        })

        return reply.view('editSubject', { id: subjectDetails.id, subject: subjectDetails.subject })

    },
    subjectUpdate(req, reply) {
        if (!req.params.id) {
            return reply({ err: 'id is required param' }).code(400);
        }
        let attributes = {};

        if (req.payload.subject) {
            attributes.subject = req.payload.subject;
        }

        subject.findByIdAndUpdate(req.params.id, attributes, { new: true }, (err, company) => {
            if (err) {
                return reply(err).code(500);
            }
            return reply.response(company);
        })
        return reply.view('addSubject')
    },
    async subjectDelete(req, reply) {

        await subject.findByIdAndRemove(req.params.id, (err, result) => {

            if (err) {
                return reply(err).code(500);
            }
            console.log("deleted")
        })
        return reply.view('addSubject')
    },

    async findName(request, reply) {

        await MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("exam_3");

            dbo.collection("students").find({}).toArray(function (err, result) {
                data = result;
                if (err) throw err;
                db.close();
            });
            dbo.collection("subjects").find({}).toArray(function (err, subject) {
                sub = subject;
                if (err) throw err;
                db.close();
            });
        });
        return reply.view('addMarks', { data, sub })

    },
    async submitMark(req, h) {

        console.log("s Id " + req.payload.studentId)
        console.log("sub id :" + req.payload.subjectId)
        console.log("mark :" + req.payload.mark)
        let user = await mark.findOne({ studentId: req.payload.studentId });
        if (user) {
            mark.findOneAndUpdate({ studentId: req.payload.studentId },
                {
                    $push: {

                        subject: [{
                            id: ObjectId(req.payload.subjectId),
                            mark: req.payload.mark
                        }]

                    }
                },
                function (error, success) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(success);
                    }
                });

        } else {
            mark.create({
                studentId: req.payload.studentId,
                subject: [{
                    id: req.payload.subjectId,
                    mark: req.payload.mark
                }]


            }, (err, saveUser) => {
                if (err) {
                    return reply(err).code(500);
                }
                return saveUser
            });

        }
        const value = await new Promise((resolve, reject) => {

            mark.aggregate([
                {
                    $lookup:
                    {

                        from: "subjects",
                        localField: "subject.id",
                        foreignField: "_id",
                        as: "data"
                    }
                },
                {
                    $lookup:
                    {

                        from: "students",
                        localField: "studentId",
                        foreignField: "_id",
                        as: "datas"
                    }
                },
                {
                    $project: {

                        name: "$datas.name",
                        subject: "$data.subject",
                        mark: "$subject.mark",
                    }
                }

            ], (err, saveUser) => {
                if (err) {
                    return reply(err).code(500);
                }
                resolve(saveUser)
            })
        })

        console.log("haii" + value.subject)
        return h.view('addMarks', { value })

    },
    async viewMark(req, h) {
        const value = await new Promise((resolve, reject) => {

            mark.aggregate([
                {
                    $lookup:
                    {

                        from: "subjects",
                        localField: "subject.id",
                        foreignField: "_id",
                        as: "data"
                    }
                },
                {
                    $lookup:
                    {

                        from: "students",
                        localField: "studentId",
                        foreignField: "_id",
                        as: "datas"
                    }
                },
                {
                    $project: {

                        name: "$datas.name",
                        subject: "$data.subject",
                        mark: "$subject.mark",
                    }
                }

            ], (err, saveUser) => {
                if (err) {
                    return reply(err).code(500);
                }
                resolve(saveUser)
            })
        })
        const price = await new Promise((resolve, reject) => {
            var arr1 = [];
            for (var x in value) {
                arr1.push(value[x].subject)
            }
            var arr2 = [];
            for (var x in value) {
                arr2.push(value[x].mark)
            }
            let n1 = arr1.length;
            let n2 = arr2.length;
            let arr3 = new Array(n1+n2);
            alternateMerge(arr1, arr2, n1, n2, arr3);
            function alternateMerge(arr1, arr2, n1,
                n2, arr3) {
                let i = 0, j = 0, k = 0;

                // Traverse both array
                while (i < n1 && j < n2) {
                    arr3[k++] = arr1[i++];
                    arr3[k++] = arr2[j++];
                }

                // Store remaining elements of first array
                while (i < n1)
                    arr3[k++] = arr1[i++];

                // Store remaining elements of second array
                while (j < n2)
                    arr3[k++] = arr2[j++];
            }

           
 

            for (let i=0; i < n1+n2; i++){
                console.log(arr3[i] + " ");
            }
            
            resolve(arr3);
        })



        return h.response(price)
    },

}