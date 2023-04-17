import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Container, Form, Button, Placeholder, Alert, Image, ButtonGroup } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import toast from 'react-hot-toast';

import ExerciseContext from '../components/ExerciseProvider';
import PoseEditor from '../components/PoseEditor/PoseEditor';

const FormContext = createContext();

function ExerciseAttribute(props) {
    let { label, attrKey = label.toLowerCase(), type = 'text', children, ...rest } = props;
    const { exercise, setExercise, editMode } = useContext(FormContext);

    if (children) {
        return (
            <Form.Group className="mb-3" controlId={`form${label}`}>
                <Form.Label>{label}</Form.Label>
                {children}
            </Form.Group>
        );
    } else {
        return (
            <Form.Group className="mb-3" controlId={`form${label}`}>
                <Form.Label>{label}</Form.Label>
                <Form.Control name={attrKey} disabled={!editMode} type={type} {...rest} value={exercise[attrKey]} onChange={e => {
                    var value;
                    if (type === 'number') {
                        value = Number(e.target.value);
                    } else if (attrKey === 'complaintsAreas' || attrKey === 'equipment') {
                        value = e.target.value.split(',').map(s => s.trim());
                    } else {
                        value = e.target.value;
                    }
                    setExercise({
                        ...exercise,
                        [attrKey]: value
                    });
                }} />
            </Form.Group>
        );
    }
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
    const { finishedLoading, reloadExercise, getExercise, createExercise, updateExercise, deleteExercise, uploadExerciseMedia, fetchExercise, deleteExerciseMedia, getSelectOptions } = React.useContext(ExerciseContext);
    const [exercise, setExercise] = useState();
    const [editMode, setEditMode] = useState(false);

    const selectOptions = getSelectOptions();

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

        // convert seconds to microseconds
        // exercise.duration *= 1000000;
        console.log(exercise); //FIXME: debug only, remove this

        toast.promise(createExercise(exercise), {
            loading: 'Creating exercise...',
            success: (res) => {
                setEditMode(false);
                naivgate(`/exercise/${res._id}`);
                return 'Exercise created!';
            },
            error: (err) => {
                console.error(err.response?.data, err);
                return 'Failed to create exercise';
            }
        });
    }

    function handleMediaUpload(e) {
        var mediaType = e.target.name;
        var file = document.getElementById(`form${mediaType}`).files[0];

        var formData = new FormData();
        formData.append(mediaType.toLowerCase(), file);

        toast.promise(uploadExerciseMedia(id, formData), {
            loading: 'Uploading media...',
            success: (res) => {
                setExercise(res);
                return 'Media uploaded!';
            },
            error: (err) => {
                console.error(err.response.data, err);
                return 'Failed to upload media';
            }
        });
    }

    function handleMediaDelete(e) {
        var mediaType = e.target.name;
        // var mediaElement = document.getElementById(`form${mediaType}`);

        var deleteMediaOptions = {
            image: false,
            video: false
        }
        deleteMediaOptions[mediaType.toLowerCase()] = true;
        console.log(deleteMediaOptions);

        toast.promise(deleteExerciseMedia(id, deleteMediaOptions), {
            loading: 'Deleting media...',
            success: (res) => {
                setExercise(res);
                // mediaElement.value = '';
                return 'Media deleted!';
            },
            error: (err) => {
                console.error(err.response.data, err);
                return 'Failed to delete media';
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

    if (!finishedLoading) {
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
                {id !== "create" && (
                    <>
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
                    </>
                )}
                <Placeholder.Button variant="primary">Edit</Placeholder.Button>
                <Placeholder.Button variant="danger">Delete</Placeholder.Button>
            </Form>
        )
    }

    if (finishedLoading && !exercise) {
        console.log('Exercise not found'); //FIXME: debug only, remove this
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
                <Container>
                    <Row>
                        <Col>
                            <ExerciseAttribute label="Title" required />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {/* <ExerciseAttribute label="Description" required /> */}
                            <ExerciseAttribute label="Description">
                                <Form.Control as="textarea" rows={10} value={exercise.description} disabled={!editMode} />
                            </ExerciseAttribute>
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
                        {/* TODO: use react-select here */}
                        <Col>
                            <ExerciseAttribute label="Complaints Areas">
                                <CreatableSelect
                                    isMulti
                                    isDisabled={!editMode}
                                    options={selectOptions.complaintsAreas}
                                    defaultValue={selectOptions.complaintsAreas.filter((option) => exercise.complaintsAreas.includes(option.value))}
                                    onChange={(value) => {
                                        var rawValues = [];
                                        value.forEach((option) => {
                                            rawValues.push(option.value);
                                        });
                                        setExercise({
                                            ...exercise,
                                            complaintsAreas: rawValues
                                        });
                                    }}
                                />
                            </ExerciseAttribute>
                        </Col>
                        <Col>
                            <ExerciseAttribute label="Equipment">
                                <CreatableSelect
                                    isMulti
                                    isDisabled={!editMode}
                                    options={selectOptions.equipment}
                                    defaultValue={selectOptions.equipment.filter((option) => exercise.equipment.includes(option.value))}
                                    onChange={(value) => {
                                        var rawValues = [];
                                        value.forEach((option) => {
                                            rawValues.push(option.value);
                                        });
                                        setExercise({
                                            ...exercise,
                                            equipment: rawValues
                                        });
                                    }}
                                />
                            </ExerciseAttribute>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ExerciseAttribute label="Link" required />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {id !== "create" && (
                                <ExerciseAttribute label="Image">
                                    <div hidden={exercise.image === undefined}>
                                        <Image crossOrigin="anonymous" src={exercise.image} alt="Exercise image" fluid onError={(e) => {
                                            console.log("Image token expired, reloading exercise...");
                                            fetchExercise(id).then((exercise) => {
                                                setExercise(exercise);
                                            });
                                        }}
                                            style={{ maxHeight: "256px" }} />
                                    </div>
                                    <Form.Control name="image" disabled={!editMode} type="file" accept="image/*" />
                                    <ButtonGroup className="mt-2">
                                        <Button name="Image" disabled={!editMode} variant="primary" onClick={handleMediaUpload}>Upload media</Button>
                                        <Button name="Image" disabled={!editMode} variant="danger" hidden={exercise.image === undefined} onClick={handleMediaDelete}>Delete media</Button>
                                    </ButtonGroup>
                                </ExerciseAttribute>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {id !== 'create' && (
                                <ExerciseAttribute label="Video">
                                    <Form.Control name="video" disabled={!editMode} type="file" accept="video/*" />
                                    <ButtonGroup className="mt-2">
                                        <Button name="Video" disabled={!editMode} variant="primary" onClick={handleMediaUpload}>Upload media</Button>
                                        <Button name="Video" disabled={!editMode} variant="danger" hidden={exercise.video === undefined} onClick={handleMediaDelete}>Delete media</Button>
                                    </ButtonGroup>
                                </ExerciseAttribute>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ExerciseAttribute label="Pose editor">
                                <PoseEditor poses={exercise.poses} />
                            </ExerciseAttribute>
                        </Col>
                    </Row>


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
                </Container>
            </FormContext.Provider>
        </Form>
    )
}
