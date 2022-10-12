import React, { useState } from 'react'

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { useLocation, useNavigate } from "react-router-dom";

import MyPagination from '../components/MyPagination';
import Search from '../components/Search';

import dummyData from '../dummy_data/exercises_new.json';
import { useEffect } from 'react';
import axios from 'axios';

export default function Overview() {
    //FIXME: page back button not rerendering component
    function setPage(page) {
        var newSearchParams = { ...searchParams, page };
        setSearchParams(newSearchParams);

        //FIXME: page swap in url history? (replace property)
        //TODO: delte url params if empty (custom hook for url params?)
         // remove empty properties from url
         var urlParams = {...newSearchParams};
         for (const key in urlParams) {
             if (urlParams[key] === "") {
                 delete urlParams[key];
             }
         }

        navigate(`/?${new URLSearchParams(urlParams, { replace: true } )}`);
    }

    function search(params) {
        var newSearchParams = { page: searchParams.page, ...params };
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

    let navigate = useNavigate();
    let location = useLocation();
    const params = new URLSearchParams(location.search);
    const [searchParams, setSearchParams] = useState({
        page: Number(params.get('page')) || 1,
        author: params.get('author') || '',
        created: params.get('created') || '',
    });

    useEffect(() => {
        console.log("Overview: useEffect");
    }, [location.search])
    

    const tableData = dummyData; //FIXME: dummy data
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
                <MyPagination dataSize={tableData.length} currentPage={searchParams.page} changePage={setPage} />
            </div>
            <button onClick={() => {
                axios.defaults.headers.common['Authorization'] = '69bf11e1';
                axios.get('http://localhost:3000/exercises').then(res => {
                    console.log(res.data);
                });
            }}>Test</button>
        </>
    )
}
