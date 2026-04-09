import React from 'react';

const SignedUsers = ({ users }) => {
    return (
        <div className="admin-table-container glass-card">
            <div className="table-header">
                <h3>Registered Users</h3>
            </div>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email Address</th>
                            <th>Phone Number</th>
                            <th>Registration Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan="4" className="text-center">No registered users.</td></tr>
                        ) : (
                            users.map(u => {
                                const d = new Date(u.createdAt);
                                return (
                                    <tr key={u.id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.phone || 'N/A'}</td>
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

export default SignedUsers;
