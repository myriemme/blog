#mongodb commands
*   help
*   show dbs
*   use
        use restful_blog_app
*   insert
        db.dogs.insert({name: "Lulu", breed: "Poodle"})
*   find
        db.dogs.find()
*   update
        db.dogs.update({name: "rusty"}, {$set: {name: "Tater", isCute: true}})
*   remove
        db.dogs.remove({breed: "labradoodle"})
