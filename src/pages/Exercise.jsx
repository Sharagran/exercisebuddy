import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Form, Button, Placeholder } from 'react-bootstrap';
import toast from 'react-hot-toast';

import ExerciseContext from '../components/ExerciseProvider';

const FormContext = createContext();

function ExerciseAttribute({ label, attrKey = label.toLowerCase(), type = 'text' }) {
    const { exercise, setExercise, editMode } = useContext(FormContext);
    return (
        <Form.Group className="mb-3" controlId={`form${label}`}>
            <Form.Label>{label}</Form.Label>
            <Form.Control disabled={!editMode} type={type} value={exercise[attrKey]} onChange={e => {
                // TODO: case for tpye === 'date' etc.
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
    const { exercises, reloadExercise, getExercise, updateExercise, deleteExercise } = React.useContext(ExerciseContext);
    const [exercise, setExercise] = useState();
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setExercise(getExercise(id));
    }, [exercises]);

    function handleEditButton() {
        if (editMode) {
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
        } else {
            setEditMode(true);
        }
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

    if (exercise) {
        const FormAttributes = {
            exercise,
            setExercise,
            editMode
        };

        return (
            <Form>
                <FormContext.Provider value={FormAttributes}>
                    <Row>
                        <Col>
                            <ExerciseAttribute label="Title" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ExerciseAttribute label="Description" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ExerciseAttribute label="Difficulty" type="number" />
                        </Col>
                        <Col>
                            <ExerciseAttribute label="Set" type="number" />
                        </Col>
                        <Col>
                            <ExerciseAttribute label="Repetition" type="number" />
                        </Col>
                        <Col>
                            <ExerciseAttribute label="Duration" type="number" />
                        </Col>
                        <Col>
                            <ExerciseAttribute label="Pause" type="number" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ExerciseAttribute label="Diagnoses" />
                        </Col>
                        <Col>
                            <ExerciseAttribute label="Equipment" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ExerciseAttribute label="createdAt" attrKey="createdAt" />
                        </Col>
                        <Col>
                            <ExerciseAttribute label="updatedAt" attrKey="updatedAt" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ExerciseAttribute label="Link" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ExerciseAttribute label="Image" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ExerciseAttribute label="Video" />
                        </Col>
                    </Row>
                </FormContext.Provider>

                <Button variant="primary" onClick={handleEditButton}>{editMode ? "Save changes" : "Edit"}</Button>
                {editMode ?
                    <Button variant="warning" onClick={handleDiscardButton}>Discard changes</Button>
                    :
                    <Button variant="danger" onClick={handleDeleteButton}>Delete</Button>
                }
            </Form>
        )
    } else {
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
                            <ExerciseAttributePlaceholder label="Diagnoses" />
                        </Col>
                        <Col>
                            <ExerciseAttributePlaceholder label="Equipment" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ExerciseAttributePlaceholder label="createdAt" />
                        </Col>
                        <Col>
                            <ExerciseAttributePlaceholder label="updatedAt" />
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
}
