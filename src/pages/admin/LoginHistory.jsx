import React from 'react';

const LoginHistory = ({ loginHistory }) => {
    return (
        <div className="admin-table-container glass-card">
            <div className="table-header">
                <h3>Login Users History</h3>
            </div>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>Login Date</th>
                            <th>Login Time</th>
                            <th>Logout Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loginHistory.length === 0 ? (
                            <tr><td colSpan="5" className="text-center">No login history found.</td></tr>
                        ) : (
                            loginHistory.map(record => (
                                <tr key={record.sessionId}>
                                    <td>{record.userName || 'Unknown'}</td>
                                    <td>{record.userEmail || 'Unknown'}</td>
                                    <td>{record.loginDate}</td>
                                    <td>{record.loginTime}</td>
                                    <td>{record.logoutTime || 'Active'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LoginHistory;
