import React from 'react';

const ProjectData = ({ projectData }) => {
    const sorted = [...projectData].sort((a, b) => new Date(b.date) - new Date(a.date));
    return (
        <div className="admin-table-container glass-card">
            <div className="table-header">
                <h3>Animal Records</h3>
            </div>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Animal Type</th>
                            <th>Input Data</th>
                            <th>Prediction Result</th>
                            <th>Date / Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.length === 0 ? (
                            <tr><td colSpan="5" className="text-center">No animal records found.</td></tr>
                        ) : (
                            sorted.map(record => {
                                const d = new Date(record.date);
                                const t = record.details || {};
                                const userName = record.displayName || record.userName || (record.userEmail ? record.userEmail.split('@')[0] : 'User');
                                const inputSummary = [
                                    t.age ? `Age: ${t.age}` : '',
                                    t.fever ? `Fever: ${t.fever}` : '',
                                    t.appetiteLoss ? `Appetite Loss: ${t.appetiteLoss}` : '',
                                    t.weakness ? `Weakness: ${t.weakness}` : '',
                                    t.temperature ? `Temp: ${t.temperature}°C` : '',
                                    t.humidity ? `Humidity: ${t.humidity}%` : '',
                                    t.vaccination ? `Vaccine: ${t.vaccination}` : '',
                                ].filter(Boolean).join(', ');

                                return (
                                    <tr key={record.id}>
                                        <td>{userName}</td>
                                        <td>{t.animalType || '—'}</td>
                                        <td style={{ fontSize: '0.82rem', maxWidth: '260px', whiteSpace: 'normal' }}>{inputSummary || '—'}</td>
                                        <td>{t.prediction || record.prediction || '—'}</td>
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
