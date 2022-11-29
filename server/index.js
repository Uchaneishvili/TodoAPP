/** @format */

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const todoTasks = require('./models/todoTasks');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

var cors = require('cors');

app.use(express.json());
app.use(cors());

mongoose.connect(
	'mongodb+srv://guchaneishvili:Gig@20003030@cluster0.p6fos.mongodb.net/todoApp?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

const swaggerOption = {
	swagger: '2.0',
	swaggerDefinition: {
		info: {
			title: 'Todo API',
			description: 'Todo API information',
			contact: {
				name: 'Giga Uchaneishvili',
			},
			servers: ['http://localhost:3001'],
		},
	},

	// ['.routes/*js]
	apis: ['index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOption);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Routes

/**
 * @swagger
 * /read:
 *  get:
 *    summary: Get all todo list.
 *    responses:
 *      '200':
 *        description: A successfull response
 *
 */
app.get('/read', async (req, res) => {
	try {
		let query = todoTasks.find({});

		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 5;
		const skip = (page - 1) * pageSize;
		const total = await todoTasks.countDocuments();

		const pages = Math.ceil(total / pageSize);

		query = query.skip(skip).limit(pageSize);
		const result = await query;

		res.status(200).json({
			status: 'Success',
			count: result.length,
			page,
			pages,
			data: result,
		});
		
	} catch (error) {
		console.log(error);

		res.status(500).json({
			status: 'Failed',
			message: 'Server Error 🆘 ',
		});
	}
});

/**
 *  @swagger
 *
 * paths:
 *   /read/{id}:
 *     get:
 *       summary: Get specific todo task info.
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *           type: string
 *           required: true
 *           description: id of todo task
 *       responses:
 *         201:
 *           description: OK
 */
app.get('/read/:id', async (req, res) => {
	const id = req.params.id;

	todoTasks.findById(id, (err, result) => {
		if (err) {
			res.send(err);
		}

		res.send(result);
	});
});

/**
 *  @swagger
 *
 * paths:
 *   /insert:
 *     post:
 *       summary: Creates a new Todo.
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: Todo
 *           description: Creates a new  Todo task.
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *       responses:
 *         200:
 *           description: Created
 */
app.post('/insert', async (req, res) => {
	const { name } = req.body;

	const task = new todoTasks({
		name: name,
		overline: false,
	});
	try {
		await task.save();
		res.send(task);
	} catch (error) {
		console.log(error);
		res.send(error);
	}
});

/**
 *  @swagger
 *
 * paths:
 *   /update/{id}:
 *     put:
 *       summary: update a Todo task.
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: path
 *           name: id
 *           type: string
 *           required: true
 *           description: id of task
 *         - in: body
 *           name: Todo
 *           description: update a Todo task.
 *           schema:
 *             type: object
 *             properties:
 *               overline:
 *                 type: boolean
 *       responses:
 *         200:
 *           description: updated
 */
app.put('/update/:id', async (req, res) => {
	const { overline } = req.body;
	const { id } = req.params;

	try {
		const updateTask = await todoTasks.findByIdAndUpdate(id, {
			overline: overline,
		});

		updateTask.save();

		res.send(updateTask);
	} catch (error) {
		console.log(error);
	}
});

/**
 *  @swagger
 *
 * paths:
 *   /delete/{id}:
 *     delete:
 *       summary: Delete a todo task.
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *           type: string
 *           required: true
 *           description: id of task
 *       responses:
 *         201:
 *           description: OK
 */
app.delete('/delete/:id', async (req, res) => {
	const id = req.params.id;
	await todoTasks.findByIdAndRemove(id).exec();

	res.send('deleted !♻️');
});

app.listen(3001, () => {
	console.log('🚀 Server running on port 3001... ');
});
