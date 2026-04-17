import React, { useState, useEffect } from 'react';

const SignedUsers = ({ users: propUsers }) => {
    const [users, setUsers] = useState(propUsers || []);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('all_users') || '[]');
        if (stored.length > 0) {
            setUsers(stored);
        } else {
            setUsers(propUsers || []);
        }
    }, []);

    return (
        <div className="admin-table-container glass-card">
            <div className="table-header">
                <h3>User Data</h3>
            </div>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan="3" className="text-center">No registered users.</td></tr>
                        ) : (
                            users.map((u, i) => (
                                <tr key={u.email || i}>
                                    <td>{u.userName || u.displayName || (u.email ? u.email.split('@')[0] : 'User')}</td>
                                    <td>{u.email}</td>
                                    <td>{u.password || '—'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SignedUsers;
