import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Form, Button, Placeholder, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';

import ExerciseContext from '../components/ExerciseProvider';

const FormContext = createContext();

function ExerciseAttribute({ label, attrKey = label.toLowerCase(), type = 'text', required = false }) {
    const { exercise, setExercise, editMode } = useContext(FormContext);
    return (
        <Form.Group className="mb-3" controlId={`form${label}`}>
            <Form.Label>{label}</Form.Label>
            <Form.Control required={required} disabled={!editMode} type={type} value={exercise[attrKey]} onChange={e => {
                setExercise({
                    ...exercise,
                    [attrKey]: type === 'number' ? Number(e.target.value) : e.target.value
                });
            }} />
        </Form.Group>
    );
}

function ExerciseAttributePlaceholder({ label }) {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Placeholder as={Form.Control} animation='wave' bg="secondary" disabled />
        </Form.Group>
    );
}

export default function Exercise() {
    const { id } = useParams();
    const naivgate = useNavigate();
    const { finishedLoading, reloadExercise, getExercise, createExercise, updateExercise, deleteExercise } = React.useContext(ExerciseContext);
    const [exercise, setExercise] = useState();
    const [editMode, setEditMode] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // TODO: split this into createExercise and editExercise to improve readability

    useEffect(() => {
        if (id === 'create') {
            clearForm();
            setEditMode(true);
            return;
        }

        var exercise = getExercise(id);
        if (exercise) {
            setExercise(exercise);
            setNotFound(false);
        } else {
            console.log('Exercise not found');
            setNotFound(true);
        }
    }, [finishedLoading]);

    function clearForm() {
        setExercise({
            title: '',
            description: '',
            difficulty: 0,
            set: 0,
            repetition: 0,
            duration: 0,
            pause: 0,
            complaintsAreas: '',
            equipment: '',
            link: '',
            image: '',
            video: ''
        });
    }

    function handleCreateButton(e) {
        e.preventDefault();

        // set created at and updated at
        exercise.createdAt = new Date();
        exercise.updatedAt = new Date();
        console.log(exercise); //FIXME: debug only, remove this

        toast.promise(createExercise(exercise), {
            loading: 'Creating exercise...',
            success: (res) => {
                setEditMode(false);
                naivgate(`/exercise/${res.data._id}`);
                return 'Exercise created!';
            },
            error: (err) => {
                console.error(err.response.data, err);
                return 'Failed to create exercise';
            }
        });
    }

    function handleSaveButton(e) {
        e.preventDefault();

        // update exercise updatedAt
        exercise.updatedAt = new Date();

        toast.promise(updateExercise(exercise), {
            loading: 'Updating exercise...',
            success: (res) => {
                reloadExercise(id);
                setEditMode(false);
                return 'Exercise updated!';
            },
            error: (err) => {
                console.error(err.response.data, err);
                return 'Failed to update exercise';
            }
        });
    }

    function handleEditButton() {
        setEditMode(true);
    }

    function handleDeleteButton() {
        toast.promise(deleteExercise(id), {
            loading: 'Deleting exercise...',
            success: (res) => {
                naivgate('/');
                return 'Exercise deleted!';
            },
            error: (err) => {
                console.error(err.response.data, err);
                return 'Failed to delete exercise';
            }
        });
    }

    function handleDiscardButton() {
        setExercise(getExercise(id));
        setEditMode(false);

        toast('Changes discarded', {
            icon: '❕',
        });
    }

    if (!finishedLoading || !exercise) {
        // Placeholder during loading
        return (
            <Form>
                <Row>
                    <Col>
                        <ExerciseAttributePlaceholder label="Title" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ExerciseAttributePlaceholder label="Description" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ExerciseAttributePlaceholder label="Difficulty" />
                    </Col>
                    <Col>
                        <ExerciseAttributePlaceholder label="Set" />
                    </Col>
                    <Col>
                        <ExerciseAttributePlaceholder label="Repetition" />
                    </Col>
                    <Col>
                        <ExerciseAttributePlaceholder label="Duration" />
                    </Col>
                    <Col>
                        <ExerciseAttributePlaceholder label="Pause" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ExerciseAttributePlaceholder label="Complaints Areas" />
                    </Col>
                    <Col>
                        <ExerciseAttributePlaceholder label="Equipment" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ExerciseAttributePlaceholder label="Link" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ExerciseAttributePlaceholder label="Image" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ExerciseAttributePlaceholder label="Video" />
                    </Col>
                </Row>

                <Placeholder.Button variant="primary">Edit</Placeholder.Button>
                <Placeholder.Button variant="danger">Delete</Placeholder.Button>
            </Form>
        )
    }

    if (notFound) {
        // Exercise not found
        return (
            <Alert variant="danger">
                Exercise not found!
            </Alert>
        );
    }

    // Display exercise
    var FormAttributes = {
        exercise,
        setExercise,
        editMode
    };

    return (
        <Form onSubmit={id === "create" ? handleCreateButton : handleSaveButton}>
            <FormContext.Provider value={FormAttributes}>
                <Row>
                    <Col>
                        <ExerciseAttribute label="Title" required />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ExerciseAttribute label="Description" required />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ExerciseAttribute label="Difficulty" type="number" required />
                    </Col>
                    <Col>
                        <ExerciseAttribute label="Set" type="number" required />
                    </Col>
                    <Col>
                        <ExerciseAttribute label="Repetition" type="number" required />
                    </Col>
                    <Col>
                        <ExerciseAttribute label="Duration" type="number" required />
                    </Col>
                    <Col>
                        <ExerciseAttribute label="Pause" type="number" required />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ExerciseAttribute label="Complaints Areas" attrKey="complaintsAreas" />
                    </Col>
                    <Col>
                        <ExerciseAttribute label="Equipment" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ExerciseAttribute label="Link" required />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {/* <ExerciseAttribute label="Image" type='file' /> */}
                        <Form.Group className="mb-3" controlId={`formImage`}>
                            <Form.Label>Image</Form.Label>
                            <Form.Control disabled={!editMode} type='file' onChange={e => {
                                console.log(e.target.files[0]);
                                setExercise({
                                    ...exercise,
                                    image: e.target.value
                                });
                            }} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ExerciseAttribute label="Video" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                    {/* TODO: implement pose editor */}
                        <div>Pose editor</div>
                    </Col>
                </Row>
            </FormContext.Provider>

            {id === 'create' ? <Button variant="primary" type="submit">Create</Button>
                :
                <>
                    {editMode ?
                        <>
                            <Button variant="primary" type="submit" key="saveChangesButton">Save changes</Button>
                            <Button variant="warning" onClick={handleDiscardButton} key="discardButton">Discard changes</Button>
                        </>
                        :
                        <>
                            <Button variant="primary" onClick={handleEditButton} key="editButton">Edit</Button>
                            <Button variant="danger" onClick={handleDeleteButton} key="deleteButton">Delete</Button>
                        </>
                    }
                </>
            }
        </Form>
    )
}
