import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

import MyPagination from '../components/MyPagination';
import Search from '../components/Search';
import ExerciseContext from '../components/ExerciseProvider';

const PAGE_SIZE = 20;

export default function Overview() {
    let navigate = useNavigate();
    const { exercises, finishedLoading } = React.useContext(ExerciseContext);
    const [searchResult, setSearchResult] = useState(exercises);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setSearchResult(exercises);
    }, [finishedLoading, exercises])

    // TODO: in search component auslagern
    function search(searchParam) {
        // apply filter
        var filteredExercises = exercises.filter(exercise => {
            var matches = true;
            for (const key in searchParam) {
                if (searchParam[key] !== "") {
                    if (key === "title") {
                        matches = matches && exercise[key].toLowerCase().includes(searchParam[key].toLowerCase());
                    } else if (key === "description") {
                        matches = matches && exercise[key].toLowerCase().includes(searchParam[key].toLowerCase());
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

        // sort by best match
        filteredExercises.sort((a, b) => {
            var aMatches = 0;
            var bMatches = 0;
            for (const key in searchParam) {
                if (searchParam[key] !== "") {
                    if ([
                        "title",
                        "description"
                    ].includes(key)) {
                        var searchStringLower = searchParam[key].toLowerCase();

                        // single words
                        var words = searchStringLower.split(" ");
                        for (var i = 0; i < words.length; i++) {
                            if (a[key].toLowerCase().startsWith(words[i])) {
                                aMatches += words.length - i;
                            }
                            if (a[key].toLowerCase().endsWith(words[i])) {
                                aMatches += words.length - i;
                            }
                            if (b[key].toLowerCase().startsWith(words[i])) {
                                bMatches += words.length - i;
                            }
                            if (b[key].toLowerCase().endsWith(words[i])) {
                                bMatches += words.length - i;
                            }
                        }

                        // whole string
                        if (a[key].toLowerCase().startsWith(searchStringLower)) {
                            aMatches++;
                        }
                        if (a[key].toLowerCase().endsWith(searchStringLower)) {
                            aMatches++;
                        }
                        if (b[key].toLowerCase().startsWith(searchStringLower)) {
                            bMatches++;
                        }
                        if (b[key].toLowerCase().endsWith(searchStringLower)) {
                            bMatches++;
                        }

                        // calculate how much percent of the string is matched
                        var aMatchPercent = 0;
                        var bMatchPercent = 0;
                        for (var i = 0; i < searchStringLower.length; i++) {
                            if (a[key].toLowerCase().includes(searchStringLower[i])) {
                                aMatchPercent++;
                            }
                            if (b[key].toLowerCase().includes(searchStringLower[i])) {
                                bMatchPercent++;
                            }
                        }
                        aMatchPercent = aMatchPercent / a[key].length;
                        bMatchPercent = bMatchPercent / b[key].length;
                        aMatches *= aMatchPercent;
                        bMatches *= bMatchPercent;
                    }
                }
            }
            return bMatches - aMatches;
        });

        setSearchResult(filteredExercises);
    }

    return (
        <>
            <h3>Search</h3>
            <Search searchFunction={search} />

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
                    {searchResult.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE).map(exercise => (
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
                <MyPagination dataSize={searchResult.length} currentPage={page} changePage={setPage} PAGE_SIZE={PAGE_SIZE} />
            </div>
        </>
    )
}
