import React from 'react';

const SignedUsers = ({ users }) => {
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
                            users.map(u => {
                                const displayName = u.displayName || u.name || (u.email ? u.email.split('@')[0] : 'N/A');
                                return (
                                    <tr key={u.id || u.email}>
                                        <td>{displayName}</td>
                                        <td>{u.email}</td>
                                        <td>{u.password || '—'}</td>
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

export default SignedUsers;
