import React from 'react';

const ProjectData = ({ projectData }) => {
    return (
        <div className="admin-table-container glass-card">
            <div className="table-header">
                <h3>User Interaction Project Data</h3>
            </div>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>User Phone Number</th>
                            <th>Animal Type</th>
                            <th>Age</th>
                            <th>Fever</th>
                            <th>Appetite Loss</th>
                            <th>Weakness</th>
                            <th>Temperature</th>
                            <th>Humidity</th>
                            <th>Vaccination Status</th>
                            <th>Submission Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectData.length === 0 ? (
                            <tr><td colSpan="12" className="text-center">No AI prediction data found.</td></tr>
                        ) : (
                            projectData.map(record => {
                                const d = new Date(record.date);
                                const t = record.details || {};
                                return (
                                    <tr key={record.id}>
                                        <td>{record.userName}</td>
                                        <td>{record.userEmail}</td>
                                        <td>{record.userPhone || 'N/A'}</td>
                                        <td>{t.animalType}</td>
                                        <td>{t.age}</td>
                                        <td>{t.fever}</td>
                                        <td>{t.appetiteLoss}</td>
                                        <td>{t.weakness}</td>
                                        <td>{t.temperature}°C</td>
                                        <td>{t.humidity}%</td>
                                        <td>{t.vaccination}</td>
                                        <td>{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
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

export default ProjectData;
