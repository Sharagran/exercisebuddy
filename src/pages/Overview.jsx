import React, { useState } from 'react'

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";

import MyPagination from '../components/MyPagination';
import Search from '../components/Search';

import dummyData from '../dummy_data/exercises.json';

export default function Overview() {

    const [page, setPage] = useState(1);
    let navigate = useNavigate();

    const tableData = dummyData;

    return (
        <>
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
                    {tableData.slice((page - 1) * 10, (page - 1) * 10 + 10).map(exercise => (
                        <tr key={exercise._id} onClick={() => {
                            navigate(`/exercise/${exercise._id}`);
                        }}>
                            <td>{exercise.title}</td>
                            <td>{exercise.description}</td>
                            <td>{exercise.createdAt}</td>
                            <td>{exercise.updatedAt}</td>
                            <td>{exercise.link}</td>
                            <td>{exercise.neededReps}</td>
                            <td>{exercise.neededDuration}</td>
                            {/* <Exercise key={exercise._id} {...exercise} /> */ }
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
