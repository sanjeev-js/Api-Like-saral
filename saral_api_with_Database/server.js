const express = require('express');
const app = express();
const fs = require("fs")
const sqlite3 = require('sqlite3')

app.use(express.json());

var courses = express.Router();
app.use("/courses", courses);

var exercises = express.Router();
app.use("/exercises", exercises);

// Task 1 

courses.get('/',(request,response,next)=> {
    let db = new sqlite3.Database("database/saral", (err) => {
        if (!err){
            db.all("SELECT * FROM courses", function (err,rows){
                if (rows){
                    var allcourses =[]
                    console.log(rows)
                    rows.forEach(function(row){
                        allcourses.push({
                            id: row.id,
                            name: row.name,
                            description: row.description
                        });
                    });
                    return response.send(allcourses)
                }return response.send("error in database or No match found")
            });
        }
    });
});

// Task 2

courses.get('/:id', (request, response, next) => {
    let id = request.params.id;
    let db = new sqlite3.Database("database/saral", (err) => {
        if (!err) {
            db.all("SELECT * FROM courses WHERE id = " + id + ";", function (err, rows) {
                if (rows) {
                  let course =
                  {
                      id: rows[0].id,
                      name: rows[0].name,
                      description: rows[0].description
                  };
                  return response.send(course)
                }
                else {
                  return response.send(["Error in DataBase or No match found"])
                }
            });
        };
    });
})

// Task 3

// create new course in the main data table named courses.
courses.post('/', (request, response, next) => {
    let name = request.body.name
    let description = request.body.description
    // return response.send(description)
    let db = new sqlite3.Database("database/saral", (err) => {
        if (err) {
            return response.send(["Error in DataBase"])
        }
        db.run('INSERT INTO courses (name, description) VALUES (?,?)'[request.body.name, request.body.description]);
        db.close();
    return response.send(["Data recorded Successfully"])

    });
    
})

// Task 4

courses.put ("/:id", function(request, response){
    let db = new sqlite3.Database("database/saral", (err) => {
        if (!err){
            db.run(
                `UPDATE courses
                SET name = ?,
                description =?,
                WHERE id = ?`,
                [request.body.name, request.body.description, request.params.id])
                course = request.body
                course['id'] = request.params.id
            return response.json(course)
        }
        return response.json({errMsg: "Error in databse or no match found"})
    })
})

// Task 5
exercises.get('/', (request, response, next) => {
    let db = new sqlite3.Database("database/saral", (err) => {
        if (!err) {
            db.all("SELECT * FROM exercises;", function (err, rows) {
                var allExercises = []
                if (rows) {
                    rows.forEach(function (row) {
                        allExercises.push(
                            {
                                id: row.id,
                                name: row.name,
                                description: row.description,
                                course_id: row.course_id
                            });
                    });
                    return response.send(allExercises)
                }
                return response.send(["Error in DataBase or No match found"])
            });
        };
    });
})

// Task 6

exercises.get('/:id', (request, response, next) => {
    let id = request.params.id;
    let db = new sqlite3.Database("database/saral", (err) => {
        if (!err) {
            db.all("SELECT * FROM exercises WHERE id = " + id + ";", function (err, rows) {
                if (rows) {
                      let exercise =
                      {
                          id: rows[0].id,
                          name: rows[0].name,
                          description: rows[0].description,
                          course_id: rows[0].course_id
                      };
                      return response.send(exercise)
                    
                }
                else {
                  return response.send(["Error in DataBase or No match found"])
                }
            });
        };
    });
})

// Task 7

exercises.post('/', (request, response, next) => {
    let name = request.body.name
    let description = request.body.description
    let course_id = request.body.course_id
    // return response.send(description)
    let db = new sqlite3.Database("database/saral", (err) => {
        if (err) {
            return response.send(["Error in DataBase"])
        }
        db.run('INSERT INTO exercises (name, description, course_id) VALUES (?,?,?)',[request.body.name, request.body.description, request.body.course_id]);
        db.close();
    return response.send(["Data recorded Successfully"])

    });
    
})

// Task 8

exercises.put ("/:id", function(request, response){
    let db = new sqlite3.Database("database/saral", (err) => {
        if (!err){
            db.run(
                `UPDATE exercises
                SET name = ?,
                description =?,
                course_id = ?
                WHERE id = ?`,
                [request.body.name, request.body.description, request.body.course_id, request.params.id])
                exercise = request.body
                exercise['id'] = request.params.id
            return response.json(exercise)
        }
        return response.json({errMsg: "Error in databse or no match found"})
    })
})

// Task 9 

exercises.delete('/:id',(request,response, next)=>{
    let db  = new sqlite3.Database('database/saral',(err)=>{
      if(!err){
        db.run('DELETE FROM exercises WHERE id = ? AND course_id = ?',[request.params.id, request.body.course_id])
        return response.json({message:"Exercise of course " + request.body.course_id + " is deleted"})
      }
    })
  })
  

app.listen (8000, function(err){
    if (!err){
        console.log("server is running properly");
    }else{
        console.log("error in code");
    }
})
