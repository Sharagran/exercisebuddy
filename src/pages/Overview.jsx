import React from 'react'

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';

export default function Overview() {
    return (
        <>
            <h2>Overview</h2>

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
            </Table>

            <div style={{
                margin: "auto",
                width: "50%",
                textAlign: "center"
            }}>
            <Spinner animation="border" />
            



            <Pagination style={{
                alignSelf: "center"
            }}>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>

                <Pagination.Ellipsis />
                <Pagination.Item>{4}</Pagination.Item>
                <Pagination.Item active>{5}</Pagination.Item>
                <Pagination.Item>{6}</Pagination.Item>
                <Pagination.Ellipsis />

                <Pagination.Item>{10}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>
            </div>
        </>
    )
}
