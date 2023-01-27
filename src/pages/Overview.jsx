import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Table, Spinner, Button } from 'react-bootstrap';

import MyPagination from '../components/MyPagination';
import Search from '../components/Search';
import ExerciseContext from '../components/ExerciseProvider';

const PAGE_SIZE = 20;

export default function Overview() {
    let navigate = useNavigate();
    const { exercises, finishedLoading } = React.useContext(ExerciseContext);
    const [exerciseView, setExerciseView] = useState(exercises);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setExerciseView(exercises);
    }, [finishedLoading])


    return (
        <>
            <h3>Search</h3>
            <Search exercises={exercises} setExerciseView={setExerciseView} />
            {/* TODO: display applied filter & reduction of search results */}

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
                    {exerciseView.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE).map(exercise => (
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
                <MyPagination dataSize={exerciseView.length} currentPage={page} changePage={setPage} PAGE_SIZE={PAGE_SIZE} />
            </div>
        </>
    )
}
