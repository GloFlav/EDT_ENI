import { createConnection } from 'mysql2'

export const connection = createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'timetable_db'
})

connection.connect()


