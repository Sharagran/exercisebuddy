import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

import MyPagination from '../components/MyPagination';
import Search from '../components/Search';
import ExerciseContext from '../components/ExerciseProvider';

const PAGE_SIZE = 20;

export default function Overview() {
    let navigate = useNavigate();
    let location = useLocation();
    const { exercises, finishedLoading } = React.useContext(ExerciseContext);
    const [searchResult, setSearchResult] = useState(exercises);
    const [searchParams, setSearchParams] = useState(getSearchParams());

    function getSearchParams() {
        var params = new URLSearchParams(location.search);
        var searchParams = {
            page: Number(params.get('page')) || 1,

            title: params.get('title') || '',
            description: params.get('description') || '',

            createdAt: params.get('createdAt') || (new Date(), new Date()), // is tuple the right data type?
            updatedAt: params.get('updatedAt') || (new Date(), new Date()),

            difficulty: Number(params.get('difficulty')) || 0,
            set: Number(params.get('set')) || 0,
            repetition: Number(params.get('repetition')) || 0,
            duration: Number(params.get('duration')) || 0,
            pause: Number(params.get('pause')) || 0,

            diagnoses: params.get('diagnoses') || [],
            equipment: params.get('equipment') || []
        }
        return searchParams;
    }

    useEffect(() => {
        setSearchResult(exercises);
    }, [finishedLoading])
    

    useEffect(() => {
        console.log("Overview: useEffect location.search");
        setSearchParams(getSearchParams());
    }, [location.search])

    function setPage(page) {
        // var newSearchParams = { ...searchParams, page };
        // setSearchParams(newSearchParams);

        // //FIXME: page swap in url history? (replace property)
        // //TODO: delte url params if empty (custom hook for url params?)
        // // remove empty properties from url
        // var urlParams = { ...newSearchParams };
        // for (const key in urlParams) {
        //     if (urlParams[key] === "") {
        //         delete urlParams[key];
        //     }
        // }

        navigate(`/?${new URLSearchParams({ ...searchParams, page }, { replace: true })}`);
    }

    function search(params) {
        // TODO: construct search query dynamically from params
        // var newSearchParams = { page: searchParams.page, ...params };
        // setSearchParams(newSearchParams);

        // remove empty properties from url
        // var urlParams = { ...newSearchParams };
        // for (const key in urlParams) {
        //     if (urlParams[key] === "") {
        //         delete urlParams[key];
        //     }
        // }

        // apply filter
        var filteredExercises = exercises.filter(exercise => {
            var matches = true;
            for (const key in params) {
                if (params[key] !== "") {
                    if (key === "title") {
                        matches = matches && exercise[key].toLowerCase().includes(params[key].toLowerCase());
                    } else if (key === "description") {
                        matches = matches && exercise[key].toLowerCase().includes(params[key].toLowerCase());
                        // } else if (key === "createdAt") {
                        //     matches = matches && exercise[key] >= params[key][0] && exercise[key] <= params[key][1];
                        // } else if (key === "updatedAt") {
                        //     matches = matches && exercise[key] >= params[key][0] && exercise[key] <= params[key][1];
                        // } else if (key === "difficulty") {
                        //     matches = matches && exercise[key] === params[key];
                        // } else if (key === "set") {
                        //     matches = matches && exercise[key] === params[key];
                        // } else if (key === "repetition") {
                        //     matches = matches && exercise[key] === params[key];
                        // } else if (key === "duration") {
                        //     matches = matches && exercise[key] === params[key];
                        // } else if (key === "pause") {
                        //     matches = matches && exercise[key] === params[key];
                        // } else if (key === "diagnoses") {
                        //     matches = matches && exercise[key].some(diagnosis => params[key].includes(diagnosis));
                        // } else if (key === "equipment") {
                        //     matches = matches && exercise[key].some(equipment => params[key].includes(equipment));
                    }
                }
            }
            return matches;
        });

        setSearchResult(filteredExercises);

        // search
        navigate(`/?${new URLSearchParams({ page: searchParams.page, ...params })}`);
    }

    return (
        <>
            <h3>Search</h3>
            <Search searchFunction={search} searchParams={searchParams} setSearchParams={setSearchParams} />

            <hr />
            <h3>Exercises</h3>
            <Button onClick={() => { navigate('/exercise/create') }}>Create new exercise</Button>
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
                    {searchResult.slice((searchParams.page - 1) * PAGE_SIZE, (searchParams.page - 1) * PAGE_SIZE + PAGE_SIZE).map(exercise => (
                        <tr key={exercise._id} onClick={(args) => {
                            if (args.target.tagName !== 'A') {
                                navigate(`/exercise/${exercise._id}`);
                            }
                        }}>
                            <td>{exercise.title}</td>
                            <td>{exercise.description}</td>
                            <td>{exercise.createdAt}</td>
                            <td>{exercise.updatedAt}</td>
                            <td><a href={exercise.link}>{exercise.link}</a></td>
                            <td>{exercise.repetition}</td>
                            <td>{exercise.duration}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div style={{
                margin: "auto",
                width: "50%",
                textAlign: "center"
            }}>
                {!finishedLoading && <Spinner animation="border" />}
                <MyPagination dataSize={searchResult.length} currentPage={searchParams.page} changePage={setPage} PAGE_SIZE={PAGE_SIZE} />
            </div>
        </>
    )
}
