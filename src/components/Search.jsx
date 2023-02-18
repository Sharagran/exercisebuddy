import React, { useState, useEffect } from 'react'
import { Button, Form, Col, Row, FloatingLabel, Accordion } from 'react-bootstrap';
import Fuse from 'fuse.js'

import DatePicker from './DateRangePickerWrapper';


const defaultSearchParams = {
    title: '',
    description: '',

    // date is last compile date?
    createdAt: [new Date(), new Date()],
    updatedAt: [new Date(), new Date()],

    difficulty: 0,
    set: 0,
    repetition: 0,
    duration: 0,
    pause: 0,

    diagnoses: [],
    equipment: [],

    isDefault(params) {
        return Object.keys(params).every(key => {
            if (Array.isArray(params[key])) {
                // ignore createdAt, updatedAt, diagnoses and equipment
                return true;
            }
            return params[key] === defaultSearchParams[key];
        });
    }
}

export default function Search({ exercises, setExerciseView, sortOptions }) {
    const [title, setTitle] = useState(defaultSearchParams.title);
    const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);
    const [description, setDescription] = useState(defaultSearchParams.description);

    const [createdAt, setCreatedAt] = useState(defaultSearchParams.createdAt);
    const [updatedAt, setUpdatedAt] = useState(defaultSearchParams.updatedAt);

    const [difficulty, setDifficulty] = useState(defaultSearchParams.difficulty);
    const [set, setSet] = useState(defaultSearchParams.set);
    const [repetition, setRepetition] = useState(defaultSearchParams.repetition);
    const [duration, setDuration] = useState(defaultSearchParams.duration);
    const [pause, setPause] = useState(defaultSearchParams.pause);

    const [diagnoses, setDiagnoses] = useState(defaultSearchParams.diagnoses);
    const [equipment, SetEquipment] = useState(defaultSearchParams.equipment);

    function getSearchParams() {
        return {
            title,
            description,

            createdAt,
            updatedAt,

            difficulty,
            set,
            repetition,
            duration,
            pause,

            diagnoses,
            equipment
        };
    }

    useEffect(() => {
        loadLastSearch();
    }, [exercises]);

    useEffect(() => {
        search(getSearchParams());
    }, [sortOptions.sortKey, sortOptions.sortAsc]);

    function submit(e) {
        e.preventDefault();

        var searchParams = getSearchParams();

        search(searchParams);
        saveLastSearch(searchParams);
    }

    function sort(exercises) { //FIXME: sort funktioniert erst nach zweitem klick
        console.log(exercises[0]);
        console.log(sortOptions);
        var sortFunction = generateSortFunction(sortOptions.sortKey, sortOptions.sortAsc);
        return exercises.sort(sortFunction);
    }

    function search(searchParams) {
        // check if default search parameters are set
        if (defaultSearchParams.isDefault(searchParams)) {
            console.log("default search");
            // display all exercises
            var sortedExercises = sort(exercises);
            setExerciseView(sortedExercises);
            return sortedExercises;
        }


        // search for created at and updated at
        // var filteredExercises = exercises.filter(exercise => {
        //     var matches = true;
        //     for (const key in searchParams) {
        //         if (searchParams[key] !== "") {
        //             if (key === "title") {
        //                 matches = matches && exercise[key].toLowerCase().includes(searchParams[key].toLowerCase());
        //             } else if (key === "description") {
        //                 matches = matches && exercise[key].toLowerCase().includes(searchParams[key].toLowerCase());
        //                 } else if (key === "createdAt") {
        //                     matches = matches && exercise[key] >= searchParams[key][0] && exercise[key] <= searchParams[key][1];
        //                 } else if (key === "updatedAt") {
        //                     matches = matches && exercise[key] >= searchParams[key][0] && exercise[key] <= searchParams[key][1];
        //                 } else if (key === "difficulty") {
        //                     matches = matches && exercise[key] === searchParams[key];
        //                 } else if (key === "set") {
        //                     matches = matches && exercise[key] === searchParams[key];
        //                 } else if (key === "repetition") {
        //                     matches = matches && exercise[key] === searchParams[key];
        //                 } else if (key === "duration") {
        //                     matches = matches && exercise[key] === searchParams[key];
        //                 } else if (key === "pause") {
        //                     matches = matches && exercise[key] === searchParams[key];
        //                 } else if (key === "diagnoses") {
        //                     matches = matches && exercise[key].some(diagnosis => searchParams[key].includes(diagnosis));
        //                 } else if (key === "equipment") {
        //                     matches = matches && exercise[key].some(equipment => searchParams[key].includes(equipment));
        //             }
        //         }
        //     }
        //     return matches;
        // });

        // search for title and description
        // docs: https://fusejs.io/api/options.html
        // https://fusejs.io/concepts/scoring-theory.html#scoring-theory
        var fuse = new Fuse(exercises, {
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

        // TODO: combine title and description search in one search field
        var result = fuse.search(title);
        // console.clear();
        // console.log(result);

        // apply best match index
        var i = 0;
        result = result.map(item => {;
            item.matchIndex = i;
            i++;
            return item;
        });

        result = sort(result);

        // FIXME: return raw result & later address exercise (result.item)
        var filteredExercises = result.map(item => {
            var exerciseWithMatchIndex = item.item;
            exerciseWithMatchIndex.matchIndex = item.matchIndex;
            return exerciseWithMatchIndex;
        });


        filteredExercises = result;
        setExerciseView(filteredExercises);
        return filteredExercises;
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

    function loadLastSearch() {
        var lastSearch = JSON.parse(window.localStorage.getItem('searchParams'));

        if (lastSearch) {
            setTitle(lastSearch.title);
            setDescription(lastSearch.description);

            setCreatedAt(lastSearch.createdAt);
            setUpdatedAt(lastSearch.updatedAt);

            setDifficulty(lastSearch.difficulty);
            setSet(lastSearch.set);
            setRepetition(lastSearch.repetition);
            setDuration(lastSearch.duration);
            setPause(lastSearch.pause);

            setDiagnoses(lastSearch.diagnoses);
            SetEquipment(lastSearch.equipment);

            search(lastSearch);
        }
    }

    function saveLastSearch(lastSearch) {
        window.localStorage.setItem('searchParams', JSON.stringify(lastSearch));
    }

    function clear() {
        setTitle(defaultSearchParams.title);
        setDescription(defaultSearchParams.description);

        setCreatedAt(defaultSearchParams.createdAt);
        setUpdatedAt(defaultSearchParams.updatedAt);

        setDifficulty(defaultSearchParams.difficulty);
        setSet(defaultSearchParams.set);
        setRepetition(defaultSearchParams.repetition);
        setDuration(defaultSearchParams.duration);
        setPause(defaultSearchParams.pause);

        setDiagnoses(defaultSearchParams.diagnoses);
        SetEquipment(defaultSearchParams.equipment);

        window.localStorage.removeItem('searchParams');
    }

    // controlId= fügt eine id allen relevanten child elementen hinzu (zB. Label, Input)
    return (
        <div className='search'>
            <h3>Search</h3>
            <Form onSubmit={submit} onKeyUp={submit}>
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
                            {/* TODO: remove this (combining title & description into fuzzy search) */}
                            <Col>
                                <Form.Group className="mb-3" controlId="formDescription">
                                    <FloatingLabel label="Description">
                                        <Form.Control type="search" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} disabled/>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formCreated">
                                    <FloatingLabel label="Created At">
                                        <DatePicker
                                            initalStartDate={createdAt[0]}
                                            initalEndDate={createdAt[1]}
                                            refDate={setCreatedAt}
                                            includeTime={true}
                                        >
                                            <Form.Control type="text" placeholder="Created At" />
                                        </DatePicker>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formUpdated">
                                    <FloatingLabel label="Updated At">
                                        <DatePicker
                                            initalStartDate={updatedAt[0]}
                                            initalEndDate={updatedAt[1]}
                                            refDate={setUpdatedAt}
                                            includeTime={true}
                                        >
                                            <Form.Control type="text" placeholder="Updated At" />
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
                                        <Form.Control type="number" placeholder="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formSet">
                                    <FloatingLabel label="Set">
                                        <Form.Control type="number" placeholder="Set" value={set} onChange={(e) => setSet(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formRepetition">
                                    <FloatingLabel label="Repetition">
                                        <Form.Control type="number" placeholder="Repetition" value={repetition} onChange={(e) => setRepetition(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formDuration">
                                    <FloatingLabel label="Duration">
                                        <Form.Control type="number" placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formPause">
                                    <FloatingLabel label="Pause">
                                        <Form.Control type="number" placeholder="Pause" value={pause} onChange={(e) => setPause(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* Find a system to add multiple items to array (tag list from CloudNein?) */}
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formDiagnoses">
                                    <FloatingLabel label="Diagnoses">
                                        <Form.Control type="text" placeholder="Diagnoses" value={diagnoses} onChange={(e) => setDiagnoses(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formEquipment">
                                    <FloatingLabel label="Equipment">
                                        <Form.Control type="text" placeholder="Equipment" value={equipment} onChange={(e) => SetEquipment(e.target.value)} />
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
