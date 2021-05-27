"use strict";
const adminController=require('../Controller/adminController')
const studentController=require('../Controller/studentController')
const subjectController=require('../Controller/subjectController')
const Path=require('path')

module.exports = [
    {
        method: "GET",
        path: "/",
        options: {
            auth: false
        },
        handler: (request, h) => {
            return h.view('index')
        }

    },
    {
        method: "GET",
        path: "/register",
        options: {
            auth: false
        },
        handler: (request, h) => {
            return h.view('registration')
        }

    },
    {
        method: "GET",
        options: {
            auth: false
        },
        path: "/login",
        handler: (request, h) => {
            return h.view('login')
        }

    },
    {
        method: "POST",
        path: "/adminRegister",
        options: {
            auth: false
        },
        handler: adminController.create

    },
    {
        method: 'POST',
        path: '/loginAdmin',
        options: {
            auth: {
                mode: 'try'
            }
        },
        handler: adminController.checkLogin
    },

    {
        method: "GET",
        path: "/addStudents",
        options: {
            auth: false
        },
        handler: (request, h) => {
            return h.view('addStudent')
        }

    },
    {
        method: "GET",
        path: "/addSubject",
        options: {
            auth: false
        },
        handler: (request, h) => {
            return h.view('addSubject')
        }

    },

    {
        method: "POST",
        path: "/addStudent",

        options: {
            auth: false,
            payload: {
              maxBytes: 209715200,
              output: 'stream',
              parse: true,
              multipart: true     // <-- this fixed the media type error
            },
        },
        handler: studentController.create

    },
    {
        method: "GET",
        path: "/studentEdit/{id}",
        options: {
            auth: false
        },
        handler: studentController.findOne

    },
    {
        method: "POST",
        path: "/submitEdit/{id}",
        options: {
            auth: false,
            payload: {
              maxBytes: 209715200,
              output: 'stream',
              parse: true,
              multipart: true     // <-- this fixed the media type error
            },
        },
        handler: studentController.update

    },
    {
        method: "GET",
        path: "/studentDelete/{id}",
        options: {
            auth: false
        },
        handler: studentController.delete

    },
    {
        method: "POST",
        path: "/addSubject",
        options: {
            auth: false
        },
        handler: subjectController.subCreate

    },
    {
        method: "GET",
        path: "/subjectEdit/{id}",
        options: {
            auth: false
        },
        handler: subjectController.findOneSubject

    },
    {
        method: "POST",
        path: "/subjectUpdate/{id}",
        options: {
            auth: false
        },
        handler: subjectController.subjectUpdate

    },
    {
        method: "GET",
        path: "/subjectDelete/{id}",
        options: {
            auth: false
        },
        handler: subjectController.subjectDelete

    },
    {
        method: "GET",
        path: "/addMarks",
        options: {
            auth: false
        },
        handler: subjectController.findName

    },
    {
        method: "POST",
        path: "/submitMark",
        options: {
            auth: false
        },
        handler: subjectController.submitMark

    },
    {
        method: "GET",
        path: "/viewMark",
        options: {
            auth: false
        },
        handler: subjectController.viewMark

    },
    {
        method: 'GET',
        path: '/image/{file*}',
        options: {
            auth: false
        },
        handler: {
            directory: {
                path: 'public/images',
                listing: true
            }
        }
    }
];