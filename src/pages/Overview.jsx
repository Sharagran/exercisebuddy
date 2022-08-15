import React from 'react'

import '../styles/Overview.css'

export default function Overview() {
    return (
        <>
            <h2>Overview</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Author</th>
                        <th>Creation date</th>

                        <th>StartAngle</th>
                        <th>AngleThreshhold</th>
                        <th>JointIndex</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Generate 10 entries */}
                    {Array(10).fill(0).map((_, index) => (
                        <tr key={index}>
                            <td>Stickman</td>
                            <td>Jakob</td>
                            <td>2019-01-01</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
