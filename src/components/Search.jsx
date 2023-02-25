import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Col, Row, FloatingLabel, Accordion } from 'react-bootstrap';

import Fuse from 'fuse.js'
import moment from 'moment';

import DatePicker from './DateRangePickerWrapper';


const defaultSearchParams = {
    title: '',

    createdAt: [null, null],
    updatedAt: [null, null],

    difficulty: '',
    set: '',
    repetition: '',
    duration: '',
    pause: '',

    complaintsAreas: '',
    equipment: '',

    isDefault(key, value) {
        if (key === "createdAt" || key === "updatedAt") {
            return value[0] === defaultSearchParams[key][0] && value[1] === defaultSearchParams[key][1];
        } else {
            return value === defaultSearchParams[key];
        }
    },

    areDefault(params) {
        return Object.keys(params).every(key => {
            return this.isDefault(key, params[key]);
        });
    }
}

export default function Search({ exercises, setExerciseView, sortOptions }) {
    // search parameters
    // TODO: change title to queryString
    const [title, setTitle] = useState(defaultSearchParams.title);
    const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);

    const [createdAt, setCreatedAt] = useState(defaultSearchParams.createdAt);
    const [updatedAt, setUpdatedAt] = useState(defaultSearchParams.updatedAt);

    const [difficulty, setDifficulty] = useState(defaultSearchParams.difficulty);
    const [set, setSet] = useState(defaultSearchParams.set);
    const [repetition, setRepetition] = useState(defaultSearchParams.repetition);
    const [duration, setDuration] = useState(defaultSearchParams.duration);
    const [pause, setPause] = useState(defaultSearchParams.pause);

    const [complaintsAreas, setcomplaintsAreas] = useState(defaultSearchParams.complaintsAreas);
    const [equipment, SetEquipment] = useState(defaultSearchParams.equipment);

    // lists for search parameters
    const [complaintsAreasList, setComplaintsAreasList] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);

    // additional states for input fields which values differ from the search parameters
    const [createdAtInput, setCreatedAtInput] = useState("");
    const [updatedAtInput, setUpdatedAtInput] = useState("");

    // other hooks
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        // Load last search parameters on page load
        loadLastSearch();
    }, []);

    useEffect(() => {
        // exercises changed
        getSelectOptions();
    }, [exercises]);

    useEffect(() => {
        // Sort options changed
        search(getSearchParams());
    }, [sortOptions.sortKey, sortOptions.sortAsc]);

    useEffect(() => {
        // Search parameters changed
        let searchParams = getSearchParams();
        search(searchParams);
        saveLastSearch(searchParams);
    }, [title, createdAt, updatedAt, difficulty, set, repetition, duration, pause, complaintsAreas, equipment]);

    function getSelectOptions() {
        var complaintsAreas = [];
        var equipment = [];
        exercises.forEach(exercise => {
            if (exercise.complaintsAreas) {
                complaintsAreas = complaintsAreas.concat(exercise.complaintsAreas);
            }
            if (exercise.equipment) {
                equipment = equipment.concat(exercise.equipment);
            }
        });
        complaintsAreas = [...new Set(complaintsAreas)];
        equipment = [...new Set(equipment)];
        setComplaintsAreasList(complaintsAreas);
        setEquipmentList(equipment);
    }

    function getSearchParams() {
        return {
            title,

            createdAt,
            updatedAt,

            difficulty,
            set,
            repetition,
            duration,
            pause,

            complaintsAreas,
            equipment
        };
    }

    function clear() {
        setTitle(defaultSearchParams.title);

        setCreatedAt(defaultSearchParams.createdAt);
        setCreatedAtInput("");
        setUpdatedAt(defaultSearchParams.updatedAt);
        setUpdatedAtInput("");

        setDifficulty(defaultSearchParams.difficulty);
        setSet(defaultSearchParams.set);
        setRepetition(defaultSearchParams.repetition);
        setDuration(defaultSearchParams.duration);
        setPause(defaultSearchParams.pause);

        setcomplaintsAreas(defaultSearchParams.complaintsAreas);
        SetEquipment(defaultSearchParams.equipment);
    }

    function saveLastSearch(lastSearch) {
        // save search parameters to history state
        navigate("/", {
            state: lastSearch,
            replace: true
        });
    }

    function loadLastSearch() {
        var lastSearch = location.state;
        console.log(lastSearch);

        if (lastSearch) {
            setTitle(lastSearch.title);

            setCreatedAt(lastSearch.createdAt);
            setUpdatedAt(lastSearch.updatedAt);

            setDifficulty(lastSearch.difficulty);
            setSet(lastSearch.set);
            setRepetition(lastSearch.repetition);
            setDuration(lastSearch.duration);
            setPause(lastSearch.pause);

            setcomplaintsAreas(lastSearch.complaintsAreas);
            SetEquipment(lastSearch.equipment);

            search(lastSearch);
        }
    }

    function submit(e) {
        e.preventDefault();

        var searchParams = getSearchParams();
        console.log(searchParams);

        search(searchParams);
        saveLastSearch(searchParams);
    }

    function search(searchParams) {

        // if default search parameters are set, display all exercises
        if (defaultSearchParams.areDefault(searchParams)) {
            if (exercises.length > 0 && exercises[0].hasOwnProperty('item')) {
                var sortedExercises = sort(exercises);
                setExerciseView(sortedExercises);
                return sortedExercises;
            } else {
                var transformedExercises = exercises.map((exercise, index) => {
                    return {
                        item: exercise,
                        matchIndex: index,
                        refIndex: index,
                        score: 1
                    }
                });
                var sortedExercises = sort(transformedExercises);
                setExerciseView(sortedExercises);
                return sortedExercises;
            }
        }


        // search for created at and updated at
        var filteredExercises = exercises.filter(exercise => {
            var matches = true;
            for (const key in searchParams) {
                // skip loop if the property is unset (default value)
                if (defaultSearchParams.isDefault(key, searchParams[key])) {
                    continue;
                }

                if (key === "createdAt" || key === "updatedAt") {
                    let exerciseDate = moment(exercise[key]);
                    let searchStartDate = moment(searchParams[key][0]);
                    let searchEndDate = moment(searchParams[key][1]);
                    let isBetween = exerciseDate.isBetween(searchStartDate, searchEndDate, null, '[]');
                    matches = matches && isBetween;
                } else if (key === "difficulty" || key === "set" || key === "repetition") {
                    matches = matches && exercise[key] == searchParams[key];
                } else if (key === "duration" || key === "pause") {
                    // TODO: implement
                } else if (key === "complaintsAreas" || key === "equipment") {
                    matches = matches && exercise[key].includes(searchParams[key]);
                }
            }

            return matches;
        });

        var result;
        if (!defaultSearchParams.isDefault("title", searchParams.title)) {
            // search for title and description
            // docs: https://fusejs.io/api/options.html
            // https://fusejs.io/concepts/scoring-theory.html#scoring-theory
            var fuse = new Fuse(filteredExercises, {
                keys: [
                    {
                        name: 'title',
                        weight: 0.7
                    },
                    {
                        name: 'description',
                        weight: 0.3
                    }
                ],
                shouldSort: true,
                includeScore: true,
                threshold: 0.3,

                // includeMatches: true
            });

            result = fuse.search(searchParams.title);

            // apply best match index
            var i = 0;
            result = result.map(item => {
                item.matchIndex = i;
                i++;
                return item;
            });
        } else {
            result = filteredExercises.map((exercise, index) => {
                return {
                    item: exercise,
                    matchIndex: index,
                    refIndex: index,
                    score: 1
                }
            });
        }

        result = sort(result);

        setExerciseView(result);
        return result;
    }

    function sort(exercises) {
        // console.log(exercises[0]);
        // console.log(sortOptions);
        var sortFunction = generateSortFunction(sortOptions.sortKey, sortOptions.sortAsc);
        return exercises.sort(sortFunction);
    }

    function sortByScore(a, b) {
        if (a.score < b.score) {
            return -1;
        } else if (a.score > b.score) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Generates a search function for the given key.
     * @param {string} key The key to sort by.
     * @param {boolean} ascending Whether to sort ascending or descending (default: true / ascending).
     * @returns {function} The search function.
     * @example
     * var searchFunction = generateSearchFunction('title');
     * var result = exercises.sort(searchFunction);
     * console.log(result);
     * // [
     * //     { title: 'A', description: 'A' },
     * //     { title: 'B', description: 'B' },
     * //     { title: 'C', description: 'C' }
     * // ]
     * @example
     * var searchFunction = generateSearchFunction('title', false);
     * var result = exercises.sort(searchFunction);
     * console.log(result);
     * // [
     * //     { title: 'C', description: 'C' },
     * //     { title: 'B', description: 'B' },
     * //     { title: 'A', description: 'A' }
     * // ]
     */
    function generateSortFunction(key, ascending = true) {
        const lessThanA = ascending ? -1 : 1;
        const greaterThanA = ascending ? 1 : -1;

        if (key === 'matchIndex') {
            return function (a, b) {
                if (a.matchIndex < b.matchIndex) {
                    return lessThanA;
                } else if (a.matchIndex > b.matchIndex) {
                    return greaterThanA;
                } else {
                    return 0;
                }
            }
        }

        return function (a, b) {
            if (a.item[key] < b.item[key]) {
                return lessThanA;
            } else if (a.item[key] > b.item[key]) {
                return greaterThanA;
            } else {
                return sortByScore(a, b);
            }
        }
    }

    return (
        <div className='search'>
            <h3>Search</h3>
            <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="formTitle">
                    <FloatingLabel label="Title">
                        <Form.Control type="search" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </FloatingLabel>
                </Form.Group>

                {/* Advanced search */}
                {/* TODO: datalist statt Select? https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist */}
                <Accordion defaultActiveKey="0" onClick={(e) => {
                    var isExpended = e.target.classList.contains('collapsed');
                    setUseAdvancedSearch(isExpended);
                }}>
                    <Accordion.Header>Advanced search options</Accordion.Header>
                    <Accordion.Body>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formCreated">
                                    <FloatingLabel label="Created At">
                                        <DatePicker
                                            setDate={setCreatedAt}
                                            setInputValue={setCreatedAtInput}
                                            includeTime={true}
                                        >
                                            <Form.Control type="text" placeholder="Created At" value={createdAtInput} onChange={(e) => setCreatedAtInput(e.target.value)} />
                                        </DatePicker>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formUpdated">
                                    <FloatingLabel label="Updated At">
                                        <DatePicker
                                            setDate={setUpdatedAt}
                                            setInputValue={setUpdatedAtInput}
                                            includeTime={true}
                                        >
                                            <Form.Control type="text" placeholder="Updated At" value={updatedAtInput} onChange={(e) => setUpdatedAtInput(e.target.value)} />
                                        </DatePicker>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* TODO: limit number ranges */}
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formDifficulty">
                                    <FloatingLabel label="Difficulty">
                                        <Form.Control type="number" placeholder="Difficulty" min={0} value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formSet">
                                    <FloatingLabel label="Set">
                                        <Form.Control type="number" placeholder="Set" min={0} value={set} onChange={(e) => setSet(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formRepetition">
                                    <FloatingLabel label="Repetition">
                                        <Form.Control type="number" placeholder="Repetition" min={0} value={repetition} onChange={(e) => setRepetition(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formDuration">
                                    {/* <FloatingLabel label="Duration">
                                        <Form.Control type="number" placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
                                    </FloatingLabel> */}
                                    {/* https://stackoverflow.com/questions/65875721/ho-can-i-add-two-values-in-bootstrap-range-slider */}
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Range />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formPause">
                                    <FloatingLabel label="Pause">
                                        {/* TODO: remove this filter option? */}
                                        <Form.Control type="number" placeholder="Pause" value={pause} onChange={(e) => setPause(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formcomplaintsAreas">
                                    <FloatingLabel label="Complaints Areas">
                                        <Form.Select value={complaintsAreas} onChange={(e) => setcomplaintsAreas(e.target.value)}>
                                            <option value=""></option>
                                            {
                                                complaintsAreasList.map((item, index) => {
                                                    return <option key={index} value={item}>{item}</option>
                                                })
                                            }
                                        </Form.Select >
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formEquipment">
                                    <FloatingLabel label="Equipment">
                                        <Form.Select value={equipment} onChange={(e) => SetEquipment(e.target.value)}>
                                            <option value=""></option>
                                            {
                                                equipmentList.map((item, index) => {
                                                    return <option key={index} value={item}>{item}</option>
                                                })
                                            }
                                        </Form.Select >
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion>

                <Button variant="primary" type="submit">Search</Button>
                <Button variant="secondary" onClick={clear}>Clear</Button>
            </Form>
        </div>
    )
}
