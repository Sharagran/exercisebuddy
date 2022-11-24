import React, { useState } from 'react'
import { useParams } from "react-router-dom";

import Badge from 'react-bootstrap/Badge';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Spinner from 'react-bootstrap/Spinner';
import Placeholder from 'react-bootstrap/Placeholder';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ExerciseContext from '../components/ExerciseProvider';
import { useEffect } from 'react';

const ExerciseAttributeList = [
    { label: 'Title' },
    { label: 'Description' },
    { label: 'Difficulty', type: 'number' },
    { label: 'Equipment' },
    { label: 'Set', type: 'number' },
    { label: 'Repetition', type: 'number' },
    { label: 'Duration', type: 'number' },
    { label: 'Pause', type: 'number' },
    { label: 'Diagnoses' },
    { label: 'createdAt', attrKey: 'createdAt' },
    { label: 'updatedAt', attrKey: 'updatedAt' },
]

export default function Exercise() {
    let params = useParams();
    const id = params.id;
    const { exercises, reloadExercise, getExercise, updateExercise, deleteExercise } = React.useContext(ExerciseContext);
    const [exercise, setExercise] = useState();
    const [editMode, setEditMode] = useState(true);

    useEffect(() => {
        setExercise(getExercise(id));
    }, [exercises]);

    console.log(exercise.equipment);

    function ExerciseAttribute({ label, attrKey = label.toLowerCase(), type = 'text' }) {
        return (
            <Form.Group className='mb-3' controlId={`form${label}`}>
                <Form.Label>{label}</Form.Label>
                <Form.Control isValid disabled={!editMode} type={type} value={exercise[attrKey]} onChange={(e) => {
                    setExercise({
                        ...exercise,
                        [attrKey]: e.target.value
                    });

                }} />
                {/* <Form.Text className="text-muted">
                    Description
                </Form.Text> */}
            </Form.Group>
        )
    }

    function saveExercise() {
        updateExercise(exercise);
        setEditMode(false);
        reloadExercise(id);
        // wird danach neu gerendert weil sich exercises ändert und useEffect ausgeführt wird oder muss exercise explizit neu gesetzt werden?
    }

    if (exercise) {
        return (
            <Form>
                {ExerciseAttributeList.map((attr, i) => <ExerciseAttribute key={i} {...attr} />)}
                <Button variant='primary' onClick={updateExercise}>Update</Button>
                <Button variant='danger' onClick={deleteExercise}>Delete</Button>
                <Button variant='danger' onClick={reloadExercise}>Reload</Button>
            </Form>
        )
        return (<>
            {/* TODO: dynamic generate input fields for exercise data (from json schema)[input type text, number, etc.] */}

            <h2>{exercise.title} <a target="_blank" rel="noopener noreferrer" href={exercise.link}><Badge bg="secondary">open external</Badge></a></h2>
            <p>{exercise.description}</p>
            <img src={exercise.image} alt="" />
            {/* <video width="320" height="240" controls>
        <source src={exercise.video} type="video/mp4" />
        Your browser does not support the video tag.
    </video> */}

            {/* <Stickman /> */}

            <p>Difficulty: {exercise.difficulty}</p>
            <p>Equipment: {exercise.equipment}</p>
            <p>Set: {exercise.set}</p>
            <p>Repetition: {exercise.repetition}</p>
            <p>Duration: {exercise.duration}</p>
            <p>Pause: {exercise.pause}</p>
            <p>Diagnoses: {exercise.diagnoses}</p>

            <p>createdAt: {exercise.createdAt}</p>
            <p>updatedAt: {exercise.updatedAt}</p>

            <Button variant='primary' onClick={updateExercise}>Update</Button>
            <Button variant='danger' onClick={deleteExercise}>Delete</Button>
            <Button variant='danger' onClick={reloadExercise}>Reload</Button>
        </>)
    } else {
        return (
            <>
                <h2><Placeholder xs={6} /></h2>
                <p><Placeholder xs={6} /></p>

                <p>Difficulty: <Placeholder xs={1} /></p>
                <p>Equipment: <Placeholder xs={3} /></p>
                <p>Set: <Placeholder xs={1} /></p>
                <p>Repetition: <Placeholder xs={1} /></p>
                <p>Duration: <Placeholder xs={1} /></p>
                <p>Pause: <Placeholder xs={1} /></p>

                <Placeholder.Button variant='primary' xs={1} />
                <Placeholder.Button variant='danger' xs={1} />
            </>
        )
    }
}
