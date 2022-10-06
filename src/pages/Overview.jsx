import React, { useState } from 'react'

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";

import MyPagination from '../components/MyPagination';
import Search from '../components/Search';

import dummyData from '../dummy_data/exercises_new.json';

export default function Overview() {

    let navigate = useNavigate();

    function setPage(page) {
        setSearchParams({ ...searchParams, page });
    }

    function search(params) {
        var newSearchParams = { ...params, page: searchParams.page };
        setSearchParams(newSearchParams);

        // remove empty properties from url
        var urlParams = {...newSearchParams};
        for (const key in urlParams) {
            if (urlParams[key] === "") {
                delete urlParams[key];
            }
        }

        // search
        navigate(`/?${new URLSearchParams(urlParams)}`);
    }

    //  TODO: get State from url params
    const params = new URLSearchParams(window.location.search);
    const [searchParams, setSearchParams] = useState({
        page: Number(params.get('page')) || 1,
        author: params.get('author') || '',
        created: params.get('created') || '',
    });

    const tableData = dummyData;

    return (
        <>
            <Search search={search} />

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
            </div>
        </>
    )
}
