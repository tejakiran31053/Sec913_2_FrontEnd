// File Name: TaskManager.jsx

import { useState, useEffect } from "react";
import { callApi } from "../lib.js";

const BASE = "http://127.0.0.1:8000";

function formatTaskId(id) {
    return "TASK-" + String(id).padStart(3, "0");
}



export default function TaskManager() {
    const [tasksList, setTasksList]   = useState([]);
    const [taskName,  setTaskName]    = useState("");
    const [taskDesc,  setTaskDesc]    = useState("");

    const [loading,   setLoading]     = useState(false);
    const [feedback,  setFeedback]    = useState(null);

    // Load tasks from DB on mount
    useEffect(() => { loadTasks(); }, []);

    function loadTasks() {
        callApi("GET", `${BASE}/tasks`, null, null, (res) => {
            if (Array.isArray(res)) setTasksList(res);
        });
    }

    function showFeedback(type, msg) {
        setFeedback({ type, msg });
        setTimeout(() => setFeedback(null), 3000);
    }

    // Add task: POST /tasks
    function handleAddTask() {
        if (!taskName.trim()) {
            showFeedback("error", "Task Name is required.");
            return;
        }

        setLoading(true);
        const payload = { task: taskName.trim(), desc: taskDesc.trim() };
        callApi("POST", `${BASE}/tasks`, payload, null, (res) => {
            setLoading(false);
            if (res && res.code === 200) {
                setTaskName("");
                setTaskDesc("");

                showFeedback("success", "Task added successfully.");
                loadTasks();
            } else {
                showFeedback("error", "Failed to add task: " + (res?.message || "Unknown error"));
            }
        });
    }

    // Delete task: DELETE /tasks/{id}
    function handleDeleteTask(id) {
        if (!window.confirm("Delete " + formatTaskId(id) + "?")) return;
        callApi("DELETE", `${BASE}/tasks/${id}`, null, null, (res) => {
            if (res && res.code === 200) {
                showFeedback("success", formatTaskId(id) + " deleted.");
                loadTasks();
            } else {
                showFeedback("error", "Failed to delete task.");
            }
        });
    }

    return (
        <div className="tm-wrapper">

            {/* Page Header */}
            <div className="tm-header">
                <h2 className="tm-title">Task Manager</h2>
                <span className="tm-count-badge">{tasksList.length} task{tasksList.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Feedback Banner */}
            {feedback && (
                <div className={"tm-feedback tm-feedback-" + feedback.type}>
                    {feedback.msg}
                </div>
            )}

            {/* Add Task Form */}
            <div className="tm-form-card">
                <div className="tm-form-title">Add New Task</div>
                <div className="tm-form-grid">

                    <div className="tm-field-group">
                        <label className="tm-label">Task Name <span className="tm-required">*</span></label>
                        <input
                            className="tm-input"
                            type="text"
                            placeholder="Enter task name"
                            value={taskName}
                            onChange={e => setTaskName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleAddTask()}
                        />
                    </div>



                    <div className="tm-field-group tm-field-full">
                        <label className="tm-label">Description</label>
                        <input
                            className="tm-input"
                            type="text"
                            placeholder="Short description (optional)"
                            value={taskDesc}
                            onChange={e => setTaskDesc(e.target.value)}
                        />
                    </div>

                </div>
                <div className="tm-form-footer">
                    <button
                        className="tm-add-btn"
                        onClick={handleAddTask}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "+ Add Task"}
                    </button>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="tm-table-card">
                <div className="tm-table-title">All Tasks</div>
                {tasksList.length === 0 ? (
                    <div className="tm-empty">
                        <div className="tm-empty-icon">&#128235;</div>
                        <p>No tasks yet. Add your first task above!</p>
                    </div>
                ) : (
                    <div className="tm-table-scroll">
                        <table className="tm-table">
                            <thead>
                                <tr>
                                    <th>TASK ID</th>
                                    <th>TASK NAME</th>
                                    <th>DESCRIPTION</th>

                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasksList.map((t) => (
                                    <tr key={t.id} className="tm-row">
                                        <td>
                                            <span className="tm-id-badge">{formatTaskId(t.id)}</span>
                                        </td>
                                        <td className="tm-task-name">{t.task}</td>
                                        <td className="tm-task-desc">{t.desc || <span className="tm-na">-</span>}</td>

                                        <td>
                                            <button
                                                className="tm-delete-btn"
                                                onClick={() => handleDeleteTask(t.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}
