import React, { useState } from 'react'

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';

import MyPagination from '../components/MyPagination';
import Search from '../components/Search';

export default function Overview() {

    const [page, setPage] = useState(1);

    // generate table data (db dummy data)
    const tableData = [];
    for (let i = 0; i < 50; i++) {
        tableData.push({
            _id: i,
            title: `Title ${i}`,
            description: `Description ${i}`,
            createdAt: `createdAt ${i}`,
            updatedAt: `updatedAt ${i}`,

            link: `https://www.google.com/search?q=${i}`,
            neededReps: 9,
            neededDuration: 80,
            poses: [
                {
                    _id: 1,
                    requirements: [
                        {
                            _id: 1,
                            requiredAngle: 26,
                            angleThreshold: 61,
                            bodyJoint: {
                                _id: 1,
                                label: 'Knie',
                                firstEdgeIndex: 6,
                                secondEdgeIndex: 5,
                                desiredAngle: 12
                            }
                        }
                    ]
                }
            ]
        });
    }

    return (
        <>
            <h2>Exercisebuddy</h2>

            <Search />

            {/* https://react-bootstrap.github.io/components/placeholder/ */}
            <Table hover striped>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Link</th>
                        <th>Needed Reps</th>
                        <th>Needed Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {/* map talbe data 0-10 */}
                    {tableData.slice((page - 1) * 10, (page - 1) * 10 + 10).map(row => (
                        <tr key={row._id}>
                            <td>{row.title}</td>
                            <td>{row.description}</td>
                            <td>{row.createdAt}</td>
                            <td>{row.updatedAt}</td>
                            <td>{row.link}</td>
                            <td>{row.neededReps}</td>
                            <td>{row.neededDuration}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div style={{
                margin: "auto",
                width: "50%",
                textAlign: "center"
            }}>
                {tableData.length !== 0 || <Spinner animation="border" />}
                <MyPagination dataSize={tableData.length} page={page} setPage={setPage} />
                <p>test</p>
            </div>
        </>
    )
}
