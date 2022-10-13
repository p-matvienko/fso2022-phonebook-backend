const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://dbuser:${password}@cluster0.krceygm.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    phone: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {

    mongoose
        .connect(url)
        .then(() => {

            const person = new Person({
                name: process.argv[3],
                phone: process.argv[4]
            })

            return person.save()
        })
        .then(() => {
            console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
            return mongoose.connection.close()
        })
}

if (process.argv.length === 3) {

    mongoose
        .connect(url)
        .then(() => {

            Person
                .find({})
                .then(result => {

                    console.log('phonebook:')

                    result.forEach(person => {
                        console.log(`${person.name} ${person.phone}`)
                    })
                    mongoose.connection.close()
                })
        })
}