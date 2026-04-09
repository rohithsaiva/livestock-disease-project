import React from 'react';

const Comments = ({ messages }) => {
    return (
        <div className="admin-table-container glass-card">
            <div className="table-header">
                <h3>User Comments & Messages</h3>
            </div>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email Address</th>
                            <th>Message</th>
                            <th>Submission Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length === 0 ? (
                            <tr><td colSpan="4" className="text-center">No comments found.</td></tr>
                        ) : (
                            messages.map(m => {
                                const d = new Date(m.date);
                                return (
                                    <tr key={m.id}>
                                        <td>{m.name || m.userName || 'Guest'}</td>
                                        <td>{m.email || 'N/A'}</td>
                                        <td style={{ maxWidth: '300px', whiteSpace: 'normal' }}>{m.message || m.details}</td>
                                        <td>{d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Comments;
