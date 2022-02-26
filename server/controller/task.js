const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/task.js');

const router = express.Router();

//GET all tasks
const getTasks = async (req, res) => {
	try {
		const tasks = await Task.find();
		res.status(200).json(tasks);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

//GET task by id
const getTaskById = async (req, res) => {
	const { id } = req.params;
	try {
		const taskId = await Task.findById(id);
		if (!taskId)
			return res.status(404).send(`there is not task with id: ${id}`);
		res.status(200).json(taskId);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
//CREATE new task
const createTask = async (req, res) => {
	const newTask = new Task(req.body);
	try {
		await newTask.save();
		res.status(201).json(newTask);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
//DELETE task
const deleteTask = async (req, res) => {
	const { id } = req.params;
	try {
		const taskId = await Task.findById(id);
		if (!taskId)
			return res.status(404).send(`there is not task with id: ${id}`);
		await Task.findByIdAndRemove(id);
		res.json({ message: 'Task deleted successfully.' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTask = async (req, res) => {
	const { id } = req.params;
	const { title, description, status, priority } = req.body;
	try {
		const taskId = await Task.findById(id);
		if (!taskId)
			return res.status(404).send(`there is not task with id: ${id}`);
		const updatedTask = {
			title,
			description,
			status,
			priority,
			_id: id,
		};
		await Task.findByIdAndUpdate(id, updatedTask, { new: true });
		res.json(updatedTask);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

//CHANGE status of task
const changeStatus = async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;
	const selectStatus = new Set(['Todo', 'InProgress', 'Done']);
	try {
		const taskId = await Task.findById(id);
		if (!taskId)
			return res.status(404).send(`there is not task with id: ${id}`);
		if (!selectStatus.has(status)) {
			return res.status(404).send('status is wrong');
		}
		const updatedTask = await Task.findByIdAndUpdate(
			id,
			{ status },
			{ new: true }
		);
		res.json(updatedTask);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
	getTasks,
	getTaskById,
	createTask,
	deleteTask,
	updateTask,
	changeStatus,
};
