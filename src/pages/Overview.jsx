import React, { useState } from 'react'

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";

import MyPagination from '../components/MyPagination';
import Search from '../components/Search';

import dummyData from '../dummy_data/exercises.json';

export default function Overview() {

    let navigate = useNavigate();

    function setPage(page) {
        setSearchParams({ ...searchParams, page });

        // TODO: usability: Seitenwechsel oder nur Suchparameter wechsel im History stack speichern???
        navigate('/', {
            state: searchParams,
            replace: true // ersetzt den letzen Eintrag im History Stack (back button führt dann nicht mehr zurück) https://reach.tech/router/api/navigate
        });
    }

    const [searchParams, setSearchParams] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return {
            page: params.get('page') || 1,
            search: params.get('search') || ''
        }
    });
    console.log(searchParams);



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
                    {tableData.slice((searchParams.page - 1) * 10, (searchParams.page - 1) * 10 + 10).map(exercise => (
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
                <MyPagination dataSize={tableData.length} page={searchParams.page} setPage={setPage} />
                <p>test</p>
            </div>
        </>
    )
}
