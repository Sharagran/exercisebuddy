import React, { useState } from 'react'

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';

import MyPagination from '../components/MyPagination';
import Search from '../components/Search';

export default function Overview() {

    const [page, setPage] = useState(1);

    // generate table data
    const tableData = [];
    for (let i = 0; i < 50; i++) {
        tableData.push({
            id: i,
            name: 'name ' + i,
            author: 'author ' + i,
            created: 'created ' + i,

            startAngle: 'StartAngle ' + i,
            angleThreshhold: 'AngleThreshhold ' + i,
            jointIndex: 'jointIndex ' + i
        });
    }

    return (
        <>
            <h2>Overview</h2>

            <Search />

            {/* https://react-bootstrap.github.io/components/placeholder/ */}
            <Table hover striped>
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
                    {/* map talbe data 0-10 */}
                    {tableData.slice((page - 1) * 10, (page - 1) * 10 + 10).map(row => (
                        <tr key={row.id}>
                            <td>{row.name}</td>
                            <td>{row.author}</td>
                            <td>{row.created}</td>
                            <td>{row.startAngle}</td>
                            <td>{row.angleThreshhold}</td>
                            <td>{row.jointIndex}</td>
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
