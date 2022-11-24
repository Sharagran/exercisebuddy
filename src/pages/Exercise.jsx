import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Badge from 'react-bootstrap/Badge';
import Placeholder from 'react-bootstrap/Placeholder';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ExerciseContext from '../components/ExerciseProvider';

const exerciseAttributeList = [
    { label: 'Title' },
    { label: 'Description' },
    { label: 'Difficulty', type: 'number' },
    { label: 'Equipment' },
    { label: 'Set', type: 'number' },
    { label: 'Repetition', type: 'number' },
    { label: 'Duration', type: 'number' },
    { label: 'Pause', type: 'number' },
    { label: 'Diagnoses' },
    { label: 'createdAt', attrKey: 'createdAt', type: 'text' },
    { label: 'updatedAt', attrKey: 'updatedAt', type: 'text' },
    { label: 'Link' },
    { label: 'Image' },
    { label: 'Video' },
];

function ExerciseAttribute({ label, attrKey = label.toLowerCase(), type = 'text', exercise, setExercise, editMode }) {
    return (
        <Form.Group className="mb-3" controlId={`form${label}`}>
            <Form.Label>{label}</Form.Label>
            <Form.Control disabled={!editMode} type={type} value={exercise[attrKey]} onChange={e => {
                setExercise({
                    ...exercise,
                    [attrKey]: e.target.value
                });

            }} />
        </Form.Group>
    );
}

export default function Exercise() {
    const { id } = useParams();
    const { exercises, reloadExercise, getExercise, updateExercise, deleteExercise } = React.useContext(ExerciseContext);
    const [exercise, setExercise] = useState();
    const [editMode, setEditMode] = useState(true);



    useEffect(() => {
        setExercise(getExercise(id));
    }, [exercises]);

    function saveExercise() {
        updateExercise(exercise);
        setEditMode(false);
        reloadExercise(id);
        // wird danach neu gerendert weil sich exercises ändert und useEffect ausgeführt wird oder muss exercise explizit neu gesetzt werden?
    }

    if (exercise) {
        return (
            <Form>
                {exerciseAttributeList.map((attr, i) => <ExerciseAttribute key={i} {...attr} exercise={exercise} setExercise={setExercise} editMode={editMode} />)}
                <Button variant="primary" onClick={updateExercise}>Update</Button>
                <Button variant="danger" onClick={deleteExercise}>Delete</Button>
                <Button variant="danger" onClick={reloadExercise}>Reload</Button>
            </Form>
        )
    } else {
        return (
            <Form>
                {/* TODO: optimise ExerciseAttribute to accept Placeholders as value for component reusability */}
                {exerciseAttributeList.map((attr, i) => <Form.Group className="mb-3" key={i}>
                    <Form.Label>{attr.label}</Form.Label>
                    <Placeholder xs={1} as={Form.Control} animation='wave' bg="secondary" disabled />
                </Form.Group>)}

                <Placeholder.Button variant="primary" xs={1} />
                <Placeholder.Button variant="danger" xs={1} />
                <Placeholder.Button variant="danger" xs={1} />
            </Form>
        )
    }
}
